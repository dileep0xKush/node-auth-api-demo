import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedPermissions() {
  console.log("🔐 Seeding permissions...");

  const permissions = [
    // PRODUCT
    { name: "product.create", module: "product", action: "create" },
    { name: "product.read", module: "product", action: "read" },
    { name: "product.update", module: "product", action: "update" },
    { name: "product.delete", module: "product", action: "delete" },

    // CATEGORY
    { name: "category.create", module: "category", action: "create" },
    { name: "category.read", module: "category", action: "read" },
    { name: "category.update", module: "category", action: "update" },
    { name: "category.delete", module: "category", action: "delete" },

    // USER
    { name: "user.create", module: "user", action: "create" },
    { name: "user.read", module: "user", action: "read" },
    { name: "user.update", module: "user", action: "update" },
    { name: "user.delete", module: "user", action: "delete" },

    // ROLE
    { name: "role.create", module: "role", action: "create" },
    { name: "role.read", module: "role", action: "read" },
    { name: "role.update", module: "role", action: "update" },
    { name: "role.delete", module: "role", action: "delete" },
  ];

  for (const p of permissions) {
    await prisma.permission.upsert({
      where: { name: p.name },
      update: {},
      create: p,
    });
  }

  console.log("✅ Permissions done");
}