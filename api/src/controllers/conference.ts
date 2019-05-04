import { query } from '../db/db';
import {editFiles, saveTags} from './post';

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
    text: 'INSERT INTO conferences (author, title, about, local, datestart, dateend, avatar, privacy) ' +
      'VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
    values: [
      req.body.author,
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

export async function getConference(req, res) {
  const id = req.params.id;
  const user = 1; // logged in user
  try {
    /**
     * conference must be owned by user
     * OR conference is public
     * OR conference is private to followers and user is a follower of the author
     */
    const conference = await query({
      text: `
              SELECT c.id, a.id as user_id, a.first_name, a.last_name, c.title,
              c.about, c.local, c.dateStart, c.dateEnd, c.avatar, c.privacy
              FROM conferences c
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
    if (conference === null) {
      res.status(400).send(
        new Error('Conference either does not exists or you do not have the required permissions'),
      );
      return;
    }
    const postsResult = await query({
      text: `SELECT p.id, first_name, last_name, p.title, p.content, p.likes,
                        p.visibility, p.date_created, p.date_updated, users.id AS user_id
                    FROM posts p
                        INNER JOIN users ON (users.id = p.author)
					WHERE p.conference = $1
                    ORDER BY p.date_created DESC
                    LIMIT 10`,
      values: [id],
    });
    console.log("POsts: ", postsResult);
    if (postsResult == null) {
      res.status(400).send(new Error(`Post either does not exist or you do not have the required permissions.`));
      return;
    }
    const commentsToSend = [];
    const likersToSend = [];
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
      const likersPost = await query({
        text: `SELECT a.id, a.first_name, a.last_name
                        FROM likes_a_post l
                        INNER JOIN users a
                        ON l.author = a.id
                        WHERE l.post = $1`,
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
      likersToSend.push(likersPost.rows);
      tagsToSend.push(tagsPost.rows);
      filesToSend.push(files.rows);
    }
    const result = {
      conference: conference.rows[0],
      posts: postsResult.rows,
      comments: commentsToSend,
      likers: likersToSend,
      tags: tagsToSend,
      files: filesToSend,
    };
    console.log(result);
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send(new Error('Error retrieving conference'));
  }
}

export async function getConferencePosts(req, res) {
  console.log("Conference ID: ", req.params.id);
  const conf_id = req.params.id;
  try {
    const result = await query({
      text: `SELECT p.id, p.title, p.content, p.likes,
                p.visibility, p.date_created, p.date_updated
                    FROM posts p
					WHERE p.conference = $1
                    ORDER BY p.date_created DESC
                    LIMIT 10`,
      values: [conf_id],
    });
    console.log("POsts: ", result);
    if (result == null) {
      res.status(400).send(new Error(`Post either does not exist or you do not have the required permissions.`));
      return;
    }
    const commentsToSend = [];
    const likersToSend = [];
    const tagsToSend = [];
    const filesToSend = [];
    for (const post of result.rows) {
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
      const likersPost = await query({
        text: `SELECT a.id, a.first_name, a.last_name
                        FROM likes_a_post l
                        INNER JOIN users a
                        ON l.author = a.id
                        WHERE l.post = $1`,
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
      likersToSend.push(likersPost.rows);
      tagsToSend.push(tagsPost.rows);
      filesToSend.push(files.rows);
    }
    console.log("MD: ", result.rows);
    res.send({
      posts: result.rows,
      comments: commentsToSend,
      likers: likersToSend,
      tags: tagsToSend,
      files: filesToSend,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(new Error('Error retrieving conference posts'));
  }
}

export function changePrivacy(req, res) {
  query({
    text: `UPDATE conferences
                SET privacy = $2
                WHERE id = $1`,
    values: [req.body.id, req.body.privacy],
  }).then((result) => {
    res.status(200).send();
  }).catch((error) => {
    console.log('\n\nERROR:', error);
    res.status(400).send({ message: 'An error ocurred while changing the privacy of a conference' });
  });
}
