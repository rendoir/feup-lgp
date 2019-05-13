'use strict';
import { Router } from 'express';
import * as controller from '../controllers/challenge';

export const challengeRouter = Router();

/**
 * @api {post} /api/conference/:id/challenge/create Create a new challenge on a conference
 * @apiName Create-A-Challenge-On-Conference
 * @apiGroup Post
 *
 * @apiParam {String}   conf.id   Number of the conference
 * @apiParam {String}   author.id   Author of the comment
 * @apiParam {String}   comment Text to write in the comment
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
challengeRouter.post('/create', controller.createChallenge);

/**
 * @api {post} /api/conference/:id/challenge/solve Solve a challenge on a conference
 * @apiName Solve-A-Challenge-On-Conference
 * @apiGroup Post
 *
 * @apiParam {String}   conf.id   Number of the conference
 * @apiParam {String}   author.id   Author of the challenge
 * @apiParam {String}   comment Text to write in the comment
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
challengeRouter.post('/solve', controller.solveChallenge);

/**
 * @api {get} /api/conference/:id/challenge Create a new challenge on a conference
 * @apiName Create-A-Challenge-On-Conference
 * @apiGroup Post
 *
 * @apiParam {String}   conf.id   Number of the conference
 * @apiParam {String}   author.id   Author of the comment
 * @apiParam {String}   comment Text to write in the comment
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
challengeRouter.get('/solvedState', controller.getSolvedStateForUser);
