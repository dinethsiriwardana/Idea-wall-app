const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

// Simple in-memory cache
const cache = {};

const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Pass cache to routes/api.js
app.use(
  "/api/ideas",
  (req, res, next) => {
    req.cache = cache;
    next();
  },
  require("./routes/api")
);
app.use("/api/auth", require("./routes/auth"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 5555;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
