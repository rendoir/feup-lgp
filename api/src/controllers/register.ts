import * as crypto from 'crypto';
import { query } from '../db/db';

export async function register(req, res) {
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
            text: `INSERT INTO users (email, pass, first_name, last_name, work, work_field, home_town, university, permissions)
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            values: [req.body.email, hashedPassword, req.body.first_name, req.body.last_name,
                req.body.work, req.body.work_field, req.body.home_town, req.body.university, 'user'],
        }).then((result2) => {
            console.log("User created!");
            res.status(200).send();
        }).catch((error) => {
            console.log('\n\nERROR:', error);
            res.status(400).send({ message: 'An error occured while registering a new user' });
        });

    }).catch((error) => {
        console.log('\n\nERROR:', error);
        res.status(400).send({ message: 'An error ocurred while checking register permissions' });
    });
}

export async function checkEmail(req, res){
    query({
        text: 'SELECT * from users',
    }).then((result) => {
        console.log('res: ', result);
        if(result.rowCount === 0) {
            res.send(false);
        } else {
            res.send(true);
        }

    }).catch((error) => {
        console.log('\n\nERROR:', error);
        res.status(400).send({ message: 'An error ocurred while checking if the email exists' });
    });
}
