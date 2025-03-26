import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateTokens.js";
import {
  AdminChk,
  chkRider,
  CreateUser,
  FindByEmail,
  FindById,
  UpdateUser,
} from "../Models/User.Model.js";
import path from "path";
import fs from "fs";
// import upload from "../config/multer.config.js";

// ✅ Register User
export const Register = async (req, res) => {
  try {
    const {
      Customer_ID,
      Name,
      Email,
      Password,
      Address,
      Phone_Number,
      IMG_URL,
    } = req.body;

    // ✅ Validate input fields
    if (!Name || !Email || !Password || !Address || !Phone_Number) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const rider = await chkRider({ Email });
    if (rider) {
      return res.status(400).json({
        message: " Email already exists as Rider Plz use different one.",
      });
    }
    // ✅ Check if user already exists
    const existingUser = await FindByEmail(Email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // ✅ Hash password
    // const hashedPassword = await bcrypt.hash(Password, 10);

    // ✅ Generate custom user ID
    const userId = "USR" + Math.floor(1000 + Math.random() * 9000);

    // ✅ Create new user
    const newUser = await CreateUser({
      Customer_ID: userId,
      Name,
      Email,
      Password,
      Address,
      Phone_Number,
    });

    // ✅ Send response
    res.status(201).json({
      message: "User Registered",
      user: newUser.Customer_ID,
      token: generateToken(userId),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

// ✅ Login User
export const Login = async (req, res) => {
  try {
    const { Email, Password } = req.body;
    const user = await FindByEmail(Email);
    if (!user) return res.status(401).json({ message: "Invalid Email" });
    if (Password !== user.Password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // const isMatch = await bcrypt.compare(Password, user.Password);
    // if (!isMatch)
    //   return res.status(401).json({ message: "Invalid Email Password" });

    const token = generateToken(user);
    res.cookie("isLoggedIn", true, {
      httpOnly: false, // ✅ avoid js access
      secure: true, // ✅ http secure
      sameSite: "Strict", // ✅ to use on one site
      maxAge: 3 * 24 * 60 * 60 * 1000, // ✅ 3 days
    });
    res.cookie("Customer_ID", user.Customer_ID, {
      httpOnly: false, // ✅ avoid js access
      secure: false, // ✅ http secure
      sameSite: "Strict", // ✅ to use on one site
      maxAge: 3 * 24 * 60 * 60 * 1000, // ✅ 3 days
    });
    res.json({
      message: "Login successful",
      token,
      user: {
        Customer_ID: user.Customer_ID,
        Name: user.Name,
        Email: user.Email,
      },
    });

    // res.json({
    //   message: "Login successful",
    //   token,
    //   Customer_ID: user.Customer_ID,
    // });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Logout User
export const logout = (req, res) => {
  res.clearCookie("Customer_ID");
  res.clearCookie("isLoggedIn");
  res.json({ message: "Logged out successfully" });
};

// ✅ Admin Login
export const adminLogin = async (req, res) => {
  try {
    const { Email, Password } = req.body;
    const admin = await AdminChk(Email);
    if (!admin) return res.status(401).json({ message: "Invalid Email" });
    if (Password !== admin.Password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // const isMatch = await bcrypt.compare(Password, user.Password);
    // if (!isMatch)
    //   return res.status(401).json({ message: "Invalid Email Password" });

    const token = generateToken(admin);
    res.cookie("isLoggedIN", true, {
      httpOnly: true, // ✅ avoid js access
      secure: true, // ✅ http secure
      sameSite: "Strict", // ✅ to use on one site
      maxAge: 3 * 24 * 60 * 60 * 1000, // ✅ 3 days
    });
    res.cookie("Email", Email, {
      httpOnly: true, // ✅ avoid js access
      secure: true, // ✅ http secure
      sameSite: "Strict", // ✅ to use on one site
      maxAge: 3 * 24 * 60 * 60 * 1000, // ✅ 3 days
    });
    res.json({
      message: "Login successful",
      Email,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  const { Customer_ID } = req.cookies; // ✅ Get user ID from cookie

  if (!Customer_ID) {
    return res.status(401).json({ message: "Unauthorized: No User ID found" });
  }
  try {
    const user = await FindById({ Customer_ID });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
// ✅ Update User

export const chkLogin = async (req, res) => {
  try {
    const isLoggedIn = req.cookies.isLoggedIn;
    console.log(isLoggedIn);
    return res.status(200).json({ isLoggedIn });
  } catch (error) {
    console.error("Error getting auth status:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// export const updateUser = async (req, res) => {
//   try {
//     const Customer_ID = req.cookies.Customer_ID;
//     console.log(Customer_ID);
//     const { Name, Email, Password, Address, Phone_Number } = req.body;

//     if (!Customer_ID) {
//       return res.status(400).json({ message: "User ID is required." });
//     }

//     // ✅ Check if user exists
//     const user = await FindById(Customer_ID);
//     if (!user) {
//       return res.status(404).json({ message: "User does not exist." });
//     }

//     let IMG_URL = user.IMG_URL; // Default: Keep old image

//     // ✅ If new image uploaded, delete old image
//     if (req.file) {
//       const oldImagePath = path.join("uploads", path.basename(user.IMG_URL)); // Old image path
//       const newImagePath = `/uploads/${req.file.filename}`; // New image path

//       // ❌ Delete old image if it exists
//       if (user.IMG_URL && fs.existsSync(oldImagePath)) {
//         fs.unlinkSync(oldImagePath);
//       }

//       IMG_URL = newImagePath; // ✅ Update image path
//     }

//     // ✅ Update user in database
//     const updatedRows = await UpdateUser({
//       Customer_ID,
//       Name: Name || user.Name,
//       Email: Email || user.Email,
//       Password: Password || user.Password,
//       Address: Address || user.Address,
//       Phone_Number: Phone_Number || user.Phone_Number,
//       IMG_URL,
//     });

//     if (updatedRows === 0) {
//       return res.status(400).json({ message: "No changes made." });
//     }

//     res.status(200).json({ message: "User updated successfully." });
//   } catch (error) {
//     console.error("❌ Error updating user:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

export const updateUser = async (req, res) => {
  try {
    console.log("Cookies:", req.cookies);

    const { Customer_ID } = req.cookies;
    console.log("Extracted Customer ID:", Customer_ID);

    if (!Customer_ID) {
      return res
        .status(400)
        .json({ message: "Customer ID is required. File upload skipped." });
    }

    const user = await FindById({ Customer_ID });
    if (!user) {
      return res.status(404).json({ message: "User does not exist." });
    }

    let IMG_URL = user.IMG_URL || ""; // ✅ Ensure it's always a string

    // ✅ Old Image Handling (Fixed `path = string` error)
    if (user.IMG_URL) {
      const oldImagePath = path.join("uploads", path.basename(user.IMG_URL));
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // ✅ New Image Handling
    if (req.file && req.file.filename) {
      IMG_URL = `/uploads/${req.file.filename}`;
    }

    // ✅ Update user in database
    const updatedRows = await UpdateUser({
      Customer_ID: Customer_ID,
      Name: req.body.Name || user.Name,
      Email: req.body.Email || user.Email,
      Password: req.body.Password || user.Password,
      Address: req.body.Address || user.Address,
      Phone_Number: req.body.Phone_Number || user.Phone_Number,
      IMG_URL: IMG_URL,
    });

    if (updatedRows === 0) {
      return res.status(400).json({ message: "No changes made." });
    }

    res.status(200).json({ message: "User profile updated successfully." });
  } catch (error) {
    console.error("❌ Error updating user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
