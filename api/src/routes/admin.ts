'use strict';
import { Router } from 'express';
export const adminRouter = Router();
import * as controller from '../controllers/admin';

// adminRouter.use((req, res, next) => {
//     if (req.user && req.user.permission !== 'admin') {
//         return res.status(401).send({
//             message: `You don't have permission to access this endpoint. You must have admin clearance or higher` });
//     }
//     next();
// });

/**
 * @api {post} /api/admin/users Add user to whitelist
 * @apiName AddUserToWhitelist
 * @apiGroup Admin
 *
 * @apiParam {String} email Email to whitelist.
 *
 * @apiSuccess {String} email Email added to the whitelist
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      email: 'a@gmail.com'
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error ocurred while inserting user email'
 *     }
 */
adminRouter.post('/users', controller.addUserToWhiteList);

/**
 * @api {delete} /api/admin/users?email Remove user from whitelist
 * @apiName RemoveUserFromWhitelist
 * @apiGroup Admin
 *
 * @apiParam {String} email Email to remove from whitelist.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {}
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error ocurred while deleting user'
 *     }
 */
adminRouter.delete('/users', controller.deleteUserFromWhiteList);

/**
 * @api {get} /api/admin/users Get list of users
 * @apiName Get-All-Users
 * @apiGroup Admin
 *
 * @apiSuccess {String} email           The email of the account.
 * @apiSuccess {String} dateCreated     The date in which the account was whitelisted.
 * @apiSuccess {String} isActive        yes if the account has been activated, false otherwise.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      [
 *          {
 *          email: 'a@gmail.com',
 *          dateCreated: '18/05/2018',
 *          isActive: yes
 *          }
 *      ]
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error ocurred while gettting users'
 *     }
 */
adminRouter.get('/users', controller.getAllUsers);

/**
 * @api {post} /api/admin Make user an admin
 * @apiName Add-admin
 * @apiGroup Admin
 *
 * @apiParam {String} email Email of the user to became admin.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'The email does not belong to a user'
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *      message: 'You do not have permissions to add an admin'
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *      message: 'An error ocurred while adding admin'
 *     }
 */
adminRouter.post('/', controller.addAdmin);

/**
 * @api {post} /api/admin/ban Ban a user
 * @apiName Ban-user
 * @apiGroup Admin
 *
 * @apiParam {String} email Email of the user to be banned
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'The email does not belong to a user'
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *      message: 'You do not have permissions to ban a user'
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *      message: 'An error ocurred while banning user'
 *     }
 */
adminRouter.post('/ban', controller.banUser);

/**
 * @api {post} /api/admin/user Change to user
 * @apiName Change-user
 * @apiGroup Admin
 *
 * @apiParam {String} email Email of the user
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'The email does not belong to a user'
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *      message: 'You do not have permissions to change to a user'
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *      message: 'An error ocurred while changing to a user'
 *     }
 */
adminRouter.post('/user', controller.makeUser);
