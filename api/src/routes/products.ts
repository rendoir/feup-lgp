'use strict';
import { Router } from 'express';
import * as controller from '../controllers/products';

export const productsRouter = Router();

productsRouter.get('/:id', controller.getProduct);

productsRouter.post('/', controller.createProduct);

productsRouter.put('/:id', controller.updateProduct);

productsRouter.delete('/:id', controller.deleteProduct);

productsRouter.post('/:id/exchange', controller.exchangeProduct);

/**
 * @api {get} /api/products Get shop products
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
productsRouter.get('/', controller.getProducts);
