import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import { UserStore } from "./User";

export const ProductStatus = {
  Default: "Not Processed",
  Processing: "Processing",
  Dispatched: "Dispatched",
  Cancelled: "Cancelled",
  Delivered: "Delivered",
};
const hashmap = new Map();
hashmap.set(ProductStatus.Default, "Not Processed");
hashmap.set(ProductStatus.Dispatched, "Dispatched");
hashmap.set(ProductStatus.Processing, "Processing");
hashmap.set(ProductStatus.Cancelled, "Cancelled");
hashmap.set(ProductStatus.Delivered, "Delivered");

function validateProductStatus(status) {
  if (!hashmap.has(status)) {
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
    const newOrder = {
      id,
      product,
      count,
      color,
      payment,
      orderStatus,
      orderBy,
    };
    this.orders.push(newOrder);
    this.saveOrders();
  }
  loadOrdersFromFile() {
    try {
      const fileData = readFileSync(this.filePath, "utf8");
      this.orders = JSON.parse(fileData);
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
    const findUser = userStore.getUserById(order.orderBy);
    if (order.orderBy && order.orderBy !== null && !findUser) {
      throw new Error("User not found.");
    }
    try {
      this.createOrderWithDefaults(order);
      return this.orders;
    } catch (e) {
      throw new Error(e);
    }
  }
  getOrdersByUserId(userId) {
    try {
      return this.orders.find((x) => {
        return x.orderBy === userId;
      });
    } catch (e) {
      throw new Error(e);
    }
  }
  getAllOrders() {
    try {
      return this.orders;
    } catch (error) {
      throw new Error(error);
    }
  }
  updateOrder(id, order) {
    try {
      validateProductStatus(order.orderStatus);
      const orderIdx = this.orders.findIndex((order) => {
        return order.id === id;
      });
      console.log(orderIdx);
      if (orderIdx !== -1) {
        this.orders[orderIdx] = { ...this.orders[orderIdx], ...order };
        this.saveOrders();
        return this.orders[orderIdx];
      }
    } catch (e) {
      throw new Error(e);
    }
  }
  getOrderById(id) {
    return this.orders.find((order) => {
      return order.id === id;
    });
  }
}
