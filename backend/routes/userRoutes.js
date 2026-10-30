import express from 'express';
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes (supports both with and without trailing slash)
router.post('/login', authUser);
router.post('/login/', authUser);

router.post('/register', registerUser);
router.post('/register/', registerUser);

// User profile routes
router.get('/profile', protect, getUserProfile);
router.get('/profile/', protect, getUserProfile);

router.put('/profile/update', protect, updateUserProfile);
router.put('/profile/update/', protect, updateUserProfile);

// Admin-only user management
router.get('/', protect, admin, getUsers);

router.get('/:id', protect, admin, getUserById);
router.get('/:id/', protect, admin, getUserById);

router.put('/:id/update', protect, admin, updateUser);
router.put('/:id/update/', protect, admin, updateUser);

router.delete('/:id/delete', protect, admin, deleteUser);
router.delete('/:id/delete/', protect, admin, deleteUser);

export default router;
