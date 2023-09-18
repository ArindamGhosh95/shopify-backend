import expressAsyncHandler from "express-async-handler";
import { CouponStore } from "../models/Coupon";

const couponStore = new CouponStore();
// create a coupon
export const createCoupon = expressAsyncHandler(async (req, res) => {
  try {
    const newCoupon = couponStore.createCoupon(req.body);
    res.json(newCoupon);
  } catch (e: any) {
    throw new Error(e);
  }
});
// update coupon
export const updateCoupon = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const newCoupon = couponStore.updateCoupon(id, req.body);
    res.json(newCoupon);
  } catch (e: any) {
    throw new Error(e);
  }
});
export const deleteCoupon = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    couponStore.deleteCoupon(id);
    res.json({ message: "Deleted Successfully." });
  } catch (e: any) {
    throw new Error(e);
  }
});
// get coupon By ID
export const getCouponbyId = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = couponStore.getCouponbyId(id);
    res.json(coupon);
  } catch (e: any) {
    throw new Error(e);
  }
});
// get all coupons
export const getAllCoupons = expressAsyncHandler(async (req, res) => {
  try {
    const allCoupon = couponStore.getCoupons();
    res.json(allCoupon);
  } catch (e: any) {
    throw new Error(e);
  }
});
