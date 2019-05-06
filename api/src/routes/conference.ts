'use strict';
import { Router } from 'express';
import * as controller from '../controllers/conference';

export const conferenceRouter = Router();

/**
 * @api {post} /api/conference Create a conference
 * @apiName Create-A-Conference
 * @apiGroup Post
 *
 * @apiParam {String}   title       title of the conference
 * @apiParam {String}   about       conference description
 * @apiParam {String}   local       local where the conference will take place
 * @apiParam {string}   dateStart   date when the conference starts
 * @apiParam {string}   dateEnd   date when the conference ends
 * @apiParam {Object}   avatar      conference image
 * @apiParam {String}   privacy     Visibility of the post: public/followers/private
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
conferenceRouter.post('/create', controller.createConference);

/**
 * @api {get} /api/conference/:id Get a conference
 * @apiName Get-A-Conference
 * @apiGroup Post
 *
 * @apiParam {String}   id       id of the conference
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
conferenceRouter.get('/:id', controller.getConference);

conferenceRouter.get('/:id/archive', controller.archiveConference);
