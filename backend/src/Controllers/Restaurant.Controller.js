import { Register } from "../Models/Restaurant.Model";

export const register = async (req, res) => {
  try {
    const {
      First_Name,
      Last_Name,
      Business_Name,
      Business_Email,
      Password,
      Business_Type,
      Phone_Number,
      City,
      Province,
      Area,
      Postal_Code,
      Detail_Address,
      CNIC,
      Operating_licence,
      FBR,
      Account_Title,
      Bank_Name,
      IBAN,
      Owner_ID,
    } = req.body;
    // Validate inputs
    if (
      !First_Name ||
      !Last_Name ||
      !Business_Name ||
      !Business_Email ||
      !Password ||
      !Business_Type ||
      !Phone_Number ||
      !City ||
      !Province ||
      !Area ||
      !Postal_Code ||
      !Detail_Address ||
      !CNIC ||
      !Operating_licence ||
      !FBR ||
      !Account_Title ||
      !Bank_Name ||
      !IBAN ||
      !Owner_ID
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // Check if business already exists
    const business = await chkBusiness({ Business_Email });
    if (business) {
      return res.status(400).json({ message: "Business already exists" });
    }

    // Assign an ID to the business
    const ID = "Restaurant_" + Math.floor(1 + Math.random() * 9000);
    console.log(ID);
    // Create a new business object
    const newRestaurant = await Register({
      Restaurant_ID: ID,
      First_Name,
      Last_Name,
      Business_Name,
      Business_Email,
      Password,
      Business_Type,
      Phone_Number,
      City,
      Province,
      Area,
      Postal_Code,
      Detail_Address,
      CNIC,
      Operating_licence,
      FBR,
      Account_Title,
      Bank_Name,
      IBAN,
      Owner_ID,
    });

    if (newRestaurant) {
      return res
        .status(201)
        .json({ message: "Restaurant registered successfully" });
    }
  } catch (error) {
    console.error("Error registering restaurant:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
