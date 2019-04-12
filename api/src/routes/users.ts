'use strict';
import { Router } from 'express';
export const usersRouter = Router();
import * as controller from '../controllers/users';

/**
 * @api {post} /api/users Create and register user
 * @apiName Register-user
 * @apiGroup Users
 *
 * @apiParam {String} email Email of the user.
 * @apiParam {String} password Password that will be associated to the email.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error ocurred while checking register permissions'
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *      message: 'The given email does not have permission to register, please contact the administration'
 *     }
 */
usersRouter.post('/', controller.registerUser);
