import express from "express";
import cors from "cors";
import session from 'express-session';
import MongoStore from "connect-mongo";
import dotenv from "dotenv";
import constructorMethod from "./routes/index.js";
import { userRoutes } from "./routes/users.js"; // ✅ Correct Import
import cookieParser from "cookie-parser";
import {logoutRoutes} from "./routes/logout.js"; // ✅ Correct Import
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

// Session setup with MongoDB storage
app.use(session({
    secret: process.env.SESSION_SECRET || 'abcd123',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/users",
        collectionName: "sessions"
    }),
    cookie: {
      maxAge: 30 * 60 * 1000, // 30 minutes
      httpOnly: true
    }
}));

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:57950', // Your frontend URL
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Debugging session storage
app.use((req, res, next) => {
    console.log("Current Session:", req.session);
    next();
});

// Routes setup
app.use("/users", userRoutes);
app.use('/logout', logoutRoutes);

constructorMethod(app); 

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
