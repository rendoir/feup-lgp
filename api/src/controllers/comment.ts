import * as fs from 'fs';
import * as request from 'request-promise';
// import * as Twitter from 'twitter';

import {query} from '../db/db';

export function createComment(req, res) {
    if (!req.body.comment.trim()) {
        console.log('\n\nERROR: Comment body cannot be empty');
        res.status(400).send({ message: 'An error ocurred while adding a comment to a post' });
        return;
    }

    query({
        text: 'INSERT INTO comments (author, post, comment) VALUES ($1, $2, $3)',
        values: [req.body.author, req.body.post_id, req.body.comment],
    }).then((result) => {
        res.status(200).send();
    }).catch((error) => {
        console.log('\n\nERROR:', error);
        res.status(400).send({ message: 'An error ocurred while adding a comment to a post' });
    });
}

export async function createNewCommentForComment(req, res) {
    if (!req.body.comment.trim()) {
        console.log('\n\nERROR: Comment body cannot be empty');
        res.status(400).send({ message: 'An error ocurred while adding a comment to a post' });
        return;
    }

    try {
        await query({
        text: 'INSERT INTO comments (author, post, comment_ref, comment) VALUES ($1, (SELECT post FROM comments WHERE id = $1),$2, $3)',
        values: [req.body.author, req.params.id, req.body.comment]});
        res.status(200).send();
    } catch (error) {
        console.log('\n\nERROR:', error);
        res.status(400).send({ message: 'An error ocurred while adding a comment to a post' });
    }
}

export function editComment(req, res) {
    if (!req.body.comment.trim()) {
        console.log('\n\nERROR: Comment body cannot be empty');
        res.status(400).send({ message: 'An error occurred while editing a comment' });
        return;
    }

    query({
        // Add image, video and document when we figure out how to store them (Update route documentation after adding them)
        text: 'UPDATE comments SET comment=$2 WHERE id=$1',
        values: [req.body.id, req.body.comment],
    }).then(() => {
        res.status(200).send({ newComment: req.body.comment });
    }).catch((error) => {
        console.log('\n\nERROR:', error);
        res.status(400).send({ message: 'An error occurred while editing a comment' });
    });
}

export function addALikeToComment(req, res) {
    // To change when loggin
    const commentId = req.params.id;
    query({
        text: `INSERT INTO likes_a_comment (comment,author) VALUES ($1,$2)`,
        values: [commentId, req.body.author],
    }).then((result) => {
        res.status(200).send();
    }).catch((error) => {
        console.log('\n\nERROR:', error);
        res.status(400).send({ message: 'An error ocurred while editing a comment' });
    });
}

export function getWhoLikedComment(req, res) {
    const commentId = req.params.id;
    query({
        text: `SELECT a.id, a.first_name, a.last_name
                FROM likes_a_comment l
                INNER JOIN users a
                ON l.author = a.id
                WHERE l.comment = $1`,
        values: [commentId],
    }).then((result) => {
        res.send(result.rows);
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

export function deleteALikeToComment(req, res) {
    query({
        text: 'DELETE FROM likes_a_comment WHERE comment=$1 AND author=$2', values: [req.params.id, req.body.author],
    }).then((result) => {
        res.status(200).send();
    }).catch((error) => {
        console.log('\n\nERROR:', error);
        res.status(400).send({ message: 'An error ocurred while deleting a like to a comment' });
    });
}

export async function getCommentsOfComment(req, res) {
    const commentId = req.params.id;
    try {
        const comments = await query({
            text: `SELECT c1.id, c1.post, c1.comment, c1.date_updated, c1.date_created, a.first_name, a.last_name
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

export function reportComment(req, res) {
    console.log("report comment");
    console.log("reporter: ", req.body.reporter);
    console.log("content id: ", req.params.id);
    query({
        text: `INSERT INTO content_reports (reporter, content_id, content_type) VALUES ($1, $2, "comment")`,
        values: [req.body.reporter, req.params.id],
    }).then((result) => {
        res.status(200).send({ report: true });
    }).catch((error) => {
        console.log('\n\nERROR:', error);
        res.status(400).send({ message: 'An error ocurred while reporting comment' + req.params.id });
    });
}

export async function checkCommentUserReport(req, res) {
    try {
        const reportQuery = await query({
            text: `SELECT *
                    FROM content_reports
                    WHERE
                        reporter = $1 AND content_id = $2 AND content_type = "comment"`,
            values: [req.body.reporter, req.params.id],
        });

        const result = { report: Boolean(reportQuery.rows[0]) };
        console.log("COMMENT ", req.params.id, " REPORT BY USER ", req.body.reporter, ": ", result);
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error retrieving comment ' + req.params.id + ' report' });
    }
}
