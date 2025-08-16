import jwt from 'jsonwebtoken';
import User from '../models/user.js';

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
