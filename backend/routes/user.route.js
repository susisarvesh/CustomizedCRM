// routes/user.route.js
import express from "express";
import { createUser, getUsers, getUserById, updateUser, deleteUser,  } from "../controllers/user.controller.js";

const router = express.Router();

// CRUD routes for User
router.post("/", createUser);
// router.get("/verify-email/:token", verifyEmail);// Create a new user
router.get("/", getUsers); // Get all users
router.get("/:id", getUserById); // Get a user by ID
router.put("/:id", updateUser); // Update a user
router.delete("/:id", deleteUser); // Delete a user

export default router;
