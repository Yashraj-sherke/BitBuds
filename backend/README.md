# BitBuds Backend API

Production-ready Node.js backend for the BitBuds platform built with Express, MongoDB, and JWT authentication.

## Features

- 🔐 JWT-based authentication with access and refresh tokens
- 👥 User management system with role-based access control
- 🛡️ Security middleware (Helmet, CORS, Rate limiting, XSS protection)
- 📝 Request validation with Joi
- 🗄️ MongoDB with Mongoose ODM
- 📊 Winston logging with daily file rotation
- ⚡ Redis caching support (optional)
- 🚀 PM2 ecosystem configuration for production
- 🔄 Graceful shutdown handling

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- MongoDB (local or remote)
- Redis (optional, for caching)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your configuration
```

3. Configure your `.env` file with appropriate values:
```env
# Application
NODE_ENV=development
PORT=5000
API_VERSION=v1

# Database
MONGODB_URI=mongodb://localhost:27017/bitbuds

# JWT Configuration
JWT_ACCESS_SECRET=your-super-secret-access-token-key
JWT_REFRESH_SECRET=your-super-secret-refresh-token-key
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

## Running the Application

### Development Mode

```bash
# Start with nodemon (auto-reload)
npm run dev
```

### Production Mode

```bash
# Start in production mode
npm run prod

# Or use PM2 for process management
pm2 start ecosystem.config.js
```

### Regular Start

```bash
npm start
```

## API Endpoints

### Health Check
- `GET /health` - Server health check

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout user (requires auth)
- `POST /api/v1/auth/logout-all` - Logout from all devices (requires auth)
- `GET /api/v1/auth/me` - Get current user (requires auth)

### Users
- `GET /api/v1/users` - Get all users (Admin only)
- `GET /api/v1/users/:id` - Get user by ID (requires auth)
- `PATCH /api/v1/users/:id` - Update user (requires auth)
- `DELETE /api/v1/users/:id` - Delete user (Admin only)

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files (database, redis)
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── services/        # Business logic layer
│   ├── utils/           # Utility functions
│   └── validators/      # Request validation schemas
├── logs/                # Application logs (auto-generated)
├── .env                 # Environment variables
├── .env.example         # Example environment file
├── server.js            # Application entry point
├── ecosystem.config.js  # PM2 configuration
└── package.json
```

## Security Features

- **Helmet**: Sets various HTTP headers for security
- **CORS**: Configurable Cross-Origin Resource Sharing
- **Rate Limiting**: Prevents brute force attacks
- **MongoDB Sanitization**: Prevents NoSQL injection
- **XSS Protection**: Sanitizes user input
- **HPP**: Prevents HTTP Parameter Pollution
- **JWT**: Secure token-based authentication
- **Bcrypt**: Password hashing with configurable rounds

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment mode | development |
| PORT | Server port | 5000 |
| API_VERSION | API version prefix | v1 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/bitbuds |
| JWT_ACCESS_SECRET | JWT access token secret | - |
| JWT_REFRESH_SECRET | JWT refresh token secret | - |
| JWT_ACCESS_EXPIRATION | Access token expiration | 15m |
| JWT_REFRESH_EXPIRATION | Refresh token expiration | 7d |
| CORS_ORIGIN | Primary CORS origin | http://localhost:5173 |
| ALLOWED_ORIGINS | Comma-separated allowed origins | - |
| RATE_LIMIT_WINDOW_MS | Rate limit window (ms) | 900000 |
| RATE_LIMIT_MAX_REQUESTS | Max requests per window | 100 |
| BCRYPT_ROUNDS | Bcrypt hashing rounds | 10 |
| FRONTEND_URL | Frontend application URL | http://localhost:5173 |
| LOG_LEVEL | Logging level | debug |
| ENABLE_REDIS | Enable Redis caching | false |
| REDIS_HOST | Redis host | localhost |
| REDIS_PORT | Redis port | 6379 |

## MongoDB Setup

### Local MongoDB

1. Install MongoDB Community Edition from [mongodb.com](https://www.mongodb.com/try/download/community)

2. Start MongoDB:
```bash
# Windows (as service)
net start MongoDB

# macOS (with Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get your connection string
4. Update `MONGODB_URI` in `.env` file

## Logging

Logs are automatically generated in the `logs/` directory:
- `combined.log` - All logs
- `error.log` - Error logs only
- Logs rotate daily and are kept for 14 days

## Development

### Code Style

```bash
# Run ESLint
npm run lint

# Fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format
```

## Production Deployment

1. Set `NODE_ENV=production` in your environment
2. Use strong, unique secrets for JWT tokens
3. Configure proper CORS origins
4. Use MongoDB with authentication enabled
5. Consider using Redis for caching
6. Use PM2 for process management
7. Set up proper logging and monitoring
8. Use HTTPS in production

### PM2 Deployment

```bash
# Start with PM2
pm2 start ecosystem.config.js --env production

# Monitor
pm2 monit

# View logs
pm2 logs

# Restart
pm2 restart bitbuds-api

# Stop
pm2 stop bitbuds-api
```

## Troubleshooting

### MongoDB Connection Issues

**Error**: `MongoDB connection error: connect ECONNREFUSED 127.0.0.1:27017`

**Solution**: 
- Ensure MongoDB is running
- Check if the connection string in `.env` is correct
- Verify MongoDB is listening on the correct port

### Port Already in Use

**Error**: `EADDRINUSE: address already in use :::5000`

**Solution**:
- Change the `PORT` in `.env` to a different value
- Or kill the process using the port:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

### JWT Token Issues

**Error**: `JsonWebTokenError: invalid token`

**Solution**:
- Ensure the JWT secrets in `.env` are set
- Make sure tokens haven't expired
- Verify the token is being sent with the correct format: `Bearer <token>`

## License

MIT

## Support

For issues or questions, please create an issue in the GitHub repository.
