# BitBuds - Kids Coding Platform

A gamified coding platform designed to teach children programming through interactive missions, badges, and projects.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your MongoDB URI and JWT secrets

5. Seed the database:
```bash
npm run seed
```

6. Start the development server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## 📁 Project Structure

```
BitBuds/
├── backend/
│   ├── src/
│   │   ├── models/          # Database models
│   │   ├── controllers/     # Route controllers
│   │   ├── services/        # Business logic
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Custom middleware
│   │   ├── validators/      # Input validation
│   │   ├── utils/           # Utility functions
│   │   └── config/          # Configuration files
│   ├── server.js            # Entry point
│   └── package.json
│
└── Frontend/
    ├── src/
    │   ├── components/      # React components
    │   ├── pages/           # Page components
    │   ├── contexts/        # React contexts
    │   ├── services/        # API services
    │   └── types/           # TypeScript types
    ├── public/              # Static assets
    └── package.json
```

## 🎯 Features

### Backend
- ✅ User authentication with JWT
- ✅ Mission system with prerequisites
- ✅ Badge system with automatic awarding
- ✅ XP and leveling system
- ✅ Progress tracking
- ✅ Leaderboard and rankings
- ✅ Streak tracking
- ✅ Code project management
- ✅ RESTful API architecture

### Frontend
- ✅ Modern React with TypeScript
- ✅ Responsive design
- ✅ User dashboard
- ✅ Mission browser
- ✅ Badge collection
- ✅ Code editor
- ✅ Real-time stats

## 🔐 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout user

### Missions
- `GET /api/v1/missions` - Get all missions
- `GET /api/v1/missions/my-missions` - Get user missions with progress
- `GET /api/v1/missions/:id` - Get mission by ID
- `POST /api/v1/missions/:id/start` - Start a mission
- `POST /api/v1/missions/:id/submit` - Submit mission

### Badges
- `GET /api/v1/badges` - Get all badges
- `GET /api/v1/badges/my-badges` - Get user badges
- `GET /api/v1/badges/available` - Get available badges
- `POST /api/v1/badges/check-eligibility` - Check and award badges

### Stats
- `GET /api/v1/stats/me` - Get user stats
- `GET /api/v1/stats/dashboard` - Get dashboard data
- `GET /api/v1/stats/leaderboard` - Get leaderboard
- `GET /api/v1/stats/rank` - Get user rank

### Projects
- `GET /api/v1/projects` - Get user projects
- `GET /api/v1/projects/public` - Get public projects
- `POST /api/v1/projects` - Create project
- `POST /api/v1/projects/:id/like` - Like project
- `POST /api/v1/projects/:id/fork` - Fork project

## 🛠️ Tech Stack

### Backend
- Node.js & Express.js
- MongoDB & Mongoose
- JWT for authentication
- Joi for validation
- Winston for logging

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Axios for API calls
- Lucide React for icons

## 🌐 Production Deployment

### Backend Deployment (Render/Railway/Heroku)

1. Set environment variables in your hosting platform
2. Update `CORS_ORIGIN` with your frontend URL
3. Deploy using:
```bash
npm start
```

### Frontend Deployment (Vercel/Netlify)

1. Update `.env.production` with your backend URL
2. Build the project:
```bash
npm run build
```
3. Deploy the `dist` folder

## 📊 Database Seeding

The project includes seed data for missions and badges:

```bash
npm run seed
```

This will create:
- 6 sample missions across different categories
- 7 badges with various criteria

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting
- CORS protection
- Input validation
- XSS protection
- MongoDB injection prevention

## 🎮 Gamification System

### XP & Levels
- Level calculation: `XP = 100 × level²`
- Performance bonuses up to 50% extra XP
- Automatic level progression

### Badges
- Automatic eligibility checking
- Multiple criteria types
- Rarity system (Common, Rare, Epic, Legendary)

### Streaks
- Daily activity tracking
- Longest streak records
- Streak-based achievements

## 📝 License

MIT License - feel free to use this project for learning purposes!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ for young coders everywhere! 🚀
