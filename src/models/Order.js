import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import { UserStore } from "./User";

const ProductStatus = {
  Default: "Not Processed",
  CashOnDelivery: "Cash on Delivery",
  Processing: "Processing",
  Dispatched: "Dispatched",
  Cancelled: "Cancelled",
  Delivered: "Delivered",
};
function validateProductStatus(status) {
  if (!(status in ProductStatus)) {
    throw new Error("Invalid product status");
  }
}
export class OrderStore {
  filepath;
  orders = [];
  constructor(fileName = "/data/order.json") {
    this.filePath = join(__dirname, fileName);
    this.loadOrdersFromFile();
  }
  createOrderWithDefaults(orderData) {
    const {
      id = uuidv4(),
      product,
      count = 0,
      color,
      payment,
      orderStatus = ProductStatus.Default,
      orderBy,
    } = orderData;
    const newBlog = {
      id,
      product,
      count,
      color,
      payment,
      orderStatus,
      orderBy,
    };
    this.blogs.push(newBlog);
    this.saveOrders();
  }
  loadOrdersFromFile() {
    try {
      const fileData = readFileSync(this.filePath, "utf8");
      this.blogs = JSON.parse(fileData);
    } catch (error) {
      console.error("Error loading data from file:", error);
    }
  }
  saveOrders() {
    try {
      writeFileSync(
        this.filePath,
        JSON.stringify(this.orders, null, 2),
        "utf-8"
      );
    } catch (e) {
      throw new Error("Error saving data into file:" + e);
    }
  }
  createOrder(order) {
    validateProductStatus(order.orderStatus);
    const userStore = new UserStore();
    const findUser = userStore.getUserById(order.userId);
    if (order.orderBy && order.orderBy !== null && !findUser) {
      throw new Error("User not found.");
    }
    try {
      this.createOrderWithDefaults(order);
      return this.blogs;
    } catch (e) {
      throw new Error(e);
    }
  }
}
