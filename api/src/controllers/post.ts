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
        text: 'INSERT INTO posts (author, title, content) VALUES ($1, $2, $3) RETURNING id',
        values: [req.body.author, req.body.title, req.body.text],
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
        res.status(400).send({ message: 'An error ocurred while editing post' });
        return;
    }

    query({
        // Add image, video and document when we figure out how to store them (Update route documentation after adding them)
        text: 'UPDATE posts SET title=$2, content=$3 WHERE id=$1',
        values: [req.body.id, req.body.title, req.body.text],
    }).then((result) => {
        res.status(200).send();
    }).catch((error) => {
        console.log('\n\nERROR:', error);
        res.status(400).send({ message: 'An error ocurred while editing post' });
    });
}

export function deletePost(req, res) {
    query({
        text: 'DELETE FROM posts WHERE id=$1', values: [req.body.id],
    }).then((result) => {
        res.status(200).send();
    }).catch((error) => {
        console.log('\n\nERROR:', error);
        res.status(400).send({ message: 'An error ocurred while deleting post' });
    });
}

export async function getPost(req, res) {
    const postId = req.params.id;
    try {
        const post = await query({
            text: `SELECT p.*, a.first_name, a.last_name
                    FROM posts p
                    INNER JOIN users a
                    ON p.author = a.id
                    WHERE
                        p.id = $1`,
            values: [postId],
        });
        const comments = await query({
            text: `SELECT c.*, a.first_name, a.last_name
                    FROM posts p
                    LEFT JOIN comments c
                    ON p.id = c.post
                    INNER JOIN users a
                    ON c.author = a.id
                    WHERE
                        p.id = $1`,
            values: [postId],
        });
        const files = await query({
            text: `SELECT f.name, f.mimetype, f.size
                    FROM posts p
                    LEFT JOIN files f
                    ON p.id = f.post
                    WHERE
                        p.id = $1`,
            values: [postId],
        });

        const result = {
            post: post.rows,
            comments: comments.rows,
            files: files.rows
        };
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send(new Error('Error retrieving post'));
    }
}


export function getFile(req, res) {
    //TODO verify if user can access the post req.params.id
    res.sendFile(process.env.PWD + '/uploads/' + req.params.id + '/' + req.params.filename);
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

export function removeFiles(files) {
    if (files && files.length) {
        files.forEach((file) => {
            fs.unlink(file.path, (err) => {
                if (err) { throw err; }
            });
        });
    }
}
