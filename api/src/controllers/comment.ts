import * as fs from 'fs';
import * as request from 'request-promise';
// import * as Twitter from 'twitter';

import {query} from '../db/db';

export function createComment(req, res) {
    if (!req.body.comment.trim() || !req.body.comment.trim()) {
        console.log('\n\nERROR: Comment body cannot be empty');
        res.status(400).send({ message: 'An error ocurred while adding a comment to a post' });
        return;
    }

    query({
        text: 'INSERT INTO comments (author, post, comment) VALUES ($1, $2, $3)',
        values: [req.body.author, req.body.post, req.body.comment],
    }).then((result) => {
        res.status(200).send();
    }).catch((error) => {
        console.log('\n\nERROR:', error);
        res.status(400).send({ message: 'An error ocurred while adding a comment to a post' });
    });
}

export function editComment(req, res) {
    if (!req.body.comment.trim() || !req.body.comment.trim()) {
        console.log('\n\nERROR: Comment body cannot be empty');
        res.status(400).send({ message: 'An error ocurred while editing a comment' });
        return;
    }

    query({
        // Add image, video and document when we figure out how to store them (Update route documentation after adding them)
        text: 'UPDATE comments SET post=$2, comment=$3 WHERE id=$1',
        values: [req.body.id, req.body.post, req.body.comment],
    }).then((result) => {
        res.status(200).send();
    }).catch((error) => {
        console.log('\n\nERROR:', error);
        res.status(400).send({ message: 'An error ocurred while editing a comment' });
    });
}

export function deleteComment(req, res) {
    query({
        text: 'DELETE FROM comments WHERE id=$1', values: [req.body.id],
    }).then((result) => {
        res.status(200).send();
    }).catch((error) => {
        console.log('\n\nERROR:', error);
        res.status(400).send({ message: 'An error ocurred while deleting a comment' });
    });
}

export async function getCommentsOfPost(req, res) {
    const postId = req.params.id;
    try {
        const comments = await query({
            text: `SELECT c.*, a.first_name, a.last_name
                    FROM posts p
                    LEFT JOIN comments c
                    ON p.id = c.post
                    INNER JOIN users a
                    ON c.author = a.id
                    WHERE
                        p.id = $1
                    ORDER BY c.date_updated ASC;`,
            values: [postId],
        });
        res.send(comments.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send(new Error('Error retrieving comments of the post ' + postId));
    }
}
