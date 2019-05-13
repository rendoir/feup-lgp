'use strict';

import { query } from '../db/db';

export async function getFeed(req, res) {
  const offset = req.query.offset;
  const userId = 1;
  try {
    const result = await query({
      text: `(SELECT p.id, first_name, last_name, p.title, p.content,
                        p.visibility, p.date_created, p.date_updated, p.conference, users.id AS user_id
                        FROM posts p
                            INNER JOIN users ON (users.id = p.author)
                        WHERE
                            (author = $1
                                OR (author IN (SELECT followed FROM follows WHERE follower = $1)
                                    AND p.visibility IN ('public', 'followers')))
                            AND p.conference IS null
                        ORDER BY date_created DESC
                        LIMIT 80
                        OFFSET $2)
                    UNION
                    (SELECT p.id, first_name, last_name, p.title, p.content,
                        p.visibility, p.date_created, p.date_updated, p.conference, users.id AS user_id
                        FROM posts p
                            INNER JOIN users ON (users.id = p.author)
                        WHERE
                            (p.visibility = 'public')
                            AND p.conference IS null
                            AND author != $1
                            AND author NOT IN (SELECT followed FROM follows WHERE follower = $1)
                        ORDER BY date_created DESC
                        LIMIT 20
                        OFFSET $2)
                    ORDER BY date_created DESC
                    LIMIT 20
                    OFFSET $2`,
      values: [userId, offset],
    });
    let followsToSend = null;
    const follows = await query({
      text: `SELECT a.first_name,a.last_name, p.date_created
	  FROM users a
	  INNER JOIN follows f ON a.id=f.followed
	  INNER JOIN posts p ON a.id = p.author
	  WHERE f.follower=1 AND p.date_created=(SELECT MAX(date_created) FROM posts p WHERE a.id=p.author)
	  ORDER BY p.date_created DESC
	  LIMIT 15
	  `,
      values: [userId],
    });
    followsToSend = follows.rows;
    const commentsToSend = [];
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
    res.send({
      posts: result.rows,
      comments: commentsToSend,
      tags: tagsToSend,
      files: filesToSend,
      follows: followsToSend,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(new Error('Error retrieving feed'));
  }
}
