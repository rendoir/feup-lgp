import * as crypto from 'crypto';
import {query} from '../db/db';

export function register(req, res) {
    query({
        text: 'SELECT * from users WHERE email=$1',
        values: [req.body.email],
    }).then((result1) => {
        if (result1.rowCount !== 0) {
            res.status(401).send({ message: 'This email already exists!' });
            return;
        }
        const hash = crypto.createHash('sha256');
        hash.update(req.body.password);
        const hashedPassword = hash.digest('hex');

        query({
            text: `INSERT INTO users (email, pass, first_name, last_name, work, work_field, home_town, university)
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            values: [req.body.email, hashedPassword, req.body.first_name, req.body.last_name,
                req.body.work, req.body.work_field, req.body.home_town, req.body.university],
        }).then((result2) => {
        }).catch((error) => {
            console.log('\n\nERROR:', error);
            res.status(400).send({ message: 'An error occured while registering a new user' });
        });
        res.status(200).send();

    }).catch((error) => {
        console.log('\n\nERROR:', error);
        res.status(400).send({ message: 'An error ocurred while checking register permissions' });
    });
}

export class UserToken {
    private _EMAIL: string;
    private _ID: number;
    private _PERMISSION: 'user'|'admin';
    constructor(email: string, id: number, permission: 'user'|'admin') {
        this._EMAIL = email;
        this._PERMISSION = permission;
        this._ID = id;
    }

    get id(): number {
        return this._ID;
    }

    get email(): string {
        return this._EMAIL;
    }

    get permission(): string {
        return this._PERMISSION;
    }

    get properties() {
        return {email: this.email, id: this.id, permission: this.permission};
    }
}

export async function getUser(req, res) {
    const id = req.params.id;
    try {
        const user = await query({
            text: `SELECT first_name, last_name, email, bio, home_town, university, work, work_field
                    FROM users
                    WHERE id = $1
                    `,
            values: [id],
        });

        res.send({ user: user.rows[0] });
    } catch (e) {
        console.log('Error getting user info. Error: ' + e.message);
    }
}

export async function getUserUserInteractions(req, res) {
    const userId = req.user.id;
    const targetUser = req.params.id;
    try {
        const totalRatingsQuery = await query({
            text: `SELECT count(*)
                    FROM users_rates
                    WHERE target_user = $1`,
            values: [targetUser],
        });
        const totalRatingAmountQuery = await query({
            text: `SELECT SUM(rate) AS total
                    FROM users_rates
                    WHERE target_user = $1`,
            values: [targetUser],
        });
        const rateQuery = await query({
            text: `SELECT rate
                    FROM users_rates
                    WHERE
                        evaluator = $1 AND target_user = $2`,
            values: [userId, targetUser],
        });
        const subscriptionQuery = await query({
            text: `SELECT *
                    FROM follows
                    WHERE
                        follower = $1 AND followed = $2`,
            values: [userId, targetUser],
        });

        // tslint:disable-next-line: no-shadowed-variable
        const rate = rateQuery.rows[0] ? rateQuery.rows[0].rate : null;
        const totalRatingsNumber = totalRatingsQuery.rows[0].count;
        const totalRatingAmount = totalRatingAmountQuery.rows[0].total * 20;

        const result = {
            rate,
            totalRatingsNumber,
            totalRatingAmount,
            subscription: Boolean(subscriptionQuery.rows[0]),
        };
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send(new Error('Error retrieving user-user interactions'));
    }
}

export function subscribeUser(req, res) {
    const userId = req.user.id;
    query({
        text: 'INSERT INTO follows (follower, followed) VALUES ($1, $2)',
        values: [userId, req.params.id],
    }).then((result) => {
        res.status(200).send();
    }).catch((error) => {
        console.log('\n\nERROR:', error);
        res.status(400).send({ message: 'An error ocurred while subscribing user' });
    });
}

export function unsubscribeUser(req, res) {
    const userId = req.user.id;
    query({
        text: 'DELETE FROM follows WHERE follower = $1 AND followed = $2',
        values: [userId, req.params.id],
    }).then((result) => {
        res.status(200).send();
    }).catch((error) => {
        console.log('\n\nERROR:', error);
        res.status(400).send({ message: 'An error ocurred while unsubscribing user' });
    });
}

export function rate(req, res) {
    const userId = req.user.id;
    query({
        text: 'INSERT INTO users_rates (evaluator, rate, target_user) VALUES ($1, $2, $3)',
        values: [userId, req.body.rate, req.params.id],
    }).then((result) => {

        query({
            text: 'UPDATE users SET rate=$1 WHERE id=$2',
            values: [req.body.newUserRating, req.params.id],
        }).then((result2) => {
            res.status(200).send();
        }).catch((error) => {
            console.log('\n\nERROR:', error);
            res.status(400).send({ message: 'An error occured while updating the rating of the user' });
        });
    }).catch((error) => {
        console.log('\n\nERROR:', error);
        res.status(400).send({ message: 'An error ocurred while rating an user' });
    });
}

export async function getProfilePosts(req, res) {
    const userId = req.params.id;
    const userloggedId = req.user.id;
    const limit = req.query.perPage;
    const offset = req.query.offset;
    try {
        const result = await query({
            text: `SELECT p.id, a.first_name, a.last_name, p.title, p.content,
                p.visibility, p.date_created, p.date_updated, a.id AS user_id
                    FROM posts p
                        INNER JOIN users a ON (p.author = a.id)
					WHERE p.author = $1 AND
							(p.visibility = 'public'
							OR (p.visibility= 'private' AND p.author = $2)
							OR (p.visibility = 'followers'
								AND (p.author IN (SELECT followed FROM follows WHERE follower = $1))
                                OR $1 = $2))
                    ORDER BY p.date_created DESC
                    LIMIT $3
                    OFFSET $4`,
            values: [userId, userloggedId, limit, offset],
        });
        if (result == null) {
            res.status(400).send(new Error(`Post either does not exist or you do not have the required permissions.`));
            return;
        }
        const totalSize = await query({
            text: `SELECT COUNT(id)
                    FROM posts
                    WHERE author = $1 AND
							          (visibility = 'public'
							          OR (visibility= 'private' AND author = $2)
							          OR (visibility = 'followers' AND (author IN (SELECT followed FROM follows WHERE follower = $1))
							          OR $1=$2))`,
            values: [userId, userloggedId],
        });
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
            post.comments = comment.rows;
            post.tags = tagsPost.rows;
            post.files = files.rows;
        }
        res.send({
            posts: result.rows,
            size: totalSize.rows[0].count,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send(new Error('Error retrieving post'));
    }
}

export async function getNotifications(req, res) {
    const userId = req.user.id;
    try {
      const unseenInvitesQuery = await query({
        text: `SELECT DISTINCT invites.id, invite_subject_id,
                (CASE WHEN invite_type = 'conference' THEN conferences.title ELSE posts.title END) as title, invite_type, date_invited
                FROM invites, conferences, posts
                WHERE (
                        (invite_type = 'conference' AND conferences.id = invite_subject_id) OR
                        (invite_type = 'post' AND posts.id = invite_subject_id)
                    ) AND
                    invited_user = $1 AND
                    invites.user_notified = FALSE
                ORDER BY date_invited DESC`,
        values: [userId],
      });

      res.status(200).send({ notifications: unseenInvitesQuery.rows });
    } catch (error) {
      console.error(error);
      res.status(500).send(new Error('Error retrieving user notifications'));
    }
}

export function inviteNotified(req, res) {
    const userId = req.user.id;
    query({
        text: `UPDATE invites SET user_notified = TRUE
                WHERE id = $1 AND
                invited_user = $2`,
        values: [req.body.inviteId, userId],
    }).then((result) => {
        res.status(200).send();
    }).catch((error) => {
        console.log('\n\nERROR:', error);
        res.status(400).send({ message: 'An error ocurred while setting invite as notified' });
    });
}
