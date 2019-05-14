'use strict';
import { Router } from 'express';
import * as controller from '../controllers/comment';

export const commentRouter = Router();

/**
 * @api {post} /api/post/:id/comment Create a new comment on the post
 * @apiName Post-A-Comment
 * @apiGroup Post
 *
 * @apiParam {String}   post_id   Associated post's ID
 * @apiParam {String}   comment   Text to write in the comment
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
commentRouter.post('/', controller.createComment);

/**
 * @api {post} /api/post/comment/:id/ Create a new 2nd level comment on the post
 * @apiName Post-A-Comment
 * @apiGroup Post
 *
 * @apiParam {String}   post_id   Associated post's ID
 * @apiParam {String}   comment Text to write in the comment
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
commentRouter.post('/:id', controller.createNewCommentForComment);

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
commentRouter.get('/:id', controller.getCommentsOfComment);

/**
 * @api {post} /api/post/:id/new_comment Create a new comment on the post
 * @apiName Post-A-Comment
 * @apiGroup Post
 *
 * @apiParam {String}   post_id   Number of the post
 * @apiParam {String}   comment Text to write in the comment
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
commentRouter.post('/:id/like', controller.addALikeToComment);

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
commentRouter.delete('/:id/like', controller.deleteALikeToComment);

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
commentRouter.get('/:id/likes', controller.getWhoLikedComment);

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
commentRouter.delete('/:id', controller.deleteComment);

/**
 * @api {put} /api/post/:id/edit_comment Edit a comment
 * @apiName Edit-A-Comment
 * @apiGroup Put
 *
 * @apiParam {String}   post.id   Number of the post this comment is related to
 * @apiParam {String}   comment.id   Number of the comment
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error occurred while deleting a comment'
 *     }
 */
commentRouter.put('/:id', controller.editComment);

/**
 * @api {post} /api/post/:post_id/comment/:id/report Report a comment
 * @apiName Report-Comment
 * @apiGroup Comment
 *
 * @apiParam {number}   id   Id of the comment being reported
 * @apiParam {number}   post_id   Id of post owning the comment being reported
 * (post_id parameter is useless, it's only required due to the comment api route URL)
 * @apiParam {string}   reason   Reason of the report
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
commentRouter.post('/:id/report', controller.reportComment);

/**
 * @api {post} /api/post/:post_id/comment/:id/check_report Check if a comment as been reported by a given user
 * @apiName Check-Comment-Report
 * @apiGroup Comment
 *
 * @apiParam {number}   id   Id of the comment whose report we want to verify
 * @apiParam {number}   post_id   Id of post owning the comment whose report we want to verify
 * (post_id parameter is useless, it's only required due to the comment api route URL)
 * @apiParam {number}   reporter   Id of the user we want to verify if reported the comment
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
commentRouter.get('/:id/report', controller.checkCommentUserReport);
