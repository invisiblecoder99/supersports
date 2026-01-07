import { Router } from 'express';
import { authenticate, isAdmin, optionalAuth } from '../middleware/auth.js';
import {
  getSeasonStreams,
  getStream,
  getLiveStreams,
  getUpcomingStreams,
  createStream,
  updateStream,
  deleteStream,
  toggleStreamLive,
  getAllStreams,
} from '../controllers/streamController.js';
import prisma from '../config/database.js';

const router = Router();

// Public routes
router.get('/', async (req, res) => {
  try {
    const streams = await prisma.stream.findMany({
      include: { season: true },
      orderBy: { scheduledAt: 'desc' }
    });
    res.json(streams);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get streams' });
  }
});

router.get('/live', getLiveStreams);
router.get('/upcoming', getUpcomingStreams);
router.get('/season/:seasonId', optionalAuth, getSeasonStreams);
router.get('/:streamId', optionalAuth, getStream);

// Chat routes
router.get('/:streamId/chat', optionalAuth, async (req, res) => {
  try {
    const messages = await prisma.chatMessage.findMany({
      where: { streamId: req.params.streamId },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'asc' },
      take: 100
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get messages' });
  }
});

router.post('/:streamId/chat', authenticate, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    const chatMessage = await prisma.chatMessage.create({
      data: {
        message: message.trim().substring(0, 500),
        userId: req.user.id,
        streamId: req.params.streamId
      },
      include: { user: { select: { id: true, name: true } } }
    });
    
    res.json(chatMessage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Admin routes
router.get('/admin/all', authenticate, isAdmin, getAllStreams);
router.post('/', authenticate, isAdmin, createStream);
router.put('/:streamId', authenticate, isAdmin, updateStream);
router.delete('/:streamId', authenticate, isAdmin, deleteStream);
router.patch('/:streamId/live', authenticate, isAdmin, toggleStreamLive);

export default router;
