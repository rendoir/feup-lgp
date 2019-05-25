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
usersRouter.post('/', controller.register);

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
 * @api {post} /api/users/:id/subscription Set a user subscription
 * @apiName Subscribe-User
 * @apiGroup Users
 *
 * @apiParam {number}   id   Id of the user being subscribed
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
usersRouter.post('/:id/subscription', controller.subscribeUser);

/**
 * @api {delete} /api/users/:id/subscription Remove a user subscription
 * @apiName Unsubscribe-User
 * @apiGroup Users
 *
 * @apiParam {number}   id   Id of the user that was being subscribed
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
usersRouter.delete('/:id/subscription', controller.unsubscribeUser);

/**
 * @api {post} /api/users/rate Rate a user
 * @apiName Rate-User
 * @apiGroup Users
 *
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
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
usersRouter.get('/:id/notifications', controller.getNotifications);

/**
 * @api {get} /api/users/:id/amount_notifications Fetch logged user's received invites amount, which he hasn't seen yet
 * @apiName Get-Amount-User-Notifications
 * @apiGroup Users
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error ocurred while gettting users'
 *     }
 */
usersRouter.get('/:id/amount_notifications', controller.amountNotifications);

/**
 * @api {put} /api/users/:id/invite_notified Mark an invite notification as seen by the invited user
 * @apiName Set-Invitation-As-Seen
 * @apiGroup Users
 *
 * @apiParam {number}   id    This id can be set to any value, since it will not be used. It's in the URL due to route problems.
 * @apiParam {number}   inviteId    Id of the invite being set as seen by the user
 *
 * The user who saw the invite notification is the logged in user.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
usersRouter.put('/:id/invite_notified', controller.inviteNotified);

/**
 * @api {post} /api/users/:id/edit Update user's information
 * @apiName Edit-user
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
usersRouter.post('/:id/edit', controller.updateProfile);

/**
 * @api {get} /api/users/:id/points Get the points availabe for a user on the general shop
 * @apiName Get-Points
 * @apiGroup Users
 *
 * @apiParam {number}   id    This id can be set to any value, since it will not be used. It's in the URL due to route problems.
 *
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
usersRouter.get('/:id/points', controller.getPoints);
