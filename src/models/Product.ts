import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
interface Image {
  public_id: string;
  url: String;
}
interface Rating {
  star: number;
  comment: number;
  posted_by: string;
}
export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  quantity: number;
  sold: number;
  images: Image[];
  color: [];
  tags: string;
  ratings: Rating[];
  avgrating: number;
}

export class ProductStore {
  private products: Product[] = [];
  private filePath: string;
  constructor(fileName: string = "/data/products.json") {
    this.filePath = path.join(__dirname, fileName);
    this.loadProductsFromFile();
  }
  private loadProductsFromFile() {
    try {
      const fileData = fs.readFileSync(this.filePath, "utf8");
      this.products = JSON.parse(fileData);
    } catch (error) {
      console.error("Error loading data from file:", error);
    }
  }
  private saveProductsToFile() {
    try {
      fs.writeFileSync(
        this.filePath,
        JSON.stringify(this.products, null, 2),
        "utf-8"
      );
    } catch (e) {
      console.log("Error saving products to file " + e);
    }
  }

  createProduct(product: Product): Product[] {
    try {
      product.id = uuidv4();
      const {
        id = uuidv4(),
        title = "",
        slug = "",
        description = "",
        category = "",
        brand = "",
        price = 1000,
        quantity = 10,
        sold = 0,
        images = [],
        tags = "",
        ratings = [],
        avgrating = 0,
        color = [],
      } = product;
      const newProduct: Product = {
        title,
        description,
        category,
        brand,
        quantity,
        sold,
        images,
        tags,
        slug,
        id,
        ratings,
        avgrating,
        price,
        color,
      };
      this.products.push(newProduct);
      this.saveProductsToFile();
      return this.products;
    } catch (err: any) {
      throw new Error(err);
    }
  }
  updateProduct(id: string, updatedProduct: Partial<Product>): Product {
    const productIndex = this.products.findIndex((product) => {
      return product.id === id;
    });

    if (productIndex !== -1) {
      this.products[productIndex] = {
        ...this.products[productIndex],
        ...updatedProduct,
      };
      this.saveProductsToFile();
      return this.products[productIndex];
    } else {
      throw new Error(`Product not found with id ${id}`);
    }
  }
  getAllProducts(): Product[] {
    return this.products;
  }
  getProductById(id: string) {
    return this.products.find((x) => {
      return x.id === id;
    });
  }
  deleteProductById(id: string) {
    const idx = this.products.findIndex((x) => {
      return x.id === id;
    });
    if (idx !== -1) {
      this.products.splice(idx, 1);
      this.saveProductsToFile();
    } else {
      throw new Error(
        `Deletion unsuccessfull. Product with id ${id} not found.`
      );
    }
  }
}
