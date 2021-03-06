'use strict';
import { Router } from 'express';
import * as controller from '../controllers/conference';

export const conferenceRouter = Router();

/**
 * @api {get} /api/conferences Get a conference
 * @apiName Get-A-Conference
 * @apiGroup Conference
 *
 * @apiParam {Number}   id          Id of the conference
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
conferenceRouter.get('/:id', controller.getConference);

/**
 * @api {post} /api/conferences/:id/:filename Gets the contents of a conference avatar
 * @apiName Get-File
 * @apiGroup Post
 *
 * @apiParam {String}   id         ID of the conference
 * @apiParam {String}   filename   Name of the avatar of the conference
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
conferenceRouter.get('/:id/avatar/:filename', controller.getAvatar);

/**
 * @api {get} /api/conferences Get all conferences
 * @apiName Get-All-Conferences
 * @apiGroup Conference
 *
 * @apiParam {Number}   user          Id of the user making the request
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
conferenceRouter.get('/', controller.getAllConferences);

/**
 * @api {post} /api/conferences Create a conference
 * @apiName Create-A-Conference
 * @apiGroup Conference
 *
 * @apiParam {Number}   userId      Id of the conference owner
 * @apiParam {String}   title       Title of the conference
 * @apiParam {String}   about       Description of the conference
 * @apiParam {String}   local       Local where the conference will take place
 * @apiParam {string}   dateStart   Date when the conference starts
 * @apiParam {string}   dateEnd     Date when the conference ends
 * @apiParam {Object}   avatar      Image of the conference
 * @apiParam {String}   privacy     Visibility of the conference: public | followers | private
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error occurred while crating a new conference.'
 *     }
 */
conferenceRouter.post('/', controller.createConference);

/**
 * @api {put} /api/conferences Update a conference
 * @apiName Update-A-Conference
 * @apiGroup Conference
 *
 * @apiParam {Number}   id          Id of the conference
 * @apiParam {String}   title       Title of the conference
 * @apiParam {String}   about       Description of the conference
 * @apiParam {String}   local       Local where the conference will take place
 * @apiParam {string}   dateStart   Date when the conference starts
 * @apiParam {string}   dateEnd     Date when the conference ends
 * @apiParam {Object}   avatar      Image of the conference
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
conferenceRouter.put('/:id', controller.editConference);

conferenceRouter.get('/:id/products', controller.getProducts);

conferenceRouter.get('/:conf_id/products/:prod_id', controller.getProduct);

conferenceRouter.post('/:conf_id/products', controller.createProduct);

conferenceRouter.put('/:conf_id/products/:prod_id', controller.updateProduct);

conferenceRouter.delete('/:conf_id/products/:prod_id', controller.deleteProduct);
