import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { v4 as uuidv4, validate } from "uuid";
import { isPasswordMatch } from "../utils/hashpasswords";
import { generateToken } from "../config/jwtToken";
import { generateRefreshToken } from "../config/refreshtoken";
import { User, UserStore } from "../models/User";
import { sendEmail } from "./EmailController";
import { Product, ProductStore } from "../models/Product";
import { CartStore } from "../models/Cart";
import { CouponStore } from "../models/Coupon";
import { OrderStore, ProductStatus } from "../models/Order";

const userStore = new UserStore();
const cartStore = new CartStore();
const productStore = new ProductStore();
const couponStore = new CouponStore();

//create user
export const createUser = expressAsyncHandler(async (req: any, res: any) => {
  const email: string = req?.body?.email;
  const findUser: User | undefined = userStore.getUserByEmail(email);
  if (!findUser) {
    //create new user
    const newUser: User = {
      id: uuidv4(),
      firstname: req?.body?.firstname,
      lastname: req?.body?.lastname,
      email: req?.body?.email,
      mobile: req?.body?.mobile,
      password: req?.body?.password,
      role: req?.body?.role,
      isBlocked: false,
      cart: [],
      wishlist: [],
    };
    userStore.createUser(newUser);
    res.json({
      message: "User Registered Successfully",
      email: newUser?.email,
      token: generateToken(newUser.id, newUser.email),
    });
  } else {
    throw new Error("User Already Exists");
  }
});
// login user
export const loginUser = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const findUser: User | undefined = userStore.getUserByEmail(email);
  if (findUser && (await isPasswordMatch(password, findUser.password))) {
    const refreshToken = generateRefreshToken(findUser.id, findUser.email);
    userStore.updateUserById(findUser.id, { refreshToken: refreshToken });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      _id: findUser?.id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser.id, findUser.email),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});
// login admin
export const loginAdmin = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const findUser: User | undefined = userStore.getUserByEmail(email);
  if (findUser?.role !== "admin") {
    throw new Error("User is not an Admin.");
  }
  if (findUser && (await isPasswordMatch(password, findUser.password))) {
    const refreshToken = generateRefreshToken(findUser.id, findUser.email);
    userStore.updateUserById(findUser.id, { refreshToken: refreshToken });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      _id: findUser?.id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser.id, findUser.email),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});
// refresh token
export const handleRefreshToken = expressAsyncHandler(
  async (req: any, res: any) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) {
      throw new Error("Refresh token not found in Cookies.");
    }
    const refreshToken = cookie?.refreshToken;
    const findUser = userStore.findUserByRefreshToken(refreshToken);
    jwt.verify(
      refreshToken,
      process.env.JWT_SECRET || "mysecret",
      (err: any, user: any) => {
        if (
          err ||
          (user.id !== findUser?.id && user.email === findUser?.email)
        ) {
          throw new Error("Token Expired Please login again.");
        }
        const accessToken = generateToken(findUser?.id, findUser?.email);
        return res.json({ token: accessToken });
      }
    );
  }
);
// logout User
export const logoutUser = expressAsyncHandler(async (req: any, res: any) => {
  const refreshToken = req?.cookies?.refreshToken;
  const findUser = userStore.findUserByRefreshToken(refreshToken);
  if (!findUser) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204);
  }
  userStore.updateUserById(findUser.id, { refreshToken: "" });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  return res.json({
    message: "User Logged-Out successfully",
  });
});
// update user
export const updatedUser = expressAsyncHandler(async (req: any, res: any) => {
  const { id } = req?.user;

  const findUser: User | undefined = userStore.getUserById(id);

  if (findUser) {
    const newUser: User = {
      id: findUser.id,
      firstname: req?.user?.firstname ?? findUser.firstname,
      lastname: req?.user?.lastname ?? findUser.lastname,
      email: req?.user?.email ?? findUser.email,
      mobile: req?.user?.mobile ?? findUser.mobile,
      password: findUser.password,
      role: req?.user?.role ?? findUser.role,
      isBlocked: false,
      cart: req?.user?.cart ?? findUser.cart,
      wishlist: req?.user?.wishlist ?? findUser.wishlist,
    };
    userStore.updateUserById(id, newUser);
    const updatedUser: User | undefined = userStore.getUserById(id);
    return res.json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } else {
    throw new Error("User not found.");
  }
});
// get all users
export const getallUser = expressAsyncHandler(async (req: any, res: any) => {
  const allUsers = userStore.getAllUsers();
  return res.json({
    message: "User fetched successfully",
    user: allUsers,
  });
});
// get a user by id
export const getUserById = expressAsyncHandler(async (req: any, res: any) => {
  const { id } = req.params;

  const findUser: User | undefined = userStore.getUserById(id);
  if (!findUser) {
    throw new Error("User not found");
  }
  return res.json({
    user: findUser,
  });
});
// delete a user
export const deleteUserById = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    userStore.deleteUserById(id);
    res.json({
      message: `User with id ${id} deleted successfully.`,
    });
  } catch (error: any) {
    throw new Error("Error occured during deleteUserById");
  }
});
// block user
export const blockUser = expressAsyncHandler(async (req: any, res: any) => {
  const { id } = req.params;

  const findUser: User | undefined = userStore.getUserById(id);
  if (findUser) {
    const newUser = {
      isBlocked: true,
    };
    userStore.updateUserById(id, newUser);
    const updatedUser: User | undefined = userStore.getUserById(id);
    return res.json({
      message: "User blocked successfully",
      user: updatedUser,
    });
  } else {
    throw new Error("User not found.");
  }
});
// unblock user
export const unBlockUser = expressAsyncHandler(async (req: any, res: any) => {
  const { id } = req.params;

  const findUser: User | undefined = userStore.getUserById(id);
  if (findUser) {
    const newUser = {
      isBlocked: false,
    };
    userStore.updateUserById(id, newUser);
    const updatedUser: User | undefined = userStore.getUserById(id);
    return res.json({
      message: "User un-blocked successfully",
      user: updatedUser,
    });
  } else {
    throw new Error("User not found.");
  }
});
//update password
export const updatePassword = expressAsyncHandler(
  async (req: any, res: any) => {
    const { id } = req.user;
    const { password } = req.body;

    const findUser: User | undefined = userStore.getUserById(id);
    if (findUser && password) {
      findUser.password = password;
      userStore.updateUserById(id, findUser);
      res.json({ message: "Password updated successfully." });
    } else {
      throw new Error("User not found. Could not update password.");
    }
  }
);
// password reset token
export const forgotPasswordToken = expressAsyncHandler(
  async (req: any, res: any) => {
    const { email } = req.body;
    const user = userStore.getUserByEmail(email);
    if (!user) throw new Error("User not found with this email");
    try {
      const token = userStore.createPasswordResetToken(user.id);
      const resetURL = `Hi, Please follow this link to reset Your Password. This link is valid till 10 minutes from now. <a href='http://localhost:3000/api/user/reset-password/${token}'>Click Here</>`;
      const data = {
        to: email,
        text: "Hey User",
        subject: "Forgot Password Link",
        htm: resetURL,
      };
      //sendEmail(data, req, res);
      res.json(token);
    } catch (e: any) {
      throw new Error(e);
    }
  }
);
// reset password
export const resetPassword = expressAsyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const userArray = userStore.getAllUsers();
  const user: User | undefined = userArray.find((user) => {
    return (
      user.passwordResetToken === hashedToken &&
      user.passwordResetExpiresIn !== undefined &&
      new Date(user.passwordResetExpiresIn).getTime() > Date.now()
    );
  });
  if (!user) throw new Error(" Token Expired, Please try again later");
  user.password = password;
  user.passwordChangedAt = new Date(Date.now());
  user.passwordResetToken = undefined;
  user.passwordResetExpiresIn = undefined;
  userStore.updateUserById(user.id, user);
  res.json(user);
});
//add product to wishlist of a user
export const addToWishlist = expressAsyncHandler(async (req: any, res: any) => {
  const { id } = req?.user;
  const { prodId } = req?.body;
  const productStore = new ProductStore();
  const product = productStore.getProductById(prodId);
  const user = userStore.getUserById(id);
  const alreadyAdded = user?.wishlist.find((id) => {
    return id === prodId;
  });
  if (!product) {
    throw new Error("Product Not found.");
  }
  if (!user) {
    throw new Error("User Not found.");
  }
  if (!alreadyAdded) {
    user.wishlist.push(product.id);
    userStore.updateUserById(user.id, user);
    const updatedUser = userStore.getUserById(id);
    res.json({
      message: "Product added to Wishlist.",
      user: {
        id: updatedUser?.id,
        name: updatedUser?.firstname,
        email: updatedUser?.email,
        wishList: updatedUser?.wishlist,
      },
    });
  } else {
    const productidx = user.wishlist.findIndex((x) => {
      return x === prodId;
    });
    const updatedUser = userStore.getUserById(id);
    user.wishlist.splice(productidx, 1);
    userStore.updateUserById(user.id, user);
    res.json({
      message: "Product removed from wishlist.",
      user: {
        id: updatedUser?.id,
        name: updatedUser?.firstname,
        email: updatedUser?.email,
        wishList: updatedUser?.wishlist,
      },
    });
  }
});
//getWishlist
export const getWishlist = expressAsyncHandler(async (req: any, res: any) => {
  const { id } = req.user;
  const productStore = new ProductStore();
  try {
    const findUser = userStore.getUserById(id);
    const wishListArray: (Product | undefined)[] = [];
    if (findUser) {
      const wishList = findUser.wishlist;
      wishList.forEach((x) => {
        const product = productStore.getProductById(x);
        wishListArray.push(product);
      });
    } else {
      throw new Error("User not found.");
    }
    res.json({ wishlist: wishListArray });
  } catch (e: any) {
    throw new Error(e);
  }
});
// save address
export const saveAddress = expressAsyncHandler(async (req: any, res: any) => {
  const { id } = req.user;
  const { address } = req.body;
  const findUser = userStore.getUserById(id);
  if (findUser) {
    findUser.address = address;
    userStore.updateUserById(findUser.id, findUser);
    res.json(userStore.getUserById(findUser.id));
  } else {
    throw new Error("User not found.");
  }
});
// user cart
type Cart = {
  items: CartItem[];
  cartTotal: number;
  totalAfterDiscount: number;
};
type CartItem = {
  productId: string;
  quantity: number;
  price: number;
  color: string;
};
//some functionality still needed here
export const addToCart = expressAsyncHandler(async (req: any, res: any) => {
  try {
    const { id } = req.user;
    const { cart } = req.body;
    const obj: Cart = {
      items: [],
      cartTotal: 0,
      totalAfterDiscount: 0,
    };
    cart.forEach((element: any) => {
      const prod = productStore.getProductById(element.id);
      if (prod) {
        obj.items.push({
          productId: prod.id,
          quantity: element.count,
          price: prod.price,
          color: element.color,
        });
        obj.cartTotal += element.count * prod.price;
        obj.totalAfterDiscount += element.count * prod.price;
      }
    });
    const createdCart = cartStore.createCart(obj, id);
    res.json(createdCart);
  } catch (e: any) {
    throw new Error(e);
  }
});
//get cart by user id
export const getUserCart = expressAsyncHandler(async (req: any, res: any) => {
  try {
    const { id } = req.user;
    const cartData = cartStore.getCartByUserID(id);
    const obj: any = {
      items: [],
      cartTotal: 0,
      totalAfterDiscount: 0,
    };
    if (cartData) {
      cartData.items.forEach((x: any) => {
        const prod = productStore.getProductById(x.productId);
        obj.items.push({
          products: prod,
          quantity: x.count,
          price: x.price,
          color: x.color,
        });
      });
      obj.cartTotal = cartData.cartTotal;
      obj.totalAfterDiscount = cartData.totalAfterDiscount;
      res.json(obj);
    } else {
      throw new Error("Not Found.");
    }
  } catch (e: any) {
    throw new Error(e);
  }
});
// empty cart
export const emptyCart = expressAsyncHandler(async (req: any, res: any) => {
  const { id } = req.user;
  try {
    const user = userStore.getUserById(id);
    if (user) {
      cartStore.deleteCartByUserID(user.id);
      res.json({ message: "Cart deleted successsfully." });
    }
  } catch (e: any) {
    throw new Error(e);
  }
});
// apply coupon
export const applyCoupon = expressAsyncHandler(async (req: any, res: any) => {
  const { id } = req.user;
  const { coupon } = req.body;
  try {
    const cartData = cartStore.getCartByUserID(id);
    const existingCoupon = couponStore.getCouponbyName(coupon);
    if (
      cartData &&
      existingCoupon &&
      existingCoupon.expiry &&
      existingCoupon.discount
    ) {
      const date = new Date(Date.now());
      const expiryDate = new Date(existingCoupon.expiry);
      if (date < expiryDate) {
        let priceAfterDiscount = (
          cartData.cartTotal -
          (existingCoupon.discount * cartData.cartTotal) / 100
        ).toFixed(2);
        cartData.totalAfterDiscount = priceAfterDiscount;
        const cart = cartStore.updateCart(cartData.id, cartData);
        res.json(cart);
      } else {
        res.json("Coupon expired.");
      }
    } else {
      throw new Error("Coupon not found.");
    }
  } catch (e: any) {
    throw new Error(e);
  }
});
type Order = {
  product: [];
  payment: PaymentIntent;
  orderStatus: string;
  orderBy: string;
};
type PaymentIntent = {
  method: string;
  amount: number;
  status?: string;
  created: Date;
  currency: string;
};
// create a new order
export const createOrder = expressAsyncHandler(async (req: any, res: any) => {
  const { id } = req.user;
  const { paymentType, couponApplied } = req.body;
  const orderStore = new OrderStore();
  try {
    if (!paymentType && !(paymentType.toString().toLowerCase() === "cash"))
      throw new Error("Create cash order failed");
    const userCart = cartStore.getCartByUserID(id);

    //assuming user already has a cart
    let finalAmout = 0;
    if (couponApplied && userCart.totalAfterDiscount) {
      finalAmout = userCart.totalAfterDiscount;
    } else {
      finalAmout = userCart.cartTotal;
    }
    const order: Order = {
      product: userCart.items,
      payment: {
        method: "Cash on delivery",
        amount: userCart.totalAfterDiscount,
        created: new Date(Date.now()),
        currency: "INR",
      },
      orderStatus: ProductStatus.Default,
      orderBy: userCart.orderby,
    };
    orderStore.createOrder(order);
    userCart.items.forEach((product: any) => {
      const existingProduct = productStore.getProductById(product.productId);
      if (existingProduct) {
        existingProduct.sold += product.quantity;
        existingProduct.quantity -= product.quantity;
        productStore.updateProduct(existingProduct.id, existingProduct);
      }
    });
    res.json({ message: "success" });
  } catch (e: any) {
    throw new Error(e);
  }
});
// get orders
export const getOrders = expressAsyncHandler(async (req: any, res: any) => {
  const { id } = req.user;
  try {
    const orderStore = new OrderStore();
    const orders = orderStore.getOrdersByUserId(id);
    const user = userStore.getUserById(orders.orderBy);
    if (orders && user) {
      orders.orderBy = {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        mobile: user.mobile,
        address: user.address,
      };
      orders.product.forEach((x: any) => {
        const product = productStore.getProductById(x.productId);
        x.productId = product;
      });
      res.json(orders);
    }
  } catch (e: any) {
    throw new Error(e);
  }
});

// get all orders
export const getAllOrders = expressAsyncHandler(async (req, res) => {
  try {
    const orderStore = new OrderStore();
    const orderList = orderStore.getAllOrders();
    orderList.forEach((order: any) => {
      const user = userStore.getUserById(order.orderBy);
      if (order && user) {
        order.orderBy = {
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          mobile: user.mobile,
          address: user.address,
        };
        order.product.forEach((x: any) => {
          const product = productStore.getProductById(x.productId);
          x.productId = product;
        });
      }
    });
    res.json(orderList);
  } catch (error: any) {
    throw new Error(error);
  }
});

// getOrder By UserId
export const getOrderByUserId = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const orderStore = new OrderStore();
    const orders = orderStore.getOrdersByUserId(id);
    const user = userStore.getUserById(orders.orderBy);
    if (orders && user) {
      orders.orderBy = {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        mobile: user.mobile,
        address: user.address,
      };
      orders.product.forEach((x: any) => {
        const product = productStore.getProductById(x.productId);
        x.productId = product;
      });
      res.json(orders);
    }
  } catch (e: any) {
    throw new Error(e);
  }
});

// update Order Status
export const updateOrderStatus = expressAsyncHandler(
  async (req: any, res: any) => {
    const { status } = req.body;
    const { id } = req.params;
    try {
      const orderStore = new OrderStore();
      const currentOrder = orderStore.getOrderById(id);
      const order = {
        ...currentOrder,
        orderStatus: status,
        payment: {
          ...currentOrder.payment,
          status: status,
        },
      };
      const updatedOrder = orderStore.updateOrder(id, order);
      res.json(updatedOrder);
    } catch (error: any) {
      throw new Error(error);
    }
  }
);
