import express from "express";
import cors from "cors"; // Import CORS
import session from 'express-session';
import constructorMethod from "./routes/index.js";
import { userRoutes } from "./routes/users.js"; // Import user routes

const app = express();
const PORT = process.env.PORT || 3000;

app.use(session({
    secret: 'abcd123', // Change this!
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 60 * 1000, // 30 minutes
      httpOnly: true
    }
  }));
// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:3000', // Your frontend URL
    credentials: true
  }));
// Routes setup
app.use("/api/users", userRoutes); // Mount user routes
// app.use("/api", protectedRoutes);
constructorMethod(app); // Other routes


// Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
