import fs from "fs";
import path from "path";
import { User } from "@/types/user";

const usersFilePath = path.join(process.cwd(), "src", "data", "users.json");

export interface UsersDatabase {
  users: User[];
}

export async function readUsersDB(): Promise<UsersDatabase> {
  try {
    const data = fs.readFileSync(usersFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return { users: [] };
  }
}

export async function writeUsersDB(data: UsersDatabase): Promise<void> {
  const dir = path.dirname(usersFilePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(usersFilePath, JSON.stringify(data, null, 2));
}

export async function getAllUsers(): Promise<User[]> {
  const db = await readUsersDB();
  return db.users;
}

export async function getUserById(id: string): Promise<User | null> {
  const db = await readUsersDB();
  return db.users.find((user) => user.id === id) || null;
}

export async function createUser(user: User): Promise<User> {
  const db = await readUsersDB();
  db.users.push(user);
  await writeUsersDB(db);
  return user;
}

export async function updateUser(
  id: string,
  updates: Partial<User>,
): Promise<User | null> {
  const db = await readUsersDB();
  const userIndex = db.users.findIndex((user) => user.id === id);

  if (userIndex === -1) {
    return null;
  }

  db.users[userIndex] = {
    ...db.users[userIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  await writeUsersDB(db);
  return db.users[userIndex];
}

export async function deleteUser(id: string): Promise<boolean> {
  const db = await readUsersDB();
  const initialLength = db.users.length;
  db.users = db.users.filter((user) => user.id !== id);

  if (db.users.length < initialLength) {
    await writeUsersDB(db);
    return true;
  }

  return false;
}
