import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export class UserService {
  /**
   * CREATE USER + OPTIONAL ROLE
   */
  static async createUser(data: {
    email: string;
    password: string;
    name?: string;
    roleId?: string;
  }) {
    try {
      // 🔍 check existing user FIRST (best practice)
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser) {
        throw new Error("EMAIL_ALREADY_EXISTS");
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);

      return await prisma.user.create({
        data: {
          email: data.email,
          name: data.name,
          password: hashedPassword,

          userRoles: data.roleId
            ? {
                create: {
                  roleId: data.roleId,
                },
              }
            : undefined,
        },
        include: {
          userRoles: {
            include: { role: true },
          },
        },
      });
    } catch (error: any) {
      // rethrow clean error
      throw error;
    }
  }

  /**
   * GET ALL USERS
   */
  static async getAllUsers() {
    return prisma.user.findMany({
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  /**
   * GET USER BY ID
   */
  static async getUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  /**
   * UPDATE USER + ROLE REPLACE
   */
  static async updateUser(
    id: string,
    data: {
      email?: string;
      password?: string;
      name?: string;
      roleId?: string;
    },
  ) {
    const updateData: any = {};

    if (data.email) updateData.email = data.email;
    if (data.name) updateData.name = data.name;

    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    // update basic fields first
    await prisma.user.update({
      where: { id },
      data: updateData,
    });

    // 👇 ROLE HANDLING (replace old role)
    if (data.roleId) {
      await prisma.userRole.deleteMany({
        where: { userId: id },
      });

      await prisma.userRole.create({
        data: {
          userId: id,
          roleId: data.roleId,
        },
      });
    }

    return prisma.user.findUnique({
      where: { id },
      include: {
        userRoles: {
          include: { role: true },
        },
      },
    });
  }

  /**
   * DELETE USER
   */
  static async deleteUser(id: string) {
    return prisma.user.delete({
      where: { id },
    });
  }

  /**
   * ADD ROLE (multi-role supported)
   */
  static async assignRole(userId: string, roleId: string) {
    return prisma.userRole.create({
      data: {
        userId,
        roleId,
      },
    });
  }

  /**
   * REMOVE ROLE
   */
  static async removeRole(userId: string, roleId: string) {
    return prisma.userRole.deleteMany({
      where: {
        userId,
        roleId,
      },
    });
  }
}
