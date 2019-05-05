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
      res.status(400).send({ message: 'An error ocurred while inviting user to conference' });
  });
}

export function inviteSubscribers(req, res) {
  const cookies = new Cookies(req.headers.cookie);
  console.log('INVITE SUBSCRIBERS');
  console.log('USER: ', cookies.get('user_id'));
  console.log('CONFERENCE: ', req.params.id);
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
      res.status(400).send({ message: 'An error ocurred while inviting subscribers to conference' });
  });
}

export function inviteNotified(req, res) {
  console.log('INVITE NOTIFIED');
  const cookies = new Cookies(req.headers.cookie);
  console.log('USER: ', cookies.get('user_id'));
  console.log('CONFERENCE: ', req.params.id);
  query({
      text: `UPDATE invites SET user_notified = TRUE
              WHERE invited_user = $1
                  AND invite_subject_id = $2
                  AND invite_type = 'conference'`,
      values: [req.params.id, cookies.get('user_id')],
  }).then((result) => {
      res.status(200).send();
  }).catch((error) => {
      console.log('\n\nERROR:', error);
      res.status(400).send({ message: 'An error ocurred while notifying conference invite' });
  });
}

export function addParticipantUser(req, res) {
  console.log('ADD PARTICIPANT');
  const userId = 3;
  console.log('USER: ', userId);
  console.log('CONFERENCE: ', req.params.id);
  query({
      text: `INSERT INTO conference_participants (participant_user, conference) VALUES ($1, $2)`,
      values: [userId, req.params.id],
  }).then((result) => {
      res.status(200).send();
  }).catch((error) => {
      console.log('\n\nERROR:', error);
      res.status(400).send({ message: 'An error ocurred while adding participant to conference' });
  });
}

export function removeParticipantUser(req, res) {
  console.log("REMOVER PARTICIPANTE")
  const userId = 3;
  console.log('USER: ', userId);
  console.log('CONFERENCE: ', req.params.id);
  query({
      text: `DELETE FROM conference_participants WHERE participant_user = $1 AND conference = $2`,
      values: [userId, req.params.id],
  }).then((result) => {
      res.status(200).send();
  }).catch((error) => {
      console.log('\n\nERROR:', error);
      res.status(400).send({ message: 'An error ocurred while removing participant from conference' });
  });
}

export async function checkUserParticipation(req, res) {
  console.log('CHECK PARTICIPATION');
  const userId = 3;
  console.log('USER: ', userId);
  console.log('CONFERENCE: ', req.params.id);
  try {
      const userParticipantQuery = await query({
          text: `SELECT *
                  FROM conference_participants
                  WHERE participant_user = $1 AND conference = $2`,
          values: [userId, req.params.id],
      });
      console.log("É PARTICIPANTE ? ", Boolean(userParticipantQuery.rows[0]));
      res.status(200).send({ participant: Boolean(userParticipantQuery.rows[0]) });
  } catch (error) {
      console.error(error);
      res.status(500).send(new Error('Error retrieving user participation in conference'));
  }
}

export async function checkUserCanJoin(req, res) {
  console.log('CHECK USER CAN JOIN');
  const userId = 3;
  console.log('USER: ', userId);
  console.log('CONFERENCE: ', req.params.id);
  try {
      const userCanJoinQuery = await query({
          text: `SELECT * FROM user_can_join_conference($1, $2)`,
          values: [req.params.id, userId],
      });
      // TODO: criar trigger para cancelar entrada se nao tiver acesso a conferencia
      const canJoin = userCanJoinQuery.rows[0].user_can_join_conference;
      console.log("PODE ENTRAR ? ", userCanJoinQuery.rows[0]);
      res.status(200).send({ canJoin });
  } catch (error) {
      console.error(error);
      res.status(500).send(new Error('Error retrieving user participation in conference'));
  }
}

export function setSecureCookiesExample(req, res) {
  console.log("SETTING COOKIES...");
  try {
      // DEPOIS DE HORAS A TENTAR POR ISTO A DAR, NAO CONSEGUI PORQUE Access-Control-Allow-Origin NAO PODE TER O VALOR '*'.
      // MAS ESSE VALOR É NECESSÁRIO PARA FAZER REQUESTS COM withCredentials A TRUE, E PARA QUE SE CONSIGA USAR COOKIES,
      // withCredentials tem de estar a true, a nao ser que se coloque o endereço de onde o cliente esta a fazer os requests
      // mas eles vêm sempre do mesmo endereço, OU CADA UTILIZADOR TEM O SEU PROPRIO IP?????

      // Set signed cookie example: {signed: true, maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true}
      // "req.cookies" para aceder a cookies mais tarde noutros requests.
      // "req.signedCookies" para aceder a cookies que estao assinadas (protegidas)
      /*for (var key in req.cookies) {
        res.clearCookie(key, { path: '/' });
      }
      for (var key in req.signedCookies) {
        res.clearCookie(key, { path: '/' });
      }*/

      //res.cookie('user_id', 3); // the one accessed by the browser (not signed and httpOnly: false - means that both client and server can access it)
      //res.cookie('user_id', 1, {signed: true, httpOnly: true}); // the one accessed by the server (signed and httpOnly: true - means only the server can access it)
      //the one the server will access cannot be forged by hackers using XSS
      /*res.cookie('openExample', 'openExampleValue');
      res.cookie('signedOpenExample', 'signedOpenExampleValue', {signed: true});
      res.cookie('serverExample', 'serverExampleValue', {httpOnly: true});
      res.cookie('signedServerExample', 'signedServerExampleValue', {signed: true, httpOnly: true});*/
      req.session.firstName = 'bomdia';
      console.log(req.session.id);
      res.status(200).send('Cookies set');
  } catch (error) {
      console.error(error);
      res.status(500).send(new Error('Error retrieving user participation in conference'));
  }
}
