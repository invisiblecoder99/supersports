import { Router } from 'express';
import { authenticate, isAdmin } from '../middleware/auth.js';
import { register, login, getProfile, updateProfile, getAllUsers, updateUserRole, deleteUser } from '../controllers/authController.js';

const router = Router();
router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.get('/users', authenticate, isAdmin, getAllUsers);
router.put('/users/:userId/role', authenticate, isAdmin, updateUserRole);
router.delete('/users/:userId', authenticate, isAdmin, deleteUser);

export default router;
