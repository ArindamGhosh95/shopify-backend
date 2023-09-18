import jwt from "jsonwebtoken";
export const generateRefreshToken = (id: string, email: string) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET || "mysecret", {
    expiresIn: "3d",
  });
};
