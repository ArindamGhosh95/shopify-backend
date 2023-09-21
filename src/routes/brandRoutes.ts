import express from "express";
import { authenticateJWT, isAdmin } from "../middlewares/authMiddleware";
import {
  createBrand,
  deleteBrand,
  getAllBrands,
  getBrandbyId,
  updateBrand,
} from "../controller/BrandController";
const router = express.Router();

router.get("/all-brands", getAllBrands);
router.get("/:id", getBrandbyId);
// admin routes
router.post("/", authenticateJWT, isAdmin, createBrand);
router.put("/:id", authenticateJWT, isAdmin, updateBrand);
router.delete("/:id", authenticateJWT, isAdmin, deleteBrand);
export default router;
