import express from "express";
import {
  createUser,
  loginUser,
  updatedUser,
  getallUser,
  getUserById,
  deleteUserById,
  blockUser,
  unBlockUser,
  handleRefreshToken,
  logoutUser,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
} from "../controller/UserController";
import { authenticateJWT, isAdmin } from "../middlewares/authMiddleware";
const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/refresh", handleRefreshToken);
router.get("/all-users", getallUser);
router.put("/edit-user", authenticateJWT, updatedUser);
router.get("/:id", authenticateJWT, isAdmin, getUserById);
router.delete("/:id", authenticateJWT, isAdmin, deleteUserById);
router.put("/block-user/:id", authenticateJWT, isAdmin, blockUser);
router.put("/unblock-user/:id", authenticateJWT, isAdmin, unBlockUser);
router.put("/password", authenticateJWT, updatePassword);
router.post("/forgot-password-token", forgotPasswordToken);
router.put("/reset-password/:token", resetPassword);
export default router;
