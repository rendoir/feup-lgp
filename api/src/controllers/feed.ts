'use strict';

import { query } from '../db/db';

export async function getFeed(req, res) {
    const offset = req.query.offset;
    const userId = 1;
    try {
        const result = await query({
            text: `SELECT *
                    FROM (SELECT p.id, first_name, last_name, p.title, p.content, p.likes,
                        p.visibility, p.date_created, p.date_updated, p.conference, users.id AS user_id
                        FROM posts p
                            INNER JOIN users ON (users.id = p.author)
                        WHERE
                            (author = $1
                                OR (author IN (SELECT followed FROM follows WHERE follower = $1)
                                    AND p.visibility IN ('public', 'followers')))
                            AND p.conference IS null
                        ORDER BY date_created DESC
                        LIMIT 100
                        OFFSET $2)
                    AS pvis
                    ORDER BY pvis.visibility DESC
                    LIMIT 20
                    OFFSET $2`,
            values: [userId, offset],
        });
        const commentsToSend = [];
        const likersToSend = [];
        const tagsToSend = [];
        const filesToSend = [];
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
                        ORDER BY c.date_updated ASC`,
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
            const tagsPost = await query({
                text: `SELECT t.name
                        FROM tags t
                        INNER JOIN posts_tags pt
                        ON pt.tag = t.id
                        WHERE pt.post = $1`,
                values: [post.id],
            });
            const files = await query({
                text: `SELECT f.name, f.mimetype, f.size
                        FROM posts p
                        INNER JOIN files f
                        ON p.id = f.post
                        WHERE
                            p.id = $1`,
                values: [post.id],
            });
            commentsToSend.push(comment.rows);
            likersToSend.push(likersPost.rows);
            tagsToSend.push(tagsPost.rows);
            filesToSend.push(files.rows);
        }
        res.send({
            posts: result.rows,
            comments: commentsToSend,
            likers: likersToSend,
            tags: tagsToSend,
            files: filesToSend,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send(new Error('Error retrieving feed'));
    }
}
