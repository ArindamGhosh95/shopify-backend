import fs from "fs";
import path from "path";
const { v4: uuidv4 } = require("uuid");
export class BrandStore {
  brandList = [];
  filePath;
  constructor(fileName = "/data/brand.json") {
    this.filePath = path.join(__dirname, fileName);
    this.loadBrandsFromFile();
  }
  loadBrandsFromFile() {
    try {
      const fileData = fs.readFileSync(this.filePath, "utf8");
      this.brandList = JSON.parse(fileData);
    } catch (error) {
      throw new Error(error);
    }
  }
  saveBrand() {
    try {
      fs.writeFileSync(
        this.filePath,
        JSON.stringify(this.brandList, null, 2),
        "utf-8"
      );
    } catch (e) {
      throw new Error(e);
    }
  }
  createBrand(brandData) {
    const { id = uuidv4(), title } = brandData;
    const newBrand = { id, title };
    this.brandList.push(newBrand);
    this.saveBrand();
    return newBrand;
  }
  updateBrand(id, body) {
    try {
      const brand = this.brandList.find((x) => {
        return x.id === id;
      });
      if (brand) {
        brand.title = body.title;
        this.saveBrand();
        return brand;
      } else {
        throw new Error(`Brand not found with id ${id}.`);
      }
    } catch (e) {
      throw new Error(e);
    }
  }
  deleteBrand(id) {
    try {
      const brandIdx = this.brandList.findIndex((x) => {
        return x.id === id;
      });
      if (brandIdx !== -1) {
        this.brandList.splice(brandIdx, 1);
        this.saveBrand();
      } else {
        throw new Error(`Brand not found with id ${id}.`);
      }
    } catch (e) {
      throw new Error(e);
    }
  }
  getBrandbyId(id) {
    try {
      const brand = this.brandList.find((x) => {
        return x.id === id;
      });
      if (brand) {
        return brand;
      } else {
        throw new Error(`Brand not found with id ${id}.`);
      }
    } catch (e) {
      throw new Error(e);
    }
  }
  getAllBrands() {
    return this.brandList;
  }
}
