'use strict';
import {Router} from 'express';
import * as controller from '../controllers/shop';
export const shopRouter = Router();

/**
 * @api {get} /api/shop Get shop products
 * @apiName Get-Products
 * @apiGroup Shop
 *
 * @apiParam {number}   userId       ID of the logged user
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *      message: 'Error getting the shop products'
 *     }
 */
shopRouter.get('/', controller.getProducts);