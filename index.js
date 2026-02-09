import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import connectDB from './config/db.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5003;

// 1. CORS CONFIGURATION
// Ensure this matches your Vite port (usually 5173 or 5174)
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"], 
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// 2. HEALTH CHECK ROUTE
// Useful to verify the server is actually running
app.get("/", (req, res) => {
    res.send("Virtual Assistant API is running...");
});

// 3. ROUTES
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// 4. GLOBAL ERROR HANDLER
// This prevents the server from leaking sensitive stack traces
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: "An internal server error occurred",
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// 5. STARTUP LOGIC
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("Failed to connect to DB", err);
    process.exit(1); // Exit if DB connection fails
  });