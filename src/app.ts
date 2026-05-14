import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import jwt from "@fastify/jwt";
import dotenv from "dotenv";
import { authRoutes } from "./routes/auth.routes";

dotenv.config();

const app = Fastify({
  logger: true,
});

app.register(cors);
app.register(helmet);

app.register(jwt, {
  secret: process.env.JWT_SECRET!,
});

app.register(authRoutes, {
  prefix: "/api/auth",
});

export default app;