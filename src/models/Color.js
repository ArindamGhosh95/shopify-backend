import fs from "fs";
import path from "path";
const { v4: uuidv4 } = require("uuid");
export class ColorStore {
  colorList = [];
  filePath;
  constructor(fileName = "/data/color.json") {
    this.filePath = path.join(__dirname, fileName);
    this.loadColorsFromFile();
  }
  loadColorsFromFile() {
    try {
      const fileData = fs.readFileSync(this.filePath, "utf8");
      this.colorList = JSON.parse(fileData);
    } catch (error) {
      throw new Error(error);
    }
  }
  saveColor() {
    try {
      fs.writeFileSync(
        this.filePath,
        JSON.stringify(this.colorList, null, 2),
        "utf-8"
      );
    } catch (e) {
      throw new Error(e);
    }
  }
  createColor(brandData) {
    const { id = uuidv4(), title } = brandData;
    const newColor = { id, title };
    this.colorList.push(newColor);
    this.saveColor();
    return newColor;
  }
  updateColor(id, body) {
    try {
      const brand = this.colorList.find((x) => {
        return x.id === id;
      });
      if (brand) {
        brand.title = body.title;
        this.saveColor();
        return brand;
      } else {
        throw new Error(`Color not found with id ${id}.`);
      }
    } catch (e) {
      throw new Error(e);
    }
  }
  deleteColor(id) {
    try {
      const brandIdx = this.colorList.findIndex((x) => {
        return x.id === id;
      });
      if (brandIdx !== -1) {
        this.colorList.splice(brandIdx, 1);
        this.saveColor();
      } else {
        throw new Error(`Color not found with id ${id}.`);
      }
    } catch (e) {
      throw new Error(e);
    }
  }
  getColorbyId(id) {
    try {
      const brand = this.colorList.find((x) => {
        return x.id === id;
      });
      if (brand) {
        return brand;
      } else {
        throw new Error(`Color not found with id ${id}.`);
      }
    } catch (e) {
      throw new Error(e);
    }
  }
  getAllColors() {
    return this.colorList;
  }
}
