import express from "express";
import constructorMethod from "./routes/index.js";

const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes setup
constructorMethod(app);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

