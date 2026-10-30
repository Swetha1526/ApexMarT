import express from 'express';
import {
  getProducts,
  getCategories,
  getTopProducts,
  getProductById,
  createProductReview,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Catalog & Public routes
router.get('/', getProducts);

router.get('/categories', getCategories);
router.get('/categories/', getCategories);

router.get('/top', getTopProducts);
router.get('/top/', getTopProducts);

// Admin product creation
router.post('/create', protect, admin, createProduct);
router.post('/create/', protect, admin, createProduct);

// Product detail, review, and admin edits
router.get('/:id', getProductById);
router.get('/:id/', getProductById);

router.post('/:id/reviews', protect, createProductReview);
router.post('/:id/reviews/', protect, createProductReview);

router.put('/:id/update', protect, admin, updateProduct);
router.put('/:id/update/', protect, admin, updateProduct);

router.delete('/:id/delete', protect, admin, deleteProduct);
router.delete('/:id/delete/', protect, admin, deleteProduct);

export default router;
