// routes/customer.route.js
import express from "express";
import { createFieldEngineer, getFieldEngineerById, updateFieldEngineer, deleteFieldEngineer, getFieldEngineers } from "../controllers/field.controller.js";

const router = express.Router();

// CRUD routes for Customer
router.post("/", createFieldEngineer); // Create a new customer
router.get("/", getFieldEngineers); // Get all customers
router.get("/:id", getFieldEngineerById); // Get a customer by ID
router.put("/:id", updateFieldEngineer); // Update a customer
router.delete("/:id", deleteFieldEngineer); // Delete a customer

export default router;
