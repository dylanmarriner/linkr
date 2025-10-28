import { Router } from 'express';
import auth from './auth';
import provider from './provider';
import client from './client';
import verification from './verification';
import media from './media';
import subscription from './subscription';
import moderation from './moderation';

const router = Router();
router.use('/auth', auth);
router.use('/provider', provider);
router.use('/client', client);
router.use('/verification', verification);
router.use('/media', media);
router.use('/subscription', subscription);
router.use('/moderation', moderation);

export default router;
