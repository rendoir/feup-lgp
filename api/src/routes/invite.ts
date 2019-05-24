'use strict';
import { Router } from 'express';
import * as controller from '../controllers/invite';

export const inviteRouter = Router();

inviteRouter.post('/', controller.sendMail);
