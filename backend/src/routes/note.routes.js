import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { createNote, getNotes, getNote, updateNote, deleteNote } from "../controllers/note.controller.js";

const router = express.Router();

router.post ("/", protect, createNote);
router.get ("/", protect, getNotes);
router.get("/:id",protect, getNote);
router.put("/:id", protect, updateNote);
router.delete("/:id", protect, deleteNote);

export default router