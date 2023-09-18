import expressAsyncHandler from "express-async-handler";
import { ColorStore } from "../models/Color";

const colorStore = new ColorStore();
export const createColor = expressAsyncHandler(async (req, res) => {
  try {
    const addedColor = colorStore.createColor(req.body);
    res.json(addedColor);
  } catch (e: any) {
    throw new Error(e);
  }
});
export const getAllColors = expressAsyncHandler((req: any, res: any) => {
  res.json({ colors: colorStore.getAllColors() });
});

export const updateColor = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const newCategory = colorStore.updateColor(id, req.body);
    res.json(newCategory);
  } catch (e: any) {
    throw new Error(e);
  }
});
export const deleteColor = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    colorStore.deleteColor(id);
    res.json({ message: "Deleted Successfully." });
  } catch (e: any) {
    throw new Error(e);
  }
});

export const getColorbyId = expressAsyncHandler((req: any, res: any) => {
  const { id } = req.params;
  res.json({ brands: colorStore.getColorbyId(id) });
});
