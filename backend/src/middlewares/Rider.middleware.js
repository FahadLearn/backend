import { FindById } from "../Models/Rider.Model.js";

export const checkRiderID = async (req, res, next) => {
  try {
    const { Rider_ID } = req.cookies;
    if (!Rider_ID) {
      return res
        .status(400)
        .json({ message: "Rider ID is required. File upload blocked." });
    }

    const rider = await FindById({ Rider_ID });
    if (!rider) {
      return res
        .status(404)
        .json({ message: "Rider does not exist. File upload blocked." });
    }

    req.rider = rider; //Rider ko request object me store kar rahe hain

    next();
  } catch (error) {
    console.error("Error in checkRiderID middleware:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
