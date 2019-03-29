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
