import prisma from '../config/database.js';

export const getSeasonStreams = async (req, res) => {
  try {
    const { seasonId } = req.params;
    const streams = await prisma.stream.findMany({ where: { seasonId }, include: { season: { select: { name: true, slug: true } } }, orderBy: { scheduledAt: 'desc' } });
    let hasAccess = false;
    if (req.user) {
      if (req.user.role === 'admin') hasAccess = true;
      else {
        const subscription = await prisma.subscription.findFirst({
          where: { userId: req.user.id, status: 'active', endDate: { gte: new Date() }, OR: [{ plan: { type: 'monthly' } }, { plan: { seasonId } }] },
        });
        hasAccess = !!subscription;
      }
    }
    const processedStreams = streams.map((stream) => (!hasAccess && !stream.isFree ? { ...stream, streamUrl: null, requiresSubscription: true } : stream));
    res.json({ streams: processedStreams, hasAccess });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get streams' });
  }
};

export const getStream = async (req, res) => {
  try {
    const stream = await prisma.stream.findUnique({ where: { id: req.params.streamId }, include: { season: { select: { id: true, name: true, slug: true } } } });
    if (!stream) return res.status(404).json({ error: 'Stream not found' });
    if (!stream.isFree) {
      if (!req.user) return res.status(401).json({ error: 'Login required' });
      if (req.user.role !== 'admin') {
        const subscription = await prisma.subscription.findFirst({
          where: { userId: req.user.id, status: 'active', endDate: { gte: new Date() }, OR: [{ plan: { type: 'monthly' } }, { plan: { seasonId: stream.seasonId } }] },
        });
        if (!subscription) return res.status(403).json({ error: 'Subscription required', seasonId: stream.seasonId });
      }
    }
    await prisma.stream.update({ where: { id: req.params.streamId }, data: { viewCount: { increment: 1 } } });
    res.json(stream);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get stream' });
  }
};

export const getLiveStreams = async (req, res) => {
  try {
    const streams = await prisma.stream.findMany({ where: { isLive: true }, include: { season: { select: { name: true, slug: true } } }, orderBy: { viewCount: 'desc' } });
    res.json(streams);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get live streams' });
  }
};

export const getUpcomingStreams = async (req, res) => {
  try {
    const streams = await prisma.stream.findMany({ where: { scheduledAt: { gte: new Date() }, isLive: false }, include: { season: { select: { name: true, slug: true } } }, orderBy: { scheduledAt: 'asc' }, take: 20 });
    res.json(streams);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get upcoming streams' });
  }
};

export const createStream = async (req, res) => {
  try {
    const { title, description, thumbnail, streamUrl, streamType, seasonId, scheduledAt, endTime, isLive, isVod, isFree } = req.body;
    if (!title || !streamUrl || !seasonId) return res.status(400).json({ error: 'Title, streamUrl, and seasonId are required' });
    const stream = await prisma.stream.create({
      data: { title, description, thumbnail, streamUrl, streamType: streamType || 'hls', seasonId, scheduledAt: scheduledAt ? new Date(scheduledAt) : null, endTime: endTime ? new Date(endTime) : null, isLive: isLive || false, isVod: isVod || false, isFree: isFree || false },
    });
    res.status(201).json({ message: 'Stream created', stream });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create stream' });
  }
};

export const updateStream = async (req, res) => {
  try {
    const { title, description, thumbnail, streamUrl, streamType, seasonId, scheduledAt, endTime, isLive, isVod, isFree } = req.body;
    const updateData = {};
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (thumbnail !== undefined) updateData.thumbnail = thumbnail;
    if (streamUrl) updateData.streamUrl = streamUrl;
    if (streamType) updateData.streamType = streamType;
    if (seasonId) updateData.seasonId = seasonId;
    if (scheduledAt !== undefined) updateData.scheduledAt = scheduledAt ? new Date(scheduledAt) : null;
    if (endTime !== undefined) updateData.endTime = endTime ? new Date(endTime) : null;
    if (isLive !== undefined) updateData.isLive = isLive;
    if (isVod !== undefined) updateData.isVod = isVod;
    if (isFree !== undefined) updateData.isFree = isFree;
    const stream = await prisma.stream.update({ where: { id: req.params.streamId }, data: updateData });
    res.json({ message: 'Stream updated', stream });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update stream' });
  }
};

export const deleteStream = async (req, res) => {
  try {
    await prisma.stream.delete({ where: { id: req.params.streamId } });
    res.json({ message: 'Stream deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete stream' });
  }
};

export const toggleStreamLive = async (req, res) => {
  try {
    const stream = await prisma.stream.update({ where: { id: req.params.streamId }, data: { isLive: req.body.isLive } });
    res.json({ message: `Stream is now ${req.body.isLive ? 'live' : 'offline'}`, stream });
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle stream status' });
  }
};

export const getAllStreams = async (req, res) => {
  try {
    const streams = await prisma.stream.findMany({ include: { season: { select: { name: true, slug: true } } }, orderBy: { createdAt: 'desc' } });
    res.json(streams);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get streams' });
  }
};
