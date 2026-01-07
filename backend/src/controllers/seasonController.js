import prisma from '../config/database.js';

export const getAllSeasons = async (req, res) => {
  try {
    const seasons = await prisma.season.findMany({
      where: { isActive: true },
      include: { _count: { select: { streams: true } }, plans: { where: { isActive: true } } },
      orderBy: { startDate: 'desc' },
    });
    res.json(seasons);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get seasons' });
  }
};

export const getSeasonBySlug = async (req, res) => {
  try {
    const season = await prisma.season.findUnique({
      where: { slug: req.params.slug },
      include: { streams: { orderBy: { scheduledAt: 'desc' } }, plans: { where: { isActive: true } } },
    });
    if (!season) return res.status(404).json({ error: 'Season not found' });
    let hasAccess = false;
    if (req.user) {
      const subscription = await prisma.subscription.findFirst({
        where: {
          userId: req.user.id, status: 'active', endDate: { gte: new Date() },
          OR: [{ plan: { type: 'monthly' } }, { plan: { seasonId: season.id } }],
        },
      });
      hasAccess = !!subscription || req.user.role === 'admin';
    }
    res.json({ ...season, hasAccess });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get season' });
  }
};

export const createSeason = async (req, res) => {
  try {
    const { name, slug, description, thumbnail, startDate, endDate } = req.body;
    if (!name || !slug || !startDate || !endDate) return res.status(400).json({ error: 'Name, slug, startDate, and endDate are required' });
    const season = await prisma.season.create({ data: { name, slug, description, thumbnail, startDate: new Date(startDate), endDate: new Date(endDate) } });
    res.status(201).json({ message: 'Season created', season });
  } catch (error) {
    if (error.code === 'P2002') return res.status(400).json({ error: 'Season slug already exists' });
    res.status(500).json({ error: 'Failed to create season' });
  }
};

export const updateSeason = async (req, res) => {
  try {
    const { name, slug, description, thumbnail, startDate, endDate, isActive } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (slug) updateData.slug = slug;
    if (description !== undefined) updateData.description = description;
    if (thumbnail !== undefined) updateData.thumbnail = thumbnail;
    if (startDate) updateData.startDate = new Date(startDate);
    if (endDate) updateData.endDate = new Date(endDate);
    if (isActive !== undefined) updateData.isActive = isActive;
    const season = await prisma.season.update({ where: { id: req.params.seasonId }, data: updateData });
    res.json({ message: 'Season updated', season });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update season' });
  }
};

export const deleteSeason = async (req, res) => {
  try {
    await prisma.season.delete({ where: { id: req.params.seasonId } });
    res.json({ message: 'Season deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete season' });
  }
};

export const getAllSeasonsAdmin = async (req, res) => {
  try {
    const seasons = await prisma.season.findMany({ include: { _count: { select: { streams: true, plans: true } } }, orderBy: { createdAt: 'desc' } });
    res.json(seasons);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get seasons' });
  }
};
