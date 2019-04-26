'use strict';
import { Router } from 'express';
import * as multer from 'multer';
import * as comment_controller from '../controllers/comment';
import * as controller from '../controllers/post';

export const postRouter = Router();

const upload = multer({dest: 'uploads'});

/**
 * @api {post} /api/post Create a post
 * @apiName Publish-A-Post
 * @apiGroup Post
 *
 * @apiParam {Object[]} files       Images to add to the post
 * @apiParam {String}   name        Name of the page/account to post
 * @apiParam {String}   text        Text content to be published
 * @apiParam {String}   visibility  Visibility of the post: public/members/followers/private
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
 * @api {delete} /api/post/delete Delete a post
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
 * @api {get} /api/post/:id Get a post
 * @apiName Get-A-Post
 * @apiGroup Post
 *
 * @apiParam {String}   post.id   Number of the post to get info
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
postRouter.get('/:id', controller.getPost);

/**
 * @api {post} /api/post/:id/new_comment Create a new comment on the post
 * @apiName Post-A-Comment
 * @apiGroup Post
 *
 * @apiParam {String}   post.id   Number of the post
 * @apiParam {String}   author.id   Author of the comment
 * @apiParam {String}   comment Text to write in the comment
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
postRouter.put('/newcomment', comment_controller.createComment);

/**
 * @api {post} /api/post/:id/new_comment Create a new comment on the post
 * @apiName Post-A-Comment
 * @apiGroup Post
 *
 * @apiParam {String}   post.id   Number of the post
 * @apiParam {String}   author.id   Author of the comment
 * @apiParam {String}   comment Text to write in the comment
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
postRouter.get('/:id/comments', comment_controller.getCommentsOfPost);

/**
 * @api {post} /api/post/:id/delete_comment Delete a comment
 * @apiName Delete-A-Comment
 * @apiGroup Post
 *
 * @apiParam {String}   post.id   Number of the comment
 * @apiParam {String}   author.id   Author of the comment
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error ocurred while deleting a comment'
 *     }
 */
postRouter.delete('/deletecomment', comment_controller.deleteComment);

/**
 * @api {post} /api/post/user_interactions Get post-user one-click interactions such as rate or subscription
 * @apiName Get-Post-User-Interactions
 * @apiGroup Post
 *
 * @apiParam {String}   postId   Id of the post
 * @apiParam {String}   userId   Id of the user
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
postRouter.post('/user_interactions', controller.getPostUserInteractions);

/**
 * @api {post} /api/post/subscribe Set a post subscription for a given user
 * @apiName Subscribe-Post
 * @apiGroup Post
 *
 * @apiParam {String}   postId   Id of the post
 * @apiParam {String}   userId   Id of the user
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
postRouter.post('/subscribe', controller.subscribePost);

/**
 * @api {post} /api/post/unsubscribe Remove a post subscription for a given user
 * @apiName Unsubscribe-Post
 * @apiGroup Post
 *
 * @apiParam {String}   postId   Id of the post
 * @apiParam {String}   userId   Id of the user
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
postRouter.post('/unsubscribe', controller.unsubscribePost);
