import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export class CouponStore {
  couponList = [];
  filePath;
  constructor(fileName = "/data/coupon.json") {
    this.filePath = path.join(__dirname, fileName);
    this.loadCouponsFromFile();
  }
  loadCouponsFromFile() {
    try {
      const fileData = fs.readFileSync(this.filePath, "utf-8");
      this.couponList = JSON.parse(fileData);
    } catch (error) {
      throw new Error(error);
    }
  }
  saveCouponsToFile() {
    try {
      fs.writeFileSync(
        this.filePath,
        JSON.stringify(this.couponList, null, 2),
        "utf-8"
      );
    } catch (e) {
      throw new Error(e);
    }
  }
  createCoupon(couponData) {
    try {
      const { id = uuidv4(), name, expiry, discount } = couponData;

      const newName = name.toUpperCase();
      const expiryDate = new Date(expiry + "T00:00:00.000Z");
      const newCoupon = {
        id: id,
        name: newName,
        expiry: expiryDate,
        discount: discount,
      };
      const coupon = this.couponList.find((x) => {
        return x.name === newName;
      });
      if (!coupon) {
        this.couponList.push(newCoupon);
        this.saveCouponsToFile();
        return newCoupon;
      } else {
        return coupon;
      }
    } catch (e) {
      throw new Error(e);
    }
  }
  updateCoupon(id, body) {
    try {
      const { name, expiry, discount } = body;
      const couponIdx = this.couponList.findIndex((x) => {
        return x.id === id;
      });
      if (couponIdx !== -1) {
        const newName = name.toUpperCase();
        const expiryDate = new Date(expiry + "T00:00:00.000Z");
        const updatedCoupon = {
          id: this.couponList[couponIdx].id,
          name:
            newName && newName.length !== 0
              ? newName
              : this.couponList[couponIdx].name,
          expiry: !isNaN(expiryDate)
            ? expiryDate
            : this.couponList[couponIdx].expiry,
          discount:
            discount && isNaN(discount)
              ? discount
              : this.couponList[couponIdx].discount,
        };
        console.log(updatedCoupon);
        this.couponList[couponIdx] = {
          ...updatedCoupon,
        };
        this.saveCouponsToFile();
        return this.couponList[couponIdx];
      } else {
        throw new Error(`Coupon not found with id ${id}.`);
      }
    } catch (e) {
      throw new Error(e);
    }
  }
  deleteCoupon(id) {
    try {
      const couponIdx = this.couponList.findIndex((x) => {
        return x.id === id;
      });
      if (couponIdx !== -1) {
        this.couponList.splice(couponIdx, 1);
        this.saveCouponsToFile();
      } else {
        throw new Error(`Coupon not found with id ${id}.`);
      }
    } catch (e) {
      throw new Error(e);
    }
  }
  getCouponbyId(id) {
    try {
      const coupon = this.couponList.find((x) => {
        return x.id === id;
      });
      if (coupon) {
        return coupon;
      } else {
        throw new Error(`Coupon not found with id ${id}.`);
      }
    } catch (e) {
      throw new Error(e);
    }
  }
  getCouponbyName(couponName) {
    try {
      const coupon = this.couponList.find((x) => {
        return x.name === couponName;
      });
      if (coupon) {
        return coupon;
      } else {
        throw new Error(`Coupon not found with name ${couponName}.`);
      }
    } catch (e) {
      throw new Error(e);
    }
  }
  getCoupons() {
    return this.couponList;
  }
}
