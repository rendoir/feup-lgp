'use strict';
import { Router } from 'express';
import * as controller from '../controllers/talks';

export const talkRouter = Router();

/**
 * @api {post} /api/talk Create a talk
 * @apiName Create-A-talk
 * @apiGroup Post
 *
 * @apiParam {String}   title       title of the talk
 * @apiParam {String}   about       talk description
 * @apiParam {String}   local       local where the talk will take place
 * @apiParam {string}   dateStart   date when the talk starts
 * @apiParam {string}   dateEnd   date when the talk ends
 * @apiParam {Object}   avatar      talk image
 * @apiParam {String}   privacy     Visibility of the post: public/followers/private
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
talkRouter.post('/', controller.createTalk);

/**
 * @api {post} /api/talk/:id/invite Invite user to talk
 * @apiName Invite-To-talk
 * @apiGroup talk
 *
 * @apiParam {number}   id    Id of the talk the user will be invited to
 * @apiParam {number}   invited_user    Id of the user being invited
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
talkRouter.post('/:id/invite', controller.inviteUser);

/**
 * @api {post} /api/talk/:id/invite_subscribers Invite subscribers of the inviter user to talk
 * @apiName Invite-Subscribers-To-talk
 * @apiGroup talk
 *
 * @apiParam {number}   id    Id of the talk the subscribers will be invited to
 * The user whose subscribers will be invited to the talk is the logged in user, which means we can access his id through cookies.
 * This way, we don't need to pass it as a request parameter.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
talkRouter.post('/:id/invite_subscribers', controller.inviteSubscribers);

/**
 * @api {get} /api/talk/:id/amount_uninvited_subscribers Retrieve talk author's amount of uninvited subscribers
 * @apiName Get-Amount-Uninvited-Subscribers
 * @apiGroup talk
 *
 * @apiParam {number}   id    Id of the talk
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
talkRouter.get('/:id/amount_uninvited_subscribers', controller.amountSubscribersUninvited);

/**
 * @api {get} /api/talk/:id/uninvited_users_info Retrieve the users that haven't been invited and haven't joined a given talk
 * @apiName Get-Uninvited-Users-Info
 * @apiGroup talk
 *
 * @apiParam {number}   id    Id of the talk
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
talkRouter.get('/:id/uninvited_users_info', controller.getUninvitedUsersInfo);

/**
 * @api {post} /api/talk/:id/add_participant Add user to talk participants
 * @apiName Add-talk-Participant
 * @apiGroup talk
 *
 * @apiParam {number}   id    Id of the talk the user wants to participate in
 * The user who intends to participate in the talk is the logged in user, which means we can access his id through cookies.
 * This way, we don't need to pass it as a request parameter.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
talkRouter.post('/:id/add_participant', controller.addParticipantUser);

/**
 * @api {delete} /api/talk/:id/remove_participant Remove a user participation in a talk
 * @apiName Remove-talk-Attendance-Intention
 * @apiGroup talk
 *
 * @apiParam {number}   id    Id of the talk the user does not intend to attend anymore
 * The user who wants to remove his intent to attend the talk is the logged in user, which means we can access his id through cookies.
 * This way, we don't need to pass it as a request parameter.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
talkRouter.delete('/:id/remove_participant', controller.removeParticipantUser);

/**
 * @api {get} /api/talk/:id/check_participant Check if a user is participating in a talk
 * @apiName Check-talk-Participation
 * @apiGroup talk
 *
 * @apiParam {number}   id    Id of the talk in which we are verifying the user participation
 * The user whose participation we in talk is being verified is the logged in user, which means we can access his id through cookies.
 * This way, we don't need to pass it as a request parameter.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
talkRouter.get('/:id/check_participation', controller.checkUserParticipation);

/**
 * @api {get} /api/talk/:id/check_user_access Check if a user is allowed to join a talk
 * @apiName Check-User-Access
 * @apiGroup talk
 *
 * @apiParam {number}   id    Id of the talk in which we are verifying if the user can join
 * The user whose access to the talk we want to verify is the logged in user, which means we can access his id through cookies.
 * This way, we don't need to pass it as a request parameter.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
talkRouter.get('/:id/check_user_access', controller.checkUserCanJoin);

/**
 * @api {get} /api/talk/:id Get a talk
 * @apiName Get-A-talk
 * @apiGroup Post
 *
 * @apiParam {String}   id       id of the talk
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
talkRouter.get('/:id', controller.gettalk);

/**
 * @api {post} /api/talk/:id/change_privacy Change the privacy of a talk
 * @apiName Change-Privacy-talk
 * @apiGroup Post
 *
 * @apiParam {String}   id          ID of the talk
 * @apiParam {String}   privacy     Visibility of the post: public/followers/private
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
talkRouter.post('/:id/change_privacy', controller.changePrivacy);

/**
 * @api {post} /api/conference/:id/archive Archive a conference
 * @apiName Archive-Conference
 * @apiGroup Post
 *
 * @apiParam {String}   id          ID of the conference
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
talkRouter.post('/:id/archive', controller.archiveTalk);

/**
 * @api {post} /api/conference/:id/unarchive Unarchive a conference
 * @apiName Unarchive-Conference
 * @apiGroup Post
 *
 * @apiParam {String}   id          ID of the conference
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
talkRouter.delete('/:id/archive', controller.unarchiveTalk);