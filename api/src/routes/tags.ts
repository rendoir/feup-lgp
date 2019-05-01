'use strict';
import { Router } from 'express';
export const tagsRouter = Router();
import * as controller from '../controllers/tags';

/**
 * @api {get} /api/tags Get all tags
 * @apiName Get-All-Tags
 * @apiGroup Get
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
tagsRouter.get('/', controller.getAllTags);
