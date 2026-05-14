import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export class UserService {
  /**
   * CREATE USER + ROLE
   */
  static async createUser(data: {
    email: string;
    password: string;
    roleId?: string;
  }) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,

        // 👇 assign role at creation
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
          include: {
            role: true,
          },
        },
      },
    });
  }

  /**
   * UPDATE USER + ROLE
   * 👉 replaces role if roleId provided
   */
  static async updateUser(
    id: string,
    data: { email?: string; password?: string; roleId?: string },
  ) {
    const updateData: any = {};

    if (data.email) updateData.email = data.email;

    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    return prisma.user
      .update({
        where: { id },
        data: updateData,
        include: {
          userRoles: {
            include: { role: true },
          },
        },
      })
      .then(async (user) => {
        // 👇 update role separately if provided
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
      });
  }

  static async getAllUsers() {
    return prisma.user.findMany({
      include: {
        userRoles: {
          include: { role: true },
        },
      },
    });
  }

  static async getUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        userRoles: {
          include: { role: true },
        },
      },
    });
  }

  static async deleteUser(id: string) {
    return prisma.user.delete({
      where: { id },
    });
  }

  static async assignRole(userId: string, roleId: string) {
    return prisma.userRole.create({
      data: { userId, roleId },
    });
  }

  static async removeRole(userId: string, roleId: string) {
    return prisma.userRole.deleteMany({
      where: { userId, roleId },
    });
  }
}
