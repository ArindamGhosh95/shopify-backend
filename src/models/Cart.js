import { readFileSync, writeFileSync } from "fs";
import { v4 as uuidv4 } from "uuid";
import path from "path";

export class CartStore {
  cart = [];
  filepath;
  constructor(fileName = "/data/cart.json") {
    this.filepath = path.join(__dirname, fileName);
    this.loadCartFormFile();
  }
  loadCartFormFile() {
    try {
      const fileData = readFileSync(this.filepath, "utf-8");
      this.cart = JSON.parse(fileData);
    } catch (e) {
      throw new Error(e);
    }
  }
  saveCartToFile() {
    try {
      writeFileSync(this.filepath, JSON.stringify(this.cart, null, 2), "utf8");
    } catch (e) {
      throw new Error(e);
    }
  }
  createCart(cartData, userId) {
    try {
      cartData.id = uuidv4();
      cartData.orderby = userId;
      this.validateCart(cartData);
      console.log(cartData);
      this.cart.push(cartData);
      this.saveCartToFile();
      return this.getCartByUserID(userId);
    } catch (e) {
      throw new Error(e);
    }
  }
  updateCart(cartId, cartData) {
    try {
      const currentCartID = this.cart.findIndex((x) => x.id === cartId);
      if (currentCartID !== -1) {
        this.cart[currentCartID] = { ...this.cart[currentCartID], ...cartData };
        this.saveCartToFile();
        return this.cart[currentCartID];
      } else {
        throw new Error(`Cart not found with id ${cartId}`);
      }
    } catch (error) {
      throw new Error(error);
    }
  }
  deleteCartByID(cartId) {
    try {
      const currentCartID = this.cart.findIndex((x) => x.id === cartId);
      if (currentCartID !== -1) {
        this.cart.splice(currentCartID, 1);
        this.saveCartToFile();
      } else {
        throw new Error(`Cart not found with id ${cartId}`);
      }
    } catch (error) {
      throw new Error(error);
    }
  }
  deleteCartByUserID(userId) {
    try {
      const currentCartByUserId = this.cart.findIndex(
        (x) => x.orderby === userId
      );
      if (currentCartByUserId !== -1) {
        this.cart.splice(currentCartByUserId, 1);
        this.saveCartToFile();
      } else {
        throw new Error(`Cart not found with user id ${userId}`);
      }
    } catch (error) {
      throw new Error(error);
    }
  }
  getCartByID(id) {
    return this.cart.find((x) => {
      return x.id === id;
    });
  }
  getCartByUserID(userId) {
    return this.cart.find((x) => {
      return x.orderby === userId;
    });
  }

  validateCart(cartData) {
    if (
      cartData &&
      cartData.cartTotal > 0 &&
      cartData.totalAfterDiscount > 0 &&
      cartData.orderby &&
      cartData.items &&
      cartData.items.productId &&
      cartData.items.quantity &&
      cartData.items.color &&
      cartData.items.price
    ) {
      throw new Error("Validation failed for cart.");
    }
  }
}
/*

products: [
      {
        product: productID
        count: 1,
        color: blue,
        price: 790,
      },
      {
        product: productID
        count: 2,
        color: red,
        price: 200,
      }
    ],
    cartTotal: 990,
    totalAfterDiscount: 970,
    orderby: userId
  }

*/
