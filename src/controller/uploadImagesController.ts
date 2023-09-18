import multer from "multer";
import path from "path";
import sharp from "sharp";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/images"));
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + uuidv4() + ".jpeg");
  },
});
const multerFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb({ message: "Unsupported file format" }, false);
  }
};
export const uploadPhoto = multer({
  storage: storage,
  fileFilter: multerFilter,
  limits: { fileSize: 1000000 },
});
export const productImgResize = async (req: any, res: any, next: any) => {
  if (!req.files) return next();
  await Promise.all(
    req.files.map(async (file: any) => {
      await sharp(file.path)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(path.join(__dirname, `../public/products/${file.filename}`));
      fs.unlinkSync(path.join(__dirname, `../public/images/${file.filename}`));
    })
  );
  next();
};

export const blogImgResize = async (req: any, res: any, next: any) => {
  if (!req.files) return next();
  await Promise.all(
    req.files.map(async (file: any) => {
      await sharp(file.path)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(path.join(__dirname, `../public/blogs/${file.filename}`));
      fs.unlinkSync(path.join(__dirname, `../public/images/${file.filename}`));
    })
  );
  next();
};
