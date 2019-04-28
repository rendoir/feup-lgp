import * as fs from 'fs';
import * as request from 'request-promise';

import { query } from '../db/db';

export function createPost(req, res) {
    if (!req.body.title.trim() || !req.body.title.trim()) {
        console.log('\n\nERROR: Post title and body cannot be empty');
        res.status(400).send({ message: 'An error ocurred while creating a new post: Invalid post.' });
        return;
    }

    query({
        // Add image, video and document when we figure out how to store them (Update route documentation after adding them)
        text: 'INSERT INTO posts (author, title, content, visibility) VALUES ($1, $2, $3, $4) RETURNING id',
        values: [req.body.author, req.body.title, req.body.text, req.body.visibility],
    }).then((result) => {
        saveFiles(req, res, result.rows[0].id);
        res.send({ id: result.rows[0].id });
    }).catch((error) => {
        console.log('\n\nERROR:', error);
        res.status(400).send({ message: 'An error ocurred while creating post: Adding post to database.' });
    });
}

export function editPost(req, res) {
    if (!req.body.title.trim() || !req.body.title.trim()) {
        console.log('\n\nERROR: Post title and body cannot be empty');
        res.status(400).send({ message: 'An error ocurred while editing a post' });
        return;
    }

    query({
        // Add image, video and document when we figure out how to store them (Update route documentation after adding them)
        text: `UPDATE posts
                SET title = $2, content = $3, visibility = $4, date_updated = NOW()
                WHERE id = $1`,
        values: [req.body.id, req.body.title, req.body.text, req.body.visibility],
    }).then((result) => {
        editFiles(req,res);
        res.status(200).send();
    }).catch((error) => {
        console.log('\n\nERROR:', error);
        res.status(400).send({ message: 'An error ocurred while editing a post' });
    });
}

export function deletePost(req, res) {
    query({
        text: 'DELETE FROM posts WHERE id = $1', values: [req.body.id],
    }).then((result) => {
        deleteFolderRecursive('uploads/' + req.body.id);
        res.status(200).send();
    }).catch((error) => {
        console.log('\n\nERROR:', error);
        res.status(400).send({ message: 'An error ocurred while deleting a post' });
    });
}

export async function getPost(req, res) {
    const postId = req.params.id;
    const userId = 1; // logged in user
    try {
        /**
         * Post must be owned by user
         * OR post is public
         * OR post is private to followers and user is a follower of the author
         */
        const post = await query({
            text: `SELECT p.id, first_name, last_name, p.title, p.content, p.likes, p.visibility, p.date_created, p.date_updated
                    FROM posts p
                    INNER JOIN users a
                    ON p.author = a.id
                    WHERE
                        p.id = $1
                        AND (p.author = $2
                            OR p.visibility = 'public'
                            OR (p.visibility = 'followers'
                                AND p.author IN (SELECT followed FROM follows WHERE follower = $2)
                                )
                            )`,
            values: [postId, userId],
        });
        if (post == null) {
            res.status(400).send(new Error(`Post either does not exist or you do not have the required permissions.`));
            return;
        }
        /**
         * Although the previous query already checks for permissions,
         * this query checks again to avoid wrong assumptions.
         */
        const comments = await query({
            text: `SELECT c.id, c.post, c.comment, c.date_updated, c.date_created, a.first_name, a.last_name
                    FROM posts p
                    LEFT JOIN comments c
                    ON p.id = c.post
                    INNER JOIN users a
                    ON c.author = a.id
                    WHERE
                        p.id = $1
                        AND (p.author = $2
                            OR p.visibility = 'public'
                            OR (p.visibility = 'followers'
                                AND p.author IN (SELECT followed FROM follows WHERE follower = $2)
                                )
                            )
                    ORDER BY c.date_updated ASC;`,
            values: [postId, userId],
        });

        const likers = await query({
            text: `SELECT a.id, a.first_name, a.last_name
                        FROM likes_a_post l
                        INNER JOIN users a
                        ON l.author = a.id
                        WHERE l.post = $1`,
            values: [postId],
        });
        const files = await query({
            text: `SELECT f.name, f.mimetype, f.size
                    FROM posts p
                    INNER JOIN files f
                    ON p.id = f.post
                    WHERE
                        p.id = $1`,
            values: [postId],
        });
        const result = {
            post: post.rows[0],
            comments: comments.rows,
            files: files.rows,
            likers: likers.rows
        };
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send(new Error('Error retrieving post'));
    }
}

export async function getPostUserInteractions(req, res) {
    const userId = req.body.userId;
    const postId = req.params.id;
    try {
        const totalRatingsQuery = await query({
            text: `SELECT count(*)
                    FROM posts_rates
                    WHERE post = $1`,
            values: [postId],
        });
        const totalRatingAmountQuery = await query({
            text: `SELECT SUM(rate) AS total
                    FROM posts_rates
                    WHERE post = $1`,
            values: [postId],
        });
        const rateQuery = await query({
            text: `SELECT rate
                    FROM posts_rates
                    WHERE
                        evaluator = $1 AND post = $2`,
            values: [userId, postId],
        });
        const subscriptionQuery = await query({
            text: `SELECT *
                    FROM posts_subscriptions
                    WHERE
                        subscriber = $1 AND post = $2`,
            values: [userId, postId],
        });

        const rate = rateQuery.rows[0] ? rateQuery.rows[0].rate : null;
        const totalRatingsNumber = totalRatingsQuery.rows[0].count;
        const totalRatingAmount = totalRatingAmountQuery.rows[0].total * 20;

        const result = {
            rate,
            totalRatingsNumber,
            totalRatingAmount,
            subscription: Boolean(subscriptionQuery.rows[0]),
        };
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send(new Error('Error retrieving post-user interactions'));
    }
}

export function subscribePost(req, res) {
    query({
        text: 'INSERT INTO posts_subscriptions (subscriber, post) VALUES ($1, $2)',
        values: [req.body.userId, req.params.id],
    }).then((result) => {
        res.status(200).send();
    }).catch((error) => {
        console.log('\n\nERROR:', error);
        res.status(400).send({ message: 'An error ocurred while subscribing post' });
    });
}

export function unsubscribePost(req, res) {
    query({
        text: 'DELETE FROM posts_subscriptions WHERE subscriber = $1 AND post = $2',
        values: [req.body.userId, req.params.id],
    }).then((result) => {
        res.status(200).send();
    }).catch((error) => {
        console.log('\n\nERROR:', error);
        res.status(400).send({ message: 'An error ocurred while unsubscribing post' });
    });
}

export function rate(req, res) {
    console.log("pls?");
    console.log("evaluator: ", req.body.evaluator);
    console.log("rate: ", req.body.rate);
    console.log("post: ", req.params.id);
    query({
        text: 'INSERT INTO posts_rates (evaluator, rate, post) VALUES ($1, $2, $3)',
        values: [req.body.evaluator, req.body.rate, req.params.id],
    }).then((result) => {

        query({
            text: 'UPDATE posts SET rate=$1 WHERE id=$2',
            values: [req.body.newPostRating, req.params.id],
        }).then((result2) => {
            res.status(200).send();
        }).catch((error) => {
            console.log('\n\nERROR:', error);
            res.status(400).send({ message: 'An error occured while updating the rating of the post' });
        });
    }).catch((error) => {
        console.log('\n\nERROR:', error);
        res.status(400).send({ message: 'An error ocurred while rating an post' });
    });
}


export function addALikeToPost(req, res) {
    query({
        text: `INSERT INTO likes_a_post (post,author) VALUES ($1,$2)`,
        values: [req.params.id, req.body.author],
    }).then((result) => {
        res.status(200).send();
    }).catch((error) => {
        console.log('\n\nERROR:', error);
        res.status(400).send({ message: 'An error ocurred while liking a post' });
    });
}

export function deleteALikeToPost(req, res) {
    query({
        text: 'DELETE FROM likes_a_post WHERE post=$1 AND author=$2', values: [req.params.id, req.body.author],
    }).then((result) => {
        res.status(200).send();
    }).catch((error) => {
        console.log('\n\nERROR:', error);
        res.status(400).send({ message: 'An error ocurred while deleting a like to a comment' });
    });
}

export function getFile(req, res) {
    //TODO verify if user can access the post req.params.id
    res.sendFile(process.env.PWD + '/uploads/' + req.params.id + '/' + req.params.filename);
}

export function downloadFile(req, res) {
    //TODO verify if user can access the post req.params.id
    res.download(process.env.PWD + '/uploads/' + req.params.id + '/' + req.params.filename);
}


export function saveFiles(req, res, id) {
    if (!req.files)
        return;

    for (let key in req.files) {
        let file = req.files[key];
        let filename = file.name;
        let filetype = file.mimetype;
        let filesize = file.size;
        //Move file to uploads
        file.mv('uploads/' + id + '/' + filename, function (err) {
            if (err) 
                res.status(400).send({ message: 'An error ocurred while creating/editing post: Moving file.' });
            else {
                //Add file to database
                query({
                    text: `INSERT INTO files (name, mimeType, size, post) VALUES ($1, $2, $3, $4) ON CONFLICT ON CONSTRAINT unique_post_file
                            DO UPDATE SET mimeType = $2, size = $3 WHERE files.post = $4 AND files.name = $1;`,
                    values: [filename, filetype, filesize, id],
                }).then(() => {
                    return;
                }).catch((error) => {
                    console.log('\n\nERROR:', error);
                    res.status(400).send({ message: 'An error ocurred while creating/editing post: Adding file to database.' });
                });
            }
        });
    }
}

export async function editFiles(req, res) {
    //Delete files
    if(req.body.removed) {
        let removed = JSON.parse(req.body.removed);
        for(const file of removed) {
            //Remove file from database
            await query({
                text: `DELETE FROM files 
                       WHERE post = $1 AND name = $2`,
                values: [req.body.id, file.name],
            })
            //Delete file from filesystem
            fs.unlinkSync("uploads/" + req.body.id + "/" + file.name);
        }
    }
    //Add new files
    saveFiles(req, res, req.body.id);
}

export function deleteFolderRecursive(path) {
    if (fs.existsSync(path)) {
      fs.readdirSync(path).forEach(function(file, index){
        var curPath = path + "/" + file;
        if (fs.lstatSync(curPath).isDirectory()) { // recurse
          deleteFolderRecursive(curPath);
        } else { // delete file
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(path);
    }
  };
