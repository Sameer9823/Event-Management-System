import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

// Initialize express app
const app = express()

// CORS configuration
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}));

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));

app.use(express.static("public"));

app.use(cookieParser());

// Import routes
import userRouter from './routes/auth.routes.js';

// Use the imported router for /api/v1/users
app.use('/api/v1/users', userRouter);

export {app}