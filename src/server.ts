import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes from "./routes/auth";
import carouselRoutes from "./routes/carouselRoute";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// connect to MongoDB
connectDB();

// middlewares
// app.use(cors({
//   origin: "http://localhost:3000", // Aapka Next.js frontend
//   credentials: true
// }));
app.use(cors());
app.use(express.json());
// 📁 Serve uploaded images statically
app.use("/uploads", express.static("uploads"));
// routes
app.use("/api/auth", authRoutes);
app.use("/api/carousel", carouselRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
