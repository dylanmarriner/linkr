import express from 'express';
import auth from '../modules/auth/routes';
import provider from '../modules/provider/routes';
import client from '../modules/client/routes';
import verification from '../modules/verification/routes';
import media from '../modules/media/routes';
import safety from '../modules/safety/routes';
import users from '../modules/users/routes';
import profiles from '../modules/profiles/routes';
import subscriptions from '../modules/subscriptions/routes';
import payments from '../modules/payments/routes';
import kyc from '../modules/kyc/routes';
import admin from '../modules/admin/routes';

const router = express.Router();

router.use('/auth', auth);
router.use('/provider', provider);
router.use('/client', client);
router.use('/verification', verification);
router.use('/media', media);
router.use('/safety', safety);
router.use('/users', users);
router.use('/profiles', profiles);
router.use('/subscriptions', subscriptions);
router.use('/payments', payments);
router.use('/kyc', kyc);
router.use('/admin', admin);

export default router;
