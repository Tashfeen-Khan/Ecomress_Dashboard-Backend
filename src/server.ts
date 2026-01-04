import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes from "./routes/auth";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// connect to MongoDB
connectDB();

// middlewares
app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
