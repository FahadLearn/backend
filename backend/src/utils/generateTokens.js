import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

export const generateToken = (user) => {
  return jwt.sign(
    { id: user.Customer_ID, email: user.email }, //payload means data you want to use in token
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};
