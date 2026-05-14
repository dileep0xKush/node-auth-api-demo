import { FastifyReply, FastifyRequest } from "fastify";
import { loginUser, registerUser } from "../services/auth.service";

export const registerController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { email, password } = request.body as any;

    const user = await registerUser(email, password);

    return reply.status(201).send({
      message: "User registered",
      user,
    });
  } catch (error: any) {
    return reply.status(400).send({
      message: error.message,
    });
  }
};

export const loginController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { email, password } = request.body as any;

    const user = await loginUser(email, password);

    const token = await reply.jwtSign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return reply.send({
      token,
    });
  } catch (error: any) {
    return reply.status(401).send({
      message: error.message,
    });
  }
};