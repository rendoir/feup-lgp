import * as fs from 'fs';
import * as request from 'request-promise';
// import * as Twitter from 'twitter';

import {query} from '../db/db';

export function createPost(req, res) {
    let promises = [];
    let files;
    try {
        const params = req.body.post;
        files = req.files;
        promises = postMultiplePosts(params, files, req.user.id);
    } catch (error) {
        console.log('\n\nERROR:', error);
        res.status(400).send(error);
        return;
    }

    Promise.all(promises).then((result) => {
        console.log('Result:', result);
        removeFiles(files);
        res.status(200).send();
    }).catch( (error) => {
        console.log('\n\nERROR:', error);
        res.status(400).send(error);
    });
}

export async function getPost(req, res) {
    const postId = req.params.id;
    try {
        const post = await query({
            text: `SELECT p.*, a.first_name, a.last_name
                    FROM posts p
                    INNER JOIN users a
                    ON p.author = a.id
                    WHERE
                        p.id = $1`,
            values: [postId],
        });
        const comments = await query({
            text: `SELECT c.*, a.first_name, a.last_name
                    FROM posts p
                    LEFT JOIN comments c
                    ON p.id = c.post
                    INNER JOIN users a 
                    ON c.author = a.id
                    WHERE
                        p.id = $1`,
            values: [postId],
        });
        const result = {
            post: post.rows,
            comments: comments.rows
        }
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send(new Error('Error retrieving post'));
    }
}


export function submitFacebookPost(postInfo, files, posterDbId): Promise<any> {
    return new Promise((resolve, reject) => {
        query({
            text: `SELECT fb_user_id
                    FROM face_users FU
                        INNER JOIN users ON FU.id = users.face_user
                    WHERE users.id = $1`,
            values: [posterDbId],
        }).then((result) => {
            postInfo.author_id = result.rows[0].fb_user_id;

            switch (postInfo.type) {
            case 'page':
                resolve(submitFacebookPagePost(postInfo, files));
                break;
            case 'group':
                resolve(submitFacebookGroupPost(postInfo, files));
                break;
            default:
                reject({message: `Invalid post type for facebook post to: ${postInfo.name}`});
            }
        }).catch((error) => {
            reject(error);
        });
    });
}

export function submitFacebookPagePost(postInfo, files): Promise<any> {
    return new Promise((resolve, reject) => {
        query({text: `SELECT * FROM pages P
                    INNER JOIN face_users_pages FP ON (P.id = FP.page)
                    WHERE fb_id = $1`, values: [postInfo.fb_id]})
        .then((result) => {
            if (result.rowCount === 0) {
                reject({ message: 'Invalid facebook page id for: ' + postInfo.name});
            }
            if (files && files.length === 1 && files[0].mimetype.includes('video')) {
                sendFacebookVideo(postInfo, files[0], result, reject, resolve);
            } else {
                sendFacebookPost(postInfo, files, result, reject, resolve);
            }
        }).catch((error) => {
            reject(error);
        });
    });
}

/**
 *
 * @param {*} postInfo
 * @param {*} files
 * @param {*} result
 * @param {*} reject
 * @param {*} resolve
 */
function sendFacebookPost(postInfo, files, result, reject, resolve) {
    const id = result.rows[0].fb_id;
    const token = result.rows[0].access_token;

    const promises = sendFacebookImages(files, id, token);

    // AFTER SENDING ALL IMAGES
    Promise.all(promises).then(
        (responses) => {
            const postOptions = {
                method: 'POST',
                uri: `https://graph.facebook.com/v3.1/${id}/feed`,
                qs: {
                    access_token: token,
                    message: postInfo.textContent,
                },
            };
            const filesID = [];
            let parsedResponse;
            for (const response of responses) {
                parsedResponse = JSON.parse(response);
                if (parsedResponse.error) {
                    reject(parsedResponse.error);
                    return;
                }
                filesID.push({media_fbid: parsedResponse.id});
            }
            if (filesID.length !== 0) {
                postOptions.qs['attached_media'] = filesID;
            }
            request(postOptions).then(
                (fbRes) => resolve(fbRes),
                (error) => reject(error),
            );
        },
    );
}

/**
 *
 * @param {*} postInfo
 * @param {*} file
 * @param {*} result
 * @param {*} reject
 * @param {*} resolve
 */
function sendFacebookVideo(postInfo, file, result, reject, resolve) {
    const id = result.rows[0].fb_id;
    const token = result.rows[0].access_token;

    const postOptions = {
        method: 'POST',
        uri: `https://graph-video.facebook.com/v3.1/${id}/videos`,
        formData: {
            name: 'source',
            file: {
                value: fs.createReadStream(file.path),
                options: {
                    filename: file.originalname,
                    contentType: file.mimetype,
                },
            },
        },
        qs: {
            access_token: token,
            description: postInfo.textContent,
            title: postInfo.videoTitle,
        },
    };
    request(postOptions).then(
        (fbRes) => {
            resolve(fbRes);
        },
        (error) => {
            try {
                reject(JSON.parse(error.error).error);
            } catch (e) {
                reject(error.error); // errors not from FB may not be JSON parsable
            }
        },
    );
}

/**
 *
 * @param {*} files
 * @param {*} id
 * @param {*} token
 * @return {*}
 */
function sendFacebookImages(files, id, token) {
    const promises = [];
    if (!files) {
        return [];
    }
    files.forEach((file) => {
        const options = {
            method: 'POST',
            uri: `https://graph.facebook.com/v3.1/${id}/photos`,
            formData: {
                name: 'source',
                file: {
                    value: fs.createReadStream(file.path),
                    options: {
                        filename: file.originalname,
                        contentType: file.mimetype,
                    },
                },
            },
            qs: {
                access_token: token,
                published: 'false',
            },
        };
        promises.push(request(options).promise().catch((reason) => {
            return reason.error;
        }));
    });
    return promises;
}

function postMultiplePosts(postsArray, files, posterDbId) {
    const promises = [];
    for (const postInfo of postsArray) {
        const currPost = JSON.parse(postInfo);
        switch (currPost.socialNetwork) {
        case 'facebook':
            promises.push(submitFacebookPost(currPost, files, posterDbId));
            break;
        case 'twitter':
            // promises.push(submitTwitterPost(currPost, files, posterDbId));
            break;
        default:
            promises.push(Promise.reject({ message: 'Invalid social network for new post to: ' + currPost.name }));
        }
    }
    return promises;
}

/**
 * @param {*} postInfo
 * @param {*} files
 * @return {Promise} a promise containing the facebook response
 */
export function submitFacebookGroupPost(postInfo, files): Promise<any> {
    return new Promise((resolve, reject) => {
        query({
            text: `SELECT face_users.user_token AS access_token, groups.fb_id
                    FROM face_users, groups
                    WHERE face_users.fb_user_id = $1 AND groups.fb_id = $2`,
            values: [postInfo.author_id, postInfo.fb_id],
        }).then((result) => {
            if (files.length === 1 && files[0].mimetype.includes('video')) {
                sendFacebookVideo(postInfo, files[0], result, reject, resolve);
            } else {
                sendFacebookPost(postInfo, files, result, reject, resolve);
            }
        }).catch((err) => {
            reject(err);
            return;
        });
    });
}

/**
 *
 * @param {*} postInfo
 * @param {*} files
 * @param {*} posterDbId
 * @return {Promise} a promise containing the twitter response
 */
// export function submitTwitterPost(postInfo, files, posterDbId): Promise<any> {
//     return new Promise((resolve, reject) => {
//         query({
//             text: `SELECT *
//                 FROM twitter_users T
//                     INNER JOIN users ON (users.id = T.user_fk)
//                 WHERE name = $1 AND users.id = $2`,
//             values: [postInfo.fb_id, posterDbId],
//         }).then((result) => {
//             if (result.rowCount === 0) {
//                 reject({message: 'Invalid twitter account id for: ' + postInfo.name});
//             }
//             sendTwitterPost(postInfo, files, result.rows[0].access_token, result.rows[0].secret_token, resolve, reject);
//         }).catch((error) => {
//             reject(error);
//         });
//     });
// }

/**
 * Step 1 of 3: Initialize a media upload
 * @return Promise resolving to String mediaId
 */
// function initUpload(mediaSize, mediaType: string, client): Promise<any> {
//     return makePost('media/upload', client, {
//         command    : 'INIT',
//         total_bytes: mediaSize,
//         media_type : mediaType,
//     }).then((data: any) => data.media_id_string);
// }

/**
 * Step 2 of 3: Append file chunk
 * @param String mediaId    Reference to media object being uploaded
 * @return Promise resolving to String mediaId (for chaining)
 */
// function appendUpload(mediaId, mediaData, client: Twitter): Promise<string> {
//     return makePost('media/upload', client, {
//         command      : 'APPEND',
//         media_id     : mediaId,
//         media        : mediaData,
//         segment_index: 0,
//     }).then((data: any) => mediaId);
// }

/**
 * Step 3 of 3: Finalize upload
 * @param String mediaId   Reference to media
 * @return Promise resolving to mediaId (for chaining)
 */
// function finalizeUpload(mediaId, client: Twitter): Promise<string> {
//     return makePost('media/upload', client, {
//         command : 'FINALIZE',
//         media_id: mediaId,
//     }).then((data: any) => mediaId);
// }

/**
 * (Utility function) Send a POST request to the Twitter API
 * @param String endpoint  e.g. 'statuses/upload'
 * @param Object params    Params object to send
 * @return Promise         Rejects if response is error
 */
// function makePost(endpoint, client: Twitter, params): Promise<any> {
//     return new Promise((resolve, reject) => {
//         client.post(endpoint, params, (error, data, response) => {
//         if (error) {
//             reject(error);
//         } else {
//             resolve(data);
//         }
//         });
//     });
// }

// function sendTwitterImages(files: any[], client: Twitter): Array<Promise<any>> {
//     const promises = [];
//     if (!files) {
//         return [];
//     }
//     for (const file of files) {
//         const fileData = fs.readFileSync(file.path);
//         const fileSize = fs.statSync(file.path).size;
//         const fileType = file.mimetype;

//         promises.push(new Promise((resolve, reject) => {
//             initUpload(fileSize, fileType, client) // Declare that you wish to upload some media
//             .then((mediaId) => appendUpload(mediaId, fileData, client)) // Send the data for the media
//             .then((mediaId) => finalizeUpload(mediaId, client)) // Declare that you are done uploading chunks
//             .then((mediaId) => {
//                 resolve(mediaId);
//                 // You now have an uploaded movie/animated gif
//                 // that you can reference in Tweets, e.g. `update/statuses`
//                 // will take a `mediaIds` param.
//             }).catch((error) => {
//                 console.error('Error submitting Twitter images:', error);
//                 reject(error);
//             });
//         }));
//     }
//     return promises;
// }

// /**
//  *
//  * @param {*} postInfo
//  * @param {*} accessToken
//  * @param {*} secretToken
//  * @param {*} resolve
//  * @param {*} reject
//  */
// function sendTwitterPost(postInfo, files, accessToken, secretToken, resolve, reject) {
//     const client = new Twitter({
//         consumer_key: process.env.TWITTER_CONSUMER_KEY,
//         consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
//         access_token_key: accessToken,
//         access_token_secret: secretToken,
//     });

//     const promises = sendTwitterImages(files, client);

//     Promise.all(promises).then(
//         (mediaIds: string[]) => {
//             /**
//              * tweet: Tweet info.
//              * response: Raw response object.
//              */
//             client.post('statuses/update', {
//                 status: postInfo.textContent,
//                 media_ids: mediaIds.join(','),
//             }, (error, tweet, response) => {
//                 if (error) {
//                     reject(error);
//                     return;
//                 }
//                 resolve(tweet);
//             });
//         },
//         (error) => {
//             reject(error);
//         },
//     );
// }

/**
 *
 * @param {*} files
 */
export function removeFiles(files) {
    if (files && files.length) {
        files.forEach((file) => {
            fs.unlink(file.path, (err) => {
                if (err) { throw err; }
            });
        });
    }
}
