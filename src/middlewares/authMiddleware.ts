import jwt from "jsonwebtoken";
import expressAsyncHandler from "express-async-handler";
import { User, UserStore } from "../models/User";

export const authenticateJWT = expressAsyncHandler(
  (req: any, res: any, next: any) => {
    const authHeader: string = req?.headers?.authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
      const token = authHeader.split(" ")[1];
      jwt.verify(
        token,
        process.env.JWT_SECRET || "mysecret",
        (err: any, user: any) => {
          if (err) {
            return res.status(403).send("Token Expired Please login again.");
          }
          const userStore = new UserStore();
          const findUser: User | undefined = userStore.getUserById(user?.id);
          req.user = findUser;
          next();
        }
      );
    } else {
      res.sendStatus(401);
    }
  }
);

export const isAdmin = expressAsyncHandler(
  async (req: any, res: any, next: any) => {
    const { email } = req?.user;
    const userStore = new UserStore();
    const adminUser = userStore.getUserByEmail(email);
    if (adminUser?.role === "admin") {
      next();
    } else {
      res.status(403).send("Process allowed for Admin users only.");
    }
  }
);
