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

export async function getProductExchangeNotifications(req, res) {
    if (!await isAdmin(req.user.id)) {
        console.log('\n\nERROR: You cannot retrieve product exchange notifications if you are not an admin');
        res.status(403).send({ message: 'An error ocurred fetching product exchange notifications: You are not an admin.' });
        return;
    }

    query({
        text: 'SELECT * FROM retrieve_exchange_notifications()',
    }).then((result) => {
        res.status(200).send(result.rows);
    }).catch((error) => {
        console.log('\n\nERROR:', error);
        res.status(500).send({ message: 'An error ocurred while fetching report notifications' });
    });
}

export async function getReportNotifications(req, res) {
    if (!await isAdmin(req.user.id)) {
        console.log('\n\nERROR: You cannot retrieve report notifications if you are not an admin');
        res.status(403).send({ message: 'An error ocurred fetching report notifications: You are not an admin.' });
        return;
    }

    query({
        text: 'SELECT * FROM retrieve_admin_notifications()',
    }).then((result) => {
        res.status(200).send(result.rows);
    }).catch((error) => {
        console.log('\n\nERROR:', error);
        res.status(500).send({ message: 'An error ocurred while fetching report notifications' });
    });
}

export async function amountReportNotifications(req, res) {
    if (!await isAdmin(req.user.id)) {
        console.log('\n\nERROR: You cannot retrieve report notifications amount if you are not an admin');
        res.status(403).send({ message: 'An error ocurred fetching report notifications amount: You are not an admin.' });
        return;
    }

    try {
        const amountReportNotificationsQuery = await query({
            text: `SELECT COUNT(*) FROM retrieve_admin_notifications()`,
        });
        res.status(200).send({ amountReportNotifications: amountReportNotificationsQuery.rows[0].count });
    } catch (error) {
        console.error(error);
        res.status(500).send(new Error('Error retrieving report notifications count'));
    }
}

export async function getReportReasons(req, res) {
    if (!await isAdmin(req.user.id)) {
        console.log('\n\nERROR: You cannot retrieve report reasons if you are not an admin');
        res.status(403).send({ message: 'An error ocurred fetching report reasons: You are not an admin.' });
        return;
    }

    query({
        text: `SELECT description, justify_hours(age(current_timestamp, date_reported)) as elapsed_time,
                reporter, users.first_name, users.last_name
                    FROM content_reports, users
                    WHERE admin_review = FALSE AND
                    content_id = $1 AND content_type = $2 AND
                    users.id = reporter
                    ORDER BY date_reported DESC`,
        values: [req.body.content_id, req.body.content_type],
    }).then((result) => {
        res.status(200).send(result.rows);
    }).catch((error) => {
        console.log('\n\nERROR:', error);
        res.status(500).send({ message: 'An error ocurred while fetching report reasons' });
    });
}

export async function ignoreContentReports(req, res) {
    if (!await isAdmin(req.user.id)) {
        console.log('\n\nERROR: You cannot ignore reports if you are not an admin');
        res.status(403).send({ message: 'An error ocurred ignoring reports: You are not an admin.' });
        return;
    }

    query({
        text: `UPDATE content_reports SET admin_review = TRUE
                WHERE content_id = $1 AND
                content_type = $2`,
        values: [req.body.content_id, req.body.content_type],
    }).then((result) => {
        res.status(200).send();
    }).catch((error) => {
        console.log('\n\nERROR:', error);
        res.status(500).send({ message: 'An error ocurred while ignoring reports' });
    });
}

export async function isUserAdmin(req, res) {
    const isRequesterAdmin = await isAdmin(req.params.id);
    if (isRequesterAdmin) {
        res.send(true);
    } else {
        res.send(false);
    }
}

export async function addAdmin(req, res) {
    const isRequesterAdmin = await isAdmin(req.user.id);

    if (isRequesterAdmin) {
        query({
            text: 'UPDATE users SET permissions = \'admin\' WHERE email = $1',
            values: [req.body.email],
        }).then((result) => {
            if (result.rowCount > 0) {
                res.status(200).send();
            } else { res.status(400).send({ message: 'The email does not belong to a user' }); }
        }).catch((error) => {
            console.log(error);
            res.status(500).send({ message: 'An error ocurred while adding admin' });
        });
    } else { res.status(401).send({ message: 'You do not have permissions to add an admin' }); }
}

export async function banUser(req, res) {
    const isRequesterAdmin = await isAdmin(req.user.id);

    if (isRequesterAdmin) {
        query({
            text: 'UPDATE users SET permissions = \'banned\' WHERE email = $1',
            values: [req.body.email],
        }).then((result) => {
            if (result.rowCount > 0) {
                res.status(200).send();
            } else { res.status(400).send({ message: 'The email does not belong to a user' }); }
        }).catch((error) => {
            console.log(error);
            res.status(500).send({ message: 'An error ocurred while banning a user' });
        });
    } else { res.status(401).send({ message: 'You do not have permissions to ban a user' }); }
}

export async function makeUser(req, res) {
    const isRequesterAdmin = await isAdmin(req.user.id);

    if (isRequesterAdmin) {
        query({
            text: 'UPDATE users SET permissions = \'user\' WHERE email = $1',
            values: [req.body.email],
        }).then((result) => {
            if (result.rowCount > 0) {
                res.status(200).send();
            } else { res.status(400).send({ message: 'The email does not belong to a user' }); }
        }).catch((error) => {
            console.log(error);
            res.status(500).send({ message: 'An error ocurred while changing to a user' });
        });
    } else { res.status(401).send({ message: 'You do not have permissions to change to a user' }); }
}

export async function isAdmin(userId): Promise<boolean> {
    try {
        const result = await query({
            text: `SELECT id FROM users WHERE id = $1 AND permissions = 'admin'`,
            values: [userId],
        });
        return result.rowCount > 0;
    } catch (error) {
        console.error(error);
        return false;
    }
}
