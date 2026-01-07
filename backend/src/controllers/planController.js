import prisma from '../config/database.js';

export const getAllPlans = async (req, res) => {
  try {
    const plans = await prisma.plan.findMany({ where: { isActive: true }, include: { season: { select: { name: true, slug: true } } }, orderBy: { price: 'asc' } });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get plans' });
  }
};

export const getSeasonPlans = async (req, res) => {
  try {
    const plans = await prisma.plan.findMany({
      where: { isActive: true, OR: [{ seasonId: req.params.seasonId }, { type: 'monthly' }] },
      include: { season: { select: { name: true, slug: true } } }, orderBy: { price: 'asc' },
    });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get plans' });
  }
};

export const createPlan = async (req, res) => {
  try {
    const { name, type, price, currency, duration, description, features, seasonId } = req.body;
    if (!name || !type || price === undefined || !duration) return res.status(400).json({ error: 'Name, type, price, and duration are required' });
    if (!['monthly', 'seasonal'].includes(type)) return res.status(400).json({ error: 'Type must be monthly or seasonal' });
    if (type === 'seasonal' && !seasonId) return res.status(400).json({ error: 'Seasonal plans require a seasonId' });
    const plan = await prisma.plan.create({
      data: { name, type, price, currency: currency || 'USD', duration, description, features: features ? JSON.stringify(features) : null, seasonId: type === 'seasonal' ? seasonId : null },
    });
    res.status(201).json({ message: 'Plan created', plan });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create plan' });
  }
};

export const updatePlan = async (req, res) => {
  try {
    const { name, type, price, currency, duration, description, features, seasonId, isActive } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (type) updateData.type = type;
    if (price !== undefined) updateData.price = price;
    if (currency) updateData.currency = currency;
    if (duration) updateData.duration = duration;
    if (description !== undefined) updateData.description = description;
    if (features !== undefined) updateData.features = features ? JSON.stringify(features) : null;
    if (seasonId !== undefined) updateData.seasonId = seasonId;
    if (isActive !== undefined) updateData.isActive = isActive;
    const plan = await prisma.plan.update({ where: { id: req.params.planId }, data: updateData });
    res.json({ message: 'Plan updated', plan });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update plan' });
  }
};

export const deletePlan = async (req, res) => {
  try {
    await prisma.plan.delete({ where: { id: req.params.planId } });
    res.json({ message: 'Plan deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete plan' });
  }
};

export const getAllPlansAdmin = async (req, res) => {
  try {
    const plans = await prisma.plan.findMany({ include: { season: { select: { name: true, slug: true } }, _count: { select: { subscriptions: true } } }, orderBy: { createdAt: 'desc' } });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get plans' });
  }
};
