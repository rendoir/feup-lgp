'use strict';
import { Router } from 'express';
import * as controller from '../controllers/post';

export const postRouter = Router();

/**
 * @api {post} /api/post Create a post
 * @apiName Publish-A-Post
 * @apiGroup Post
 *
 * @apiParam {Object[]} files       Images to add to the post
 * @apiParam {Object[]} tags        Tags to add to the post
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
postRouter.post('/', controller.createPost);

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
postRouter.put('/:id', controller.editPost);

/**
 * @api {delete} /api/post/:id Delete a post
 * @apiName Delete-A-Post
 * @apiGroup Post
 *
 * @apiParam {String}   id Id of the post.
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
postRouter.delete('/:id', controller.deletePost);

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
 * @api {post} /api/post/:id/user_interactions Get post-user one-click interactions such as rate or subscription
 * @apiName Get-Post-User-Interactions
 * @apiGroup Post
 *
 * @apiParam {number}   id   Id of the post
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
postRouter.post('/:id/user_interactions', controller.getPostUserInteractions);

/**
 * @api {post} /api/post/:id/subscription Set a post subscription for a given user
 * @apiName Subscribe-Post
 * @apiGroup Post
 *
 * @apiParam {number}   id   Id of the post
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
postRouter.post('/:id/subscription', controller.subscribePost);

/**
 * @api {delete} /api/post/:id/subscription Remove a post subscription for a given user
 * @apiName Unsubscribe-Post
 * @apiGroup Post
 *
 * @apiParam {number}   id   Id of the post
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
postRouter.delete('/:id/subscription', controller.unsubscribePost);

/**
 * @api {post} /api/post/:id/report Report a post
 * @apiName Report-Post
 * @apiGroup Post
 *
 * @apiParam {number}   id   Id of the post being reported
 * @apiParam {string}   reason   Reason of the report
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
postRouter.post('/:id/report', controller.reportPost);

/**
 * @api {post} /api/post/:id/check_report Check if a post as been reported by a given user
 * @apiName Check-Post-Report
 * @apiGroup Post
 *
 * @apiParam {number}   id   Id of the post whose report we want to verify
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
postRouter.get('/:id/report', controller.checkPostUserReport);

/**
 * @api {post} /api/post/:id/:filename Gets the contents of a file
 * @apiName Get-File
 * @apiGroup Post
 *
 * @apiParam {String}   id         ID of the post
 * @apiParam {String}   filename   Name of the file in the post
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
postRouter.get('/:id/:filename', controller.getFile);

/**
 * @api {post} /api/post/download/:id/:filename Downloads a file
 * @apiName Download-File
 * @apiGroup Post
 *
 * @apiParam {String}   id         ID of the post
 * @apiParam {String}   filename   Name of the file in the post
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
postRouter.get('/download/:id/:filename', controller.downloadFile);

/**
 * @api {post} /api/post/:id/rate Rate a post
 * @apiName Rate-Post
 * @apiGroup Post
 *
 * @apiParam {Number}   rate             Rate of the User
 * @apiParam {String}   post             Id of the post being rated
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
postRouter.post('/:id/rate', controller.rate);

/**
 * @api {post} /api/post/:id/update_rate Updates rate of a post
 * @apiName Update-Rate-Post
 * @apiGroup Post
 *
 * @apiParam {Number}   rate             Rate of the User
 * @apiParam {String}   post             Id of the post being rated
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
postRouter.put('/:id/rate', controller.updateRate);

/**
 * @api {post} /api/post/:id/invite Invite user to engage in post discussion
 * @apiName Invite-To-Post
 * @apiGroup Post
 *
 * @apiParam {number}   id    Id of the post the user will be invited to
 * @apiParam {number}   invited_user    Id of the user being invited
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
postRouter.post('/:id/invite', controller.inviteUser);

/**
 * @api {post} /api/post/:id/invite_subscribers Invite subscribers of the inviter user to engage in post discussion
 * @apiName Invite-Subscribers-To-Post
 * @apiGroup Post
 *
 * @apiParam {number}   id    Id of the post the subscribers will be invited to
 * The user whose subscribers will be invited to the post is the logged in user.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
postRouter.post('/:id/invite_subscribers', controller.inviteSubscribers);
