const express = require("express");
const router = express.Router();
const Idea = require("../models/Idea");
const auth = require("../middleware/authenticate");

// Use cache for storing ideas
router.post("/", auth, (req, res) => {
  if (!req.cache.ideas) req.cache.ideas = [];
  const newIdea = new Idea({ ...req.body, createdBy: req.user.username });
  req.cache.ideas.unshift(newIdea);
  res.json(newIdea);
});

router.get("/", (req, res) => {
  if (!req.cache.ideas) req.cache.ideas = [];
  // Return sorted by createdAt descending
  const ideas = req.cache.ideas
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(ideas);
});

router.get("/search", (req, res) => {
  const q = req.query.q || "";
  if (!req.cache.ideas) req.cache.ideas = [];
  const filtered = req.cache.ideas.filter(
    (idea) => idea.title && idea.title.toLowerCase().includes(q.toLowerCase())
  );
  res.json(filtered);
});

router.get("/:id", (req, res) => {
  if (!req.cache.ideas) req.cache.ideas = [];
  const found = req.cache.ideas.find((idea) => idea._id == req.params.id);
  if (found) return res.json(found);
  res.status(404).json({ msg: "Idea not found" });
});

router.put("/:id", auth, (req, res) => {
  if (!req.cache.ideas) req.cache.ideas = [];
  let updated = null;
  req.cache.ideas = req.cache.ideas.map((idea) => {
    if (idea._id == req.params.id) {
      updated = { ...idea, ...req.body, updatedAt: new Date() };
      return updated;
    }
    return idea;
  });
  if (updated) {
    return res.json(updated);
  } else {
    return res.status(404).json({ msg: "Idea not found" });
  }
});

router.delete("/:id", auth, (req, res) => {
  if (!req.cache.ideas) req.cache.ideas = [];
  const before = req.cache.ideas.length;
  req.cache.ideas = req.cache.ideas.filter((idea) => idea._id != req.params.id);
  if (req.cache.ideas.length < before) {
    res.json({ msg: "Idea deleted" });
  } else {
    res.status(404).json({ msg: "Idea not found" });
  }
});

// Authenticated endpoint to clear all cache
router.delete("/cache/all", auth, (req, res) => {
  const { password } = req.body;
  if (password !== "12345678") {
    return res.status(403).json({ msg: "Invalid password" });
  }
  Object.keys(req.cache).forEach((key) => delete req.cache[key]);
  res.json({ msg: "All cache cleared" });
});

module.exports = router;
