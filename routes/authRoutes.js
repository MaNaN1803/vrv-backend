const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const User = require("../models/User");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// Example protected routes
router.get("/admin", protect, authorize("Admin"), (req, res) => {
  res.send("Admin access");
});

router.get("/user", protect, authorize("User"), (req, res) => {
  res.send("User access");
});

router.get("/moderator", protect, authorize("Moderator"), (req, res) => {
    res.send("Moderator access");
  });
  
  router.get("/moderator/manage-posts", protect, authorize("Moderator"), (req, res) => {
    res.send("Moderator is managing posts");
  });
  
  router.get("/admin/users", protect, authorize("Admin"), async (req, res) => {
    const users = await User.find();
    res.json(users);
  });
  
  router.delete("/admin/users/:id", protect, authorize("Admin"), async (req, res) => {
    const user = await User.findById(req.params.id);
    console.log(`Admin ${req.user.email} deleted user ${user.email}`);
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  });
  
  router.get("/user-info", protect, async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password"); // Exclude password
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (err) {
      console.error("Error in /user-info route:", err); // Log the error
      res.status(500).json({ message: "Server error" });
    }
  });
  
module.exports = router;
