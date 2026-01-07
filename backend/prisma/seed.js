import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@supersports.com' },
    update: {},
    create: { email: 'admin@supersports.com', password: adminPassword, name: 'Admin', role: 'admin' },
  });

  const userPassword = await bcrypt.hash('user123', 10);
  await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: { email: 'user@example.com', password: userPassword, name: 'Test User', role: 'user' },
  });

  const pl = await prisma.season.upsert({
    where: { slug: 'premier-league-2024-25' },
    update: {},
    create: { name: 'Premier League 2024-25', slug: 'premier-league-2024-25', description: 'English Premier League', thumbnail: 'https://via.placeholder.com/400x225?text=PL', startDate: new Date('2024-08-01'), endDate: new Date('2025-05-31') },
  });

  const cl = await prisma.season.upsert({
    where: { slug: 'champions-league-2024-25' },
    update: {},
    create: { name: 'UEFA Champions League 2024-25', slug: 'champions-league-2024-25', description: 'UEFA Champions League', thumbnail: 'https://via.placeholder.com/400x225?text=UCL', startDate: new Date('2024-09-01'), endDate: new Date('2025-06-01') },
  });

  await prisma.plan.upsert({ where: { id: 'monthly-basic' }, update: {}, create: { id: 'monthly-basic', name: 'Monthly All-Access', type: 'monthly', price: 19.99, duration: 30, description: 'Access all seasons', features: '["All live streams","HD quality"]' } });
  await prisma.plan.upsert({ where: { id: 'pl-season' }, update: {}, create: { id: 'pl-season', name: 'Premier League Pass', type: 'seasonal', price: 99.99, duration: 300, seasonId: pl.id, features: '["All PL matches","VOD archive"]' } });
  await prisma.plan.upsert({ where: { id: 'cl-season' }, update: {}, create: { id: 'cl-season', name: 'Champions League Pass', type: 'seasonal', price: 79.99, duration: 270, seasonId: cl.id, features: '["All CL matches","VOD archive"]' } });

  await prisma.stream.createMany({ data: [
    { title: 'Man United vs Liverpool', streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', seasonId: pl.id, scheduledAt: new Date(Date.now() + 86400000), isFree: false },
    { title: 'Arsenal vs Chelsea - FREE', streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', seasonId: pl.id, isFree: true },
    { title: 'Real Madrid vs Bayern', streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', seasonId: cl.id, isLive: true },
  ], skipDuplicates: true });

  console.log('Seeded! Admin: admin@supersports.com / admin123');
}

main().catch(console.error).finally(() => prisma.$disconnect());
