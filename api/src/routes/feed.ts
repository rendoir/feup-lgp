'use strict';
import {Router} from 'express';
import * as controller from '../controllers/feed';
export const feedRouter = Router();

/**
 * @api {get} /api/feed Get feed posts
 * @apiName Get-Feed
 * @apiGroup Feed
 *
 * @apiParam {number}   offset       Offset of the posts appearing
 * @apiParam {number}   limit        Limit of the posts appearing
 * @apiParam {number}   userId       ID of the logged user
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'Error getting the feed'
 *     }
 */
feedRouter.get('/', controller.getFeed);

/**
 * @api {get} /api/feed/posts Get feed posts
 * @apiName Get-Feed-Posts
 * @apiGroup Feed
 *
 * @apiParam {number}   userId       ID of the logged user
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'Error getting the feed stuff'
 *     }
 */
feedRouter.get('/posts', controller.getPosts);
