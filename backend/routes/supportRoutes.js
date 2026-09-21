// routes/supportRoutes.js
import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  createTicket,
  getMyTickets,
  getAllTickets,
  updateTicketStatus,
} from '../controllers/supportController.js';

const router = express.Router();

// Optional auth helper: attaches req.user if valid token provided, but doesn't block guests
const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      if (token && process.env.JWT_SECRET) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
      }
    } catch {
      // guest fallback
    }
  }
  next();
};

router.post('/', optionalAuth, createTicket);
router.get('/my-tickets', protect, getMyTickets);
router.get('/', protect, admin, getAllTickets);
router.put('/:id/status', protect, admin, updateTicketStatus);

export default router;

