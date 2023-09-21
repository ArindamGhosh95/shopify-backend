import express from "express";
import { authenticateJWT, isAdmin } from "../middlewares/authMiddleware";
import {
  createCoupon,
  deleteCoupon,
  getAllCoupons,
  getCouponbyId,
  updateCoupon,
} from "../controller/CouponController";
const router = express.Router();
router.get("/all-coupons", getAllCoupons);
router.get("/:id", getCouponbyId);
// admin routes
router.post("/", authenticateJWT, isAdmin, createCoupon);
router.put("/:id", authenticateJWT, isAdmin, updateCoupon);
router.delete("/:id", authenticateJWT, isAdmin, deleteCoupon);
export default router;
