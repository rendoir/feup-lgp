import { query } from '../db/db';
import {editFiles, saveTags} from './post';

export function createTalk(req, res) {
  if (!req.body.title.trim()) {
    console.log('\n\nError: talk title cannot be empty');
    res.status(400).send({
      message: 'An error occurred while crating a new talk. ' +
        'The field title cannot be empty',
    });
    return;
  }
  if (!req.body.about.trim()) {
    console.log('\n\nError: talk body cannot be empty');
    res.status(400).send({
      message: 'An error occurred while crating a new talk. ' +
        'The field about cannot be empty',
    });
  }
  if (!req.body.local.trim()) {
    console.log('\n\nError: talk local cannot be empty');
    res.status(400).send({
      message: 'An error occurred while crating a new talk. ' +
        'The field local cannot be empty',
    });
  }
  if (!req.body.dateStart.trim()) {
    console.log('\n\nError: talk starting date cannot be empty');
    res.status(400).send({
      message: 'An error occurred while crating a new talk. ' +
        'The field date start cannot be empty',
    });
  }
  if (req.body.dateEnd.trim()) {
    if (Date.parse(req.body.dateEnd) < Date.parse(req.body.dateStart)) {
      console.log(
        '\n\nError: talk ending date cannot be previous to starting date',
      );
      res.status(400).send({
        message: 'An error occurred while crating a new talk. ' +
          'The field date end cannot be a date previous to date start',
      });
    }
  }

  query({
    text: 'INSERT INTO talks (author, title, about, livestream_url, local, datestart, dateend, avatar, privacy, conference) ' +
      'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
    values: [
      req.body.author,
      req.body.title,
      req.body.about,
      req.body.livestream,
      req.body.local,
      req.body.dateStart,
      req.body.dateEnd,
      req.body.avatar,
      req.body.privacy,
      req.body.conference,
    ],
  }).then((result) => {
    res.send({
      id: result.rows[0].id,
    });
  }).catch((error) => {
    console.log('\n\nERROR: ', error);
    res.status(400).send({
      message: 'An error occurred while crating a new talk. Error: ' + error.toString(),
    });
  });
}

export async function inviteUser(req, res) {
  if (!await loggedUserOwnstalk(req.params.id)) {
    console.log('\n\nERROR: You cannot invite users to a talk if you are not the owner');
    res.status(400).send({ message: 'An error ocurred while inviting user: You are not the talk owner.' });
    return;
  }

  query({
      text: `INSERT INTO invites (invited_user, invite_subject_id, invite_type) VALUES ($1, $2, 'talk')`,
      values: [req.body.invited_user, req.params.id],
  }).then((result) => {
      res.status(200).send();
  }).catch((error) => {
      console.log('\n\nERROR:', error);
      res.status(400).send({ message: 'An error ocurred while inviting user to talk' });
  });
}

export async function inviteSubscribers(req, res) {
  if (!await loggedUserOwnstalk(req.params.id)) {
    console.log('\n\nERROR: You cannot invite users to a talk if you are not the owner');
    res.status(400).send({ message: 'An error ocurred while inviting subscribers: You are not the talk owner.' });
    return;
  }

  query({
      text: `INSERT INTO invites (invited_user, invite_subject_id, invite_type)
                SELECT uninvited_subscriber, $1, 'talk'
                FROM retrieve_talk_uninvited_subscribers($1)
              ON CONFLICT ON CONSTRAINT unique_invite
              DO NOTHING`,
      values: [req.params.id],
  }).then((result) => {
      res.status(200).send();
  }).catch((error) => {
      console.log('\n\nERROR:', error);
      res.status(400).send({ message: 'An error ocurred while inviting subscribers to talk' });
  });
}

export async function amountSubscribersUninvited(req, res) {
  if (!await loggedUserOwnstalk(req.params.id)) {
    console.log('\n\nERROR: You cannot retrieve the amount of uninvited subscribers to your talk');
    res.status(400).send({ message: 'An error ocurred fetching amount of uninvited subscribers: You are not the talk owner.' });
    return;
  }

  try {
    const amountUninvitedSubscribersQuery = await query({
      text: `SELECT COUNT(*) FROM retrieve_talk_uninvited_subscribers($1)`,
      values: [req.params.id],
    });
    res.status(200).send({ amountUninvitedSubscribers: amountUninvitedSubscribersQuery.rows[0].count });
  } catch (error) {
    console.error(error);
    res.status(500).send(new Error('Error retrieving user participation in talk'));
  }
}

export async function getUninvitedUsersInfo(req, res) {
  if (!await loggedUserOwnstalk(req.params.id)) {
    console.log('\n\nERROR: You cannot retrieve the amount of uninvited subscribers to a talk that is not yours');
    res.status(400).send({ message: 'An error ocurred fetching amount of uninvited subscribers: You are not the talk owner.' });
    return;
  }

  const userId = 3;
  try {
    const uninvitedUsersQuery = await query({
      text: `SELECT id, first_name, last_name, home_town, university, work, work_field
              FROM users
              WHERE id NOT IN (SELECT * FROM retrieve_talk_invited_or_joined_users($1)) AND id <> $2`,
      values: [req.params.id, userId],
    });
    res.status(200).send({ uninvitedUsers: uninvitedUsersQuery.rows });
  } catch (error) {
    console.error(error);
    res.status(500).send(new Error('Error retrieving user participation in talk'));
  }
}

export function addParticipantUser(req, res) {
  const userId = 1; // logged user
  query({
      text: `INSERT INTO talk_participants (participant_user, talk) VALUES ($1, $2)`,
      values: [userId, req.params.id],
  }).then((result) => {
      res.status(200).send();
  }).catch((error) => {
      console.log('\n\nERROR:', error);
      res.status(400).send({ message: 'An error ocurred while adding participant to talk' });
  });
}

export function removeParticipantUser(req, res) {
  const userId = 1; // logged user
  query({
      text: `DELETE FROM talk_participants WHERE participant_user = $1 AND talk = $2`,
      values: [userId, req.params.id],
  }).then((result) => {
      res.status(200).send();
  }).catch((error) => {
      console.log('\n\nERROR:', error);
      res.status(400).send({ message: 'An error ocurred while removing participant from talk' });
  });
}

export async function checkUserParticipation(req, res) {
  const userId = 1; // logged user
  try {
      const userParticipantQuery = await query({
          text: `SELECT *
                  FROM talk_participants
                  WHERE participant_user = $1 AND talk = $2`,
          values: [userId, req.params.id],
      });
      res.status(200).send({ participant: Boolean(userParticipantQuery.rows[0]) });
  } catch (error) {
      console.error(error);
      res.status(500).send(new Error('Error retrieving user participation in talk'));
  }
}

export async function checkUserCanJoin(req, res) {
  const userId = 1; // logged user
  try {
      const userCanJoinQuery = await query({
          text: `SELECT * FROM user_can_join_talk($1, $2)`,
          values: [req.params.id, userId],
      });
      const canJoin = userCanJoinQuery.rows[0].user_can_join_talk;
      res.status(200).send({ canJoin });
  } catch (error) {
      console.error(error);
      res.status(500).send(new Error('Error retrieving user participation in talk'));
  }
}

async function loggedUserOwnstalk(talkId): Promise<boolean> {
  const loggedUser = 3;
  try {
    const userOwnstalkQuery = await query({
        text: `SELECT * FROM talks WHERE id = $1 AND author = $2`,
        values: [talkId, loggedUser],
    });
    return Boolean(userOwnstalkQuery.rows[0]);
  } catch (error) {
      console.error(error);
      return false;
  }
}

export function setSecureCookiesExample(req, res) {
  console.log('SETTING COOKIES...');
  try {
      // DEPOIS DE HORAS A TENTAR POR ISTO A DAR, NAO CONSEGUI PORQUE Access-Control-Allow-Origin NAO PODE TER O VALOR '*'.
      // MAS ESSE VALOR É NECESSÁRIO PARA FAZER REQUESTS COM withCredentials A TRUE, E PARA QUE SE CONSIGA USAR COOKIES,
      // withCredentials tem de estar a true, UMA FORMA DE CONTORNAR ISTO É POR o endereço de onde o cliente esta a fazer os requests
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

      // res.cookie('user_id', 3);
      // the one accessed by the browser (not signed and httpOnly: false - means that both client and server can access it)

      // res.cookie('user_id', 1, {signed: true, httpOnly: true});
      // the one accessed by the server (signed and httpOnly: true - means only the server can access it)
      // the one the server will access cannot be forged by hackers using XSS
      /*res.cookie('openExample', 'openExampleValue');
      res.cookie('signedOpenExample', 'signedOpenExampleValue', {signed: true});
      res.cookie('serverExample', 'serverExampleValue', {httpOnly: true});
      res.cookie('signedServerExample', 'signedServerExampleValue', {signed: true, httpOnly: true});*/
      req.session.firstName = 'bomdia';
      console.log(req.session.id);
      res.status(200).send('Cookies set');
  } catch (error) {
      console.error(error);
      res.status(500).send(new Error('Error retrieving user participation in talk'));
  }
}

export async function gettalk(req, res) {
  const id = req.params.id;
  const user = 2;
  try {
    /**
     * talk must be owned by user
     * OR talk is public
     * OR talk is private to followers and user is a follower of the author
     */
    const talk = await query({
      text: `
              SELECT c.id, a.id as user_id, a.first_name, a.last_name, c.title,
              c.about, c.livestream_url, c.local, c.dateStart, c.dateEnd, c.avatar, c.privacy
              FROM talks c
              INNER JOIN users a ON c.author = a.id
              WHERE c.id = $1
                AND (c.author = $2
                    OR c.privacy = 'public'
                    OR (c.privacy = 'followers'
                        AND c.author IN (SELECT followed FROM follows WHERE follower = $2)
                    )
                )
            `,
      values: [id, user],
    });
    if (talk === null) {
      res.status(400).send(
        new Error('talk either does not exists or you do not have the required permissions'),
      );
      return;
    }
    const postsResult = await query({
      text: `SELECT p.id, first_name, last_name, p.title, p.content,
                        p.visibility, p.date_created, p.date_updated, users.id AS user_id
                    FROM posts p
                        INNER JOIN users ON (users.id = p.author)
					WHERE p.talk = $1
                    ORDER BY p.date_created DESC
                    LIMIT 10`,
      values: [id],
    });
    if (postsResult == null) {
      res.status(400).send(new Error(`Post either does not exist or you do not have the required permissions.`));
      return;
    }
    const commentsToSend = [];
    const tagsToSend = [];
    const filesToSend = [];
    for (const post of postsResult.rows) {
      const comment = await query({
        text: `SELECT c.id, c.post, c.comment, c.date_updated, c.date_created, a.first_name, a.last_name
                        FROM posts p
                        LEFT JOIN comments c
                        ON p.id = c.post
                        INNER JOIN users a
                        ON c.author = a.id
                        WHERE
                            p.id = $1
                        ORDER BY c.date_updated ASC`,
        values: [post.id],
      });
      const tagsPost = await query({
        text: `SELECT t.name
                        FROM tags t
                        INNER JOIN posts_tags pt
                        ON pt.tag = t.id
                        WHERE pt.post = $1`,
        values: [post.id],
      });
      const files = await query({
        text: `SELECT f.name, f.mimetype, f.size
                        FROM posts p
                        INNER JOIN files f
                        ON p.id = f.post
                        WHERE
                            p.id = $1`,
        values: [post.id],
      });
      commentsToSend.push(comment.rows);
      tagsToSend.push(tagsPost.rows);
      filesToSend.push(files.rows);
    }
    const result = {
      talk: talk.rows[0],
      posts: postsResult.rows,
      comments: commentsToSend,
      tags: tagsToSend,
      files: filesToSend,
    };
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send(new Error('Error retrieving talk'));
  }
}

export function changePrivacy(req, res) {
  query({
    text: `UPDATE talks
                SET privacy = $2
                WHERE id = $1`,
    values: [req.body.id, req.body.privacy],
  }).then((result) => {
    res.status(200).send();
  }).catch((error) => {
    console.log('\n\nERROR:', error);
    res.status(400).send({ message: 'An error ocurred while changing the privacy of a talk' });
  });
}
