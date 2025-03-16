import { NextFunction, Request, Response } from "express";
import * as roleService from "../services/roleService";
import { InternalServerError } from "../errors";

/**
 * Get all roles
 */
export const getRoles = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const roles = await roleService.getAllRoles();
        res.json(roles);
    } catch (error) {
        next(error);
    }
};

/**
 * Get role by ID
 */
export const getRole = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const role = await roleService.getRoleById(id);
        res.json(role);
    } catch (error) {
        next(error);
    }
};

/**
 * Get role by Name
 */
export const getRoleByName = async (req: Request, res: Response) => {
    const { name } = req.params;
    try {
        const role = await roleService.getRoleByName(name);
        res.json(role);
    } catch (error) {
        throw new InternalServerError();
    }
};

/**
 * Create a new role
 */
export const createRole = async (req: Request, res: Response) => {
    try {
        const role = await roleService.createRole(req.body);
        res.status(201).json(role);
    } catch (error) {
        throw new InternalServerError();
    }
};

/**
 * Update a role
 */
export const updateRole = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const updatedRole = await roleService.updateRole(id, req.body);
        res.json(updatedRole);
    } catch (error) {
        throw new InternalServerError();
    }
};

/**
 * Delete a role
 */
export const deleteRole = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await roleService.deleteRole(id);
        res.json({ message: "Role deleted successfully" });
    } catch (error) {
        throw new InternalServerError();
    }
};
