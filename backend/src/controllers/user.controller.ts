import { Request, Response } from "express";
import { findByUsername, login, create } from "../models/user.model";

export const getUserByUsername = (req: Request, res: Response): void => {
  const username = req.session?.username;
  if (!username) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }
  const user = findByUsername(username);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  res.json({
    id: user.id,
    username: user.username,
    firstname: user.firstname,
    lastname: user.lastname,
  });
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ message: "Username and password are required" });
    return;
  }
  const user = await login(username, password);
  if (!user) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }
  if (req.session) {
    req.session.username = username;
  }
  res.json({
    message: "Login successful",
    user: {
      id: user.id,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
    },
  });
};

export const addUser = async (req: Request, res: Response): Promise<void> => {
  const { username, password, firstname, lastname } = req.body;
  if (!username || !password || !firstname || !lastname) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }
  if (findByUsername(username)) {
    res.status(409).json({ message: "Username already exists" });
    return;
  }
  const user = await create({ username, password, firstname, lastname });
  res.status(201).json({
    message: "User created",
    user: {
      id: user.id,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
    },
  });
};

export const logout = (req: Request, res: Response): void => {
  req.session = null;
  res.json({ message: "Logged out" });
};
