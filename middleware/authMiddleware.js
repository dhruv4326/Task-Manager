const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.header("Authorization");

  console.log("🔹 Received Auth Header:", authHeader); // Debugging

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. No valid token provided." });
  }
  const token = authHeader.split(" ")[1];
   // Expects "Bearer <token>"

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token verified, user:", verified); // Debugging
    req.user = verified.userId;

    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token" });
  }
};

