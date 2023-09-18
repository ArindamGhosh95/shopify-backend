import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import { hashPasswords } from "../utils/hashpasswords";

export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  password: string;
  role: string;
  isBlocked: boolean;
  cart: any[];
  address?: string;
  wishlist: string[]; // Assuming these are Product IDs
  refreshToken?: string;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpiresIn?: Date;
}

export class UserStore {
  private users: User[] = [];
  private filePath: string;

  constructor(fileName: string = "/data/users.json") {
    this.filePath = path.join(__dirname, fileName);
    this.loadUsersFromFile();
  }
  private loadUsersFromFile() {
    try {
      const fileData = fs.readFileSync(this.filePath, "utf8");
      this.users = JSON.parse(fileData);
    } catch (error) {
      console.error("Error loading data from file:", error);
    }
  }
  private saveUsersToFile() {
    try {
      fs.writeFileSync(
        this.filePath,
        JSON.stringify(this.users, null, 2),
        "utf8"
      );
    } catch (error) {
      console.error("Error saving data to file:", error);
    }
  }
  createPasswordResetToken(userId: string) {
    const resetToken = crypto.randomBytes(32).toString("hex");
    const passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const user = this.users.find((user) => {
      return user.id === userId;
    });
    if (user) {
      user.passwordResetToken = passwordResetToken;
      user.passwordResetExpiresIn = new Date(Date.now() + 30 * 60 * 1000); // 30 mins
      this.updateUserById(userId, user);
      return resetToken;
    } else {
      throw new Error("User not found.");
    }
  }
  createUser(newUser: User) {
    let hash = hashPasswords(newUser.password);
    newUser.password = hash;
    this.users.push(newUser);
    this.saveUsersToFile();
  }
  getUserByEmail(email: string): User | undefined {
    return this.users.find((user) => user.email === email);
  }
  getUserById(id: string): User | undefined {
    return this.users.find((user) => {
      return user.id === id;
    });
  }
  updateUserById(id: string, updatedUser: Partial<User>) {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (updatedUser && updatedUser.password) {
      let hash = hashPasswords(updatedUser.password);
      updatedUser.password = hash;
    }
    if (userIndex !== -1) {
      this.users[userIndex] = { ...this.users[userIndex], ...updatedUser };
      this.saveUsersToFile();
    } else {
      throw new Error(`User not found with id ${id}`);
    }
  }
  deleteUserById(id: string) {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex !== -1) {
      this.users.splice(userIndex, 1);
      this.saveUsersToFile();
    } else {
      throw new Error(`User not found with id ${id}`);
    }
  }
  getAllUsers(): User[] {
    return this.users;
  }
  findUserByRefreshToken(token: string) {
    const userIndex = this.users.findIndex(
      (user) => user.refreshToken === token
    );
    if (userIndex !== -1) {
      return this.users[userIndex];
    } else {
      throw new Error(`No Refresh token present in db or not matched`);
    }
  }
}
