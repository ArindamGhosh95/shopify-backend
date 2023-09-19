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
  getWishlist,
  addToWishlist,
  saveAddress,
} from "../controller/UserController";
import { authenticateJWT, isAdmin } from "../middlewares/authMiddleware";
const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/refresh", handleRefreshToken);
router.get("/all-users", getallUser);
router.post("/forgot-password-token", forgotPasswordToken);
router.put("/reset-password/:token", resetPassword);
router.put("/edit-user", authenticateJWT, updatedUser);
router.put("/password", authenticateJWT, updatePassword);
router.get("/wishlist", authenticateJWT, getWishlist);
router.put("/wishlist", authenticateJWT, addToWishlist);
router.put("/save-address", authenticateJWT, saveAddress);

router.get("/:id", authenticateJWT, isAdmin, getUserById);
router.delete("/:id", authenticateJWT, isAdmin, deleteUserById);
router.put("/block-user/:id", authenticateJWT, isAdmin, blockUser);
router.put("/unblock-user/:id", authenticateJWT, isAdmin, unBlockUser);
export default router;
