import prisma from '../config/database.js';
import config from '../config/index.js';
import Stripe from 'stripe';

const stripe = config.stripe.secretKey ? new Stripe(config.stripe.secretKey) : null;

export const getMySubscriptions = async (req, res) => {
  try {
    const subscriptions = await prisma.subscription.findMany({ where: { userId: req.user.id }, include: { plan: { include: { season: { select: { name: true, slug: true } } } } }, orderBy: { createdAt: 'desc' } });
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get subscriptions' });
  }
};

export const checkAccess = async (req, res) => {
  try {
    if (req.user.role === 'admin') return res.json({ hasAccess: true, reason: 'admin' });
    const subscription = await prisma.subscription.findFirst({
      where: { userId: req.user.id, status: 'active', endDate: { gte: new Date() }, OR: [{ plan: { type: 'monthly' } }, { plan: { seasonId: req.params.seasonId } }] },
      include: { plan: true },
    });
    res.json({ hasAccess: !!subscription, subscription: subscription || null });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check access' });
  }
};

export const initiateStripePayment = async (req, res) => {
  try {
    if (!stripe) return res.status(500).json({ error: 'Stripe not configured' });
    const plan = await prisma.plan.findUnique({ where: { id: req.body.planId } });
    if (!plan) return res.status(404).json({ error: 'Plan not found' });
    const payment = await prisma.payment.create({ data: { userId: req.user.id, amount: plan.price, currency: plan.currency, provider: 'stripe', status: 'pending', metadata: JSON.stringify({ planId: req.body.planId }) } });
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price_data: { currency: plan.currency.toLowerCase(), product_data: { name: plan.name }, unit_amount: Math.round(plan.price * 100) }, quantity: 1 }],
      mode: 'payment',
      success_url: `${config.frontendUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}&payment_id=${payment.id}`,
      cancel_url: `${config.frontendUrl}/payment/cancel`,
      metadata: { paymentId: payment.id, planId: plan.id, userId: req.user.id },
    });
    await prisma.payment.update({ where: { id: payment.id }, data: { providerPaymentId: session.id } });
    res.json({ sessionId: session.id, url: session.url, paymentId: payment.id });
  } catch (error) {
    console.error('Stripe payment error:', error);
    res.status(500).json({ error: 'Failed to create payment session' });
  }
};

export const stripeWebhook = async (req, res) => {
  try {
    if (!stripe) return res.status(500).json({ error: 'Stripe not configured' });
    const sig = req.headers['stripe-signature'];
    const event = stripe.webhooks.constructEvent(req.body, sig, config.stripe.webhookSecret);
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const { paymentId, planId, userId } = session.metadata;
      await prisma.payment.update({ where: { id: paymentId }, data: { status: 'completed' } });
      const plan = await prisma.plan.findUnique({ where: { id: planId } });
      if (plan) {
        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + plan.duration);
        await prisma.subscription.create({ data: { userId, planId, startDate, endDate, status: 'active' } });
      }
    }
    res.json({ received: true });
  } catch (error) {
    res.status(400).json({ error: `Webhook Error: ${error.message}` });
  }
};

export const initiateCryptoPayment = async (req, res) => {
  try {
    const { planId, provider } = req.body;
    if (!['btcpay', 'nowpayments'].includes(provider)) return res.status(400).json({ error: 'Invalid payment provider' });
    const plan = await prisma.plan.findUnique({ where: { id: planId } });
    if (!plan) return res.status(404).json({ error: 'Plan not found' });
    const payment = await prisma.payment.create({ data: { userId: req.user.id, amount: plan.price, currency: plan.currency, provider, status: 'pending', metadata: JSON.stringify({ planId }) } });
    let paymentUrl, invoiceId;
    if (provider === 'btcpay' && config.btcpay.url) {
      const response = await fetch(`${config.btcpay.url}/api/v1/stores/${config.btcpay.storeId}/invoices`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `token ${config.btcpay.apiKey}` }, body: JSON.stringify({ amount: plan.price, currency: plan.currency, metadata: { orderId: payment.id, planId: plan.id, userId: req.user.id }, checkout: { redirectURL: `${config.frontendUrl}/payment/success?payment_id=${payment.id}` } }) });
      const invoice = await response.json();
      invoiceId = invoice.id;
      paymentUrl = invoice.checkoutLink;
    } else if (provider === 'nowpayments' && config.nowpayments.apiKey) {
      const response = await fetch('https://api.nowpayments.io/v1/invoice', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-api-key': config.nowpayments.apiKey }, body: JSON.stringify({ price_amount: plan.price, price_currency: plan.currency.toLowerCase(), order_id: payment.id, order_description: plan.name, success_url: `${config.frontendUrl}/payment/success?payment_id=${payment.id}`, cancel_url: `${config.frontendUrl}/payment/cancel` }) });
      const invoice = await response.json();
      invoiceId = invoice.id;
      paymentUrl = invoice.invoice_url;
    } else {
      return res.status(500).json({ error: `${provider} not configured` });
    }
    await prisma.payment.update({ where: { id: payment.id }, data: { providerPaymentId: invoiceId } });
    res.json({ paymentId: payment.id, invoiceId, paymentUrl });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create payment' });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const payment = await prisma.payment.findUnique({ where: { id: req.params.paymentId } });
    if (!payment || payment.userId !== req.user.id) return res.status(404).json({ error: 'Payment not found' });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify payment' });
  }
};

export const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await prisma.subscription.findMany({ include: { user: { select: { id: true, email: true, name: true } }, plan: { include: { season: { select: { name: true, slug: true } } } } }, orderBy: { createdAt: 'desc' } });
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get subscriptions' });
  }
};

export const getAllPayments = async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({ include: { user: { select: { id: true, email: true, name: true } } }, orderBy: { createdAt: 'desc' } });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get payments' });
  }
};

export const grantSubscription = async (req, res) => {
  try {
    const { userId, planId, durationDays } = req.body;
    const plan = await prisma.plan.findUnique({ where: { id: planId } });
    if (!plan) return res.status(404).json({ error: 'Plan not found' });
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + (durationDays || plan.duration));
    const subscription = await prisma.subscription.create({ data: { userId, planId, startDate, endDate, status: 'active' }, include: { user: { select: { email: true, name: true } }, plan: true } });
    res.status(201).json({ message: 'Subscription granted', subscription });
  } catch (error) {
    res.status(500).json({ error: 'Failed to grant subscription' });
  }
};

export const cancelSubscription = async (req, res) => {
  try {
    const subscription = await prisma.subscription.update({ where: { id: req.params.subscriptionId }, data: { status: 'cancelled' } });
    res.json({ message: 'Subscription cancelled', subscription });
  } catch 
