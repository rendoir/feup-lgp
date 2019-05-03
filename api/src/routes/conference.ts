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
 * @api {get} /api/conference/:id/invite_subscribers Invite subscribers of the inviter user to conference
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
conferenceRouter.get('/:id/invite_subscribers', controller.inviteSubscribers);

/**
 * @api {get} /api/conference/:id/attendance_intent Set a user intention to attend a conference
 * @apiName Set-Conference-Attendance-Intention
 * @apiGroup Conference
 *
 * @apiParam {number}   id    Id of the conference the user intends to attend
 * The user who intends to attend the conference is the logged in user, which means we can access his id through cookies.
 * This way, we don't need to pass it as a request parameter.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
conferenceRouter.get('/:id/attendance_intent', controller.addUserAttendanceIntent);

/**
 * @api {get} /api/conference/:id/remove_attendance_intent Remove a user intention to attend a conference
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
conferenceRouter.get('/:id/remove_attendance_intent', controller.removeUserAttendanceIntent);

/**
 * @api {post} /api/conference/:id/invite_notified Mark a conference invite notification as seen by the invited user
 * @apiName Set-Conference-Invitation-As-Seen
 * @apiGroup Conference
 *
 * @apiParam {number}   id    Id of the conference referred on the invite
 * @apiParam {number}   invited_user    Id of the user who has been already notified about the invitation
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'An error message here'
 *     }
 */
conferenceRouter.post('/:id/invite_notified', controller.inviteNotified);
