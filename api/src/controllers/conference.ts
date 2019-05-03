import * as fs from 'fs';
import * as request from 'request-promise';
import Cookies from 'universal-cookie';
import { query } from '../db/db';

export function createConference(req, res) {
  if (!req.body.title.trim()) {
    console.log('\n\nError: Conference title cannot be empty');
    res.status(400).send({
      message: 'An error occurred while crating a new conference. ' +
        'The field title cannot be empty',
    });
    return;
  }
  if (!req.body.about.trim()) {
    console.log('\n\nError: Conference body cannot be empty');
    res.status(400).send({
      message: 'An error occurred while crating a new conference. ' +
        'The field about cannot be empty',
    });
  }
  if (!req.body.local.trim()) {
    console.log('\n\nError: Conference local cannot be empty');
    res.status(400).send({
      message: 'An error occurred while crating a new conference. ' +
        'The field local cannot be empty',
    });
  }
  if (!req.body.dateStart.trim()) {
    console.log('\n\nError: Conference starting date cannot be empty');
    res.status(400).send({
      message: 'An error occurred while crating a new conference. ' +
        'The field date start cannot be empty',
    });
  }
  if (req.body.dateEnd.trim()) {
    if (Date.parse(req.body.dateEnd) < Date.parse(req.body.dateStart)) {
      console.log(
        '\n\nError: Conference ending date cannot be previous to starting date',
      );
      res.status(400).send({
        message: 'An error occurred while crating a new conference. ' +
          'The field date end cannot be a date previous to date start',
      });
    }
  }

  query({
    text: 'INSERT INTO conference (title, about, local, datestart, dateend, avatar, privacy) ' +
      'VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
    values: [
      req.body.title,
      req.body.about,
      req.body.local,
      req.body.dateStart,
      req.body.dateEnd,
      req.body.avatar,
      req.body.privacy,
    ],
  }).then((result) => {
    res.send({
      id: result.rows[0].id,
    });
  }).catch((error) => {
    console.log('\n\nERROR: ', error);
    res.status(400).send({
      message: 'An error occurred while crating a new conference. Error: ' + error.toString(),
    });
  });
}

export function inviteUser(req, res) {
  query({
      text: `INSERT INTO invites (invited_user, invite_subject_id, invite_type) VALUES ($1, $2, 'conference')`,
      values: [req.body.invited_user, req.params.id],
  }).then((result) => {
      res.status(200).send();
  }).catch((error) => {
      console.log('\n\nERROR:', error);
      res.status(400).send({ message: 'An error ocurred while subscribing post' });
  });
}

export function inviteSubscribers(req, res) {
  const cookies = new Cookies(req.headers.cookie);
  query({
      text: `INSERT INTO invites (invited_user, invite_subject_id, invite_type)
              SELECT follower, $1, 'conference' FROM follows WHERE followed = $2
              ON CONFLICT ON CONSTRAINT unique_invite
              DO NOTHING`,
      values: [req.params.id, cookies.get('user_id')],
  }).then((result) => {
      res.status(200).send();
  }).catch((error) => {
      console.log('\n\nERROR:', error);
      res.status(400).send({ message: 'An error ocurred while subscribing post' });
  });
}

export function addUserAttendanceIntent(req, res) {
  console.log('ADD ATTENDANCE INTENT');
  const cookies = new Cookies(req.headers.cookie);
  console.log('USER: ', cookies.get('user_id'));
  console.log('CONFERENCE: ', req.params.id);
  query({
      text: `INSERT INTO conference_attendance_intents (attending_user, conference) VALUES ($1, $2)`,
      values: [cookies.get('user_id'), req.params.id],
  }).then((result) => {
      res.status(200).send();
  }).catch((error) => {
      console.log('\n\nERROR:', error);
      res.status(400).send({ message: 'An error ocurred while subscribing post' });
  });
}

export function removeUserAttendanceIntent(req, res) {
  console.log('REMOVE ATTENDANCE INTENT');
  const cookies = new Cookies(req.headers.cookie);
  console.log('USER: ', cookies.get('user_id'));
  console.log('CONFERENCE: ', req.params.id);
  query({
      text: `DELETE FROM conference_attendance_intents WHERE attending_user = $1 AND conference = $2`,
      values: [cookies.get('user_id'), req.params.id],
  }).then((result) => {
      res.status(200).send();
  }).catch((error) => {
      console.log('\n\nERROR:', error);
      res.status(400).send({ message: 'An error ocurred while subscribing post' });
  });
}

export function inviteNotified(req, res) {
  query({
      text: `UPDATE invites SET user_notified = TRUE
              WHERE invited_user = $1
                  AND invite_subject_id = $2
                  AND invite_type = 'conference'`,
      values: [req.params.id, req.body.invited_user],
  }).then((result) => {
      res.status(200).send();
  }).catch((error) => {
      console.log('\n\nERROR:', error);
      res.status(400).send({ message: 'An error ocurred while subscribing post' });
  });
}
