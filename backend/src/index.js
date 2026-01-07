import express from 'express';
import cors from 'cors';
import config from './config/index.js';
import prisma from './config/database.js';
import authRoutes from './routes/auth.js';
import seasonRoutes from './routes/seasons.js';
import streamRoutes from './routes/streams.js';
import planRoutes from './routes/plans.js';
import subscriptionRoutes from './routes/subscriptions.js';

const app = express();

app.use(cors({ origin: config.frontendUrl, credentials: true }));
app.use((req, res, next) => {
  if (req.originalUrl === '/api/subscriptions/webhook/stripe') next();
  else express.json()(req, res, next);
});

app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.use('/api/auth', authRoutes);
app.use('/api/seasons', seasonRoutes);
app.use('/api/streams', streamRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

app.get('/api/stats', async (req, res) => {
  try {
    const [userCount, seasonCount, streamCount, activeSubscriptions, totalRevenue] = await Promise.all([
      prisma.user.count(), prisma.season.count(), prisma.stream.count(),
      prisma.subscription.count({ where: { status: 'active' } }),
      prisma.payment.aggregate({ where: { status: 'completed' }, _sum: { amount: true } }),
    ]);
    res.json({ users: userCount, seasons: seasonCount, streams: streamCount, activeSubscriptions, totalRevenue: totalRevenue._sum.amount || 0 });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

app.use((err, req, res, next) => { console.error(err.stack); res.status(500).json({ error: 'Something went wrong!' }); });
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

app.listen(config.port, () => {
  console.log(`SuperSports API running on http://localhost:${config.port}`);
});

process.on('SIGINT', async () => { await prisma.$disconnect(); process.exit(0); });

export default app;
