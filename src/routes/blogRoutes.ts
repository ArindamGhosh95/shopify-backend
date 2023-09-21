import express from "express";
import { authenticateJWT, isAdmin } from "../middlewares/authMiddleware";
import {
  createBlog,
  deleteBlog,
  disliketheBlog,
  getAllBlogs,
  getBlog,
  liketheBlog,
  updateBlog,
  uploadImages,
} from "../controller/BlogController";
import {
  blogImgResize,
  uploadPhoto,
} from "../controller/uploadImagesController";
const router = express.Router();

router.get("/:id", getBlog);
router.get("/", getAllBlogs);
// authenticated routes
router.put("/likes", authenticateJWT, liketheBlog);
router.put("/dislikes", authenticateJWT, disliketheBlog);
// admin routes
router.post("/", authenticateJWT, isAdmin, createBlog);
router.put("/:id", authenticateJWT, isAdmin, updateBlog);
router.delete("/:id", authenticateJWT, isAdmin, deleteBlog);
router.put(
  "/upload/:id",
  authenticateJWT,
  isAdmin,
  uploadPhoto.array("images", 2),
  blogImgResize,
  uploadImages
);

export default router;
