import expressAsyncHandler from "express-async-handler";
import { ProductStore } from "../models/Product";
import slugify from "slugify";
import { UserStore } from "../models/User";

const productStore = new ProductStore();

// get a product by id
export const getProductByID = expressAsyncHandler(async (req, res) => {
  const { id } = req?.params;
  const product = productStore.getProductById(id);
  res.json({ product });
});
// create a product
export const createProduct = expressAsyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = productStore.createProduct(req.body);
    res.json(newProduct);
  } catch (error: any) {
    throw new Error(error);
  }
});
// update a product
export const updateProduct = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updatedProduct = productStore.updateProduct(id, req.body);
    res.json(updatedProduct);
  } catch (error: any) {
    throw new Error(error);
  }
});
// delete a product
export const deleteProduct = expressAsyncHandler(async (req, res) => {
  const { id } = req?.params;
  try {
    productStore.deleteProductById(id);
    res.json({ message: "Product deleted successfully." });
  } catch (err: any) {
    throw new Error(err.message);
  }
});
//add product to wishlist of a user
export const addToWishlist = expressAsyncHandler(async (req: any, res: any) => {
  const { id } = req?.user;
  const { prodId } = req?.body;
  const userStore = new UserStore();
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
//add rating to product
export const rating = expressAsyncHandler(async (req: any, res: any) => {
  const { id } = req?.user;
  const { star, comment, prodId } = req.body;

  try {
    const product = productStore.getProductById(prodId);
    const existingRatings = product?.ratings;
    if (product && !product.ratings) {
      productStore.updateProduct(prodId, {
        ratings: [],
      });
    }
    if (product && product.ratings) {
      const alreadyRated = product.ratings.find((userId) => {
        return userId.posted_by === id;
      });
      const alreadyRatedIdx = product.ratings.findIndex((userId) => {
        return userId.posted_by === id;
      });

      if (alreadyRated) {
        alreadyRated.comment = comment;
        alreadyRated.star = star;
        alreadyRated.posted_by = id;
        existingRatings?.splice(alreadyRatedIdx, 1);
        existingRatings?.push(alreadyRated);
      } else {
        existingRatings?.push({ star: star, comment: comment, posted_by: id });
      }

      let totalRating = existingRatings?.length;
      let ratingsum = existingRatings
        ?.map((item) => {
          return item.star;
        })
        .reduce((prev, curr) => prev + curr, 0);
      if (ratingsum && totalRating) {
        let actualRating = Math.round(ratingsum / totalRating);
        productStore.updateProduct(prodId, {
          ratings: existingRatings,
          avgrating: actualRating,
        });
      }
      return res.json({ product: productStore.getProductById(product.id) });
    }
    return res.json({
      message: "Some error occured during rating the product.",
    });
  } catch (error: any) {
    throw new Error(error);
  }
});
// get all product is mei pagination kaise add hoga
export const getAllProducts = expressAsyncHandler(
  async (req: any, res: any) => {
    const products = productStore.getAllProducts();
    return res.json({
      message: "Products fetched successfully.",
      product: products,
    });
  }
);
//upload product images
export const uploadImages = expressAsyncHandler(async (req: any, res: any) => {
  const { id } = req.params;
  try {
    const product = productStore.getProductById(id);
    const files = req.files;

    if (files && product) {
      for (const file of files) {
        product.images.push({
          public_id: file.filename,
          url: file.path.replace(/\\/g, "/"),
        });
      }
      const updatedProduct = productStore.updateProduct(id, product);
      res.json(updatedProduct);
    }
  } catch (e: any) {
    throw new Error(e);
  }
});
