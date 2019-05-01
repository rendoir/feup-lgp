'use strict';
import {Router} from 'express';
import * as controller from '../controllers/feed';
export const feedRouter = Router();

feedRouter.get('/', controller.getFeed);
