'use strict';
import { Router } from 'express';
import * as controller from '../controllers/register';
export const registerRouter = Router();

/**
 * @api {post} /api/register/ Register into gNet
 * @apiName Register-gNet
 * @apiGroup Register
 *
 * @apiParam {String} first_name First name of the user.
 * @apiParam {String} last_name Last name of the user.
 * @apiParam {String} home_town Hometown of the user.
 * @apiParam {String} university University of the user.
 * @apiParam {String} work Work of the user.
 * @apiParam {String} work_field Work field of the user.
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
registerRouter.post('/', controller.register);

/**
 * @api {post} /api/register/check-email Check if email exists
 * @apiName Register-check-email
 * @apiGroup Register
 *
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
 *      message: 'An error ocurred while checking if the e'mail exists
 *     }
 */
registerRouter.post('/check-email', controller.checkEmail);
