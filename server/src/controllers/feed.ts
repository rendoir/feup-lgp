'use strict';

import { query } from '../db/db';

export async function getFeed(req, res) {
    const offset = req.query.offset;
    const userId = 1;
    try {
        const result = await query({
            text: `SELECT id, author, title, content, date_created, date_updated
                    FROM posts
                    WHERE
                        author = $1
                        OR author IN (SELECT followed FROM follows WHERE follower = $1)
                    ORDER BY date_created
                    LIMIT 10
                    OFFSET $2`,
            values: [userId, offset],
        });
        res.send(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send(new Error('Error retrieving feed'));
    }
}
