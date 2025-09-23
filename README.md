# Full-Stack Chatbot Application

## Brief Architecture/Design Explanation

This application is a **full-stack chatbot** with a separation between the **frontend** (client-side) and **backend** (server-side).

### Backend

The backend is built with **Node.js** and the **Express.js** framework. It uses **MongoDB** as a database, connected via **Mongoose**. The backend handles:

- **Authentication**: User registration, login, and logout using JWT (JSON Web Tokens). It uses `bcrypt` for password hashing and `jsonwebtoken` for creating and verifying tokens.

- **API Routes**: The routes are structured to manage `auth`, `projects`, `agents`, and `chat`.

- **Middleware**: It includes middleware for authentication (`auth.js`) and validation using `zod`.

- **Chat Logic**: When a user sends a message, the backend retrieves the agent's system prompt and examples, and then sends the user's message and the conversation history to the **Groq API** for a response. The model used is `'openai/gpt-oss-20b'`. The conversation is then saved to the database.

### Frontend

The frontend is a single-page application built with **React** and bundled with **Vite**. It uses:

- **State Management**: **Recoil** is used for state management, specifically to handle the user's state across the application.

- **Routing**: **React Router DOM** is used for client-side navigation between pages like login, projects, and chat.

- **Styling**: **Tailwind CSS** is used for styling the components.

- **API Calls**: **Axios** is used to make API requests to the backend.

## Instructions to Run the Application

To run the application, you need to set up both the backend and frontend.

### 1. Backend Setup

1. Navigate to the `backend` directory.

2. Install dependencies by running `npm install`.

3. Create a `.env` file in the `backend` directory based on the `.env.example` file. You'll need to provide values for `MONGO_URI` (MongoDB connection string), `JWT_SECRET`, and a `GROQ_API` key.

4. Start the backend server by running `npm start`.

### 2. Frontend Setup

1. Navigate to the `frontend` directory.

2. Install dependencies by running `npm install`.

3. Start the frontend development server by running `npm run dev`. The application should now be accessible in your browser at the specified local URL (e.g., `http://localhost:5173`).

## Prerequisites

- Node.js installed on your system
- MongoDB database (local or cloud-based like MongoDB Atlas)
- Groq API key

## Environment Variables

Make sure to set up the following environment variables in your `.env` file:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GROQ_API=your_groq_api_key
```
