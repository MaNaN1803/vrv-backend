const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Register User
const registerUser = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ username, email, password, role });
    res.status(201).json({ id: user._id, username: user.username, role: user.role });
  } catch (error) {
    res.status(500).json({ message: "Error registering user" });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user._id, user.role);
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
};

module.exports = { registerUser, loginUser };
