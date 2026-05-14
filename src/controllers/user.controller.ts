import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import {
  createUserSchema,
  updateUserSchema,
  roleSchema,
} from "../validators/user.validation";

export class UserController {
  /**
   * CREATE USER
   */
  static async create(req: Request, res: Response) {
    try {
      const result = createUserSchema.safeParse(req.body);

      if (!result.success) {
        return res.status(400).json({
          message: "Validation error",
          errors: result.error.flatten().fieldErrors,
        });
      }

      const user = await UserService.createUser(result.data);

      return res.json(user);
    } catch (err: any) {
      if (err.message === "EMAIL_ALREADY_EXISTS") {
        return res.status(409).json({
          message: "Email already exists",
        });
      }

      return res.status(500).json({
        message: err.message,
      });
    }
  }

  /**
   * GET ALL USERS
   */
  static async getAll(req: Request, res: Response) {
    const users = await UserService.getAllUsers();
    return res.json(users);
  }

  /**
   * GET USER BY ID
   */
  static async getById(req: Request, res: Response) {
    const id = String(req.params.id);

    const user = await UserService.getUserById(id);
    return res.json(user);
  }

  /**
   * UPDATE USER
   */
  static async update(req: Request, res: Response) {
    try {
      const id = String(req.params.id);

      const result = updateUserSchema.safeParse(req.body);

      if (!result.success) {
        return res.status(400).json({
          message: "Validation error",
          errors: result.error.flatten().fieldErrors,
        });
      }

      const user = await UserService.updateUser(id, result.data);

      return res.json(user);
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }

  /**
   * DELETE USER
   */
  static async delete(req: Request, res: Response) {
    const id = String(req.params.id);

    await UserService.deleteUser(id);
    return res.json({ message: "User deleted" });
  }

  /**
   * ASSIGN ROLE
   */
  static async assignRole(req: Request, res: Response) {
    try {
      const userId = String(req.params.id);

      const result = roleSchema.safeParse(req.body);

      if (!result.success) {
        return res.status(400).json({
          message: "Validation error",
          errors: result.error.flatten().fieldErrors,
        });
      }

      const { roleId } = result.data;

      const data = await UserService.assignRole(userId, roleId);

      return res.json(data);
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }

  /**
   * REMOVE ROLE
   */
  static async removeRole(req: Request, res: Response) {
    try {
      const userId = String(req.params.id);

      const result = roleSchema.safeParse(req.body);

      if (!result.success) {
        return res.status(400).json({
          message: "Validation error",
          errors: result.error.flatten().fieldErrors,
        });
      }

      const { roleId } = result.data;

      const data = await UserService.removeRole(userId, roleId);

      return res.json(data);
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }
}
