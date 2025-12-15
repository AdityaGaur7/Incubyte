# Sweet Shop Management System

A full-stack application for managing a sweet shop, built with the MERN stack (MongoDB, Express, React, Node.js).

## Features
- **User Authentication**: Secure login and registration using JWT.
- **Browse and Search**: Filter sweets by category, price range, and search by name.
- **Premium UI**: Modern, responsive design with glassmorphism effects and smooth animations.
- **Purchase System**: Real-time stock updates and purchase functionality.
- **Admin Dashboard**: 
    - Add, Edit, Delete sweets.
    - Restock inventory.
    - Image URL support with live previews.
    - Visual management table with thumbnails.

## Setup Instructions

### Backend
1.  Navigate to `backend` directory.
2.  Install dependencies: `npm install`
3.  Create `.env` file with:
    ```
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/sweetshop
    JWT_SECRET=your_secret_key
    ```
4.  Start server: `npm run dev`
5.  Run tests: `npm test`

### Frontend
1.  Navigate to `frontend` directory.
2.  Install dependencies: `npm install`
3.  Start dev server: `npm run dev`

## My AI Usage
I used an AI assistant (Google DeepMind's Antigravity) to co-author this project.

-   **Brainstorming**: The AI helped outline the project structure and task list.
-   **Boilerplate**: Generated initial Express server setup and React component structures.
-   **Testing**: Wrote Jest/Supertest test cases for TDD.
-   **Debugging**: Assisted in resolving gitignore issues and connecting frontend to backend.

The AI significantly accelerated the development process by handling repetitive tasks and providing instant feedback on code structure.
# Incubyte
