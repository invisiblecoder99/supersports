import { Router } from 'express';
import { authenticate, isAdmin } from '../middleware/auth.js';
import { getAllPlans, getSeasonPlans, createPlan, updatePlan, deletePlan, getAllPlansAdmin } from '../controllers/planController.js';

const router = Router();
router.get('/', getAllPlans);
router.get('/admin/all', authenticate, isAdmin, getAllPlansAdmin);
router.get('/season/:seasonId', getSeasonPlans);
router.post('/', authenticate, isAdmin, createPlan);
router.put('/:planId', authenticate, isAdmin, updatePlan);
router.delete('/:planId', authenticate, isAdmin, deletePlan);

export default router;
