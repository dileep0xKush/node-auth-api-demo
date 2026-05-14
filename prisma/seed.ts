import { seedPermissions } from "./seed/permissions.seed";
import { seedRoles } from "./seed/roles.seed";
import { seedRolePermissions } from "./seed/rolePermissions.seed";
import process from "process";

async function main() {
  console.log("🚀 Starting DB seeding...");

  await seedPermissions();
  await seedRoles();
  await seedRolePermissions();

  console.log("🎉 All seeding completed");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});