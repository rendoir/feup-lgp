'use strict';
import { Router } from 'express';
export const postRouter = Router();
import * as multer from 'multer';
import * as controller from '../controllers/post';

const upload = multer({dest: 'uploads'});

/**
 * @api {post} /api/post Create a post
 * @apiName Publish-A-Post
 * @apiGroup Post
 *
 * @apiParam {Object[]} files       Images to add to the post.
 * @apiParam {Object[]} post        Array of posts.
 * @apiParam {String}   post.name   Name of the page/account to post
 * @apiParam {String}   post.socialNetwork Social network of this post
 * @apiParam {String}   post.type        page or group
 * @apiParam {String}   [post.fb_id]     Id of facebook page/group, when it is a post on facebook
 * @apiParam {String}   post.textContent Text content to be published
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
postRouter.post('/', upload.array('image', 10), controller.createPost);
