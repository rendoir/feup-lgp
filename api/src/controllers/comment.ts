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

export function createNewCommentForComment(req, res) {
    if (!req.body.comment.trim() || !req.body.comment.trim()) {
        console.log('\n\nERROR: Comment body cannot be empty');
        res.status(400).send({ message: 'An error ocurred while adding a comment to a post' });
        return;
    }

    query({
        text: 'INSERT INTO comments (author, post, comment_ref, comment) VALUES ($1, (SELECT post FROM comments WHERE id = $1),$2, $3)',
        values: [req.body.author, req.body.comment_id, req.body.comment],
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

export function addALikeToComment(req, res) {
    // To change when loggin
    const commentId = req.params.id;
    query({
        text: `UPDATE comments
                SET likes = likes + 1
                WHERE id = $1`,
        values: [commentId],
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

export async function getCommentsOfComment(req, res) {
    const commentId = req.params.id;
    try {
        const comments = await query({
            text: `SELECT c1.id, c1.comment, c1.likes, c1.date_updated, c1.date_created, a.first_name, a.last_name
                    FROM comments c1
                    LEFT JOIN comments c2
                    ON c1.comment_ref = c2.id
                    INNER JOIN users a
                    ON c1.author = a.id
                    WHERE
                        c2.id = $1
                    ORDER BY c1.date_updated ASC;`,
            values: [commentId],
        });
        res.send(comments.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send(new Error('Error retrieving comments of the comment ' + commentId));
    }
}
