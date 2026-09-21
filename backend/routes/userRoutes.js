import express from 'express';
import { 
    registerUser, 
    loginUser, 
    adminLoginUser,
    getUserProfile, 
    updateUserProfile 
} from '../controllers/userController.js';

import { protect, admin } from '../middleware/authMiddleware.js';
import User from '../models/user.js';  // ✅ ADD THIS IMPORT

const router = express.Router();

// ✅ Public Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/admin-login', adminLoginUser);

// ✅ Protected User Routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// ✅ Admin-Only Routes (Example)
router.get('/admin/users', protect, admin, async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users' });
    }
});

export default router;
