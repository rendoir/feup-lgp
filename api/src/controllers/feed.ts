'use strict';

import { query } from '../db/db';

export async function getFeed(req, res) {
    const offset = req.query.offset;
    const userId = 1;
    try {
        const result = await query({
            text: `SELECT p.id, first_name, last_name, p.title, p.content, p.likes, p.visibility, p.date_created, p.date_updated
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
        const likersToSend = [];
        for (const post of result.rows) {
            const comment = await query({
                text: `SELECT c.id, c.post, c.comment, c.date_updated, c.date_created, a.first_name, a.last_name
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
            const likersPost = await query({
                text: `SELECT a.id, a.first_name, a.last_name
                        FROM likes_a_post l
                        INNER JOIN users a
                        ON l.author = a.id
                        WHERE l.post = $1`,
                values: [post.id],
            });
            commentsToSend.push(comment.rows);
            likersToSend.push(likersPost.rows);
        }
        res.send({
            posts: result.rows,
            comments: commentsToSend,
            likers: likersToSend,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send(new Error('Error retrieving feed'));
    }
}
