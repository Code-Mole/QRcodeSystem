import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/DB.js";
import userRoutes from "./router/userRoute.js";
import tokenRoute from "./router/tokenRoute.js";

const server = express();
dotenv.config();
connectDB();
server.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://qrcode-system-frontend.onrender.com"]
        : ["http://localhost:5173"],
    credentials: true,
  })
);
server.use(express.json());

// Routes
server.use("/api/users", userRoutes);
server.use("/api", tokenRoute);

server.listen(process.env.PORT || 4000, () => {
  console.log(`Server is running on port ${process.env.PORT || 4000}`);
});
