import { query } from '../db/db';

// import * as Twitter from 'twitter';

export async function createChallenge(req, res) {

    if (!req.body.title.trim()) {
        console.log('\n\nError: Challenge title cannot be empty');
        res.status(400).send({
            message: 'An error occurred while crating a new challenge. ' +
                'The field title cannot be empty',
        });
        return;
    }

    const type = req.body.type;
    let answers = null;
    let points = 0;
    let question = null;
    let post = null;

    if (!isNaN(Number(req.body.points))) {
        points = Number(req.body.points);
    }

    switch (type) {
        case 'question_options': {
            question = req.body.question;
            answers = [];
            answers.push('CorrectAnswer: ' + req.body.correctAnswer);
            for (const key in req.body) {
                if (key.includes('options[')) {
                    answers.push('Answer: ' + req.body[key]);
                }
            }
            break;
        }
        case 'comment_post': {
            post = Number(req.body.post);
            break;
        }
        default:
            break;
    }

    query({
        text: `INSERT INTO challenges
                (title, description, dateStart, dateEnd, points, challengeType, question, answers, post, talk)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                RETURNING id`,
        values: [
            req.body.title,
            req.body.description,
            req.body.dateStart,
            req.body.dateEnd,
            points,
            type,
            question,
            answers,
            post,
            Number(req.body.talk_id),
        ],
    }).then((challenge) => {
        res.status(200).send({ challenge: challenge.rows[0].id });
    }).catch((error) => {
        /* istanbul ignore next */
        console.log('\n\nERROR:', error);
        res.status(400).send({ message: 'An error occurred while adding a challenge to a conference' });
    });
}

export function solveChallenge(req, res) {
    query({
        text: `INSERT INTO user_challenge
                (challenged, challenge, answer, complete)
                VALUES ($1, $2, $3, $4)`,
        values: [
            req.body.author,
            req.body.challenge,
            req.body.challenge_answer,
            req.body.completion,
        ],
    }).then((result) => {
        res.status(200).send();
    }).catch((error) => /* istanbul ignore next */ {
        console.log('\n\nERROR:', error);
        res.status(400).send({ message: 'Could not update challenge state. Error: ' + error });
    });
}

export async function getSolvedStateForUser(req, res) {
    try {
        const postTitle = (await query({
            text: `SELECT title
                        FROM posts
                        WHERE posts.id = $1`,
            values: [req.query.post],
        })).rows[0];

        const title = (postTitle !== undefined) ? postTitle.title : undefined;

        const result = (await query({
            text: `SELECT answer, complete FROM user_challenge
                    WHERE user_challenge.challenged = $1 AND user_challenge.challenge = $2`,
            values: [
                req.query.author,
                req.query.challenge,
            ],
        }));

        res.send({state: result.rows, title});

    } catch (error) /* istanbul ignore next */ {
        console.log('\n\nERROR:', error);
        res.status(400).send({ message: 'An error ocurred while creating a post' });
    }

}
