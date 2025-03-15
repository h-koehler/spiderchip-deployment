import prisma from "../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import globalConfig from "../config/global";
import { User, UserResponse } from "../models/User";
import { Role } from "../config/roles";
import { ConflictError, InternalServerError, NotFoundError, UnauthorizedError } from "../errors";

export const registerUser = async (user: Omit<User, "id" | "created_at" | "updated_at">): Promise<UserResponse> => {
    const { username, email, password } = user;

    const existingUser = await prisma.users.findUnique({
        where: { email }
    });
    if (existingUser) {
        throw new ConflictError("User already exists");
    }

    try {
        const hashed_password = await bcrypt.hash(password, 10);
    
        const newUser = await prisma.users.create({
            data: {
                username,
                email,
                hashed_password,
                roles: {
                    connect: { name: Role.USER }
                }
            },
            select: { id: true }
        });

        const token = jwt.sign({ id: newUser.id }, globalConfig.jwt.secret, {
            expiresIn: globalConfig.jwt.expiresIn
        });

        return { token };
    } catch (error) {
        throw new InternalServerError("Failed to register user");
    }
};

export const loginUser = async (user: Pick<User, "email" | "password">): Promise<UserResponse | null> => {
    const userRecord = await prisma.users.findUnique({
        where: { email: user.email },
        select: { id: true, hashed_password: true }
    });

    if (!userRecord) {
        throw new NotFoundError("User not found.");
    };

    const isValidPassword = await bcrypt.compare(user.password, userRecord.hashed_password);
    if (!isValidPassword) {
        throw new UnauthorizedError("Invalid password");
    };

    try {
        const token = jwt.sign({ id: userRecord.id }, globalConfig.jwt.secret, {
            expiresIn: globalConfig.jwt.expiresIn
        });
    
        return { token };
    } catch (error) {
        throw new InternalServerError("Failed to generate authentication token");
    }
};

export const getCurrentUser = async (userId: string): Promise<Omit<User, "id" | "password" | "created_at" | "updated_at"> | null>=> {
    const user = await prisma.users.findUnique({
        where: { id: userId },
        select: {
            username: true,
            email: true,
            roles: {
                select: { name: true }
            }
        }
    });
    
    if (!user) {
        throw new NotFoundError("User not found.");
    };
  
    return { 
        username: user.username,
        email: user.email,
        role: user.roles?.name
     };
};