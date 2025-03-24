import express from "express";
import { createRider, login } from "../Controllers/Rider.Controller.js";

const RiderRoute = express.Router();

RiderRoute.post("/Register", createRider);
RiderRoute.get("/login", login);

export default RiderRoute;
