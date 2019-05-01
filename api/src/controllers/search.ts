'use strict';
import {query} from '../db/db';

/**
 * Get posts matching keywords and tags (desired tags must be a subset of the actual tags).
 * Posts must be either public or, if for followers, the logged in user must be a follower of the author,
 * or, if private, the logged in user must be the post's author.
 */
function postQuery(keywords: string[], tags: string[], offset: number, initialDate: number, finalDate: number) {
    const loggedInUser = 1;
    const queryKeywords = keywords.join(' & ');
    return query({
        text: `SELECT p.id, first_name, last_name, p.title, p.content, p.likes, p.visibility, p.date_created, p.date_updated
                FROM posts p
                    INNER JOIN users ON (users.id = p.author)
                WHERE
                    (p.content_tokens @@ TO_TSQUERY($3) OR $3 LIKE '')
                    AND $6::TEXT[] <@ (SELECT ARRAY(SELECT tags.name
                                        FROM tags INNER JOIN posts_tags pt ON (pt.tag = tags.id)
                                        WHERE pt.post = p.id))
                    AND p.date_created >= (SELECT TO_TIMESTAMP($4)) AND p.date_created <= (SELECT TO_TIMESTAMP($5))
                    AND (p.visibility = 'public'
                        OR (p.visibility = 'followers' AND p.author IN (SELECT followed FROM follows WHERE follower = $1))
                        OR (p.visibility = 'private' AND p.author = $1))
                ORDER BY date_created DESC
                LIMIT 10
                OFFSET $2`,
        values: [loggedInUser, offset, queryKeywords, initialDate, finalDate, tags],
    });
}

function authorQuery(keywords: string[], tags: string[], offset: number, initialDate: number, finalDate: number) {
    const loggedInUser = 1;
    const queryKeywords = keywords.join('|');
    return query({
        text: `SELECT p.id, first_name, last_name, p.title, p.content, p.likes, p.visibility, p.date_created, p.date_updated
                FROM posts p
                    INNER JOIN users ON (users.id = p.author)
                WHERE
                    (first_name ~* ($3)
                        OR last_name ~* ($3))
                    AND $6::TEXT[] <@ (SELECT ARRAY(SELECT tags.name
                                        FROM tags INNER JOIN posts_tags pt ON (pt.tag = tags.id)
                                        WHERE pt.post = p.id))
                    AND p.date_created >= (SELECT TO_TIMESTAMP($4)) AND p.date_created <= (SELECT TO_TIMESTAMP($5))
                    AND (p.visibility = 'public'
                        OR (p.visibility = 'followers' AND p.author IN (SELECT followed FROM follows WHERE follower = $1))
                        OR (p.visibility = 'private' AND p.author = $1))
                ORDER BY date_created DESC
                LIMIT 10
                OFFSET $2`,
        values: [loggedInUser, offset, queryKeywords, initialDate, finalDate, tags],
    });
}

function userQuery(keywords: string[], offset: number, initialDate: number, finalDate: number) {
    const queryKeywords = keywords.join('|');
    return query({
        text: `SELECT id, first_name, last_name, rate, date_created
                FROM users
                WHERE
                    (first_name ~* ($2)
                        OR last_name ~* ($2))
                    AND date_created >= (SELECT TO_TIMESTAMP($3)) AND date_created <= (SELECT TO_TIMESTAMP($4))
                LIMIT 10
                OFFSET $1`,
        values: [offset, queryKeywords, initialDate, finalDate],
    });
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

async function runQueries(type, keywords, tags, offset, initialDate, finalDate): Promise<{}> {
    const res = {
        authorPosts: [],
        posts: [],
        users: [],
        retrieveAll: false,
        retrievePosts: false,
        retrievePostsByAuthor: false,
        retrieveUsers: false,
    };
    switch (type) {
        case 'post':
            res.posts = (await postQuery(keywords, tags, offset, initialDate, finalDate)).rows;
            res.retrievePosts = true;
            break;
        case 'author':
            res.authorPosts = (await authorQuery(keywords, tags, offset, initialDate, finalDate)).rows;
            res.retrievePostsByAuthor = true;
            break;
        case 'user':
            res.users = (await userQuery(keywords, offset, initialDate, finalDate)).rows;
            res.retrieveUsers = true;
            break;
        default:
            res.posts = (await postQuery(keywords, tags, offset, initialDate, finalDate)).rows;
            res.authorPosts = (await authorQuery(keywords, tags, offset, initialDate, finalDate)).rows;
            res.users = (await userQuery(keywords, offset, initialDate, finalDate)).rows;
            res.retrieveAll = true;
    }
    if (res.posts) {
        await addPostDetails(res.posts);
    }
    if (res.authorPosts) {
        await addPostDetails(res.authorPosts);
    }
    return res;
}

/**
 * TODO: Integrate conferences
 * @param req
 * @param res
 */
export async function search(req, res) {
    const offset: number = req.query.o;

    const keywords: string[] = req.query.k ? JSON.parse(req.query.k) : [];
    const tags: string[] = req.query.tags ? JSON.parse(req.query.tags) : [];
    const type: string = req.query.t ? JSON.parse(req.query.t) : null;
    const initialDate: number = new Date(req.query.di ? req.query.di : null).getTime() / 1000;
    const finalDate: number = (req.query.df
        ? new Date(req.query.df).getTime() / 1000
        : Date.now() / 1000);

    try {
        const result = await runQueries(type, keywords, tags, offset, initialDate, finalDate);
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('Search error');
    }
}
