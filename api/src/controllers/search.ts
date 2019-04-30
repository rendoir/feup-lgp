'use strict';
import {query} from '../db/db';

/**
 * Get posts matching keywords.
 * Posts must be either public or, if for followers, the logged in user must be a follower of the author,
 * or, if private, the logged in user must be the post's author.
 */
function postQuery(keywords: string, offset: number, initialDate: number, finalDate: number) {
    const loggedInUser = 1;
    const queryKeywords = JSON.parse(keywords).join(' & ');
    return query({
        text: `SELECT p.id, first_name, last_name, p.title, p.content, p.likes, p.visibility, p.date_created, p.date_updated
                FROM posts p
                    INNER JOIN users ON (users.id = p.author)
                WHERE
                    p.content_tokens @@ to_tsquery($3)
                    AND p.date_created >= (SELECT TO_TIMESTAMP($4)) AND p.date_created <= (SELECT TO_TIMESTAMP($5))
                    AND (p.visibility = 'public'
                        OR (p.visibility = 'followers' AND p.author IN (SELECT followed FROM follows WHERE follower = $1))
                        OR (p.visibility = 'private' AND p.author = $1))
                LIMIT 10
                OFFSET $2`,
        values: [loggedInUser, offset, queryKeywords, initialDate, finalDate],
    });
}

function authorQuery(keywords: string, offset: number, initialDate: number, finalDate: number) {
    const loggedInUser = 1;
    const queryKeywords = JSON.parse(keywords).join('|');
    return query({
        text: `SELECT p.id, first_name, last_name, p.title, p.content, p.likes, p.visibility, p.date_created, p.date_updated
                FROM posts p
                    INNER JOIN users ON (users.id = p.author)
                WHERE
                    (first_name ~* ($3)
                        OR last_name ~* ($3))
                    AND p.date_created >= (SELECT TO_TIMESTAMP($4)) AND p.date_created <= (SELECT TO_TIMESTAMP($5))
                    AND (p.visibility = 'public'
                        OR (p.visibility = 'followers' AND p.author IN (SELECT followed FROM follows WHERE follower = $1))
                        OR (p.visibility = 'private' AND p.author = $1))
                LIMIT 10
                OFFSET $2`,
        values: [loggedInUser, offset, queryKeywords, initialDate, finalDate],
    });
}

function userQuery(keywords: string, offset: number, initialDate: number, finalDate: number) {
    const queryKeywords = JSON.parse(keywords).join('|');
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

async function runQueries(type, keywords, offset, initialDate, finalDate): Promise<{}> {
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
            res.posts = (await postQuery(keywords, offset, initialDate, finalDate)).rows;
            res.retrievePosts = true;
            break;
        case 'author':
            res.authorPosts = (await authorQuery(keywords, offset, initialDate, finalDate)).rows;
            res.retrievePostsByAuthor = true;
            break;
        case 'user':
            res.users = (await userQuery(keywords, offset, initialDate, finalDate)).rows;
            res.retrieveUsers = true;
            break;
        default:
            res.posts = (await postQuery(keywords, offset, initialDate, finalDate)).rows;
            res.authorPosts = (await authorQuery(keywords, offset, initialDate, finalDate)).rows;
            res.users = (await userQuery(keywords, offset, initialDate, finalDate)).rows;
            res.retrieveAll = true;
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

    const keywords: string = req.query.k;
    if (keywords == null) {
        console.error('No search keywords provided');
        res.status(400).send('Invalid search keywords');
        return;
    }

    const type: string = JSON.parse(req.query.t);
    const initialDate: number = new Date(req.query.di ? req.query.di : null).getTime() / 1000;
    const finalDate: number = (req.query.df
        ? new Date(req.query.df).getTime() / 1000
        : Date.now() / 1000);

    try {
        const result = await runQueries(type, keywords, offset, initialDate, finalDate);
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('Search error');
    }
}
