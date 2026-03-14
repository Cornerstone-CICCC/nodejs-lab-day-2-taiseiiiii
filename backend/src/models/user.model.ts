import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

export interface User {
  id: string;
  username: string;
  password: string;
  firstname: string;
  lastname: string;
}

const users: User[] = [];

export const findByUsername = (username: string): User | undefined => {
  return users.find((user) => user.username === username);
};

export const login = async (
  username: string,
  password: string
): Promise<User | null> => {
  const user = findByUsername(username);
  if (!user) return null;
  const match = await bcrypt.compare(password, user.password);
  return match ? user : null;
};

export const create = async (
  newUser: Omit<User, "id">
): Promise<User> => {
  const hashedPassword = await bcrypt.hash(newUser.password, 10);
  const user: User = {
    id: uuidv4(),
    username: newUser.username,
    password: hashedPassword,
    firstname: newUser.firstname,
    lastname: newUser.lastname,
  };
  users.push(user);
  return user;
};
