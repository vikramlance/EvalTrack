# 📄 Product Requirements Document (PRD) – Job Search Tracker App

## 🎯 Purpose
Build a highly engaging web and mobile application to help job seekers stay consistent, track their progress like a fitness tracker, and stay motivated using gamification, analytics, and habit loops.

---

## 1. ✅ Dashboard (Interactive Overview)

### Features
- **Progress bars** (auto-updated from backend data):
  - Total applications submitted
  - Interviews scheduled
  - Offers received
  - Weekly goal completion

- **Time-based charts**:
  - Daily, weekly, monthly summaries
  - Streak heatmaps (days applied)
  - Bar graphs (applications/day)
  - Funnel chart: Applied → Interview → Offer → Rejected

### Design Goals
- Visually engaging (progress rings, animations)
- Real-time updates via polling or websockets
- Mobile-first responsive design

---

## 2. 📋 Job Tracker (CRM-style)

### Features
- **Kanban Board**: 
  - Columns: `Applied` → `Interview` → `Offer` → `Rejected`
  - Drag & drop movement
  - Persistent state with server sync

- **Card Details for Each Job**:
  - Job title, company
  - Resume version used (dropdown)
  - Application URL
  - Contact name, email, LinkedIn
  - Notes

- **Add/Edit/Delete Jobs**
- **Filtering**: By company, stage, tags

---

## 3. 🥅 Goal & Challenge Tracker

### Features
- **Weekly Goals** (user-defined):
  - Examples: “Apply to 7 jobs”, “2 mock interviews”

- **Time-bound Challenges**:
  - Examples: “30-day Interview Sprint”, “10 apps in 5 days”
  - Countdown timer
  - Track progress in real time

- **Visual Timers & Rings**:
  - Pomodoro-style widgets for daily efforts
  - Show % completion of weekly goal

---

## 4. 📚 Interview & Tech Prep Logging

### Features
- **Log Preparation Activities**:
  - DSA Practice
  - System Design
  - Mock Interviews
  - Leetcode problems

- **Fields**:
  - Type (select)
  - Date
  - Self-rating (1–5 stars)
  - Notes & takeaways

- **Trend Charts**:
  - Time spent per week on prep
  - Number of sessions
  - Ratings over time

---

## 5. 🔔 Reminders & Notifications

### Types
- **Daily Nudge**: "You haven’t applied to any job today"
- **Weekly Summary Email**:
  - “You applied to 12 jobs. Keep the streak!”
  - “3 interviews scheduled this week!”

- **Push Notifications (Mobile)**:
  - Reminders for challenges
  - Prep goal incomplete
  - Motivational nudges

---

## 6. 📥 Data Entry & Integration

### Manual Data Entry Options
- **Form-Based Entry**:
  - Dedicated forms for each data type (job applications, interviews, prep activities)
  - Quick-add buttons on dashboard for common actions
  - Batch entry for multiple applications at once

- **Calendar Integration**:
  - Log activities directly on a calendar interface
  - Schedule prep activities and interview sessions
  - Track time spent on different job search activities

- **Voice Input**:
  - Voice commands for quick logging ("Applied to Google today")
  - Natural language processing to extract key details
  - Hands-free logging while on the go

### External Data Integration
- **Job Board APIs**:
  - Connect with LinkedIn, Indeed, Glassdoor, and ZipRecruiter APIs
  - Auto-import applications submitted through these platforms
  - Track application status updates automatically

- **Email Parsing**:
  - Scan user's email (with permission) for job-related messages
  - Automatically detect application confirmations and interview invites
  - Extract key information like company, position, and dates

- **ATS Integration**:
  - Connect with Applicant Tracking Systems like Workday, Lever, Greenhouse
  - Import application status updates in real-time
  - Reduce duplicate data entry for candidates

- **Calendar Sync**:
  - Integrate with Google Calendar, Outlook, or Apple Calendar
  - Auto-detect interview appointments and prep sessions
  - Two-way sync to update both systems

- **Browser Extension**:
  - Browser plugin that detects when users apply on job sites
  - One-click logging of applications while browsing
  - Capture job details automatically from the webpage

### Mobile-Friendly Options
- **Mobile App Features**:
  - Camera scanning of business cards from networking events
  - QR code scanning at job fairs to log connections
  - Location-based reminders for networking events

- **Offline Capabilities**:
  - Data entry without internet connection
  - Sync when connection is restored
  - Log activities anywhere

### AI-Assisted Data Entry
- **Smart Suggestions**:
  - Analyze past applications to suggest similar jobs
  - Pre-fill forms based on previous entries
  - Recommend prep activities based on upcoming interviews

- **Data Extraction**:
  - Upload resume/CV to pre-populate skills and experience
  - Scan job descriptions to extract key requirements
  - Match user skills to job requirements automatically

---

## 🔧 Tech Stack Suggestions

| Layer              | Tool                             |
|--------------------|----------------------------------|
| Frontend (Web)     | React + Tailwind CSS             |
| Frontend (Mobile)  | React Native / Expo              |
| Backend            | Node.js (Express or Fastify)     |
| Database           | PostgreSQL (SQLite for dev)      |
| Auth               | Auth0 / Firebase / Supabase      |
| Charts             | Recharts / Chart.js              |
| Hosting            | Vercel (Web), Railway / Fly.io   |
| Notifications      | OneSignal / Firebase Messaging   |
| Deployment         | Docker, GitHub Actions CI/CD     |
