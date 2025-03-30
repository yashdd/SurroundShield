import express from "express";
import bcrypt from "bcrypt";
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { createUser, getUser, updateUser, deleteUser, getUserByEmail } from "../data/users.js";
import { users } from "../config/mongoCollections.js";
import axios from "axios";

import jwt from "jsonwebtoken";


const router = express.Router();



router.route("/").post(async (req, res) => {
    try {
        const { name, email, password, age, height, weight, bmi, lat, lon } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await createUser(name, email, hashedPassword, age, height, weight, bmi, lat, lon);
        // console.log(req.body);

        return res.status(201).json(user);
    } catch (e) {
        console.log(e);
        return res.status(400).json({ error: e});
    }
});

router.route("/:id").get(async (req, res) => {
    try {
        const user = await getUser(req.params.id);
        return res.status(200).json(user);
    } catch (e) {
        return res.status(404).json({ error: e });
    }
}).put(async (req, res) => {
    try {
        const { name, age, height, weight, bmi, lat, lon } = req.body;
        const user = await updateUser(req.params.id, name, age, height, weight, bmi, lat, lon);
        return res.status(200).json(user);
    } catch (e) {
        return res.status(404).json({ error: e });
    }
}).delete(async (req, res) => {
    try {
        const user = await deleteUser(req.params.id);
        return res.status(200).json(user);
    } catch (e) {
        return res.status(404).json({ error: e });
    }
});

// router.route("/login").post(async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const user = await getUserByEmail(email);
        
//         if (!user) {
//             return res.status(401).json({ error: "Invalid email or password" });
//         }
        
//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         if (!isPasswordValid) {
//             return res.status(401).json({ error: "Invalid email or password" });
//         }

//         // Generate JWT token
//         const token = jwt.sign(
//             { userId: user._id, email: user.email },
//             process.env.JWT_SECRET || 'your-secret-key',
//             { expiresIn: '24h' }
//         );

//         // Return user data and token
//         return res.status(200).json({
//             token,
//             user: {
//                 id: user._id,
//                 name: user.name,
//                 email: user.email,
//                 age: user.age,
//                 height: user.height,
//                 weight: user.weight,
//                 bmi: user.bmi,
//                 location: user.location
//             }
//         });
//     } catch (e) {
//         console.error('Login error:', e);
//         return res.status(500).json({ error: "An error occurred during login" });
//     }
// });
// Login Route
router.post("/login", async (req, res) => {    try {
      const { email, password } = req.body;
  
      // Validate input
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }
  
      // Get user from database
      const user = await getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
  
      // Compare passwords
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
  
      // Create session
      req.session.user = {
        id: user._id,
        email: user.email,
        name: user.name
      };

      const pythonApiUrl = 'http://127.0.0.1:7000/risk_assessment';
      const response = await axios.post(pythonApiUrl, user);
      console.log(response.data);

    console.log(user);
  
      return res.status(200).json({ 
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        //   riskData: response.data
        }
      });
  
    } catch (e) {
      console.error("Login error:", e);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
  
  // Logout Route
  router.get("/logout", (req, res) => {
    try {
      req.session.destroy((err) => {
        if (err) {
            console.log("eff")
          return res.status(500).json({ error: "Could not log out" });
        }
        console.log("eff")
        res.clearCookie("connect.sid");
        return res.status(200).json({ message: "Logout successful" });
      });
    } catch (e) {
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  
  // Check Auth Status
  router.get("/check-auth", (req, res) => {
    if (req.session.user) {
      return res.status(200).json({ 
        isAuthenticated: true,
        user: req.session.user 
      });
    }
    return res.status(200).json({ isAuthenticated: false });
  });
  


// Logout
router.post("/logout", (req, res) => {
    req.session.destroy();
    res.json({ message: "Logged out" });
});

router.route("/refreshData/:id").get(async (req, res) => {
    try {
        const user = await getUser(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
          }
          const pythonApiUrl = 'http://127.0.0.1:7000/risk_assessment';
          const response = await axios.post(pythonApiUrl, user);
          return res.status(200).json({ 
            message: "Login successful",
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              riskData: response.data
            }
          });
    } catch (e) {
        console.error('Error sending user data:', e);
        return res.status(500).json({ error: e });
    }
});

router.route("/followup/:id").get(async (req, res) => {
    try {
        const user = await getUser(req.params.id);
        const { query } = req.body;
        const pythonApiUrl = 'http://127.0.0.1:7000/followup_query';
        const response = await axios.post(pythonApiUrl, { user, query });
        return res.status(200).json(response.data);
    } catch (e) {
        console.error('Error sending user data:', e);
        return res.status(500).json({ error: e });
    }
});

router.route("/sendUserData/:id").get(async (req, res) => {
    try {
        const user = await getUser(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
          }
          const pythonApiUrl = 'http://127.0.0.1:5000/predict';
          const response = await axios.post(pythonApiUrl, user);
          return res.status(200).json(response.data);
    } catch (e) {
        console.error('Error sending user data:', e);
        return res.status(500).json({ error: e });
    }
});

router.route("/sendUserData/:id").get(async (req, res) => {
    try {
        const user = await getUser(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
          }
          const pythonApiUrl = 'http://127.0.0.1:5000/predict';
          const response = await axios.post(pythonApiUrl, user);
          return res.status(200).json(response.data);
    } catch (e) {
        console.error('Error sending user data:', e);
        return res.status(500).json({ error: e });
    }
});

export { router as userRoutes };


