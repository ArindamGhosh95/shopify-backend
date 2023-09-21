import { readFileSync, writeFileSync } from "fs";
import { v4 as uuidv4 } from "uuid";

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
  createCart(cartData) {
    try {
      validateCart(cartData);
      cartData.id = uuidv4();
      this.cart.push(cartData);
      this.saveCartToFile();
      return getCartByID(cartData.id);
    } catch (e) {
      throw new Error(e);
    }
  }
  getCartByID(id) {
    return this.cart.find((x) => {
      return x.id === id;
    });
  }
  validateCart(cartData) {
    if (
      cartData &&
      cartData.cartTotal > 0 &&
      totalAfterDiscount > 0 &&
      orderby &&
      products &&
      products.prodId &&
      products.count &&
      products.color &&
      products.price
    ) {
      throw new Error("Validation failed for cart.");
    }
  }
}
/*

products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        count: Number,
        color: String,
        price: Number,
      },
    ],
    cartTotal: Number,
    totalAfterDiscount: Number,
    orderby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },

*/
