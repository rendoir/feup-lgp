'use strict';
import {Router} from 'express';
// import * as controller from '../controllers/feed';
export const feedRouter = Router();

// https://i1.wp.com/digital-photography-school.com/wp-content/uploads/flickr/2746960560_8711acfc60_o.jpg
// https://static.photocdn.pt/images/articles/2018/03/09/articles/2017_8/landscape_photography.jpg
// https://photopedia.in/wp-content/uploads/2018/03/landscape-photography-e1521915292157.jpg
// https://cdn3.dpmag.com/2018/04/Matiash_DPP_Landscape_01.jpg

// const mockPosts = [
//     {
//         text: `this is a very big text for testing pursopes this is a very big text for testing pursopes
//         this is a very big text for testing pursopes this is a very big text for testing pursopes
//         this is a very big text for testing pursopes this is a very big text for testing pursopes
//         this is a very big text for testing pursopes this is a very big text for testing pursopes
//         this is a very big text for testing pursopes this is a very big text for testing pursopes`,
//         imgs: [],
//         page: 'testAcc1',
//         network: 'facebook',
//         date: 'Wed Nov 21 2018 22:40:00 GMT+0000 (Western European Standard Time)',
//     },
//     {
//         text: `this is a very big text for testing pursopes this is a very big text for testing pursopes
//         this is a very big text for testing pursopes this is a very big text for testing pursopes
//         this is a very big text for testing pursopes this is a very big text for testing pursopes
//         this is a very big text for testing pursopes this is a very big text for testing pursopes
//         this is a very big text for testing pursopes this is a very big text for testing pursopes`,
//         imgs: ['https://cdn3.dpmag.com/2018/04/Matiash_DPP_Landscape_01.jpg'],
//         page: 'testAcc1',
//         network: 'facebook',
//         date: 'Wed Nov 21 2018 22:40:00 GMT+0000 (Western European Standard Time)',
//     },
//     {
//         text: `this is a very big text for testing pursopes this is a very big text for testing pursopes
//         this is a very big text for testing pursopes this is a very big text for testing pursopes
//         this is a very big text for testing pursopes this is a very big text for testing pursopes
//         this is a very big text for testing pursopes this is a very big text for testing pursopes
//         this is a very big text for testing pursopes this is a very big text for testing pursopes`,
//         imgs: ['https://i1.wp.com/digital-photography-school.com/wp-content/uploads/flickr/2746960560_8711acfc60_o.jpg'],
//         page: 'testAcc2',
//         network: 'facebook',
//         date: 'Wed Nov 21 2018 22:40:00 GMT+0000 (Western European Standard Time)',
//     },
//     {
//         text: 'this is a genereic post text three',
//         imgs: ['https://i1.wp.com/digital-photography-school.com/wp-content/uploads/flickr/2746960560_8711acfc60_o.jpg'],
//         page: 'testAcc3',
//         network: 'facebook',
//         date: 'Wed Nov 21 2018 22:40:00 GMT+0000 (Western European Standard Time)',
//     },
//     {
//         text: 'this is a genereic post text four',
//         imgs: ['https://static.photocdn.pt/images/articles/2018/03/09/articles/2017_8/landscape_photography.jpg'],
//         page: 'testAcc2',
//         network: 'facebook',
//         date: 'Wed Nov 21 2018 22:40:00 GMT+0000 (Western European Standard Time)',
//     },
//     {
//         text: 'this is a genereic post text five',
//         imgs: ['https://photopedia.in/wp-content/uploads/2018/03/landscape-photography-e1521915292157.jpg'],
//         page: 'testAcc1',
//         network: 'facebook',
//         date: 'Wed Nov 21 2018 22:40:00 GMT+0000 (Western European Standard Time)',
//     },
//     {
//         text: 'this is a genereic post text',
//         imgs: [],
//         page: 'testAcc1',
//         network: 'facebook',
//         date: 'Wed Nov 21 2018 22:40:00 GMT+0000 (Western European Standard Time)',
//     },
//     {
//         text: 'this is a genereic post text one',
//         imgs: ['https://cdn3.dpmag.com/2018/04/Matiash_DPP_Landscape_01.jpg'],
//         page: 'testAcc1',
//         network: 'facebook',
//         date: 'Wed Nov 21 2018 22:40:00 GMT+0000 (Western European Standard Time)',
//     },
//     {
//         text: 'this is a genereic post text two',
//         imgs: ['https://i1.wp.com/digital-photography-school.com/wp-content/uploads/flickr/2746960560_8711acfc60_o.jpg'],
//         page: 'testAcc2',
//         network: 'facebook',
//         date: 'Wed Nov 21 2018 22:40:00 GMT+0000 (Western European Standard Time)',
//     },
//     {
//         text: 'this is a genereic post text',
//         imgs: [],
//         page: 'testAcc1',
//         network: 'facebook',
//         date: 'Wed Nov 21 2018 22:40:00 GMT+0000 (Western European Standard Time)',
//     },
//     {
//         text: 'this is a genereic post text one',
//         imgs: ['https://cdn3.dpmag.com/2018/04/Matiash_DPP_Landscape_01.jpg'],
//         page: 'testAcc1',
//         network: 'facebook',
//         date: 'Wed Nov 21 2018 22:40:00 GMT+0000 (Western European Standard Time)',
//     },
//     {
//         text: 'this is a genereic post text two',
//         imgs: ['https://i1.wp.com/digital-photography-school.com/wp-content/uploads/flickr/2746960560_8711acfc60_o.jpg'],
//         page: 'testAcc2',
//         network: 'facebook',
//         date: 'Wed Nov 21 2018 22:40:00 GMT+0000 (Western European Standard Time)',
//     },
//     {
//         text: 'this is a genereic post text',
//         imgs: [],
//         page: 'testAcc1',
//         network: 'facebook',
//         date: 'Wed Nov 21 2018 22:40:00 GMT+0000 (Western European Standard Time)',
//     },
//     {
//         text: 'this is a genereic post text one',
//         imgs: ['https://cdn3.dpmag.com/2018/04/Matiash_DPP_Landscape_01.jpg'],
//         page: 'testAcc1',
//         network: 'facebook',
//         date: 'Wed Nov 21 2018 22:40:00 GMT+0000 (Western European Standard Time)',
//     },
//     {
//         text: 'this is a genereic post text two',
//         imgs: ['https://i1.wp.com/digital-photography-school.com/wp-content/uploads/flickr/2746960560_8711acfc60_o.jpg'],
//         page: 'testAcc2',
//         network: 'facebook',
//         date: 'Wed Nov 21 2018 22:40:00 GMT+0000 (Western European Standard Time)',
//     },
//     {
//         text: 'this is a genereic post text',
//         imgs: [],
//         page: 'testAcc1',
//         network: 'facebook',
//         date: 'Wed Nov 21 2018 22:40:00 GMT+0000 (Western European Standard Time)',
//     },
//     {
//         text: 'this is a genereic post text one',
//         imgs: ['https://cdn3.dpmag.com/2018/04/Matiash_DPP_Landscape_01.jpg'],
//         page: 'testAcc1',
//         network: 'facebook',
//         date: 'Wed Nov 21 2018 22:40:00 GMT+0000 (Western European Standard Time)',
//     },
//     {
//         text: 'this is a genereic post text two',
//         imgs: ['https://i1.wp.com/digital-photography-school.com/wp-content/uploads/flickr/2746960560_8711acfc60_o.jpg'],
//         page: 'testAcc2',
//         network: 'facebook',
//         date: 'Wed Nov 21 2018 22:40:00 GMT+0000 (Western European Standard Time)',
//     },
//     {
//         text: 'this is a genereic post text',
//         imgs: [],
//         page: 'testAcc1',
//         network: 'facebook',
//         date: 'Wed Nov 21 2018 22:40:00 GMT+0000 (Western European Standard Time)',
//     },
//     {
//         text: 'this is a genereic post text one',
//         imgs: ['https://cdn3.dpmag.com/2018/04/Matiash_DPP_Landscape_01.jpg'],
//         page: 'testAcc1',
//         network: 'facebook',
//         date: 'Wed Nov 21 2018 22:40:00 GMT+0000 (Western European Standard Time)',
//     },
//     {
//         text: 'this is a genereic post text two',
//         imgs: ['https://i1.wp.com/digital-photography-school.com/wp-content/uploads/flickr/2746960560_8711acfc60_o.jpg'],
//         page: 'testAcc2',
//         network: 'facebook',
//         date: 'Wed Nov 21 2018 22:40:00 GMT+0000 (Western European Standard Time)',
//     },
//     {
//         text: 'this is a genereic post text',
//         imgs: [],
//         page: 'testAcc1',
//         network: 'facebook',
//         date: 'Wed Nov 21 2018 22:40:00 GMT+0000 (Western European Standard Time)',
//     },
//     {
//         text: 'this is a genereic post text one',
//         imgs: ['https://cdn3.dpmag.com/2018/04/Matiash_DPP_Landscape_01.jpg'],
//         page: 'testAcc1',
//         network: 'facebook',
//         date: 'Wed Nov 21 2018 22:40:00 GMT+0000 (Western European Standard Time)',
//     },
//     {
//         text: 'this is a genereic post text two',
//         imgs: ['https://i1.wp.com/digital-photography-school.com/wp-content/uploads/flickr/2746960560_8711acfc60_o.jpg'],
//         page: 'testAcc2',
//         network: 'facebook',
//         date: 'Wed Nov 21 2018 22:40:00 GMT+0000 (Western European Standard Time)',
//     },
// ];

/**
 * @api {get} /api/feed Get user feed
 * @apiName Get-Feed
 * @apiGroup Feed
 *
 * @apiSuccess {Object[]} posts        List of user facebook groups.
 * @apiSuccess {String}   posts.text   Group name.
 * @apiSuccess {String[]} posts.imgs     Facebook group id.
 * @apiSuccess {Boolean}  posts.page True if group is selected as active by the user
 * @apiSuccess {String}   posts.network     facebook
 * @apiSuccess {String}   posts.date   group
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      [
 *          {
 *          text: 'this is a genereic post text two',
 *          imgs: ['https://i1.wp.com/digital-photography-school.com/wp-content/uploads/flickr/2746960560_8711acfc60_o.jpg'],
 *          page: 'testAcc2',
 *          network: 'facebook',
 *          date: 'Wed Nov 21 2018 22:40:00 GMT+0000 (Western European Standard Time)',
 *          }
 *      ]
 *     }
 */
// feedRouter.get('/', controller.getTweets);
