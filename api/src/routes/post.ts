'use strict';
import { Router } from 'express';
import * as controller from '../controllers/post';

export const postRouter = Router();


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
postRouter.post('/create', controller.createPost);

/**
 * @api {post} /api/post/edit Edit a post
 * @apiName Edit-A-Post
 * @apiGroup Post
 *
 * @apiParam {String}   id Id of the post.
 * @apiParam {String}   title Title of the post.
 * @apiParam {String}   text Body of the post.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error ocurred while editing post'
 *     }
 */
postRouter.post('/edit', controller.editPost);

/**
 * @api {post} /api/post/delete Delete a post
 * @apiName Delete-A-Post
 * @apiGroup Post
 *
 * @apiParam {String}   id Id of the post.
 * @apiParam {String}   title Title of the post.
 * @apiParam {String}   text Body of the post.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error ocurred while deleting post'
 *     }
 */
postRouter.delete('/delete', controller.deletePost);

/**
 * @api {post} /api/post Get a post
 * @apiName Get-A-Post
 * @apiGroup Post
 *
 * @apiParam {String}   post.id   Number of the post
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
postRouter.get('/:id', controller.getPost);

postRouter.get('/:id/:filename', controller.getFile);
