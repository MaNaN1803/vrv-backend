const jwt = require("jsonwebtoken");

// Protect Routes Middleware
const protect = (req, res, next) => {
  console.log("Authorization Header:", req.headers.authorization); // Debugging
  
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else {
    return res.status(401).json({ message: "Not authorized, token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded); // Debugging

    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (error) {
    console.error("Token verification error:", error.message); // Debugging
    res.status(401).json({ message: "Invalid token, authorization failed" });
  }
};

// Role-Based Access Middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

module.exports = { protect, authorize };
