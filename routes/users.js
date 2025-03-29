import express from "express";
import bcrypt from "bcrypt";
import { createUser, getUser, updateUser, deleteUser, getUserByEmail } from "../data/users.js";
import jwt from "jsonwebtoken";

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

router.route("/login").post(async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await getUserByEmail(email);
        
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        // Return user data and token
        return res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                age: user.age,
                height: user.height,
                weight: user.weight,
                bmi: user.bmi,
                location: user.location
            }
        });
    } catch (e) {
        console.error('Login error:', e);
        return res.status(500).json({ error: "An error occurred during login" });
    }
});

export { router as userRoutes };
