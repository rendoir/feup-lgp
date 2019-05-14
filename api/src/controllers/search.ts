'use strict';
import {query} from '../db/db';

/**
 * Get posts matching keywords and tags (desired tags must be a subset of the actual tags).
 * Posts must be either public or, if for followers, the logged in user must be a follower of the author,
 * or, if private, the logged in user must be the post's author.
 */
async function postQuery(keywords: string[], tags: string[], limit: number, offset: number, initialDate: number, finalDate: number) {
    const loggedInUser = 1;
    const queryKeywords = keywords.join(' & ');
    const posts = await query({
        text: `SELECT p.id, first_name, last_name, p.title, p.content,
            p.visibility, p.date_created, p.date_updated, users.id AS user_id
                FROM posts p
                    INNER JOIN users ON (users.id = p.author)
                WHERE
                    (p.search_tokens @@ TO_TSQUERY($4) OR $4 LIKE '')
                    AND $7::TEXT[] <@ (SELECT ARRAY(SELECT tags.name
                                        FROM tags INNER JOIN posts_tags pt ON (pt.tag = tags.id)
                                        WHERE pt.post = p.id))
                    AND p.date_created >= (SELECT TO_TIMESTAMP($5)) AND p.date_created <= (SELECT TO_TIMESTAMP($6))
                    AND (p.visibility = 'public'
                        OR (p.visibility = 'followers' AND (p.author IN (SELECT followed FROM follows WHERE follower = $1)
                                                            OR p.author = $1))
                        OR (p.visibility = 'private' AND p.author = $1))
                ORDER BY date_created DESC
                LIMIT $2
                OFFSET $3`,
        values: [loggedInUser, limit, offset, queryKeywords, initialDate, finalDate, tags],
    });
    const size = await query({
        text: `SELECT COUNT(p.id)
                FROM posts p
                WHERE
                    (p.search_tokens @@ TO_TSQUERY($2) OR $2 LIKE '')
                    AND $5::TEXT[] <@ (SELECT ARRAY(SELECT tags.name
                                        FROM tags INNER JOIN posts_tags pt ON (pt.tag = tags.id)
                                        WHERE pt.post = p.id))
                    AND p.date_created >= (SELECT TO_TIMESTAMP($3)) AND p.date_created <= (SELECT TO_TIMESTAMP($4))
                    AND (p.visibility = 'public'
                        OR (p.visibility = 'followers' AND (p.author IN (SELECT followed FROM follows WHERE follower = $1)
                                                            OR p.author = $1))
                        OR (p.visibility = 'private' AND p.author = $1))`,
        values: [loggedInUser, queryKeywords, initialDate, finalDate, tags],
    });

    return {
        posts: posts.rows,
        size: size.rows[0].count,
    };
}

async function authorQuery(keywords: string[], tags: string[], limit: number, offset: number, initialDate: number, finalDate: number) {
    const loggedInUser = 1;
    const queryKeywords = keywords.join('|');
    const posts = await query({
        text: `SELECT p.id, first_name, last_name, p.title, p.content, p.visibility, p.date_created, p.date_updated
                FROM posts p
                    INNER JOIN users ON (users.id = p.author)
                WHERE
                    (first_name ~* ($4)
                        OR last_name ~* ($4))
                    AND $7::TEXT[] <@ (SELECT ARRAY(SELECT tags.name
                                        FROM tags INNER JOIN posts_tags pt ON (pt.tag = tags.id)
                                        WHERE pt.post = p.id))
                    AND p.date_created >= (SELECT TO_TIMESTAMP($5)) AND p.date_created <= (SELECT TO_TIMESTAMP($6))
                    AND (p.visibility = 'public'
                        OR (p.visibility = 'followers' AND p.author IN (SELECT followed FROM follows WHERE follower = $1))
                        OR (p.visibility = 'private' AND p.author = $1))
                ORDER BY date_created DESC
                LIMIT $2
                OFFSET $3`,
        values: [loggedInUser, limit, offset, queryKeywords, initialDate, finalDate, tags],
    });
    const size = await query({
        text: `SELECT COUNT(p.id)
                FROM posts p
                    INNER JOIN users ON (users.id = p.author)
                WHERE
                    (first_name ~* ($2)
                        OR last_name ~* ($2))
                    AND $5::TEXT[] <@ (SELECT ARRAY(SELECT tags.name
                                        FROM tags INNER JOIN posts_tags pt ON (pt.tag = tags.id)
                                        WHERE pt.post = p.id))
                    AND p.date_created >= (SELECT TO_TIMESTAMP($3)) AND p.date_created <= (SELECT TO_TIMESTAMP($4))
                    AND (p.visibility = 'public'
                        OR (p.visibility = 'followers' AND p.author IN (SELECT followed FROM follows WHERE follower = $1))
                        OR (p.visibility = 'private' AND p.author = $1))`,
        values: [loggedInUser, queryKeywords, initialDate, finalDate, tags],
    });

    return {
        posts: posts.rows,
        size: size.rows[0].count,
    };
}

async function userQuery(keywords: string[], limit: number, offset: number, initialDate: number, finalDate: number) {
    const queryKeywords = keywords.join('|');
    const users = await query({
        text: `SELECT id, first_name, last_name, rate, date_created
                FROM users
                WHERE
                    (first_name ~* ($3)
                        OR last_name ~* ($3))
                    AND date_created >= (SELECT TO_TIMESTAMP($4)) AND date_created <= (SELECT TO_TIMESTAMP($5))
                LIMIT $1
                OFFSET $2`,
        values: [limit, offset, queryKeywords, initialDate, finalDate],
    });
    const size = await query({
        text: `SELECT COUNT(id)
                FROM users
                WHERE
                    (first_name ~* ($1) OR last_name ~* ($1))
                    AND date_created >= (SELECT TO_TIMESTAMP($2))
                    AND date_created <= (SELECT TO_TIMESTAMP($3))`,
        values: [queryKeywords, initialDate, finalDate],
    });

    return {
        users: users.rows,
        size: size.rows[0].count,
    };
}

// Add comments, tags, etc. of posts to response.
async function addPostDetails(posts: any[]) {
    for (const post of posts) {
        const comments = await query({
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

        post.comments = comments.rows;
        post.tags = tagsPost.rows;
        post.files = files.rows;
    }
}

async function runQueries(type, keywords, tags, limit, offset, initialDate, finalDate): Promise<{}> {
    let results;
    let posts;
    let size;
    let users;
    switch (type) {
        case 1:
            results = (await postQuery(keywords, tags, limit, offset, initialDate, finalDate));
            posts = results.posts;
            size = results.size;
            await addPostDetails(posts);
            return { posts, size };
        case 2:
            results = (await authorQuery(keywords, tags, limit,  offset, initialDate, finalDate));
            posts = results.posts;
            size = results.size;
            await addPostDetails(posts);
            return { posts, size };
        case 3:
            results = (await userQuery(keywords, limit, offset, initialDate, finalDate));
            users = results.users;
            size = results.size;
            return { users, size };
    }
}

/**
 * TODO: Integrate conferences
 * @param req
 * @param res
 */
export async function search(req, res) {
    const offset: number = req.query.offset;
    const limit: number = req.query.perPage;

    const keywords: string[] = req.query.k ? JSON.parse(req.query.k) : [];
    const tags: string[] = req.query.tags ? JSON.parse(req.query.tags) : [];
    const type: string = req.query.t ? JSON.parse(req.query.t) : null;
    const initialDate: number = new Date(req.query.di ? req.query.di : null).getTime() / 1000;
    const finalDate: number = (req.query.df
        ? new Date(req.query.df).getTime() / 1000
        : Date.now() / 1000);

    try {
        const result = await runQueries(type, keywords, tags, limit, offset, initialDate, finalDate);
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('Search error');
    }
}
