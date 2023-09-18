import express from "express";
import { authenticateJWT, isAdmin } from "../middlewares/authMiddleware";
import {
  createColor,
  deleteColor,
  getAllColors,
  getColorbyId,
  updateColor,
} from "../controller/ColorController";
const router = express.Router();
router.get("/all-colors", getAllColors);
router.get("/:id", getColorbyId);
router.post("/", authenticateJWT, isAdmin, createColor);
router.put("/:id", authenticateJWT, isAdmin, updateColor);
router.delete("/:id", authenticateJWT, isAdmin, deleteColor);
export default router;
