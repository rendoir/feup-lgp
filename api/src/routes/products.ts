'use strict';
import { Router } from 'express';
import * as controller from '../controllers/products';

export const productsRouter = Router();

productsRouter.get('/:id', controller.getProduct);

productsRouter.post('/', controller.createProduct);

productsRouter.put('/:id', controller.updateProduct);

productsRouter.delete('/:id', controller.deleteProduct);

productsRouter.post('/:id/exchange', controller.exchangeProduct);
