import express from "express";
import { addItem, Update_Item } from "../Controllers/Order.Controller";

import upload from "../config/multer.js";
const Order_route = express.Router();

Order_route.post("/Add", upload.single("Img"), addItem);
Order_route.patch("/Add/:Item_Id", upload.single("Img"), Update_Item);

export default Order_route;
