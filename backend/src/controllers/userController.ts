import { Request, Response, NextFunction } from "express";
import * as userService from "../services/userService";
import { BadRequestError, UnauthorizedError } from "../errors";

/**
 * Create a new user
 */
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, email, password } = req.body;
        const user = await userService.createUser(username, email, password);
        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
};

/**
 * Get a user by ID
 */
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new UnauthorizedError("User not authenticated");
        }
        const user = await userService.getUserById(userId);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

/**
 * Get a user by email
 */
export const getUserByEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.params;
        const user = await userService.getUserByEmail(email);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

/**
 * Get all users
 */
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

/**
 * Update a user
 */
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw new UnauthorizedError("User not authenticated");
        }
        const updates = req.body;
        const updatedUser = await userService.updateUser(userId, updates);
        res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
};

/**
 * Delete a user
 */
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;
        await userService.deleteUser(userId);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
