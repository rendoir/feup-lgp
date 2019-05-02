'use strict';
import { Router } from 'express';
import * as controller from '../controllers/search';

export const searchRouter = Router();

/**
 * @api {get} /api/search Search resources
 * @apiName Search
 * @apiGroup Search
 *
 * @apiParam {String}   k       Array of (K)eywords to search for
 * @apiParam {String}   t       (T)ype of resources: 'post', 'user', 'conf', 'author'
 * @apiParam {Date}     di      (I)nitial (D)ate of resource creation
 * @apiParam {Date}     df      (F)inal (D)ate of resource creation
 * @apiParam {Number}   o  Results offset
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
searchRouter.get('/', controller.search);
