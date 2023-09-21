import express from "express";
import { authenticateJWT, isAdmin } from "../middlewares/authMiddleware";
import {
  getAllProducts,
  deleteProduct,
  getProductByID,
  createProduct,
  updateProduct,
  rating,
  uploadImages,
} from "../controller/ProductController";
import {
  productImgResize,
  uploadPhoto,
} from "../controller/uploadImagesController";
const router = express.Router();
router.get("/", getAllProducts);
router.get("/:id", getProductByID);
// authenticated routes
router.put("/rating", authenticateJWT, rating);
// admin routes
router.post("/", authenticateJWT, isAdmin, createProduct);
router.put("/:id", authenticateJWT, isAdmin, updateProduct);
router.delete("/:id", authenticateJWT, isAdmin, deleteProduct);
router.put(
  "/upload/:id",
  authenticateJWT,
  isAdmin,
  uploadPhoto.array("images", 10),
  productImgResize,
  uploadImages
);
export default router;
