'use strict';
import { Router } from 'express';
import * as controller from '../controllers/login';
export const loginRouter = Router();

/**
 * @api {post} /api/login Login into SocialHub
 * @apiName Login-SocialHub
 * @apiGroup Login
 *
 * @apiParam {String} password Password of the user.
 * @apiParam {String} email Email of the user.
 *
 * @apiSuccess {String} token JWT token
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      token: 'xyz'
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *      message: 'Invalid Credentials'
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error ocurred while attempting to login'
 *     }
 */
loginRouter.post('/', controller.login);
