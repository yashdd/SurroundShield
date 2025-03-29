import express from "express";
import { userRoutes } from "./users.js";

const constructorMethod = (app) => {
    app.use("/users", userRoutes);
};

export default constructorMethod;

