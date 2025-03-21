import jwt from "jsonwebtoken";
// import { blacklistedTokens } from "../config/blacklist.js";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
export const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token)
    return res.status(401).json({ message: "Unauthorized, No Token" });
  // if (blacklistedTokens.has(token)) {
  //   return res
  //     .status(401)
  //     .json({ message: "Token is blacklisted. Please log in again." });
  // }

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.Customer_ID = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
};
