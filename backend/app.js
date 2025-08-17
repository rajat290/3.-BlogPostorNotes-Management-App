import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./src/routes/auth.routes.js";
import noteRoutes from "./src/routes/note.routes.js";
import { errorHandler } from "./src/middleware/error.middleware.js";

const app = express();

// middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

// global error handler
app.use(errorHandler);
export default app;