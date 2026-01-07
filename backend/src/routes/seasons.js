import { Router } from 'express';
import { authenticate, isAdmin, optionalAuth } from '../middleware/auth.js';
import { getAllSeasons, getSeasonBySlug, createSeason, updateSeason, deleteSeason, getAllSeasonsAdmin } from '../controllers/seasonController.js';

const router = Router();
router.get('/', getAllSeasons);
router.get('/admin/all', authenticate, isAdmin, getAllSeasonsAdmin);
router.get('/:slug', optionalAuth, getSeasonBySlug);
router.post('/', authenticate, isAdmin, createSeason);
router.put('/:seasonId', authenticate, isAdmin, updateSeason);
router.delete('/:seasonId', authenticate, isAdmin, deleteSeason);

export default router;
