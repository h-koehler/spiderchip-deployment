import { Request, Response } from "express";
import { registerUser, loginUser, getCurrentUser } from "../services/authService";
import { User } from "../models/User";

export const register = async (req: Request, res: Response) => {
  try {
    const user: Omit<User, "id" | "created_at"> = req.body;
    const newUser = await registerUser(user);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const user: Pick<User, "email" | "password"> = req.body;
    const authData = await loginUser(user);

    if (!authData) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    res.status(200).json(authData);
  } catch (error) {
    
    res.status(500).json({ error: "Database error" });
  }
};

export const currentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.user.id) {
      res.status(401).json({ error: "Unauthorized. No user found." });
      return;
    }

    const user = await getCurrentUser(req.user.id);

    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Current User Error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};