import express from "express";
import cors from "cors"; // Import CORS
import constructorMethod from "./routes/index.js";
import { userRoutes } from "./routes/users.js"; // Import user routes

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // Enable Cross-Origin Resource Sharing

// Routes setup
app.use("/api/users", userRoutes); // Mount user routes
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
