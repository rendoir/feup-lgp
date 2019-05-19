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

export async function getReportNotifications(req, res) {
    console.log("GETTING ADMIN NOTIFICATIONS...");
    if (!await isAdmin(req.user.id)) {
        console.log('\n\nERROR: You cannot retrieve report notifications if you are not an admin');
        res.status(403).send({ message: 'An error ocurred fetching report notifications: You are not an admin.' });
        return;
    }

    query({
        text: 'SELECT * FROM retrieve_admin_notifications()',
    }).then((result) => {
        console.log("ADMIN NOTIFS: ", result.rows);
        res.status(200).send(result.rows);
    }).catch((error) => {
        console.log('\n\nERROR:', error);
        res.status(500).send({ message: 'An error ocurred while fetching report notifications' });
    });
}

export async function amountReportNotifications(req, res) {
    console.log("GETTING ADMIN NOTIFICATIONS AMOUNT...");
    if (!await isAdmin(req.user.id)) {
        console.log('\n\nERROR: You cannot retrieve report notifications amount if you are not an admin');
        res.status(403).send({ message: 'An error ocurred fetching report notifications amount: You are not an admin.' });
        return;
    }

    try {
        const amountReportNotificationsQuery = await query({
            text: `SELECT COUNT(*) FROM retrieve_admin_notifications()`,
        });
        console.log("ADMIN NOTIFS AMOUNT: ", amountReportNotificationsQuery.rows[0].count);
        res.status(200).send({ amountReportNotifications: amountReportNotificationsQuery.rows[0].count });
    } catch (error) {
        console.error(error);
        res.status(500).send(new Error('Error retrieving report notifications count'));
    }
}

export async function getReportReasons(req, res) {
    console.log("GETTING REPORT REASONS...");
    if (!await isAdmin(req.user.id)) {
        console.log('\n\nERROR: You cannot retrieve report reasons if you are not an admin');
        res.status(403).send({ message: 'An error ocurred fetching report reasons: You are not an admin.' });
        return;
    }
    console.log("REPORT CONTENT ID", req.body.content_id);
    console.log("REPORT CONTENT TYPE", req.body.content_type);
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
        console.log("REPORT REASONS: ", result.rows);
        res.status(200).send(result.rows);
    }).catch((error) => {
        console.log('\n\nERROR:', error);
        res.status(500).send({ message: 'An error ocurred while fetching report reasons' });
    });
}

export async function ignoreContentReports(req, res) {
    console.log("IGNORING CONTENT REPORTS");
    if (!await isAdmin(req.user.id)) {
        console.log('\n\nERROR: You cannot ignore reports if you are not an admin');
        res.status(403).send({ message: 'An error ocurred ignoring reports: You are not an admin.' });
        return;
    }
    console.log("REPORT CONTENT ID", req.body.content_id);
    console.log("REPORT CONTENT TYPE", req.body.content_type);
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

async function isAdmin(userId): Promise<boolean> {
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
