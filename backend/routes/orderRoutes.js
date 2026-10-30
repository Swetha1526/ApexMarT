import express from 'express';
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
  getAdminSummary,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Order placement & user orders
router.post('/add', protect, addOrderItems);
router.post('/add/', protect, addOrderItems);

router.get('/myorders', protect, getMyOrders);
router.get('/myorders/', protect, getMyOrders);

// Admin dashboard summary metrics
router.get('/summary', protect, admin, getAdminSummary);
router.get('/summary/', protect, admin, getAdminSummary);

// Admin list all orders
router.get('/', protect, admin, getOrders);

// Order details, pay, and deliver
router.get('/:id', protect, getOrderById);
router.get('/:id/', protect, getOrderById);

router.put('/:id/pay', protect, updateOrderToPaid);
router.put('/:id/pay/', protect, updateOrderToPaid);

router.put('/:id/deliver', protect, admin, updateOrderToDelivered);
router.put('/:id/deliver/', protect, admin, updateOrderToDelivered);

export default router;
