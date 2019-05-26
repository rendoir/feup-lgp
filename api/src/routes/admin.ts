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
 * @apiParam {String} userLevel The permissions this user should have.
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
 * @apiSuccess {String} date_created     The date in which the account was whitelisted.
 * @apiSuccess {String} isactive        yes if the account has been activated, false otherwise.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      [
 *          {
 *          email: 'a@gmail.com',
 *          date_created: '18/05/2018',
 *          isactive: yes
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
 * @api {post} /api/admin/isAdmin Know if user is admin
 * @apiName Is-admin
 * @apiGroup Admin
 *
 * @apiParam {number} is ID of the user
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
 *      message: 'You do not have permissions to add a admin'
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *      message: 'An error ocurred while adding admin'
 *     }
 */
adminRouter.post('/:id', controller.isUserAdmin);

/**
 * @api {get} /api/admin/product_exchange_notifications Get list of products exchanged by users
 * @apiName Get-Product-Exchange-Notifications
 * @apiGroup Admin
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error ocurred while gettting users'
 *     }
 */
adminRouter.get('/product_exchange_notifications', controller.getProductExchangeNotifications);

/**
 * @api {get} /api/admin/notifications Get list of reported content who has not been subject of admin review
 * @apiName Get-Report-Notifications
 * @apiGroup Admin
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Bad Request
 *     {
 *      message: 'An error ocurred fetching report notifications: You are not an admin.'
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error ocurred while fetching report notifications'
 *     }
 */
adminRouter.get('/notifications', controller.getReportNotifications);

/**
 * @api {get} /api/admin/amount_notifications Get amount of report notifications
 * @apiName Get-Amount-Report-Notifications
 * @apiGroup Admin
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'Error retrieving report notifications count'
 *     }
 */
adminRouter.get('/amount_notifications', controller.amountReportNotifications);

/**
 * @api {post} /api/admin/report_reasons Get reasons of a report
 * @apiName Get-Report-Reasons
 * @apiGroup Admin
 *
 * The id paramater is in the URL to avoid routing errors
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error ocurred while fetching report reasons'
 *     }
 */
adminRouter.post('/:id/report_reasons', controller.getReportReasons);

/**
 * @api {post} /api/admin/ignore_reports Ignore all reports to a given content
 * @apiName Ignore-Reports
 * @apiGroup Admin
 *
 * The id paramater is in the URL to avoid routing errors
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error ocurred while gettting users'
 *     }
 */
adminRouter.post('/:id/ignore_reports', controller.ignoreContentReports);

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
