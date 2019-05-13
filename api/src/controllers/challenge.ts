import * as fs from 'fs';
import * as request from 'request-promise';
// import * as Twitter from 'twitter';

import {query} from '../db/db';

export async function createChallenge(req, res) {

    if (!req.body.title.trim()) {
        console.log('\n\nError: Challenge title cannot be empty');
        res.status(400).send({
            message: 'An error occurred while crating a new challenge. ' +
                'The field title cannot be empty',
        });
        return;
    }

    const content = [];

    if (req.body.text !== '') {
        content.push('Description: ' + req.body.text);
    }

    let type = '';
    let points = 0;

    if (isNaN(Number(req.body.prizePoints)) !== false) {
        points = Number(req.body.prizePoints);
    }

    switch (req.body.type) {
        case 'post': {
            type = 'create_post';
            break;
        }
        case 'question': {
            type = 'answer_question';
            content.push('Question: ' + req.body.question);
            content.push('CorrectAnswer: ' + req.body.correctAnswer);
            break;
        }
        case 'options': {
            type = 'question_options';
            content.push('Question: ' + req.body.question);
            content.push('CorrectAnswer: ' + req.body.correctAnswer);
            for (const key in req.body) {
                if (key.includes('options[')) {
                    content.push('Answer: ' + req.body[key]);
                }
            }
            break;
        }
        case 'comment': {
            type = 'comment_post';
            content.push('PostToComment: ' + req.body.post);
            break;
        }
        default:
            break;
    }

    query({
        text: `INSERT INTO challenges
                (title, dateStart, dateEnd, prize, points_prize, challengeType, content, conference)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        values: [
            req.body.title,
            req.body.dateStart,
            req.body.dateEnd,
            req.body.prize,
            points,
            type,
            content,
            Number(req.body.conf_id),
        ],
    }).then((result) => {
        res.status(200).send();
    }).catch((error) => {
        console.log('\n\nERROR:', error);
        res.status(400).send({ message: 'An error ocurred while adding a challenge to a conference' });
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
    }).catch((error) => {
        console.log('\n\nERROR:', error);
        res.status(400).send({ message: 'An error ocurred while adding a challenge to a conference' });
    });
}

export function getSolvedStateForUser(req, res) {

    query({
        text: `SELECT answer, complete FROM user_challenge
                WHERE user_challenge.challenged = $1 AND user_challenge.challenge = $2`,
        values: [
            req.query.author,
            req.query.challenge,
        ],
    }).then((result) => {
        res.send(result.rows);
    }).catch((error) => {
        console.log('\n\nERROR:', error);
        res.status(400).send({ message: 'An error ocurred while getting the state of a challenge from a conference' });
    });
}
