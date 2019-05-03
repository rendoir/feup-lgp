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
 *
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
