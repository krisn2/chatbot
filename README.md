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
