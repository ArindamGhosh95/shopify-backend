import expressAsyncHandler from "express-async-handler";
import { CategoryStore } from "../models/productCategory";

const categoryStore = new CategoryStore();

export const getAllCategories = expressAsyncHandler((req: any, res: any) => {
  res.json({ categories: categoryStore.getCategories() });
});
export const createCategory = expressAsyncHandler(async (req, res) => {
  try {
    const newCategory = categoryStore.createCategory(req.body);
    res.json(newCategory);
  } catch (e: any) {
    throw new Error(e);
  }
});
export const updateCategory = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const newCategory = categoryStore.updateCategory(id, req.body);
    res.json(newCategory);
  } catch (e: any) {
    throw new Error(e);
  }
});
export const deleteCategory = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    categoryStore.deleteCategory(id);
    res.json({ message: "Deleted Successfully." });
  } catch (e: any) {
    throw new Error(e);
  }
});

export const getCategorybyId = expressAsyncHandler((req: any, res: any) => {
  const { id } = req.params;
  res.json({ categories: categoryStore.getCategorybyId(id) });
});
