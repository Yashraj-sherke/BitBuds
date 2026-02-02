import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import mongoose from 'mongoose';

import connectDB from './src/config/database.js';
import logger from './src/utils/logger.js';
import errorHandler, {
  notFoundHandler,
  unhandledRejectionHandler,
  uncaughtExceptionHandler,
} from './src/middleware/error.middleware.js';
import sanitizeMiddleware from './src/middleware/sanitize.middleware.js';

// Routes
import authRoutes from './src/routes/auth.routes.js';
import userRoutes from './src/routes/user.routes.js';
import missionRoutes from './src/routes/mission.routes.js';
import badgeRoutes from './src/routes/badge.routes.js';
import statsRoutes from './src/routes/stats.routes.js';
import codeProjectRoutes from './src/routes/codeProject.routes.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Trust proxy (important for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:5173',
      'http://localhost:3000',
    ];

    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser
app.use(cookieParser());

// Data sanitization against NoSQL injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(sanitizeMiddleware);

// Prevent HTTP Parameter Pollution
app.use(hpp());

// Compression middleware
app.use(compression());

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  next();
});

// API version prefix
const API_VERSION = process.env.API_VERSION || 'v1';

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// API routes
app.use(`/api/${API_VERSION}/auth`, authRoutes);
app.use(`/api/${API_VERSION}/users`, userRoutes);
app.use(`/api/${API_VERSION}/missions`, missionRoutes);
app.use(`/api/${API_VERSION}/badges`, badgeRoutes);
app.use(`/api/${API_VERSION}/stats`, statsRoutes);
app.use(`/api/${API_VERSION}/projects`, codeProjectRoutes);

// API documentation (if needed)
app.get(`/api/${API_VERSION}`, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'BitBuds API',
    version: API_VERSION,
    documentation: `/api/${API_VERSION}/docs`,
  });
});

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// Handle unhandled rejections and uncaught exceptions
unhandledRejectionHandler();
uncaughtExceptionHandler();

// Server configuration
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Start listening
    const server = app.listen(PORT, () => {
      logger.info(`Server running in ${NODE_ENV} mode on port ${PORT}`);
      logger.info(`Health check: http://localhost:${PORT}/health`);
      logger.info(`API endpoint: http://localhost:${PORT}/api/${API_VERSION}`);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal) => {
      logger.info(`${signal} received, starting graceful shutdown`);

      server.close(async () => {
        logger.info('HTTP server closed');

        // Close database connection
        try {
          await mongoose.connection.close();
          logger.info('Database connection closed');
          process.exit(0);
        } catch (error) {
          logger.error('Error during graceful shutdown:', error);
          process.exit(1);
        }
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    // Listen for termination signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

export default app;
