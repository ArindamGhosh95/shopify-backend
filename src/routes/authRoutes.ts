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
  addToCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  createOrder,
  getOrders,
  getAllOrders,
  loginAdmin,
  getOrderByUserId,
  updateOrderStatus,
  // updateOrderStatus,
  // getOrderByUserId,
} from "../controller/UserController";
import { authenticateJWT, isAdmin } from "../middlewares/authMiddleware";
const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/admin-login", loginAdmin);
router.get("/logout", logoutUser);
router.get("/refresh", handleRefreshToken);
router.get("/all-users", getallUser);
router.post("/forgot-password-token", forgotPasswordToken);
router.put("/reset-password/:token", resetPassword);
// authenticated routes
router.put("/edit-user", authenticateJWT, updatedUser);
router.put("/password", authenticateJWT, updatePassword);
router.get("/wishlist", authenticateJWT, getWishlist);
router.put("/wishlist", authenticateJWT, addToWishlist);
router.put("/save-address", authenticateJWT, saveAddress);
router.put("/cart/addtocart", authenticateJWT, addToCart);
router.get("/cart/get-user-cart", authenticateJWT, getUserCart);
router.delete("/cart/empty-cart", authenticateJWT, emptyCart);
router.put("/cart/apply-coupon", authenticateJWT, applyCoupon);
router.post("/cart/cash-order", authenticateJWT, createOrder);

router.get("/get-orders", authenticateJWT, getOrders);

// admin routes

router.get("/getallorders", authenticateJWT, isAdmin, getAllOrders);
router.get("/getorderbyuser/:id", authenticateJWT, isAdmin, getOrderByUserId);
router.put(
  "/order/update-order/:id",
  authenticateJWT,
  isAdmin,
  updateOrderStatus
);

router.get("/:id", authenticateJWT, isAdmin, getUserById);
router.delete("/:id", authenticateJWT, isAdmin, deleteUserById);
router.put("/block-user/:id", authenticateJWT, isAdmin, blockUser);
router.put("/unblock-user/:id", authenticateJWT, isAdmin, unBlockUser);
export default router;
