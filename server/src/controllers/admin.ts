import { query } from '../db/db';

export function getAllUsers(req, res) {
    const sql = `SELECT email, dateCreated, permissions, pass FROM users where users.email != $1`;
    query({ text: sql, values: [req.user.email] }).then((result) => {
        for (const x of result.rows) {
            if (x.pass === null) {
                x['isactive'] = 'no';
            } else { x['isactive'] = 'yes'; }
            delete x.pass;
        }
        res.send(result.rows);
    }).catch((error) => {
        console.log(error);
        res.status(400).send({ message: `An error ocurred while gettting users` });
    });
}

export function addUserToWhiteList(req, res) {
    const validEmail = /\S+@\S+\.\S+/.test(req.body.email);
    if (req.body.email == null || req.body.email === undefined || !validEmail) {
        res.status(400).send({ message: 'Please insert a valid email' });
        return;
    }
    query({
        text: 'INSERT INTO users (email,pass,permissions) VALUES ($1,$2,$3) RETURNING email',
        values: [req.body.email, null, req.body.userLevel],
    }).then((result) => {
        res.status(200).json(result.rows[0]);
    }).catch((error) => {
        console.log(error);
        res.status(400).send({ message: 'An error ocurred while inserting user email' });
    });

}

export function deleteUserFromWhiteList(req, res) {
    query({
        text: 'DELETE FROM users WHERE email = $1', values: [req.query.email],
    }).then((result) => {
        res.status(200).send();
    }).catch((error) => {
        console.log(error);
        res.status(400).send({ message: 'An error ocurred while deleting user' });
    });

}