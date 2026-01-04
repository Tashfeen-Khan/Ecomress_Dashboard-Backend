import express from "express";
import dotenv from "dotenv";
// import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// app.use(cors());
app.use(express.json());

// Root endpoint
app.get("/", (req, res) => {
  res.send("Hello from TypeScript Node.js server!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
