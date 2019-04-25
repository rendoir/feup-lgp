'use strict';

import { query } from '../db/db';

export async function getFeed(req, res) {
    const offset = req.query.offset;
    const userId = 1;
    try {
        const result = await query({
            text: `SELECT p.id, first_name, last_name, p.title, p.content, p.visibility, p.date_created, p.date_updated
                    FROM posts p
                        INNER JOIN users ON (users.id = p.author)
                    WHERE
                        author = $1
                        OR (author IN (SELECT followed FROM follows WHERE follower = $1)
                            AND p.visibility IN ('public', 'followers'))
                    ORDER BY date_created DESC
                    LIMIT 10
                    OFFSET $2`,
            values: [userId, offset],
        });
        const commentsToSend = [];
        for (const post of result.rows) {
            const comment = await query({
                text: `SELECT c.id, c.post, c.comment, c.likes, c.date_updated, c.date_created, a.first_name, a.last_name
                        FROM posts p
                        LEFT JOIN comments c
                        ON p.id = c.post
                        INNER JOIN users a
                        ON c.author = a.id
                        WHERE
                            p.id = $1
                        ORDER BY c.date_updated ASC;`,
                values: [post.id],
            });
            commentsToSend.push(comment.rows);
        }
        res.send({
            posts: result.rows,
            comments: commentsToSend,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send(new Error('Error retrieving feed'));
    }
}
