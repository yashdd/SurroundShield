import express from "express";
import bcrypt from "bcrypt";
import { createUser, getUser, updateUser, deleteUser } from "../data/users.js";

const router = express.Router();

router.route("/").post(async (req, res) => {
    try {
        const { name, email, password, age, height, weight, bmi, location } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await createUser(name, email, hashedPassword, age, height, weight, bmi, location);
        const { name, email, password, age, height, weight, bmi, location } = req.body;
        // console.log(req.body);
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await createUser(name, email, hashedPassword, age, height, weight, bmi, location);
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

export { router as userRoutes };
