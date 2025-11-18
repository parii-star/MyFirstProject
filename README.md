# Three Tier Application

A simple three-tier application with React frontend, Node.js backend, and PostgreSQL database.

## Setup

1. Start the database:
   ```bash
   docker-compose up -d
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   npm start
   ```

3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

Frontend will be on http://localhost:3000
Backend on http://localhost:5000