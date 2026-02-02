# Quick Start Guide

## ✅ Completed Setup

The BitBuds backend has been successfully configured with:

- ✅ Server entry point (`server.js`)
- ✅ All dependencies installed
- ✅ Environment file created (`.env`)
- ✅ Authentication routes (register, login, logout, refresh token)
- ✅ User management routes (CRUD operations)
- ✅ Security middleware (CORS, Helmet, Rate limiting, XSS protection)
- ✅ Error handling and logging
- ✅ JWT authentication system

## 🚀 Next Steps

### 1. Install MongoDB

You need MongoDB to run the backend. Choose one option:

#### Option A: Install MongoDB Locally (Recommended for Development)

**Windows:**
1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Run the installer (choose "Complete" installation)
3. Install MongoDB as a Windows Service (recommended)
4. MongoDB will start automatically

**Verify installation:**
```powershell
mongod --version
```

#### Option B: Use MongoDB Atlas (Cloud - Free Tier Available)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster (select free tier)
4. Create a database user
5. Whitelist your IP address (or use 0.0.0.0/0 for testing)
6. Get your connection string
7. Update `.env` file with your connection string:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bitbuds?retryWrites=true&w=majority
```

### 2. Update JWT Secrets

⚠️ **Important**: Change the JWT secrets in `.env` to secure values:

```env
JWT_ACCESS_SECRET=your-very-secure-random-string-at-least-32-characters-long
JWT_REFRESH_SECRET=another-different-very-secure-random-string-at-least-32-characters
```

You can generate secure secrets using:
```powershell
# Generate random base64 string
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

### 3. Start the Server

#### Development Mode (with auto-reload):
```bash
npm run dev
```

#### Production Mode:
```bash
npm start
```

### 4. Test the API

Once the server is running, test these endpoints:

**Health Check:**
```bash
curl http://localhost:5000/health
```

**Register a new user:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@#",
    "firstName": "Test",
    "lastName": "User"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@#"
  }'
```

### 5. API Documentation

Access the API endpoints at:
- **Base URL**: `http://localhost:5000/api/v1`
- **Health Check**: `http://localhost:5000/health`

Available endpoints:
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout (requires Bearer token)
- `GET /api/v1/auth/me` - Get current user (requires Bearer token)
- `GET /api/v1/users` - Get all users (Admin only, requires Bearer token)
- `GET /api/v1/users/:id` - Get user by ID (requires Bearer token)
- `PATCH /api/v1/users/:id` - Update user (requires Bearer token)
- `DELETE /api/v1/users/:id` - Delete user (Admin only, requires Bearer token)

## 🔧 Configuration

### Environment Variables

Key variables in `.env`:

```env
# Server
NODE_ENV=development
PORT=5000

# Database (update this with your MongoDB connection)
MONGODB_URI=mongodb://localhost:27017/bitbuds

# JWT Secrets (MUST CHANGE THESE!)
JWT_ACCESS_SECRET=your-secure-secret-here
JWT_REFRESH_SECRET=your-secure-secret-here

# CORS (update with your frontend URL)
CORS_ORIGIN=http://localhost:5173
```

## 📝 Development Workflow

1. **Make changes** to your code
2. **Server auto-restarts** (if using `npm run dev`)
3. **Check logs** in `logs/` directory
4. **Run linter**: `npm run lint`
5. **Format code**: `npm run format`

## 🐛 Troubleshooting

### MongoDB not connecting?
- Ensure MongoDB is running: `net start MongoDB` (Windows)
- Check connection string in `.env`
- Verify MongoDB is listening on port 27017

### Port 5000 already in use?
- Change `PORT=5001` in `.env`
- Or kill the process using port 5000

### JWT errors?
- Make sure you've set JWT secrets in `.env`
- Check token format: `Authorization: Bearer <your-token>`

## 📚 Additional Resources

- Full documentation: See `README.md`
- API testing: Use Postman or Thunder Client
- MongoDB GUI: MongoDB Compass (comes with MongoDB installation)

## 🎉 You're Ready!

Once MongoDB is installed and running, execute:

```bash
npm run dev
```

Your backend will be available at `http://localhost:5000`

Happy coding! 🚀
