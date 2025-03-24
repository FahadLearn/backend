import {
  CreateRider,
  FindByEmail,
  FindById,
  UpdateRider,
} from "../Models/Rider.Model.js";
import { generateToken } from "../utils/generateTokens.js";
import path from "path";
import fs from "fs";
export const createRider = async (req, res) => {
  try {
    const {
      First_Name,
      Last_Name,
      City,
      Vehicle,
      Cnic,
      Phone_No,
      Date_of_Birth,
      License,
      Payment_Method,
      Account_Title,
      RIDER_ID,
      Email,
      Password,
    } = req.body;

    if (
      !First_Name ||
      !Last_Name ||
      !City ||
      !Vehicle ||
      !Cnic ||
      !Phone_No ||
      !Date_of_Birth ||
      !License ||
      !Payment_Method ||
      !Account_Title ||
      !Email ||
      !Password
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }
    //Allocating ID to the Rider
    const Rider_ID = "Rider_" + Math.floor(100 + Math.random() * 9000);
    console.log(Rider_ID);

    // Check if rider already exists
    const Rider = await FindById({ Rider_ID });
    if (Rider) {
      return res
        .status(400)
        .json({ message: "Rider with this ID already exists." });
    }
    // Create new rider
    const newRider = await CreateRider({
      First_Name,
      Last_Name,
      City,
      Vehicle,
      Cnic,
      Phone_No,
      Date_of_Birth,
      License,
      Payment_Method,
      Account_Title,
      RIDER_ID: Rider_ID,
      Email,
      Password,
    });
    res.status(201).json({
      message: "Rider Registered",
      user: newRider.RIDER_ID,
      token: generateToken(Rider_ID),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
};

export const login = async (req, res) => {
  try {
    const { Email, Password } = req.body;
    const user = await FindByEmail({ Email });
    if (!user) return res.status(401).json({ message: "Invalid Email" });
    if (Password !== user.Password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = generateToken(user);
    res.cookie("isLoggedIn", true, {
      httpOnly: false, // ✅ avoid js access
      secure: true, // ✅ http secure
      sameSite: "Strict", // ✅ to use on one site
      maxAge: 3 * 24 * 60 * 60 * 1000, // ✅ 3 days
    });
    res.cookie("Customer_ID", user.Customer_ID, {
      httpOnly: false, // ✅ avoid js access
      secure: true, // ✅ http secure
      sameSite: "Strict", // ✅ to use on one site
      maxAge: 3 * 24 * 60 * 60 * 1000, // ✅ 3 days
    });
    res.json({
      message: "Login successful",
      token,
      user: {
        Rider_ID: user.RIDER_ID,
        Name: user.First_Name,
        Email: user.Email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const logout = async (req, res) => {
  res.clearCookie("isLoggedIn");
  res.clearCookie("Customer_ID");
  res.json({ message: "Logged Out" });
};

export const riderProfile = async (req, res) => {
  const { Rider_ID } = req.cookies;
  if (!Rider_ID) return res.status(401).json({ message: "Unauthorized" });
  try {
    const rider = await FindById({ Rider_ID });
    if (!rider) return res.status(404).json({ message: "User not found" });
    res.json(rider);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRiderProfile = async (req, res) => {
  try {
    console.log("Cookies:", req.cookies);

    const { Rider_ID } = req.cookies;
    console.log("Extracted Rider ID:", Rider_ID);

    // ✅ Stop execution if Rider_ID is missing before processing the file
    if (!Rider_ID) {
      return res
        .status(400)
        .json({ message: "Rider ID is required. File upload skipped." });
    }

    // ✅ Check if rider exists before file processing
    const rider = await FindById({ Rider_ID });
    if (!rider) {
      return res.status(404).json({ message: "Rider does not exist." });
    }

    let IMG = rider.IMG; // Default: Keep old image

    // ✅ Now process image only if everything is valid
    if (req.file) {
      const oldImagePath = path.join("uploads", path.basename(rider.IMG)); // Old image path
      const newImagePath = `/uploads/${req.file.filename}`; // New image path

      // ❌ Delete old image if it exists
      if (rider.IMG && fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }

      IMG = newImagePath; // ✅ Update image path
    }

    // ✅ Update rider in database
    const updatedRows = await UpdateRider({
      RIDER_ID: Rider_ID,
      First_Name: req.body.First_Name || rider.First_Name,
      Last_Name: req.body.Last_Name || rider.Last_Name,
      City: req.body.City || rider.City,
      Vehicle: req.body.Vehicle || rider.Vehicle,
      Cnic: req.body.Cnic || rider.Cnic,
      Phone_No: req.body.Phone_No || rider.Phone_No,
      Date_of_Birth: req.body.Date_of_Birth || rider.Date_of_Birth,
      License: req.body.License || rider.License,
      Payment_Method: req.body.Payment_Method || rider.Payment_Method,
      Account_Title: req.body.Account_Title || rider.Account_Title,
      Email: req.body.Email || rider.Email,
      Password: req.body.Password || rider.Password,
      IMG: IMG,
    });

    if (updatedRows === 0) {
      return res.status(400).json({ message: "No changes made." });
    }

    res.status(200).json({ message: "Rider profile updated successfully." });
  } catch (error) {
    console.error("❌ Error updating rider:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
