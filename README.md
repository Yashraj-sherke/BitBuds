<div align="center">
  <img src="./logo.png" alt="BitBuds Logo" width="120" />
</div>

# BitBuds 🚀
**A gamified coding platform introducing kids (6–14) to programming fundamentals.**

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-MongoDB-brightgreen.svg)](https://mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Backend CI](https://github.com/Yashraj-sherke/BitBuds/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/Yashraj-sherke/BitBuds/actions/workflows/backend-ci.yml)

[**Live Demo 🚀**](https://bit-buds.vercel.app)

## 📸 Screenshots

<img width="1366" height="768" alt="Copy of Improve Website Cart Design" src="https://github.com/user-attachments/assets/17860c3c-6ffb-4d7f-a4ae-4667167b6a46" />




## 🎯 Overview
BitBuds solves the problem of high barrier-to-entry in kids' coding education by wrapping computer science concepts in a gamified, reward-based experience. Unlike open-ended sandbox tools, it provides structured learning paths using missions, badges, and automated progression tracking to keep younger users engaged while learning logic and loops.

## ✨ Features

**Engineering & Architecture**
- **JWT Authentication Flow:** Secure stateless session management with bcrypt password hashing.
- **Automated Eligibility Engine:** Backend service that evaluates user state against prerequisite graphs before unlocking new missions or badges.
- **Modular API Design:** Separation of concerns across controllers, services, and Mongoose models, with Joi-based request validation.

**Core Functionality (User-Facing)**
- **Interactive Dashboard:** Real-time progress tracking, streak calculation, and XP rendering.
- **Mission System:** Sequential coding challenges with automatic level progression.
- **Gamification Engine:** Four-tier rarity badge system (Common, Rare, Epic, Legendary).

## 🏗️ Architecture

```text
Client (React 18 + Vite) 
  │
  ├──► [ JWT Auth ] 
  │       │
  ▼       ▼
API Gateway (Express.js)
  │
  ├──► Controllers (Req/Res parsing, Joi Validation)
  │
  ├──► Services (Business logic: XP calc, Badge evaluation)
  │
  ▼
Data Layer (Mongoose)
  │
  ▼
MongoDB (User profiles, Missions, Badges, Progress state)
```

## 🛠️ Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Frontend** | React 18, TypeScript, Vite | Fast HMR, strict type checking for API contracts |
| **Styling** | Tailwind CSS, Lucide React | Rapid prototyping of playful, kid-friendly UI components |
| **Backend API** | Node.js, Express.js | Lightweight routing and middleware ecosystem |
| **Database** | MongoDB, Mongoose | Flexible document schema for evolving gamification rules |
| **Security/Auth** | JWT, bcrypt, CORS | Standard stateless token exchange, rate limiting, and password security |

## 🚀 Quick Start

**Prerequisites:** Node.js (v16+) and MongoDB (Local or Atlas URI).

```bash
# 1. Clone and setup the backend
cd backend
npm install
cp .env.example .env
# (Ensure your MongoDB URI and JWT_SECRET are set in .env)
npm run seed      # Seeds DB with initial missions and badges
npm run dev       # Starts backend on localhost:5000

# 2. Setup the frontend in a new terminal
cd ../Frontend
npm install
cp .env.example .env
npm run dev       # Starts frontend on localhost:5173
```

## 🔌 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/auth/register` | Creates a new user and returns JWT |
| `POST` | `/api/v1/auth/login` | Authenticates user and returns JWT |
| `GET` | `/api/v1/missions` | Returns all available missions |
| `POST` | `/api/v1/missions/:id/start`| Initializes progress tracking for a specific mission |
| `POST` | `/api/v1/missions/:id/submit`| Validates mission completion and calculates XP |
| `POST` | `/api/v1/badges/check-eligibility` | Evaluates user state and automatically awards earned badges |
| `GET` | `/api/v1/stats/me` | Returns user XP, level, and streak data |

## 🧠 Notable Engineering Decisions

- **Automated Seeding Strategy:** Included an `npm run seed` script to deterministically populate a fresh database with complex mission prerequisite graphs, ensuring developers can spin up a fully functional local environment in seconds.
- **Decoupled Badge Evaluation:** Badge awarding logic is separated into an eligibility endpoint (`/check-eligibility`) rather than being strictly hardcoded into mission completion logic, allowing for flexible evaluation criteria.
- **Client-Side Environment Separation:** Utilizing Vite's environment variable handling (`.env.production`) to seamlessly swap between local development APIs and production backend URLs without code changes.

## 🧪 Testing

The backend includes a comprehensive integration test suite verifying core security constraints:
- **Test Suite:** 6 fully functional integration tests covering signup, authentication, and cross-user authorization.
- **Coverage:** ~24% overall backend line coverage, including critical logic in auth controllers and models.
- **Tools used:** Jest, Supertest, and `mongodb-memory-server` for a realistic in-memory test database.

## 🗺️ Roadmap
- [ ] **AI Coding Assistant:** Implement contextual, read-only AI hints for kids when they are stuck on a mission.
- [ ] **Real-time Leaderboard:** Upgrade leaderboard from REST polling to real-time WebSockets.
- [ ] **Educator/Parent Portal:** Build a secondary dashboard for monitoring student/child progress.

## 📄 License & Contributing

Distributed under the MIT License. See `LICENSE` for more information.

Contributions, issues, and feature requests are welcome. Feel free to check the issues page.
