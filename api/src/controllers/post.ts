import * as fs from 'fs';
import { query } from '../db/db';

export async function createPost(req, res) {
    if (!req.body.title.trim()) {
        res.status(400).send({
            message: 'An error ocurred while creating a new post. Error: field title can not be empty.',
        });
        return;
    }
    if (!req.body.text.trim()) {
        res.status(400).send({
            message: 'An error ocurred while creating a new post. Error: field content can not be empty.',
        });
        return;
    }

    const userId = req.user.id;

    try {
        if ( req.body.talk > 0) {
            const post = (await query({
                text: `INSERT INTO posts (author, title, content, search_tokens, visibility, talk)
                VALUES ($1, $2, $3, TO_TSVECTOR($2 || ' ' || $3), $4, $5) RETURNING id`,
                values: [userId, req.body.title, req.body.text, req.body.visibility, req.body.talk],
            })).rows[0];
            saveFiles(req, res, post.id);
            saveTags(req, res, post.id);
            res.send({ post: post.id });
        } else {
            const post = (await query({
                text: `INSERT INTO posts (author, title, content, search_tokens, visibility)
                VALUES ($1, $2, $3, TO_TSVECTOR($2 || ' ' || $3), $4) RETURNING id`,
                values: [userId, req.body.title, req.body.text, req.body.visibility],
            })).rows[0];
            saveFiles(req, res, post.id);
            saveTags(req, res, post.id);
            res.send({ id: post.id });
        }
    } catch (error) /* istanbul ignore next */ {
        console.log('\n\nERROR:', error);
        res.status(400).send({ message: 'An error ocurred while creating a post' });
    }
}

/**
 * Can only edit if user is author.
 */
export function editPost(req, res) {
    if (!req.body.title.trim() || !req.body.title.trim()) {
        console.log('\n\nERROR: Post title and body cannot be empty');
        res.status(400).send({ message: 'An error ocurred while editing a post' });
        return;
    }

    const userId = req.user.id;
    query({
        text: `UPDATE posts
                SET title = $2, content = $3, search_tokens = TO_TSVECTOR($2 || ' ' || $3), visibility = $4, date_updated = NOW()
                WHERE id = $1 AND author = $5`,
        values: [req.params.id, req.body.title, req.body.text, req.body.visibility, userId],
    }).then((result) => {
        editFiles(req, res);
        saveTags(req, res, req.params.id);
        res.status(200).send();
    }).catch(
        /* istanbul ignore next */
        (error) => {
        console.log('\n\nERROR:', error);
        res.status(400).send({ message: 'An error ocurred while editing a post' });
    });
}

/**
 * Can only delete if user is author or admin.
 */
export function deletePost(req, res) {
    const userId = req.user.id;
    query({
        text: `DELETE FROM posts
                WHERE id = $1
                    AND (author = $2 OR 'admin' = (SELECT permissions FROM users WHERE id = $2))`, values: [req.params.id, userId],
    }).then(() => {
        deleteFolderRecursive('uploads/' + req.params.id);
        res.status(200).send();
    }).catch(
        /* istanbul ignore next */
        (error) => {
        console.log('\n\nERROR:', error);
        res.status(400).send({ message: 'An error ocurred while deleting a post' });
    });
}

export async function getPost(req, res) {
    const postId = req.params.id;
    const userId = req.user.id;
    try {
        /**
         * Post must be owned by user
         * OR post is public
         * OR post is private to followers and user is a follower of the author
         */
        const post = (await query({
            text: `SELECT p.id, (a.first_name || ' ' || a.last_name) as author, p.title, p.content,
                        p.visibility, p.date_created as date, p.date_updated, a.id AS user_id
                    FROM posts p
                        INNER JOIN users a ON p.author = a.id
                    WHERE
                        p.id = $1
                        AND (p.author = $2
                            OR p.visibility = 'public'
                            OR (p.visibility = 'followers'
                                AND p.author IN (SELECT followed FROM follows WHERE follower = $2)
                                )
                            )`,
            values: [postId, userId],
        })).rows[0];
        if (post == null) {
            res.status(400).send(new Error(`Post either does not exist or you do not have the required permissions.`));
            return;
        }
        /**
         * Although the previous query already checks for permissions,
         * this query checks again to avoid wrong assumptions.
         */
        const comments = await query({
            text: `SELECT c.id, c.post, c.comment, c.date_updated, c.date_created,
                        a.first_name, a.last_name, a.id AS author_id
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
            values: [postId, userId],
        });

        const tags = await query({
             text: `SELECT t.name
                        FROM tags t
                        INNER JOIN posts_tags pt
                        ON pt.tag = t.id
                        WHERE pt.post = $1`,
            values: [postId],
        });

        const files = await query({
            text: `SELECT f.name, f.mimetype, f.size
                    FROM posts p
                    INNER JOIN files f
                    ON p.id = f.post
                    WHERE
                        p.id = $1`,
            values: [postId],
        });
        const result = {
            post,
            comments: comments.rows,
            tags: tags.rows,
            files: files.rows,
        };
        res.send(result);
    } catch (error) /* istanbul ignore next */ {
        console.error(error);
        res.status(500).send(new Error('Error retrieving post'));
    }
}

export async function getPostUserInteractions(req, res) {
    const userId = req.user.id;
    const postId = req.params.id;
    try {
        const totalRatingsQuery = await query({
            text: `SELECT count(*)
                    FROM posts_rates
                    WHERE post = $1`,
            values: [postId],
        });
        const totalRatingAmountQuery = await query({
            text: `SELECT SUM(rate) AS total
                    FROM posts_rates
                    WHERE post = $1`,
            values: [postId],
        });
        const rateQuery = await query({
            text: `SELECT rate
                    FROM posts_rates
                    WHERE
                        evaluator = $1 AND post = $2`,
            values: [userId, postId],
        });
        const subscriptionQuery = await query({
            text: `SELECT *
                    FROM posts_subscriptions
                    WHERE
                        subscriber = $1 AND post = $2`,
            values: [userId, postId],
        });

        const rateValue = rateQuery.rows[0] ? rateQuery.rows[0].rate : null;
        const totalRatingsNumber = totalRatingsQuery.rows[0].count;
        const totalRatingAmount = totalRatingAmountQuery.rows[0].total * 20;

        const result = {
            rate: rateValue,
            totalRatingsNumber,
            totalRatingAmount,
            subscription: Boolean(subscriptionQuery.rows[0]),
        };
        res.send(result);
    } catch (error) /* istanbul ignore next */ {
        console.error(error);
        res.status(500).send(new Error('Error retrieving post-user interactions'));
    }
}

export function subscribePost(req, res) {
    const userId = req.user.id;
    query({
        text: `INSERT INTO posts_subscriptions (subscriber, post) VALUES ($1, $2)
                ON CONFLICT ON CONSTRAINT pk_posts_subscriptions
                DO NOTHING`,
        values: [userId, req.params.id],
    }).then((result) => {
        res.status(200).send();
    }).catch(
        /* istanbul ignore next */
        (error) => {
        console.log('\n\nERROR:', error);
        res.status(400).send({ message: 'An error ocurred while subscribing post' });
    });
}

export function unsubscribePost(req, res) {
    const userId = req.user.id;
    query({
        text: 'DELETE FROM posts_subscriptions WHERE subscriber = $1 AND post = $2',
        values: [userId, req.params.id],
    }).then((result) => {
        res.status(200).send();
    }).catch(
        /* istanbul ignore next */
        (error) => {
        console.log('\n\nERROR:', error);
        res.status(400).send({ message: 'An error ocurred while unsubscribing post' });
    });
}

export function rate(req, res) {
    const userId = req.user.id;
    query({
        text: 'INSERT INTO posts_rates (evaluator, rate, post) VALUES ($1, $2, $3)',
        values: [userId, req.body.rate, req.params.id],
    }).then((result) => {

        query({
            text: 'UPDATE posts SET rate = $1 WHERE id = $2',
            values: [req.body.newPostRating, req.params.id],
        }).then((result2) => {
            res.status(200).send();
        }).catch((error) => {
            console.log('\n\nERROR:', error);
            res.status(400).send({ message: 'An error occured while updating the rating of the post' });
        });
    }).catch((error) => /* istanbul ignore next */{
        console.log('\n\nERROR:', error);
        res.status(400).send({ message: 'An error ocurred while rating an post' });
    });
}

export function updateRate(req, res) {
    const userId = req.user.id;
    query({
        text: 'UPDATE posts_rates SET rate = $2 WHERE evaluator = $1 AND post = $3',
        values: [userId, req.body.rate, req.params.id],
    }).then((result) => {
        query({
            text: 'UPDATE posts SET rate = $1 WHERE id = $2',
            values: [req.body.newPostRating, req.params.id],
        }).then((result2) => {
            res.status(200).send();
        }).catch((error) => {
            console.log('\n\nERROR:', error);
            res.status(400).send({ message: 'An error occured while updating the rating of the post' });
        });
    }).catch((error) => /* istanbul ignore next */{
        console.log('\n\nERROR:', error);
        res.status(400).send({ message: 'An error ocurred while rating an post' });
    });
}

export async function reportPost(req, res) {
    if (!req.body.reason.trim()) {
        console.log('\n\nERROR: Report reason cannot be empty');
        res.status(400).send({ message: 'An error ocurred while creating a new post report' });
        return;
    }

    const userId = req.user.id;
    query({
        text: `INSERT INTO content_reports (reporter, content_id, content_type, description) VALUES ($1, $2, 'post', $3)`,
        values: [userId, req.params.id, req.body.reason],
    }).then((result) => {
        res.status(200).send({ report: true });
    }).catch(
        /* istanbul ignore next */
        (error) => {
        console.log('\n\nERROR:', error);
        res.status(400).send({ message: 'An error ocurred while reporting a post' });
    });
}

export async function checkPostUserReport(req, res) {
    const userId = req.user.id;
    try {
        const reportQuery = await query({
            text: `SELECT *
                    FROM content_reports
                    WHERE
                        reporter = $1 AND content_id = $2 AND content_type = 'post'`,
            values: [userId, req.params.id],
        });

        const result = { report: Boolean(reportQuery.rows[0]) };
        res.status(200).send(result);
    } catch (error) /* istanbul ignore next */ {
        console.error(error);
        res.status(500).send({ message: 'Error retrieving post report' });
    }
}

export function getFile(req, res) {
    // TODO verify if user can access the post req.params.id
    res.sendFile(process.cwd() + '/uploads/' + req.params.id + '/' + req.params.filename);
}

export function downloadFile(req, res) {
    // TODO verify if user can access the post req.params.id
    res.download(process.cwd() + '/uploads/' + req.params.id + '/' + req.params.filename);
}

export function saveFiles(req, res, id) {
    if (!req.files) {
        return;
    }

    for (const key in req.files) {
        if (req.files.hasOwnProperty(key)) {
            const file = req.files[key];
            const filename = file.name;
            const filetype = file.mimetype;
            const filesize = file.size;
            // Move file to uploads
            file.mv('./uploads/' + id + '/' + filename, (err) => {
                if (err) {
                    res.status(400).send({ message: 'An error ocurred while creating/editing post: Moving file.' });
                } else {
                    // Add file to database
                    query({
                        text: `INSERT INTO files (name, mimeType, size, post)
                                VALUES ($1, $2, $3, $4)
                                ON CONFLICT ON CONSTRAINT unique_post_file
                                    DO UPDATE SET mimeType = $2, size = $3 WHERE files.post = $4 AND files.name = $1`,
                        values: [filename, filetype, filesize, id],
                    }).then(() => {
                        return;
                    }).catch((error) => /* istanbul ignore next */{
                        console.log('\n\nERROR:', error);
                        res.status(400).send({ message: 'An error ocurred while creating/editing post: Adding file to database.' });
                    });
                }
            });
        }
    }
}

export async function saveTags(req, res, id) {

    const tagsToAdd = [];
    const tagsToDelete = [];

    for (const key in req.body) {
        if (key.includes('tags[')) {
            tagsToAdd.push(req.body[key]);
        }
    }

    if (tagsToAdd.length === 0) {
        return;
    }

    let allTags;
    let tagsOfPost;
    try {
        allTags = await query({
            text: `SELECT id, name FROM tags`,
        });
        tagsOfPost = await query({
            text: `SELECT t.id, t.name FROM tags t INNER JOIN posts_tags pt ON pt.tag = t.id WHERE pt.post = $1`,
            values: [id],
        });
    } catch (err) /* istanbul ignore next */{
        console.error(err);
        res.status(400).send({ message: 'An error ocurred while creating post: Adding tags to post.' });
        return;
    }

    if (tagsToAdd === []) {
        return;
    }

    for (const tag of tagsOfPost.rows) {
        if (!tagsToAdd.includes(tag.name)) {
            tagsToDelete.push(tag);
        }
    }

    for (const tag of tagsToDelete) {
        query({
            text: 'DELETE FROM posts_tags WHERE post = $1 AND tag = $2',
            values: [id, tag.id],
        }).then(() => {
            return;
        }).catch((error) => /* istanbul ignore next */{
            console.log('\n\nERROR:', error);
            res.status(400).send({ message: 'An error ocurred while creating post: Adding tags to post.' });
        });
    }

    for (const tag of tagsToAdd) {
        const foundValue = allTags.rows.find((e: { name: string; }) => {
            if (e.name === tag) {
                return e;
            } else {
                return null;
            }
        });

        const alreadyValue = tagsOfPost.rows.find((e: { name: string; }) => {
            if (e.name === tag) {
                return e;
            } else {
                return null;
            }
        });

        let tagID = 0;
        if (foundValue != null) {
            tagID = foundValue.id;
        } else {
            const newTagID = await query({
                text: `INSERT INTO tags (name) VALUES ($1) RETURNING id`,
                values: [tag],
            });
            tagID = newTagID.rows[0].id;
        }
        if (alreadyValue === null || alreadyValue === undefined) {
            query({
                text: 'INSERT INTO posts_tags (post, tag) VALUES ($1, $2)',
                values: [id, tagID],
            }).then(() => {
                return;
            }).catch((error) => /* istanbul ignore next */{
                console.log('\n\nERROR:', error);
                res.status(400).send({ message: 'An error ocurred while creating post: Adding tags to post.' });
            });
        }
    }
}

export async function editFiles(req, res) {
    // Delete files
    if (req.body.removed) {
        const removed = JSON.parse(req.body.removed);
        for (const file of removed) {
            // Remove file from database
            await query({
                text: `DELETE FROM files
                       WHERE post = $1 AND name = $2`,
                values: [req.params.id, file.name],
            });
            // Delete file from filesystem
            fs.unlinkSync('uploads/' + req.params.id + '/' + file.name);
        }
    }
    // Add new files
    saveFiles(req, res, req.params.id);
}

export function deleteFolderRecursive(path) {
    if (fs.existsSync(path)) {
      fs.readdirSync(path).forEach((file, index) => {
        const curPath = path + '/' + file;
        if (fs.lstatSync(curPath).isDirectory()) { // recurse
          deleteFolderRecursive(curPath);
        } else { // delete file
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(path);
    }
}

export async function inviteUser(req, res) {
    query({
        text: `INSERT INTO invites (invited_user, invite_subject_id, invite_type) VALUES ($1, $2, 'post')`,
        values: [req.body.invited_user, req.params.id],
    }).then((result) => {
        res.status(200).send();
    }).catch(
        /* istanbul ignore next */
        (error) => {
        console.log('\n\nERROR:', error);
        res.status(400).send({ message: 'An error ocurred while inviting user to conference' });
    });
}

export function inviteSubscribers(req, res) {
    const userId = req.user.id;
    query({
        text: `INSERT INTO invites (invited_user, invite_subject_id, invite_type)
                  SELECT uninvited_subscriber, $1, 'post'
                  FROM retrieve_post_uninvited_subscribers($1, $2)
                ON CONFLICT ON CONSTRAINT unique_invite
                DO NOTHING`,
        values: [req.params.id, userId],
    }).then((result) => {
        res.status(200).send();
    }).catch(
        /* istanbul ignore next */
        (error) => {
        console.log('\n\nERROR:', error);
        res.status(400).send({ message: 'An error ocurred while inviting subscribers to conference' });
    });
}

export async function amountSubscribersUninvited(req, res) {
    const userId = req.user.id;
    try {
        const amountUninvitedSubscribersQuery = await query({
            text: `SELECT COUNT(*) FROM retrieve_post_uninvited_subscribers($1, $2)`,
            values: [req.params.id, userId],
        });
        res.status(200).send({ amountUninvitedSubscribers: amountUninvitedSubscribersQuery.rows[0].count });
    } catch (error) /* istanbul ignore next */ {
        console.error(error);
        res.status(500).send(new Error('Error retrieving uninvited subscribers count in post'));
    }
}

export async function getUninvitedUsersInfo(req, res) {
    const userId = req.user.id;
    try {
        const uninvitedUsersQuery = await query({
            text: `SELECT id, first_name, last_name, home_town, university, work, work_field
                    FROM users
                    WHERE id NOT IN (SELECT * FROM retrieve_post_invited_or_subscribed_users($1)) AND id <> $2`,
            values: [req.params.id, userId],
        });
        res.status(200).send({ uninvitedUsers: uninvitedUsersQuery.rows });
    } catch (error) /* istanbul ignore next */ {
        console.error(error);
        res.status(500).send(new Error('Error retrieving post uninvited users info'));
    }
}
