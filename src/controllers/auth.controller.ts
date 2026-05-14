import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { registerSchema, loginSchema } from "../validators/auth.validator";

const prisma = new PrismaClient();

/**
 * REGISTER
 */
export const registerController = async (req: Request, res: Response) => {
  try {
    // ✅ VALIDATE INPUT
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: result.error.flatten().fieldErrors,
      });
    }

    const { email, password } = result.data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return res.status(201).json({
      message: "User registered",
      user,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

/**
 * LOGIN
 */
export const loginController = async (req: Request, res: Response) => {
  try {
    // ✅ VALIDATE INPUT
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: result.error.flatten().fieldErrors,
      });
    }

    const { email, password } = result.data;

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const roles = user.userRoles.map((ur) => ur.role.name);

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        roles,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" },
    );

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        roles,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
