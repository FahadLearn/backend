import express from "express";
import {
  Register,
  Login,
  logout,
  adminLogin,
  getUserProfile,
  chkLogin,
  updateUser,
} from "../Controllers/User.Controller.js";
import upload from "../config/multer.js";
const UserRouter = express.Router();

UserRouter.post("/Register", Register);
UserRouter.get("/Profile", getUserProfile);
UserRouter.post("/Login", Login);
UserRouter.patch("/Update", upload.single("IMG_URL"), updateUser);
UserRouter.get("/chkLogin", chkLogin);
UserRouter.post("/Admin_dashboard", adminLogin);
UserRouter.post("/Logout", logout);

export default UserRouter;
