import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

// Initialize MongoDB connection
connectDB();

const app = express();

// Enable CORS for frontend clients (Vercel & local development)
app.use(cors());

// Body parser
app.use(express.json());

// Base status route
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    project: 'ApexMart MERN E-Commerce REST API',
    database: 'MongoDB',
    connectionState: mongoose.connection.readyState === 1 ? 'Connected' : 'Connecting / Disconnected',
    endpoints: {
      users: '/api/users',
      products: '/api/products',
      orders: '/api/orders',
    },
  });
});

// Mount modular API routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Fallback error middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

// Only bind to port if run directly (not serverless)
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 [ApexMart API] Express server running on http://127.0.0.1:${PORT}`);
  });
}

export default app;
