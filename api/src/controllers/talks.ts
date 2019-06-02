import { query } from '../db/db';

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

  let livestreamURL = req.body.livestream;
  if (livestreamURL.includes('youtube.com')) {
    livestreamURL = 'https://www.youtube.com/embed/' + req.body.livestream.substr(req.body.livestream.length - 11);
  }
  const userId = req.user.id;

  query({
    text: 'INSERT INTO talks (author, title, about, livestream_url, local, datestart, dateend, avatar, privacy, conference, hidden) ' +
      'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id',
    values: [
      userId,
      req.body.title,
      req.body.about,
      livestreamURL,
      req.body.local,
      req.body.dateStart,
      req.body.dateEnd,
      req.body.avatar,
      req.body.privacy,
      req.body.conference,
      true,
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

export async function getTalk(req, res) {
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
              SELECT t.id, a.id as user_id, (a.first_name || ' ' || a.last_name) as user_name, t.title, t.conference as conference_id,
              t.about, t.livestream_url, t.local, t.dateStart, t.dateEnd, t.avatar, t.privacy, t.archived, t.hidden,
              c.title as conference_title
              FROM talks t
              INNER JOIN users a ON t.author = a.id
              INNER JOIN conferences c ON t.conference = c.id
              WHERE t.id = $1
                AND (t.author = $2
                    OR (t.archived = FALSE
                        AND t.hidden = FALSE
                        AND (t.privacy = 'public'
                              OR (t.privacy = 'followers'
                                    AND t.author IN (SELECT followed FROM follows WHERE follower = $2)
                              )
                        )
                    )
                )
            `,
      values: [id, userId],
    });
    if (talk.rows.length === 0) {
      res.status(400).send({
        message: 'talk either does not exists or you do not have the required permissions',
      });
      return;
    }
    const isParticipating = await query({
      text: `
              SELECT id
              FROM talk_participants
              WHERE talk = $1
                AND participant_user = $2
      `,
      values: [id, userId],
    });

    const challenges = await query ({
      text: `SELECT *
              FROM challenges
              WHERE talk = $1
              AND current_timestamp BETWEEN dateStart AND dateEnd
              ORDER BY dateStart DESC`,
      values: [id],
    });
    for (const challenge of challenges.rows) {
      const isAnswered = await query({
        text: `SELECT uc.answer, uc.complete
              FROM user_challenge uc
              INNER JOIN challenges c ON c.id = uc.challenge
              INNER JOIN talks t ON t.id = c.talk
              WHERE (
                t.id = $1
                AND uc.challenged = $2
                AND uc.challenge = $3
              )
              `,
        values: [id, userId, challenge.id],
      });
      if (isAnswered.rows.length > 0) {
        challenge.isComplete = true;
        challenge.userAnswer = isAnswered.rows[0].answer;
        challenge.isCorrect = isAnswered.rows[0].complete;
      } else {
        challenge.isComplete = false;
        challenge.userAnswer = null;
        challenge.isCorrect = null;
      }
      if (challenge.challengetype === 'question_options') {
        const answers = challenge.answers;
        challenge.options = [];
        answers.forEach((answer) => {
          const aux = answer.split(': ');
          if (aux[0] === 'CorrectAnswer') {
            challenge.correctAnswer = aux[1];
          } else {
            challenge.options.push(aux[1]);
          }
          delete challenge.answers;
        });
      }
    }
    const posts = await query({
      text: `SELECT p.id, (first_name || ' ' || last_name) as author, p.title, p.content,
                        p.visibility, p.date_created as date, p.date_updated, users.id AS user_id
                    FROM posts p
                        INNER JOIN users ON (users.id = p.author)
					WHERE p.talk = $1
                    ORDER BY date DESC
                    LIMIT $2
                    OFFSET $3`,
      values: [id, limit, offset],
    });
    const totalSize = await query({
      text: `SELECT COUNT(id)
              FROM posts
              WHERE talk = $1`,
      values: [id],
    });
    for (const post of posts.rows) {
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
      const postTags = await query({
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
      post.tags = postTags.rows;
      post.files = files.rows;
    }
    const tags = await query({
      text: `SELECT id, name
             FROM tags`,
      values: [],
    });
    let userPoints = await query({
      text: `SELECT points
             FROM talk_participants
             WHERE talk = $1
             AND participant_user = $2`,
      values: [id, userId],
    });
    userPoints = userPoints.rows.length > 0
      ? userPoints.rows[0].points
      : 0;
    const result = {
      challenges: challenges.rows,
      talk: talk.rows[0],
      posts: posts.rows,
      size: totalSize.rows[0].count,
      isParticipating: isParticipating.rows.length > 0,
      tags: tags.rows,
      userPoints,
    };
    res.send(result);
  } catch (error) {
    res.status(500).send({
      message: 'Error retrieving talk. Error: ' + error,
    });
  }
}

export function editTalk(req, res) {
  const data = req.body;
  const talk = req.params.id;

  if (!data.title.trim()) {
    console.log('\n\nError: talk title cannot be empty');
    res.status(400).send({
      message: `An error occurred while updating talk #${talk}: ` +
        'The field title cannot be empty',
    });
    return;
  }
  if (!data.description.trim()) {
    console.log('\n\nError: talk about cannot be empty');
    res.status(400).send({
      message: `An error occurred while updating talk #${talk}: ` +
        'The field about cannot be empty',
    });
    return;
  }
  if (!data.local.trim()) {
    console.log('\n\nError: talk local cannot be empty');
    res.status(400).send({
      message: `An error occurred while updating talk #${talk}: ` +
        'The field local cannot be empty',
    });
    return;
  }
  if (!data.dateStart.trim()) {
    console.log('\n\nError: talk starting date cannot be empty');
    res.status(400).send({
      message: `An error occurred while updating talk #${talk}: ` +
        'The field starting date cannot be empty',
    });
    return;
  }
  if (!data.dateEnd.trim()) {
    console.log('\n\nError: talk ending date cannot be empty');
    res.status(400).send({
      message: `An error occurred while updating talk #${talk}: ` +
        'The field ending date cannot be empty',
    });
    return;
  }

  query({
    text: `UPDATE talks
           SET (title, about, local, datestart, dateend, livestream_url) =
               ($2, $3, $4, $5, $6, $7)
           WHERE id = $1`,
    values: [
      talk,
      data.title,
      data.description,
      data.local,
      data.dateStart,
      data.dateEnd,
      data.livestreamURL,
    ],
  })
    .then(() => {
      res.status(200).send();
    })
    .catch((error) => {
      res.status(400).send({
        message: `An error occurred while updating a talk. Error: ${error.toString()}`,
      });
    });
}

export async function inviteUser(req, res) {
  const talk = req.params.id;
  const user = req.user.id;
  const selected = req.body.selected;

  let values = '';

  selected.forEach((sl) => {
    values += `(${sl}, $1, 'talk'), `;
  });
  values = values.substr(0, values.length - 2);
  if (await !loggedUserOwnsTalk(talk, user)) {
    res.status(400).send({
      message: 'An error occurred while trying to invite users to a talk: You are not the talk owner.',
    });
    return;
  }
  try {
    query({
      text: `INSERT INTO invites (invited_user, invite_subject_id, invite_type) VALUES ${values}`,
      values: [talk],
    }).then(() => {
      res.status(200).send();
    }).catch((error) => {
      res.status(400).send({ message: `An error occurred while inviting user to talk. Error ${error}` });
    });
  } catch (e) {

  }
}

export async function inviteSubscribers(req, res) {
  const talk = req.params.id;
  const user = req.user.id;
  if (!await loggedUserOwnsTalk(talk, user)) {
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
  }).then(() => {
    res.status(200).send();
  }).catch((error) => {
      console.log('\n\nERROR:', error);
      res.status(400).send({ message: 'An error ocurred while inviting subscribers to talk' });
  });
}

export async function amountSubscribersUninvited(req, res) {
  const talk = req.params.id;
  const user = req.user.id;
  if (!await loggedUserOwnsTalk(talk, user)) {
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

export async function getUninvitedUsers(req, res) {
  const talk = req.params.id;
  const user = req.user.id;
  try {
    if (await !loggedUserOwnsTalk(talk, user)) {
      res.status(400).send({
        message: 'An error occurred fetching amount of uninvited subscribers: You are not the talk owner.',
      });
      return;
    }

    const uninvitedUsers = await query({
      text: `SELECT id, (first_name || ' ' || last_name) as user_name
             FROM users
             WHERE id NOT IN (SELECT * FROM retrieve_talk_invited_or_joined_users($1))
             AND id <> $2
             AND (
                  id IN (SELECT follower FROM follows WHERE followed = $2) OR
                  id IN (SELECT followed FROM follows WHERE follower = $2)
                )`,
      values: [talk, user],
    });
    res.status(200).send({ uninvitedUsers: uninvitedUsers.rows });
  } catch (error) {
    res.status(500).send({
      message: 'Error retrieving user participation in talk',
    });
  }
}

export async function joinTalk(req, res) {
  const user = req.user.id;
  const talk = req.params.id;
  query({
    text: 'INSERT INTO talk_participants (talk, participant_user) VALUES ($1, $2)',
    values: [talk, user],
  }).then(() => {
    res.status(200).send();
  }).catch(() => {
    res.status(400).send({
      message: 'An error occurred while adding participant to talk',
    });
  });
}

export async function leaveTalk(req, res) {
  const user = req.user.id;
  const talk = req.params.id;
  query({
    text: 'DELETE FROM talk_participants WHERE talk = $1 AND participant_user = $2',
    values: [talk, user],
  }).then(() => {
    res.status(200).send();
  }).catch(() => {
    res.status(400).send({
      message: 'An error occurred while removing participant from talk',
    });
  });
}

export async function checkUserParticipation(req, res) {
  const userId = req.user.id;
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
  const userId = req.user.id;
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

async function loggedUserOwnsTalk(talk, user): Promise<boolean> {
  try {
    const isOwner = await query({
      text: `SELECT COUNT(id) FROM talks WHERE id = $1 AND author = $2`,
      values: [talk, user],
    });

    return isOwner.rows[0].count !== 0;
  } catch (error) {
    console.error(error);
    return false;
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
  }).then(() => {
    res.status(200).send();
  }).catch((error) => {
    console.log('\n\nERROR:', error);
    res.status(400).send({ message: 'An error ocurred while changing the privacy of a talk' });
  });
}

// Can only archive if user is author.
export async function archiveTalk(req, res) {
  const id = req.params.id;
  const user = req.user.id;
  const value = req.body.value;
  await query({
    text: `UPDATE talks
              SET archived = $3
              WHERE id = $1 AND author = $2`,
    values: [id, user, value],
  }).then(() => {
    res.status(200).send();
  }).catch((error) => {
    res.status(500).send({
      message: `Error ${value ? 'archiving' : 'restoring'} talk. Error: ${error}`,
    });
  });
}

export async function hideTalk(req, res) {
  const id = req.params.id;
  const user = req.user.id;
  const value = req.body.value;
  await query({
    text: `UPDATE talks
              SET hidden = $3
              WHERE id = $1 AND author = $2`,
    values: [id, user, value],
  }).then(() => {
    res.status(200).send();
  }).catch((error) => {
    res.status(500).send({
      message: `Error ${value ? 'hiding' : 'opening'} talk. Error: ${error}`,
    });
  });
}

export function getPointsUserTalk(req, res) {
  query({
    text: `SELECT points FROM talk_participants WHERE talk = $1 AND participant_user = $2`,
    values: [req.params.id, req.params.user_id],
  }).then((result) => {
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
    values: [req.params.id, req.params.user_id],
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
