import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedRoles() {
  console.log("🧩 Seeding roles...");

  const roles = [
    { name: "SUPER_ADMIN", description: "Full system access" },
    { name: "ADMIN", description: "Admin access" },
    { name: "MANAGER", description: "Manager access" },
    { name: "USER", description: "Basic user access" },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
  }

  console.log("✅ Roles done");
}