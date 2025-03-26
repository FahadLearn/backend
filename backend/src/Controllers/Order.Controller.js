import path from "path";
import { Add_Item, FindById } from "../Models/Orders.Model";
import fs from "fs";
export const addItem = async (req, res) => {
  try {
    const {
      Item_ID,
      Name,
      Category,
      Price,
      Discount,
      Description,
      Availability,
    } = req.body;
    const { Restaurant_Id } = req.cookies;
    if (!Restaurant_Id) {
      return res.status(400).json({ message: "Restaurant ID is required." });
    }

    if (
      !Item_ID ||
      !Name ||
      !Category ||
      !Price ||
      !Discount ||
      !Description ||
      !Img ||
      Availability
    ) {
      res.status(404).json({ message: "All Fields are required" });
    }
    const item = await FindById({ Item_ID });
    if (item) {
      return res.status(400).json({
        message: "Item_ID already exists change the ITEM ID to add new item",
      });
    }

    let Img = item.Img;
    if (req.file) {
      const oldImagePath = path.join("uploads", path.basename(item.Img)); // Old image path
      const newImagePath = `/uploads/${req.file.filename}`; // New image path

      // ❌ Delete old image if it exists
      if (item.Img && fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }

      Img = newImagePath; // ✅ Update image path
    }
    const newItem = await Add_Item({
      Item_ID,
      Name,
      Category,
      Price,
      Discount,
      Description,
      Img: item.Img || Img,
      Availability,
    });
    res.status(201).json(newItem, { message: "Item added successfully" });
  } catch (error) {
    console.error("�� Error adding item:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const Update_Item = async (req, res) => {
  try {
    const { Restaurant_Id } = req.cookies;
    if (!Restaurant_Id) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No Restaurant ID found" });
    }

    const { Name, Category, Price, Discount, Description, Availability } =
      req.body;

    if (
      !Name ||
      !Category ||
      !Price ||
      !Discount ||
      !Description ||
      !Img ||
      Availability
    ) {
      res.status(404).json({ message: "All Fields are required" });
    }
    const { Item_ID } = req.params;

    const item = await FindById({ Item_ID });
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    let Img = item.Img;
    if (req.file) {
      const oldImagePath = path.join("uploads", path.basename(item.Img)); // Old image path
      const newImagePath = `/uploads/${req.file.filename}`; // New image path

      // ❌ Delete old image if it exists
      if (item.Img && fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }

      Img = newImagePath; // ✅ Update image path
    }
    const updatedItem = await Update_Item({
      Item_ID: Item_ID,
      Name: req.body.Name || item.Name,
      Category: req.body.Category || item.Category,
      Price: req.body.Price || item.Price,
      Discount: req.body.Discount || item.Discount,
      Description: req.body.Description || item.Description,
      Img: Img,
      Availability: req.body.Availability || item.Availability,
      Restaurant_Id: Restaurant_Id,
    });
    if (updatedItem === 0) {
      return res.status(400).json({ message: "No changes made" });
    }
    return res.status(200).json({ message: "Item updated successfully" });
  } catch (error) {
    console.error("Error updating item:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const Delete_Item = async (req, res) => {
  try {
  } catch (error) {}
};
