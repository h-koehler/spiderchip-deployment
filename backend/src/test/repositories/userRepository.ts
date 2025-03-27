import { Role } from "../../config/roles";
import { prismaTestClient } from "../db";
import bcrypt from "bcryptjs";

export const createTestUser = async () => {
    const { password, hashed_password, ...testUser } = await getTestUserDTO();
    await prismaTestClient.users.create({
        data: {
            ...testUser,
            hashed_password,
            roles: { connect: { name: Role.USER } },
        }
    });
    return { ...testUser, password };
};

export const createAdminUser = async () => {
    const password = `Test${Math.floor(1000 + Math.random() * 9000)}`;
    const hashed_password = await bcrypt.hash(password, 10);
    const adminUser = await prismaTestClient.users.create({
        data: {
            username: `admin_user_${Date.now()}`,
            email: `admin${Date.now()}@spiderchip.com`,
            hashed_password,
            roles: { connect: { name: Role.ADMIN } },
        }
    });
    
    return {
        username: adminUser.username,
        email: adminUser.email,
        password
    };
};

export const getTestUserDTO = async () => {
    const password = `Test${Math.floor(1000 + Math.random() * 9000)}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    return {
        username: `test_user_${Date.now()}`,
        email: `test${Date.now()}@spiderchip.com`,
        password,
        hashed_password: hashedPassword,
    };
};