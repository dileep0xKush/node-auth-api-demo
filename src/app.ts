import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",
  credentials: true,
}));

app.use(helmet());

app.use(rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
}));


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);


app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(500).json({
    message: "Internal Server Error",
  });
});

export default app;