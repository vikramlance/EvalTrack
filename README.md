
# 🏆 Motivational Scorecard App

**A web and mobile app** for software developers, professionals, and individuals to track measurable progress, stay motivated, and build consistent habits using metrics, challenges, and gamification.

---

## 📌 Key Features

### 🧠 Personal Metrics Dashboard
- Custom KPIs: job applications, interview prep hours, coding sessions, learning, baby nurturing tasks, etc.
- Daily, weekly, monthly views
- Progress bars and streak counters

### 🎯 Time-Bound Challenges
- Create and track personal or shared challenges
- Countdown timers for active challenges
- Completion medals, badges, and stats

### 📊 Analytics & Visualization
- Line, bar, and pie charts
- Radar charts to map skill distribution
- GitHub-style heatmaps for daily activity

### 🏅 Gamification Engine
- XP points, level-up system
- Achievement badges and milestones
- Personal and team leaderboards

### 🔔 Reminders & Notifications
- Daily check-ins
- Missed goal alerts
- Weekly summary reports

### 🔐 Authentication & Profiles
- Email/password login
- Goal settings and personal profile
- OAuth support (planned)

### 🌱 Growth Reflection Logs
- Weekly reflection prompts
- Notes and journaling for mindset & habits

---

## 🏗️ Tech Stack

### ✅ Web MVP
- **Frontend**: React + TailwindCSS
- **Backend**: Node.js + Express
- **Database**: SQLite (local) → PostgreSQL (production)
- **ORM**: Prisma
- **Authentication**: JWT-based auth

### 📱 Mobile App (Phase 2)
- React Native (Expo)
- Shared API with web version
- Push notification support

---

## 📂 Folder Structure

```
/app
├── /client            # React frontend
│   ├── /components
│   ├── /pages
│   └── /styles
├── /server            # Node.js backend
│   ├── /routes
│   ├── /controllers
│   ├── /models        # ORM models (Prisma)
│   └── /utils
├── /prisma            # Schema and migrations
├── /config            # DB and env setup
├── README.md
└── package.json
```

---

## 🔧 Local Setup

1. **Clone the repo**
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Initialize database with SQLite**
   ```bash
   npx prisma migrate dev --name init
   ```
4. **Start the backend**
   ```bash
   npm run dev
   ```
5. **Start frontend (from `client/`)**
   ```bash
   cd client
   npm install
   npm start
   ```

---

## 🧩 Future Enhancements

- Google/GitHub OAuth login
- Social features (follows, comments)
- AI-based goal recommendations
- Mobile app notifications
- Team & cohort challenges

---

## 📈 Vision

Help individuals stay consistently motivated in personal growth, job search, learning, and life goals through measurable tracking, social accountability, and game-like feedback loops.
