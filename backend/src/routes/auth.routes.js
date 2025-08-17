import express from "express";
import { body } from "express-validator";
import { signup, login, getMe, forgotPassword, resetPassword, changePassword } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../controllers/validate.middleware.js';

const router = express.Router();

router.post('/signup', 
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    validate,
    signup
);
router.post('/login', 
    body('email').isEmail().withMessage('Email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    validate,
    login

);
router.post(
  "/forgot-password",
  [body("email").isEmail().withMessage("Valid email is required")],
  validate,
  forgotPassword
);
router.post(
  "/reset-password/:token",
  [body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 chars")],
  validate,
  resetPassword
);

router.post(
  "/change-password",
  [
    body("currentPassword").notEmpty().withMessage("Current password is required"),
    body("newPassword").isLength({ min: 6 }).withMessage("New password must be at least 6 chars"),
  ],
  validate,
  protect,
  changePassword
);

export default router;
// router.get('/me', protect, getMe);