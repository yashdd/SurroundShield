// import express from "express";
// import { authenticateUser } from "./authMiddleware.js";

// const router = express.Router();

// // Apply authenticateUser middleware to all protected routes
// router.use(authenticateUser);

// // Example protected route
// router.get("/dashboard", (req, res) => {
//   res.json({ 
//     message: "Welcome to your dashboard",
//     user: req.session.user 
//   });
// });

// // Add more protected routes here...

// export {router as protectedRoutes};