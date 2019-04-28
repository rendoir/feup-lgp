'use strict';
import {query} from '../db/db';

/**
 * Get posts matching keywords.
 * Posts must be either public or, if for followers, the logged in user must be a follower of the author,
 * or, if private, the logged in user must be the post's author.
 */
function getPostQuery(keywords: string, offset: number, initialDate: number, finalDate: number): {text: string, values: any[]} {
    const loggedInUser = 1;
    const queryKeywords = JSON.parse(keywords).join(' & ');
    return {
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
    };
}

function getAuthorQuery(keywords: string, offset: number, initialDate: number, finalDate: number): {text: string, values: any[]} {
    const loggedInUser = 1;
    const queryKeywords = JSON.parse(keywords).join('|');
    return {
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
    };
}

function getUserQuery(keywords: string, offset: number, initialDate: number, finalDate: number): {text: string, values: any[]} {
    const queryKeywords = JSON.parse(keywords).join('|');
    return {
        text: `SELECT id, first_name, last_name, rate, date_created
                FROM users
                WHERE
                    (first_name ~* ($2)
                        OR last_name ~* ($2))
                    AND date_created >= (SELECT TO_TIMESTAMP($3)) AND date_created <= (SELECT TO_TIMESTAMP($4))
                LIMIT 10
                OFFSET $1`,
        values: [offset, queryKeywords, initialDate, finalDate],
    };
}

function getSpecificQuery(type: string)
: (queryKeywords: string, offset: number, initialDate: number, finalDate: number) => {text: string, values: any[]} {
    switch (type) {
        case 'post':
            return getPostQuery;
        case 'author':
            return getAuthorQuery;
        case 'user':
            return getUserQuery;
        default:
            console.error('Invalid search type: ' + type);
            return null;
    }
}

/**
 * TODO: Integrate conferences and files search
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

    const type: string = req.query.t;
    const initialDate: number = new Date(req.query.di ? req.query.di : null).getTime();
    const finalDate: number = (req.query.df
        ? new Date(req.query.df).getTime()
        : Date.now());

    const queryGetter = getSpecificQuery(type);
    if (queryGetter == null) {
        res.status(400).send('Invalid search type');
        return;
    }

    try {
        const result = await query(queryGetter(keywords, offset, initialDate, finalDate));
        res.send(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Search error');
    }
}
