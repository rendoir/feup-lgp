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
        saveTags(req, res, result.rows[0].id);
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
        saveTags(req, res, req.body.id);
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

        const tags = await query({
             text: `SELECT t.name
                        FROM tags t
                        INNER JOIN posts_tags pt
                        ON pt.tag = t.id
                        WHERE pt.post = $1`,
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
            likers: likers.rows,
            tags: tags.rows,
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

        const result = {
            rate,
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
    // TODO verify if user can access the post req.params.id
    res.sendFile(process.env.PWD + '/uploads/' + req.params.id + '/' + req.params.filename);
}

export function downloadFile(req, res) {
    // TODO verify if user can access the post req.params.id
    res.download(process.env.PWD + '/uploads/' + req.params.id + '/' + req.params.filename);
}

export function saveFiles(req, res, id) {

    if (!req.files) {
        return;
    }

// tslint:disable-next-line: forin
    for (const key in req.files) {
        const file = req.files[key];
        const filename = file.name;
        const filetype = file.mimetype;
        const filesize = file.size;
        // Move file to uploads
// tslint:disable-next-line: only-arrow-functions
        file.mv('uploads/' + id + '/' + filename, function(err) {
            if (err) {
                res.status(400).send({ message: 'An error ocurred while creating post: Moving file.' });
            } else {
                // Add file to database
                query({
                    text: 'INSERT INTO files (name, mimeType, size, post) VALUES ($1, $2, $3, $4) RETURNING id',
                    values: [filename, filetype, filesize, id],
                }).then(() => {
                    return;
                }).catch((error) => {
                    console.log('\n\nERROR:', error);
                    res.status(400).send({ message: 'An error ocurred while creating post: Adding file to database.' });
                });
            }
        });
    }
}

export async function saveTags(req, res, id) {

    const allTags = await query({
        text: `SELECT id, name FROM tags`,
    });

    const tagsOfPost = await query({
        text: `SELECT t.id, t.name FROM tags t INNER JOIN posts_tags pt ON pt.tag = t.id WHERE pt.post = $1`,
        values: [id],
    });

    const tagsToAdd = [];
    const tagsToDelete = [];

    for (const key in req.body) {
        if (key.includes('tags[')) {
            tagsToAdd.push(req.body[key]);
        }
    }

    for (const tag of tagsOfPost.rows) {
        if (!tagsToAdd.includes(tag.name)) {
            tagsToDelete.push(tag);
        }
    }

    for (const tag of tagsToDelete) {
        query({
            text: 'DELETE FROM posts_tags WHERE post=$1 AND tag=$2',
            values: [id, tag.id],
        }).then(() => {
            return;
        }).catch((error) => {
            console.log('\n\nERROR:', error);
            res.status(400).send({ message: 'An error ocurred while creating post: Adding tags to post.' });
        });
    }

    for (const tag of tagsToAdd) {
        const foundValue = allTags.rows.find((e: { name: string; }) => {
            if (e.name === tag) {
                return e;
            } else {
                return null;
            }
        });

        const alreadyValue = tagsOfPost.rows.find((e: { name: string; }) => {
            if (e.name === tag) {
                return e;
            } else {
                return null;
            }
        });

        let tagID = 0;
        if (foundValue != null) {
            tagID = foundValue.id;
        } else {
            const newTagID = await query({
                text: `INSERT INTO tags (name) VALUES ($1) RETURNING id`,
                values: [tag],
            });
            tagID = newTagID.rows[0].id;
        }
        if (alreadyValue === null || alreadyValue === undefined) {
            query({
                text: 'INSERT INTO posts_tags (post, tag) VALUES ($1, $2)',
                values: [id, tagID],
            }).then(() => {
                return;
            }).catch((error) => {
                console.log('\n\nERROR:', error);
                res.status(400).send({ message: 'An error ocurred while creating post: Adding tags to post.' });
            });
        }
    }
}

export function deleteFolderRecursive(path) {
    if (fs.existsSync(path)) {
// tslint:disable-next-line: only-arrow-functions
      fs.readdirSync(path).forEach(function(file, index) {
        const curPath = path + '/' + file;
        if (fs.lstatSync(curPath).isDirectory()) { // recurse
          deleteFolderRecursive(curPath);
        } else { // delete file
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(path);
    }
  }
