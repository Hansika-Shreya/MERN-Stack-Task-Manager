# Task Manager - MERN Stack Application

A full-stack Task Manager web application built with the MERN Stack.

## Tech Stack
- **Frontend:** React.js, Vite, React Router, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Authentication:** JWT (JSON Web Tokens), bcrypt

## Setup Instructions

### Backend
1. Clone the repository
2. Go to backend folder: `cd backend`
3. Install dependencies: `npm install`
4. Create `.env` file with:
5. Run server: `npm run dev`

### Frontend
1. Go to frontend folder: `cd frontend`
2. Install dependencies: `npm install`
3. Run app: `npm run dev`
4. Open: `http://localhost:5173`

## API Documentation

### Auth Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/signup | Register new user |
| POST | /api/auth/login | Login user |

### Task Routes (Protected - JWT Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/tasks | Get all tasks (filter/search/sort) |
| POST | /api/tasks | Create new task |
| GET | /api/tasks/stats/summary | Get task statistics |
| GET | /api/tasks/:id | Get single task |
| PUT | /api/tasks/:id | Update task |
| DELETE | /api/tasks/:id | Delete task |
| PATCH | /api/tasks/:id/toggle | Toggle completion |
| DELETE | /api/tasks/completed | Delete all completed tasks |