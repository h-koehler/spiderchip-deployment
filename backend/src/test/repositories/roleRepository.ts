import { Role } from "../../config/roles";
import { createRole } from "../../services/roleService";

/**
 * Ensures that roles exist in the database.
 */
export const seedRoles = async () => {
    console.log("🔹 Seeding roles...");

    await createRole({ name: Role.ADMIN, description: "Administrator role" });
    await createRole({ name: Role.USER, description: "Regular user role" });

    console.log(`✅ Roles ('${Role.ADMIN}', '${Role.USER}') are ready.`);
};
