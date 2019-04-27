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

/**
 * @api {post} /api/users/:id/user_interactions Get user-user one-click interactions such as rate or subscription
 * @apiName Get-User-User-Interactions
 * @apiGroup Users
 *
 * @apiParam {number}   observer   Id of the user visting another user's page
 * @apiParam {number}   id   Id of the user whose page is being visited
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
usersRouter.post('/:id/user_interactions', controller.getUserUserInteractions);

/**
 * @api {post} /api/users/:id/subscribe Set a user subscription
 * @apiName Subscribe-User
 * @apiGroup Users
 *
 * @apiParam {number}   follower   Id of the user that intends to subscribe
 * @apiParam {number}   id   Id of the user being subscribed
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
usersRouter.post('/:id/subscribe', controller.subscribeUser);

/**
 * @api {post} /api/users/:id/unsubscribe Remove a user subscription
 * @apiName Unsubscribe-User
 * @apiGroup Users
 *
 * @apiParam {number}   follower   Id of the user removing the subscription
 * @apiParam {number}   id   Id of the user that was being subscribed
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
usersRouter.post('/:id/unsubscribe', controller.unsubscribeUser);
