import { query } from '../db/db';
import { editFiles, saveTags } from './post';

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
    return;
  }
  if (!req.body.local.trim()) {
    console.log('\n\nError: talk local cannot be empty');
    res.status(400).send({
      message: 'An error occurred while crating a new talk. ' +
        'The field local cannot be empty',
    });
    return;
  }
  if (!req.body.dateStart.trim()) {
    console.log('\n\nError: talk starting date cannot be empty');
    res.status(400).send({
      message: 'An error occurred while crating a new talk. ' +
        'The field date start cannot be empty',
    });
    return;
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
      return;
    }
  }

  const userId = req.user.id;

  query({
    text: 'INSERT INTO talks (author, title, about, livestream_url, local, datestart, dateend, avatar, privacy, conference) ' +
      'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id',
    values: [
      userId,
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

  const userId = req.user.id;
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
  const userId = req.user.id; // logged user
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
  const userId = req.user.id; // logged user
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
  const userId = req.user.id; // logged user
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
  const userId = req.user.id; // logged user
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

export async function gettalk(req, res) {
  const id = req.params.id;
  const limit = req.query.perPage;
  const offset = req.query.offset;
  const userId = req.user.id;
  try {
    /**
     * talk must be owned by user
     * OR talk is public
     * OR talk is private to followers and user is a follower of the author
     */
    const talk = await query({
      text: `
              SELECT c.id, a.id as user_id, a.first_name, a.last_name, c.title,
              c.about, c.livestream_url, c.local, c.dateStart, c.dateEnd, c.avatar, c.privacy, c.archived
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
      values: [id, userId],
    });
    if (talk === null) {
      res.status(400).send(
        new Error('talk either does not exists or you do not have the required permissions'),
      );
      return;
    }
    const challengesResult = await query ({
      text: `SELECT id, title, dateStart, dateEnd, prize, points_prize, challengeType, content
                    FROM challenges
					          WHERE talk = $1
                    ORDER BY dateStart DESC`,
      values: [id],
    });
    const postsResult = await query({
      text: `SELECT p.id, first_name, last_name, p.title, p.content,
                        p.visibility, p.date_created, p.date_updated, users.id AS user_id
                    FROM posts p
                        INNER JOIN users ON (users.id = p.author)
					WHERE p.talk = $1
                    ORDER BY p.date_created DESC
                    LIMIT $2
                    OFFSET $3`,
      values: [id, limit, offset],
    });
    if (postsResult == null) {
      res.status(400).send(new Error(`Post either does not exist or you do not have the required permissions.`));
      return;
    }
    const totalSize = await query({
      text: `SELECT COUNT(id)
              FROM posts
              WHERE talk = $1`,
      values: [id],
    });
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
      post.comments = comment.rows;
      post.tags = tagsPost.rows;
      post.files = files.rows;
    }
    const result = {
      challenges: challengesResult.rows,
      talk: talk.rows[0],
      posts: postsResult.rows,
      size: totalSize.rows[0].count,
    };
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send(new Error('Error retrieving talk'));
  }
}

// Can only change privacy if user is author.
export function changePrivacy(req, res) {
  const userId = req.user.id;
  query({
    text: `UPDATE talks
                SET privacy = $2
                WHERE id = $1 AND author = $3`,
    values: [req.body.id, req.body.privacy, userId],
  }).then((result) => {
    res.status(200).send();
  }).catch((error) => {
    console.log('\n\nERROR:', error);
    res.status(400).send({ message: 'An error ocurred while changing the privacy of a talk' });
  });
}

// Can only archive if user is author.
export async function archiveTalk(req, res) {
  const id = req.params.id;
  const userId = req.user.id;
  try {
    console.log('id asdasd ' + id);
    const archivedConference = await query({
      text: `UPDATE talks
              SET archived = TRUE
              WHERE id = $1 AND author = $2`,
      values: [id, userId],
    });
    if (archivedConference === null) {
      res.status(400).send(
        new Error('Error in the archieve process of talk'),
      );
      return;
    }
    res.send();
  } catch (error) {
    console.log(error);
    res.status(500).send(new Error('Error archieve talk'));
  }
}

// Can only unarchive if user is author.
export async function unarchiveTalk(req, res) {
  const id = req.params.id;
  const userId = req.user.id;
  try {
    const archivedConference = await query({
      text: `UPDATE talks
            SET archived = FALSE
            WHERE id = $1 AND author = $2`,
      values: [id, userId],
    });
    if (archivedConference === null) {
      res.status(400).send(
        new Error('Error in the archieve process of talk'),
      );
      return;
    }
    res.send();
  } catch (error) {
    console.log(error);
    res.status(500).send(new Error('Error archieve talk'));
  }
}

export function getPointsUserTalk(req, res) {
  query({
    text: `SELECT points FROM talk_participants WHERE talk = $1 AND participant_user = $2`,
    values: [req.params.id, req.params.user_id],
  }).then((result) => {
    console.log(result.rows);
    const results = {points: 0};
    if (result.rows !== []) {
      results.points = result.rows[0].points;
    }
    res.send(results);
  }).catch((error) => {
    console.log('\n\nERROR:', error);
    res.status(400).send({ message: 'An error ocurred while subscribing post' });
  });
}

export function getPostsAuthor(req, res) {
  query({
    text: `SELECT p.id, first_name, last_name, p.title, p.content,
      p.visibility, p.date_created, p.date_updated, users.id AS user_id
      FROM posts p
      INNER JOIN users ON (users.id = p.author)
      WHERE p.talk = $1
      AND p.author = $2
      ORDER BY p.date_created DESC
      LIMIT 10`,
    values: [req.params.id, req.query.author],
  }).then((result) => {
    res.send(result.rows);
  }).catch((error) => {
    console.log('\n\nERROR:', error);
    res.status(400).send({ message: 'An error ocurred while subscribing post' });
  });
}

export async function getCommentsOfPostAndAuthor(req, res) {
  query({
    text: `SELECT c.id, c.post, c.comment, c.date_updated, c.date_created, a.first_name, a.last_name
              FROM posts p
                  LEFT JOIN comments c ON p.id = c.post
                  INNER JOIN users a ON c.author = a.id
              WHERE
                  p.id = $1
                  AND (p.author = $2
                      OR p.visibility = 'public'
                      OR (p.visibility = 'followers'
                          AND p.author IN (SELECT followed FROM follows WHERE follower = $2)
                          )
                      )
              ORDER BY c.date_updated ASC`,
    values: [req.params.post_id, req.query.author],
  }).then((result) => {
    res.send(result.rows);
  }).catch((error) => {
    console.log('\n\nERROR:', error);
    res.status(400).send({ message: 'An error ocurred while subscribing post' });
  });
}