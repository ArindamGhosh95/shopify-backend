import fs from "fs";
import path from "path";
const { v4: uuidv4 } = require("uuid");
export class CategoryStore {
  categories = [];
  filePath;
  constructor(fileName = "/data/productCategory.json") {
    this.filePath = path.join(__dirname, fileName);
    this.loadCategoriesFromFile();
  }
  loadCategoriesFromFile() {
    try {
      const fileData = fs.readFileSync(this.filePath, "utf8");
      this.categories = JSON.parse(fileData);
    } catch (error) {
      throw new Error(error);
    }
  }
  saveCategory() {
    try {
      fs.writeFileSync(
        this.filePath,
        JSON.stringify(this.categories, null, 2),
        "utf-8"
      );
    } catch (e) {
      throw new Error(e);
    }
  }
  createCategory(categoryDate) {
    const { id = uuidv4(), title } = categoryDate;
    const newCategory = { id, title };
    this.categories.push(newCategory);
    this.saveCategory();
    return newCategory;
  }
  updateCategory(id, body) {
    try {
      const category = this.categories.find((x) => {
        return x.id === id;
      });
      if (category) {
        category.title = body.title;
        this.saveCategory();
        return category;
      } else {
        throw new Error(`Category not found with id ${id}.`);
      }
    } catch (e) {
      throw new Error(e);
    }
  }
  deleteCategory(id) {
    try {
      const categoryIdx = this.categories.findIndex((x) => {
        return x.id === id;
      });
      if (categoryIdx !== -1) {
        this.categories.splice(categoryIdx, 1);
        this.saveCategory();
      } else {
        throw new Error(`Category not found with id ${id}.`);
      }
    } catch (e) {
      throw new Error(e);
    }
  }
  getCategorybyId(id) {
    try {
      const category = this.categories.find((x) => {
        return x.id === id;
      });
      if (category) {
        return category;
      } else {
        throw new Error(`Category not found with id ${id}.`);
      }
    } catch (e) {
      throw new Error(e);
    }
  }
  getCategories() {
    return this.categories;
  }
}
