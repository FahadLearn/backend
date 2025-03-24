import { CreateRider, FindByEmail, FindById } from "../Models/Rider.Model.js";
import { generateToken } from "../utils/generateTokens.js";

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
