import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import crypto from 'crypto';
import { sendEmail } from "../utils/sendEmail.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// POST /signup
export const signup = async (req, res) => {
  console.log("📩 Incoming body:", req.body); // Debug line

  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields required' });
  }

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'Email already in use' });

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id);

  res.status(201).json({
    token,
    user: { id: user._id, name: user.name, email: user.email }
  });
};


// POST /login
export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && await user.matchPassword(password)) {
    const token = generateToken(user._id);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

// GET /me
export const getMe = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
};

// ✅ Forgot password
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ message: "If that email exists, reset link has been sent" });
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get("host")}/api/auth/reset-password/${resetToken}`;
    const message = `You requested a password reset.\n\nClick the link below:\n${resetUrl}\n\nIf you didn't request this, ignore.`;

    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      text: message,
      html: `<p>You requested a password reset.</p><p><a href="${resetUrl}">Reset Password</a></p>`,
    });

    res.json({ message: "Email sent for password reset" });
  } catch (err) {
    next(err); // central error handler
  }
};

// ✅ Reset password using token
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) return res.status(400).json({ message: "New password is required" });

  const hashed = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashed,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Token is invalid or has expired" });
  }

  user.password = password; // will be hashed by pre-save
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  res.json({ message: "Password has been reset successfully" });
};

// ✅ Change password (logged-in user)
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Both currentPassword and newPassword are required" });
  }

  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

  user.password = newPassword; // pre-save will hash
  await user.save();

  res.json({ message: "Password changed successfully" });
};

