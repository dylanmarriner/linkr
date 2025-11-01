import express from 'express';
import auth from '../modules/auth/routes';
import provider from '../modules/provider/routes';
import client from '../modules/client/routes';
import verification from '../modules/verification/routes';
import media from '../modules/media/routes';

const router = express.Router();

// comment out unused modules for now
// import subscription from './subscription'
// import moderation from './moderation'

router.use('/auth', auth);
router.use('/provider', provider);
router.use('/client', client);
router.use('/verification', verification);
router.use('/media', media);

export default router;
