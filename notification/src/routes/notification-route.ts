import express, { Request, Response, Router } from 'express';
import { validateRequest, verifyAdminToken } from '@rx-marketplace/common';
import { NotificationDomain } from '../domain/notification-domain';

const router = express.Router();

router.post('/api/notification/brodcast',NotificationDomain.brodcastNotification);


export { router as notificationRouter };
