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
 * @api {post} /api/conference/:id/invite Invite user to conference
 * @apiName Invite-To-Conference
 * @apiGroup Conference
 *
 * @apiParam {number}   id    Id of the conference the user will be invited to
 * @apiParam {number}   invited_user    Id of the user being invited
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
conferenceRouter.post('/:id/invite', controller.inviteUser);

/**
 * @api {post} /api/conference/:id/invite_subscribers Invite subscribers of the inviter user to conference
 * @apiName Invite-Subscribers-To-Conference
 * @apiGroup Conference
 *
 * @apiParam {number}   id    Id of the conference the subscribers will be invited to
 * The user whose subscribers will be invited to the conference is the logged in user, which means we can access his id through cookies.
 * This way, we don't need to pass it as a request parameter.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
conferenceRouter.post('/:id/invite_subscribers', controller.inviteSubscribers);

/**
 * @api {get} /api/conference/:id/amount_uninvited_subscribers
 * Retrieve the amount of subscribers of the conference's author, which are not invited to the conference
 * If a subscriber as already joined the conference, he will be accounted as invited
 * @apiName Get-Amount-Uninvited-Subscribers
 * @apiGroup Conference
 *
 * @apiParam {number}   id    Id of the conference
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
conferenceRouter.get('/:id/amount_uninvited_subscribers', controller.amountSubscribersUninvited);

/**
 * @api {get} /api/conference/:id/uninvited_users_info Retrieve the users that haven't been invited and haven't joined a given conference
 * @apiName Get-Uninvited-Users-Info
 * @apiGroup Conference
 *
 * @apiParam {number}   id    Id of the conference
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
conferenceRouter.get('/:id/uninvited_users_info', controller.getUninvitedUsersInfo);

/**
 * @api {put} /api/conference/:id/invite_notified Mark a conference invite notification as seen by the invited user
 * @apiName Set-Conference-Invitation-As-Seen
 * @apiGroup Conference
 *
 * @apiParam {number}   id    Id of the conference referred on the invite
 * The user who saw the invite notification is the logged in user, which means we can access his id through cookies.
 * This way, we don't need to pass it as a request parameter.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
conferenceRouter.put('/:id/invite_notified', controller.inviteNotified);

/**
 * @api {post} /api/conference/:id/add_participant Add user to conference participants
 * @apiName Add-Conference-Participant
 * @apiGroup Conference
 *
 * @apiParam {number}   id    Id of the conference the user wants to participate in
 * The user who intends to participate in the conference is the logged in user, which means we can access his id through cookies.
 * This way, we don't need to pass it as a request parameter.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
conferenceRouter.post('/:id/add_participant', controller.addParticipantUser);

/**
 * @api {delete} /api/conference/:id/remove_attendance_intent Remove a user intention to attend a conference
 * @apiName Remove-Conference-Attendance-Intention
 * @apiGroup Conference
 *
 * @apiParam {number}   id    Id of the conference the user does not intend to attend anymore
 * The user who wants to remove his intent to attend the conference is the logged in user, which means we can access his id through cookies.
 * This way, we don't need to pass it as a request parameter.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
conferenceRouter.delete('/:id/remove_participant', controller.removeParticipantUser);

/**
 * @api {get} /api/conference/:id/check_participant Check if a user is participating in a conference
 * @apiName Check-Conference-Participation
 * @apiGroup Conference
 *
 * @apiParam {number}   id    Id of the conference in which we are verifying the user participation
 * The user whose participation we in conference is being verified is the logged in user, which means we can access his id through cookies.
 * This way, we don't need to pass it as a request parameter.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
conferenceRouter.get('/:id/check_participation', controller.checkUserParticipation);

/**
 * @api {get} /api/conference/:id/check_user_access Check if a user is allowed to join a conference
 * @apiName Check-User-Access
 * @apiGroup Conference
 *
 * @apiParam {number}   id    Id of the conference in which we are verifying if the user can join
 * The user whose access to the conference we want to verify is the logged in user, which means we can access his id through cookies.
 * This way, we don't need to pass it as a request parameter.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
conferenceRouter.get('/:id/check_user_access', controller.checkUserCanJoin);

/**
 * This is just an example on how to set cookies in a secure way, so that they dont get forged or accessed by XSS
 */
conferenceRouter.post('/set_cookies', controller.setSecureCookiesExample);
