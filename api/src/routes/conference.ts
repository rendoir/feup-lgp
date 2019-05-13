'use strict';
import { Router } from 'express';
import * as controller from '../controllers/conferences';

export const conferenceRouter = Router();

/**
 *
 */
conferenceRouter.get('/:id', controller.getConference);
