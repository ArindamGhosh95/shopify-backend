import express from "express";
import { authenticateJWT, isAdmin } from "../middlewares/authMiddleware";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategorybyId,
  updateCategory,
} from "../controller/ProductCategoryController";
const router = express.Router();
router.get("/", getAllCategories);
router.get("/:id", getCategorybyId);
// admin routes
router.post("/", authenticateJWT, isAdmin, createCategory);
router.put("/:id", authenticateJWT, isAdmin, updateCategory);
router.delete("/:id", authenticateJWT, isAdmin, deleteCategory);
export default router;
