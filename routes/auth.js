const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Embedded secret for JWT
const JWT_SECRET = "mysecret";

const users = []; // In-memory user store

router.post("/register", (req, res) => {
  const { username, password } = req.body;
  users.push({ username, password });
  res.json({ msg: "User registered" });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) return res.status(401).json({ msg: "Invalid credentials" });

  const token = jwt.sign({ user: { username } }, JWT_SECRET, {
    expiresIn: "1h",
  });
  res.json({ token });
});

module.exports = router;
