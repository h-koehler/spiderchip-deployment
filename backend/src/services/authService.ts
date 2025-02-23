import pool from "../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import globalConfig from "../config/global";
import { User, UserAuth, UserResponse } from "../models/User";

export const registerUser = async (user: Omit<User, "id" | "created_at" | "updated_at">): Promise<UserResponse> => {
    const {first_name, last_name, email, password} = user;
    const hashedPassword = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
        "INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING id",
        [first_name, last_name, email, hashedPassword]
    );
    return rows[0];
};

export const loginUser = async (user: Pick<User, "email" | "password">): Promise<{id: string; token: string} | null> => {
    const { rows } = await pool.query<UserAuth>("SELECT id, password FROM users WHERE email = $1", [user.email]);

    if (rows.length === 0) return null;

    const dbUser = rows[0];
    const isValidPassword = await bcrypt.compare(user.password, dbUser.password);

    if (!isValidPassword) return null;

    const token = jwt.sign({ id: dbUser.id, email: dbUser.email }, globalConfig.jwt.secret, {
        expiresIn: globalConfig.jwt.expiresIn
    });

    return { id: dbUser.id, token };
};

export const getCurrentUser = async (userId: string): Promise<Omit<User, "id" | "password" | "created_at" | "updated_at"> | null> => {
    const { rows } = await pool.query<Omit<User, "password">>(
      "SELECT first_name, last_name, email FROM users WHERE id = $1",
      [userId]
    );
  
    return rows.length ? rows[0] : null;
};