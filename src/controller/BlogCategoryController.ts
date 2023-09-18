import expressAsyncHandler from "express-async-handler";
import { BlogCategoryStore } from "../models/BlogCategory";

const blogCategoryStore = new BlogCategoryStore();

export const getAllBlogCategories = expressAsyncHandler(
  (req: any, res: any) => {
    res.json({ categories: blogCategoryStore.getCategories() });
  }
);
export const createBlogCategory = expressAsyncHandler(async (req, res) => {
  try {
    const newCategory = blogCategoryStore.createCategory(req.body);
    res.json(newCategory);
  } catch (e: any) {
    throw new Error(e);
  }
});
export const updateBlogCategory = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const newCategory = blogCategoryStore.updateCategory(id, req.body);
    res.json(newCategory);
  } catch (e: any) {
    throw new Error(e);
  }
});
export const deleteBlogCategory = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    blogCategoryStore.deleteCategory(id);
    res.json({ message: "Deleted Successfully." });
  } catch (e: any) {
    throw new Error(e);
  }
});

export const getBlogCategorybyId = expressAsyncHandler((req: any, res: any) => {
  const { id } = req.params;
  res.json({ categories: blogCategoryStore.getCategorybyId(id) });
});
