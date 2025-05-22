# EvalTrack - Motivational Scorecard App

A web and mobile app for software developers, professionals, and individuals to track measurable progress, stay motivated, and build consistent habits using metrics, challenges, and gamification.

## Features Implemented

### Dashboard (Interactive Overview)
- Progress bars for key metrics
- Job application statistics
- Time-based charts
- Active challenges display

## Tech Stack

### Web MVP
- **Frontend**: React + TailwindCSS
- **Backend**: Node.js + Express
- **Database**: SQLite (local) → PostgreSQL (production)
- **ORM**: Prisma
- **Authentication**: JWT-based auth

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
2. Install server dependencies:
```bash
npm install
```

3. Install client dependencies:
```bash
cd app/client
npm install
```

4. Create a `.env` file in the root directory with the following content:
```
DATABASE_URL="file:./dev.db"
JWT_SECRET=your_jwt_secret_here
PORT=5000
CLIENT_URL=http://localhost:3000
```

5. Initialize the database:
```bash
npx prisma migrate dev --name init
```

### Running the Application

1. Start the backend server:
```bash
npm run dev
```

2. In a separate terminal, start the frontend:
```bash
cd app/client
npm start
```

3. Access the application at `http://localhost:3000`

## Project Structure

```
/app
├── /client            # React frontend
│   ├── /components    # Reusable UI components
│   ├── /pages         # Page components
│   ├── /styles        # CSS styles
│   ├── /context       # React context providers
│   └── /utils         # Utility functions
├── /server            # Node.js backend
│   ├── /routes        # API routes
│   ├── /controllers   # Route controllers (future)
│   ├── /models        # ORM models (Prisma)
│   └── /utils         # Utility functions
├── /prisma            # Prisma schema and migrations
├── /config            # Configuration files
└── README.md          # Project documentation
```

## Future Enhancements

- Job Tracker (Kanban-style board)
- Time-bound Challenges
- Interview Prep Logging
- Mobile App (React Native)
