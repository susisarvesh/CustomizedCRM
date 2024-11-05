// routes/customer.route.js
import express from "express";
import { createCustomer, getCustomers, getCustomerById, updateCustomer, deleteCustomer } from "../controllers/customer.controller.js";

const router = express.Router();

// CRUD routes for Customer
router.post("/", createCustomer); // Create a new customer
router.get("/", getCustomers); // Get all customers
router.get("/:id", getCustomerById); // Get a customer by ID
router.put("/:id", updateCustomer); // Update a customer
router.delete("/:id", deleteCustomer); // Delete a customer

export default router;
