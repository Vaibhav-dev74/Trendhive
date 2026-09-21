import express from 'express';
import { protect, admin, adminOrShopkeeper } from '../middleware/authMiddleware.js';
import {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  getOrders,
  getMyOrders,
  trackOrder,
  updateOrderStatus,
} from '../controllers/orderController.js';

const router = express.Router();

router.get('/', protect, admin, getOrders);
router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/track/:identifier', trackOrder); // Public tracking by Order ID or Tracking Number
router.get('/:id', protect, getOrderById);
router.put('/:id/pay', protect, updateOrderToPaid);
router.put('/:id/status', protect, adminOrShopkeeper, updateOrderStatus);

export default router;
