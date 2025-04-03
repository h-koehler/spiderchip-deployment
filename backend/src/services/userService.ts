import { getPrisma } from "../config/db";
import bcrypt from "bcryptjs";
import { ConflictError, InternalServerError, NotFoundError } from "../errors";
import { Role } from "../config/roles";

/**
 * Create a new user
 */
export const createUser = async (username: string, email: string, password: string) => {
    const prisma = await getPrisma();
    // Check if user already exists
    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
        throw new ConflictError("User with this email already exists.");
    }

    // Hash password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        return await prisma.users.create({
            data: {
                username,
                email,
                hashed_password: hashedPassword,
                roles: { connect: { name: Role.USER } },
            },
            select: { id: true }
        });
    } catch (error) {
        throw new InternalServerError("Failed to create user. Ensure role ID is valid.");
    }
};

/**
 * Find a user by ID
 */
export const getUserById = async (userId: string) => {
    try {
        const prisma = await getPrisma();
        const user = await prisma.users.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                email: true,
                roles: { select: { name: true } }
            }
        });

        if (!user) {
            throw new NotFoundError("User not found.");
        }

        return user;
    } catch (error) {
        throw new InternalServerError("Failed to fetch user.");
    }
};

/**
 * Find a user by email
 */
export const getUserByEmail = async (email: string) => {
    const prisma = await getPrisma();
    const user = await prisma.users.findUnique({
        where: { email },
        select: {
            id: true,
            username: true,
            email: true,
            hashed_password: true,
            roles: { select: { name: true } }
        }
    });

    if (!user) {
        throw new NotFoundError("User not found.");
    }

    return user;
};

/**
 * Get all users
 */
export const getAllUsers = async () => {
    try {
        const prisma = await getPrisma();
        return prisma.users.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                roles: { select: { name: true } }
            }
        });
    } catch (error) {
        throw new InternalServerError("Failed to fetch users.");
    }
};

/**
 * Update a user
 */
export const updateUser = async (
    userId: string, 
    updates: Partial<{ username: string; email: string; password: string }>
) => {
    const prisma = await getPrisma();
    
    const user = await prisma.users.findUnique({ where: { id: userId } });
    if (!user) {
        throw new NotFoundError("User not found.");
    }

    let data: any = { ...updates };

    if (updates.password) {
        data.hashed_password = await bcrypt.hash(updates.password, 10);
        delete data.password; // Ensure plaintext password is never stored
    }
    
    try {
        return prisma.users.update({
            where: { id: userId },
            data,
        });
    } catch (error) {
        throw new InternalServerError("Failed to update user.");
    }
};

/**
 * Delete a user
 */
export const deleteUser = async (userId: string) => {
    const prisma = await getPrisma();
    
    const user = await prisma.users.findUnique({ where: { id: userId } });
    if (!user) {
        throw new NotFoundError("User not found.");
    }

    try {
        return await prisma.users.delete({
            where: { id: userId },
        });
    } catch (error) {
        throw new InternalServerError("Failed to delete user.");
    }
};
