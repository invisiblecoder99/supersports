import { Router } from 'express';
import express from 'express';
import { authenticate, isAdmin } from '../middleware/auth.js';
import { getMySubscriptions, checkAccess, createSubscription, initiateStripePayment, stripeWebhook, initiateCryptoPayment, verifyPayment, getAllSubscriptions, getAllPayments, grantSubscription, cancelSubscription } from '../controllers/subscriptionController.js';

const router = Router();
router.get('/my', authenticate, getMySubscriptions);
router.get('/access/:seasonId', authenticate, checkAccess);
router.post('/activate', authenticate, createSubscription);
router.get('/payment/:paymentId', authenticate, verifyPayment);
router.post('/pay/stripe', authenticate, initiateStripePayment);
router.post('/pay/crypto', authenticate, initiateCryptoPayment);
router.post('/webhook/stripe', express.raw({ type: 'application/json' }), stripeWebhook);
router.get('/admin/all', authenticate, isAdmin, getAllSubscriptions);
router.get('/admin/payments', authenticate, isAdmin, getAllPayments);
router.post('/admin/grant', authenticate, isAdmin, grantSubscription);
router.delete('/admin/:subscriptionId', authenticate, isAdmin, cancelSubscription);

export default router;
