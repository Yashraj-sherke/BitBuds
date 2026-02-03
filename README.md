<<<<<<< HEAD
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
=======
# 🌟 BitBuds – Kids Coding Platform (Prototype)

> A playful step toward teaching programming to young minds.

---

## 🎯 Project Vision: Why BitBuds?

In a world where technology is evolving rapidly, understanding the basics of coding is no longer optional—it's essential. But most coding platforms are built for adults or teens, leaving younger children behind.

**BitBuds** is our vision to fix that. It’s a fun, colorful, and interactive platform designed to introduce kids aged **6–14** to **coding fundamentals** in a way that feels like play.

---

## 💡 The Thought Behind BitBuds

We started with a simple idea:  
> _"What if kids could learn programming the same way they play games?"_

Most platforms like Scratch, Code.org, or Tynker are helpful but:
- Lack a truly **gamified** experience
- Are often too **open-ended** or **complex**
- Don’t provide structured **progress tracking**

So we designed **BitBuds**: A platform that teaches through **missions**, **badges**, **visual challenges**, and **guided learning paths**—backed by a strong design for **young kids**.

---

## 🎯 Purpose of This Prototype

This prototype is the **first step** in building the larger vision.  
It helps us:
- Validate the idea of gamified learning
- Experiment with design and flow
- Set up the structure for further development

🔨 This is not a full product—it's a **simple working model** that showcases the concept.

---

## 😕 The Problem We’re Solving

| Problem | Our Solution |
|--------|---------------|
| Platforms are too complex for young kids | Simple UI, large buttons, playful visuals |
| Kids lose interest quickly | Badges, rewards, levels, and progress |
| Lack of structured learning | Roadmaps with logic, loops, conditionals, and more |
| Parents/Teachers don’t know where to start | Future parental dashboards & educator tools |
| Costly learning tools | Built with open-source stack to keep it affordable |

---

## 🛠️ Development Challenges

| Challenge | What We Did |
|----------|-------------|
| Designing for kids | Used bold colors, minimal text, fun UI |
| Avoiding tech overload | Chose React + Vite + Tailwind for speed and simplicity |
| Backend costs | Switched from Firebase to **Supabase** |
| Limited time/resources | Focused on essential MVP features only |

---

## 🧱 Tech Stack

| Layer | Tech |
|------|------|
| Frontend | React.js + Vite |
| Styling | Tailwind CSS |
| Auth/DB | Supabase |
| Version Control | Git + GitHub |
| IDE | VS Code |

---

## 🔭 Future Scope

**BitBuds** is built to grow. Here’s what we plan next:

- 🧠 AI coding assistant for in-app help  
- 🎓 Learning paths from basics to real coding  
- 📊 Parental dashboard with usage stats  
- 🌍 Multilingual support (Hindi, English, more)  
- 🧑‍🏫 School accounts & teacher portal  
- 🎮 Real-time games, animations, coding quests

---

## 📌 Current Status

BitBuds is currently in the **early prototype phase**.  
✅ UI structure in place  
✅ Navigation between sections (login, badges, settings)  
🕒 Next: Add Supabase Auth + Firestore DB for real-time learning tracking









---



>>>>>>> 8ccaeef89bf98a72f1240eeb19896616c7db069c
