import express from "express";
import { userRoutes } from "./users.js";
import { pythonApis } from "./pythonapis.js";
const constructorMethod = (app) => {
    app.use("/users", userRoutes);
    app.use("/pythonapis", pythonApis);
};

export default constructorMethod;

