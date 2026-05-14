import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedRolePermissions() {
  console.log("🔗 Seeding role permissions...");

  const permissions = await prisma.permission.findMany();
  const roles = await prisma.role.findMany();

  const roleMap = Object.fromEntries(
    roles.map((r: { name: any; }) => [r.name, r])
  );

  /**
   * SUPER_ADMIN → ALL
   */
  const superAdmin = roleMap["SUPER_ADMIN"];

  for (const p of permissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: superAdmin.id,
          permissionId: p.id,
        },
      },
      update: {},
      create: {
        roleId: superAdmin.id,
        permissionId: p.id,
      },
    });
  }

  /**
   * ADMIN → product, category, user
   */
  const admin = roleMap["ADMIN"];

  const adminPermissions = permissions.filter(
    (p: { module: string; }) =>
      ["product", "category", "user"].includes(p.module)
  );

  for (const p of adminPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: admin.id,
          permissionId: p.id,
        },
      },
      update: {},
      create: {
        roleId: admin.id,
        permissionId: p.id,
      },
    });
  }

  /**
   * MANAGER → limited product access
   */
  const manager = roleMap["MANAGER"];

  const managerPermissions = permissions.filter(
    (p: { name: string; }) =>
      ["product.read", "product.create", "product.update", "category.read"].includes(p.name)
  );

  for (const p of managerPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: manager.id,
          permissionId: p.id,
        },
      },
      update: {},
      create: {
        roleId: manager.id,
        permissionId: p.id,
      },
    });
  }

  /**
   * USER → read only
   */
  const user = roleMap["USER"];

  const userPermissions = permissions.filter(
    (p: { name: string; }) =>
      ["product.read", "category.read"].includes(p.name)
  );

  for (const p of userPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: user.id,
          permissionId: p.id,
        },
      },
      update: {},
      create: {
        roleId: user.id,
        permissionId: p.id,
      },
    });
  }

  console.log("✅ Role permissions done");
}