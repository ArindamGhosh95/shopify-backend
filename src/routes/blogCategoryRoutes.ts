import express from "express";
import { authenticateJWT, isAdmin } from "../middlewares/authMiddleware";
import {
  createBlogCategory,
  deleteBlogCategory,
  getAllBlogCategories,
  getBlogCategorybyId,
  updateBlogCategory,
} from "../controller/BlogCategoryController";
const router = express.Router();
router.get("/all-blog-categories", getAllBlogCategories);
router.get("/:id", getBlogCategorybyId);
// admin routes
router.post("/", authenticateJWT, isAdmin, createBlogCategory);
router.put("/:id", authenticateJWT, isAdmin, updateBlogCategory);
router.delete("/:id", authenticateJWT, isAdmin, deleteBlogCategory);
export default router;
