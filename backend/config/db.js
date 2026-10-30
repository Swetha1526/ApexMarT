import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/apexmart_db';
    const conn = await mongoose.connect(mongoUri);
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host} / database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`[MongoDB Connection Error] ${error.message}`);
    console.error('Make sure your MongoDB server is running locally or set MONGO_URI in backend/.env for MongoDB Atlas.');
    // In serverless environments, avoid process.exit so diagnostic routes can respond
    if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
      // Do not hard-exit immediately to let developers see logs clearly
    }
  }
};

export default connectDB;
