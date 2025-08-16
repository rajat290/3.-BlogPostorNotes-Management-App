import express from "express";
import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import mongoose from "mongoose";

dotenv.config();

const PORT = process.env.PORT || 5000;

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
.then (() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

}).catch ((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
})
