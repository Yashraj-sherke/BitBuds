import mongoose from 'mongoose';
import logger from '../utils/logger.js';

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bitbuds';

  mongoose.set('strictQuery', true);

  await mongoose.connect(uri);
  logger.info('MongoDB connected', { host: mongoose.connection.host, db: mongoose.connection.name });
};

export default connectDB;
