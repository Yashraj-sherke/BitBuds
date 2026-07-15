import http from 'http';
import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { Server } from 'socket.io';

import connectDB from './src/config/database.js';
import connectRedis from './src/config/redis.js';
import logger from './src/utils/logger.js';
import errorHandler, { notFoundHandler } from './src/middleware/error.middleware.js';
import initSocket from './src/socket/connection.js';

import authRoutes, { userRouter } from './src/routes/auth.routes.js';
import missionRoutes from './src/routes/mission.routes.js';
import statsRoutes, { badgeRouter } from './src/routes/stats.routes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const API_VERSION = process.env.API_VERSION || 'v1';
const PORT = process.env.PORT || 5000;

const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:3000').split(',');

app.set('trust proxy', 1);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin.trim())) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(helmet());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`, { ip: req.ip });
  next();
});

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

app.set('io', io);
initSocket(io);

app.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

app.use(`/api/${API_VERSION}/auth`, authRoutes);
app.use(`/api/${API_VERSION}/users`, userRouter);
app.use(`/api/${API_VERSION}/missions`, missionRoutes);
app.use(`/api/${API_VERSION}/stats`, statsRoutes);
app.use(`/api/${API_VERSION}/badges`, badgeRouter);

app.get(`/api/${API_VERSION}`, (_req, res) => {
  res.json({ success: true, message: 'BitBuds API', version: API_VERSION });
});

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();

    server.listen(PORT, () => {
      logger.info(`BitBuds API running on port ${PORT}`, {
        health: `http://localhost:${PORT}/health`,
        api: `http://localhost:${PORT}/api/${API_VERSION}`,
      });
    });

    const shutdown = async (signal) => {
      logger.info(`${signal} received — shutting down`);
      server.close(async () => {
        await mongoose.connection.close();
        process.exit(0);
      });
      setTimeout(() => process.exit(1), 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (err) {
    logger.error('Failed to start server', { error: err.message });
    process.exit(1);
  }
};

startServer();

export default app;
