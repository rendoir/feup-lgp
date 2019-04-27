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
        res.send({ id: result.rows });
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
                SET title = $2, content = $3, visibility = $4
                WHERE id = $1`,
        values: [req.body.id, req.body.title, req.body.text, req.body.visibility],
    }).then((result) => {
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
            post: post.rows,
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

export function addALikeToPost(req, res) {
    query({
        text: `INSERT INTO likes_a_post (post,author) VALUES ($1,$2)`,
        values: [req.params.id, req.body.author],
    }).then((result) => {
        res.status(200).send();
    }).catch((error) => {
        console.log('\n\nERROR:', error);
        res.status(400).send({ message: 'An error ocurred while editing a comment' });
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
                res.status(400).send({ message: 'An error ocurred while creating post: Moving file.' });
            else {
                //Add file to database
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
