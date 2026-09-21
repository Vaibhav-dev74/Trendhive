import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  getOrders,
  getMyOrders,
} from '../controllers/orderController.js';

const router = express.Router();

router.get('/', protect, admin, getOrders);
router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/pay', protect, updateOrderToPaid);

export default router;
