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
    console.log("your user id: ", observerUser);
    console.log("you want to rate this user: ", targetUser);
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
    console.log("SUBSCRIBEE");
    console.log("follower", req.body.follower);
    console.log("followed", req.body.followed);
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
