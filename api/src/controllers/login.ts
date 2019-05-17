import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import { query } from '../db/db';
import {UserToken} from './users';

export async function login(req, res, next) {
    try {
        const hash = crypto.createHash('sha256');
        hash.update(req.body.password);
        const hashedPassword = hash.digest('hex');
        const result = await query({
            text: 'SELECT id, permissions FROM users WHERE email = $1 AND pass = $2',
            values: [req.body.email, hashedPassword],
        });
        const user = result.rows[0];
        if (result.rowCount === 0) {
            const err = new Error('Invalid Credentials');
            err.name = 'UnauthorizedError';
            next(err);
            return;
        }
        else if(user.permissions === 'banned'){
            console.log("You are banned");
            const err = new Error('You are banned from this site');
            err.name = 'BanError';
            next(err);
            return;
        }
        const userToken = new UserToken(req.body.email, user.id, user.permissions);
        const token = jwt.sign(userToken.properties, process.env.JWT_SECRET);
        const body = {
            token,
        };
        res.status(200).send(body);
    } catch (error) {
        console.log('\n\nERROR:', error);
        res.status(400).send({ message: 'An error ocurred while attempting to login' });
    }
}
