import * as crypto from 'crypto';
import {query} from '../db/db';

export function registerUser(req, res) {
    query({
        text: 'SELECT * from users WHERE email=$1 AND pass IS NULL',
        values: [req.body.email],
    }).then((result1) => {
        if (result1.rowCount === 0) {
            res.status(401).send({ message: 'The given email does not have permission to register, please contact an administrator' });
            return;
        }
        const userId = result1.rows[0].id;
        const hash = crypto.createHash('sha256');
        hash.update(req.body.password);
        const hashedPassword = hash.digest('hex');

        query({
            text: 'UPDATE users SET pass=$1 WHERE id=$2',
            values: [hashedPassword, userId],
        }).then((result2) => {
            res.status(200).json(result2.rows);
        }).catch((error) => {
            console.log('\n\nERROR:', error);
            res.status(400).send({ message: 'An error occured while registering new user' });
        });
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

export async function getUserUserInteractions(req, res) {
    const observerUser = req.body.observer;
    const targetUser = req.params.id;
    console.log('your user id: ', observerUser);
    console.log('you want to rate this user: ', targetUser);
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
            values: [observerUser, targetUser],
        });
        const subscriptionQuery = await query({
            text: `SELECT *
                    FROM follows
                    WHERE
                        follower = $1 AND followed = $2`,
            values: [observerUser, targetUser],
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
    console.log('follower', req.body.follower);
    console.log('followed', req.body.followed);
    query({
        text: 'INSERT INTO follows (follower, followed) VALUES ($1, $2)',
        values: [req.body.follower, req.params.id],
    }).then((result) => {
        res.status(200).send();
    }).catch((error) => {
        console.log('\n\nERROR:', error);
        res.status(400).send({ message: 'An error ocurred while subscribing user' });
    });
}

export function unsubscribeUser(req, res) {
    query({
        text: 'DELETE FROM follows WHERE follower = $1 AND followed = $2',
        values: [req.body.follower, req.params.id],
    }).then((result) => {
        res.status(200).send();
    }).catch((error) => {
        console.log('\n\nERROR:', error);
        res.status(400).send({ message: 'An error ocurred while unsubscribing user' });
    });
}

export function rate(req, res) {
    query({
        text: 'INSERT INTO users_rates (evaluator, rate, target_user) VALUES ($1, $2, $3)',
        values: [req.body.evaluator, req.body.rate, req.params.id],
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
    const userId = req.params.id; const userloggedId = 1; // logged in user
    const offset = req.query.offset;
    try {
        const result = await query({
            text: `SELECT p.id, a.first_name, a.last_name, p.title, p.content, p.likes,
                p.visibility, p.date_created, p.date_updated, a.id AS user_id
                    FROM posts p
                        INNER JOIN users a ON (p.author = a.id)
					WHERE p.author = $1 AND
							(p.visibility = 'public'
							OR (p.visibility= 'private' AND p.author = $2)
							OR (p.visibility = 'followers'
								AND (p.author IN (SELECT followed FROM follows WHERE follower = $1))
                                OR $1=$2))
                    ORDER BY p.date_created DESC
                    LIMIT 10
                    OFFSET $3`,
            values: [userId, userloggedId, offset],
        });
        if (result == null) {
            res.status(400).send(new Error(`Post either does not exist or you do not have the required permissions.`));
            return;
        }
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
        const profileInfo = await query({
            text: `SELECT first_name, last_name, email, bio, home_town, university, work, work_field
                FROM users
                WHERE id = $1
             `,
            values: [userId],
        });
        res.send({
            posts: result.rows,
            comments: commentsToSend,
            likers: likersToSend,
            tags: tagsToSend,
            files: filesToSend,
            user: profileInfo.rows[0],
        });
    } catch (error) {
        console.error(error);
        res.status(500).send(new Error('Error retrieving post'));
    }
}

export async function getNotifications(req, res) {
    console.log('GET NOTIFICATIONS');
    const userId = 1;
    console.log('USER: ', userId);

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

      console.log("NOTIFICATIONS FETCHED");

      res.status(200).send({ notifications: unseenInvitesQuery.rows });
    } catch (error) {
      console.error(error);
      res.status(500).send(new Error('Error retrieving user notifications'));
    }
}

export function inviteNotified(req, res) {
    console.log('INVITE NOTIFIED');
    const userId = 1;
    console.log('USER: ', userId);
    console.log('INVITE: ', req.body.inviteId);
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
