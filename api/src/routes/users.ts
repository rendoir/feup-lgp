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
 * @api {get} /api/users/{id} Get user profile info
 * @apiName Profile info
 * @apiGroup Users
 *
 * @apiParam {id} id ID of the user.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error occurred while getting profile posts'
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *      message: 'The given email does not have permission to register, please contact the administration'
 *     }
 */
usersRouter.get('/:id', controller.getUser);

/**
 * @api {post} /api/users/{id} Get user posts
 * @apiName Profile Posts
 * @apiGroup Users
 *
 * @apiParam {id} id ID of the user.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error ocurred while getting profile posts'
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *      message: 'The given email does not have permission to register, please contact the administration'
 *     }
 */
usersRouter.get('/:id/posts', controller.getProfilePosts);

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

/**
 * @api {post} /api/users/rate Rate a user
 * @apiName Rate-User
 * @apiGroup Users
 *
 * @apiParam {String}   evaluator        Id of the user that intends to evaluate
 * @apiParam {Number}   rate             Rate of the User
 * @apiParam {String}   target_user      Id of the user being rated
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
usersRouter.post('/:id/rate', controller.rate);

/**
 * @api {get} /api/users/:id/notifications Fetch logged user's received invites, which he hasn't seen yet
 * @apiName Get-User-Notifications
 * @apiGroup Users
 *
 * @apiParam {number}   id  This id can be set to any value, since it will not be used. It's in the URL due to route problems.
 *
 * The logged user id is required, but we can access it through cookies. Therefore, no parameter is required.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
usersRouter.get('/:id/notifications', controller.getNotifications);

/**
 * @api {put} /api/users/:id/invite_notified Mark an invite notification as seen by the invited user
 * @apiName Set-Invitation-As-Seen
 * @apiGroup Users
 *
 * @apiParam {number}   id    This id can be set to any value, since it will not be used. It's in the URL due to route problems.
 * @apiParam {number}   inviteId    Id of the invite being set as seen by the user
 *
 * The user who saw the invite notification is the logged in user, which means we can access his id through cookies.
 * This way, we don't need to pass it as a request parameter.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
usersRouter.put('/:id/invite_notified', controller.inviteNotified);
