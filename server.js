const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "PTIT DevOps - Session 10",
    status: "success",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "UP",
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend is running on port ${PORT}`);
});
