import express from "express"; 
import { registerUser, AdminLogin, getAllUsers, getUserById, deleteUser, updateUser } from "../controller/userController.js";

const userRoute = express.Router();


userRoute.post("/register",registerUser);

// Admin routes protected by middleware

userRoute.post("/login", AdminLogin);

userRoute.get("/", getAllUsers);

userRoute.get("/:id", getUserById);

userRoute.delete("/:id", deleteUser);

userRoute.put("/:id", updateUser);

export default userRoute;
