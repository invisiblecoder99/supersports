import { Router } from 'express';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import prisma from '../config/database.js';

const router = Router();

// Get chat messages for a stream
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

// Send a chat message
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

export default router;
