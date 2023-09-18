import expressAsyncHandler from "express-async-handler";
import { BrandStore } from "../models/Brand";

const brandStore = new BrandStore();
export const createBrand = expressAsyncHandler(async (req, res) => {
  try {
    const addedBrand = brandStore.createBrand(req.body);
    res.json(addedBrand);
  } catch (e: any) {
    throw new Error(e);
  }
});
export const getAllBrands = expressAsyncHandler((req: any, res: any) => {
  res.json({ brands: brandStore.getAllBrands() });
});

export const updateBrand = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const newCategory = brandStore.updateBrand(id, req.body);
    res.json(newCategory);
  } catch (e: any) {
    throw new Error(e);
  }
});
export const deleteBrand = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    brandStore.deleteBrand(id);
    res.json({ message: "Deleted Successfully." });
  } catch (e: any) {
    throw new Error(e);
  }
});

export const getBrandbyId = expressAsyncHandler((req: any, res: any) => {
  const { id } = req.params;
  res.json({ brands: brandStore.getBrandbyId(id) });
});
