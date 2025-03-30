import express from "express";
import bcrypt from "bcrypt";
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { createUser, getUser, updateUser, deleteUser, getUserByEmail } from "../data/users.js";
import { users } from "../config/mongoCollections.js";
import axios from "axios";

const router = express.Router();



router.route("/").post(async (req, res) => {
    try {
        const { name, email, password, age, height, weight, bmi, location } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await createUser(name, email, hashedPassword, age, height, weight, bmi, location);
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
        const { name, age, height, weight, bmi, location } = req.body;
        const user = await updateUser(req.params.id, name, age, height, weight, bmi, location);
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

router.post("/login", async (req, res) => {
    try {
        console.log("Login request received:", req.body);
        const userCollection = await users();
        const { email, password } = req.body;

        // 1. Find user
        const user = await userCollection.findOne({ email });
        if (!user) return res.status(401).json({ error: "Invalid credentials" });

        // 2. Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ error: "Invalid credentials" });

        // 3. Set session
        req.session.user = {
            id: user._id,
            email: user.email,
            name: user.name,
        };

        // 4. Respond without password
        res.json({ user: { id: user._id, email: user.email, name: user.name } });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Login failed" });
    }
});

// Check Authentication
router.get("/check-auth", (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});

// Logout
router.post("/logout", (req, res) => {
    req.session.destroy();
    res.json({ message: "Logged out" });
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
