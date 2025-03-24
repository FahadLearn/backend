import jwt from "jsonwebtoken";
// import { blacklistedTokens } from "../config/blacklist.js";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
import { FindById } from "../Models/User.Model.js";
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

export const chkUser = async (req, res, next) => {
  try {
    const { Customer_ID } = req.cookies;
    if (!Customer_ID) {
      return res
        .status(400)
        .json({ message: "Customer ID is required. File upload blocked." });
    }

    const user = await FindById({ Customer_ID });
    if (!user) {
      return res
        .status(404)
        .json({ message: "user does not exist. File upload blocked." });
    }

    req.user = user; //Rider ko request object me store kar rahe hain

    next();
  } catch (error) {
    console.error("Error in checkRiderID middleware:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
