// controllers/customerController.js
import CustomerTicket from '../models/tickets.model.js';
import CustomerDetails from '../models/customerTicket.model.js'; // Import CustomerDetails model
import { body, validationResult } from 'express-validator'; // Import express-validator for input validation

// Update the status of a ticket
export const updateTicketStatus = async (req, res) => {
  const { ticketId, newStatus } = req.body;

  try {
    const ticket = await CustomerTicket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const customer = await CustomerDetails.findById(ticket.customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Update counts based on the new status
    if (ticket.isPending !== newStatus.isPending) {
      customer.pendingCount += newStatus.isPending ? 1 : -1;
    }
    if (ticket.isAssigned !== newStatus.isAssigned) {
      customer.assignedCount += newStatus.isAssigned ? 1 : -1;
    }
    if (ticket.isClosed !== newStatus.isClosed) {
      customer.closedCount += newStatus.isClosed ? 1 : -1;
    }
    if (ticket.isVerified !== newStatus.isVerified) {
      customer.verifiedCount += newStatus.isVerified ? 1 : -1;
    }
    if (ticket.isFieldClosed !== newStatus.isFieldClosed) {
      customer.fieldClosedCount += newStatus.isFieldClosed ? 1 : -1;
    }

    // Update the ticket with new status
    Object.assign(ticket, newStatus);
    await ticket.save();
    await customer.save();

    res.status(200).json({ message: 'Ticket status updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Validation middleware for ticket creation
export const validateTicketCreation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('companyName').notEmpty().withMessage('Company name is required'),
  body('emailId').isEmail().withMessage('Valid email is required'),
  body('complaint').notEmpty().withMessage('Complaint is required'),
  body('phoneNumber').notEmpty().withMessage('Phone number is required'),
  body('type').notEmpty().withMessage('Type is required'),
];

// Create a new ticket
export const createTicket = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, companyName, emailId, complaint, phoneNumber, type } = req.body;

  try {
    // Check if customer already exists
    console.log('Received request to create a ticket:', req.body);
    let customer = await CustomerDetails.findOne({ emailId });

    if (!customer) {
      // Create a new customer
      customer = new CustomerDetails({
        name,
        companyName,
        emailId,
        phoneNumber,
      });
      await customer.save();
      console.log('New customer created:', customer);
    }

    // Create a new ticket
    const newTicket = new CustomerTicket({
      name,
      companyName,
      emailId,
      complaint,
      phoneNumber,
      type,
      customerId: customer._id, // Associate the ticket with the customer
    });

    // Update customer's counts based on the ticket's status
    if (newTicket.isPending) {
      customer.pendingCount += 1;
    }
    if (newTicket.isAssigned) {
      customer.assignedCount += 1;
    }
    if (newTicket.isClosed) {
      customer.closedCount += 1;
    }
    if (newTicket.isVerified) {
      customer.verifiedCount += 1;
    }
    if (newTicket.isFieldClosed) {
      customer.fieldClosedCount += 1;
    }

    // Save the ticket
    await newTicket.save();

    // Add the ticket to the customer's list of tickets
    customer.tickets.push(newTicket._id);
    await customer.save();

    res.status(201).json({ message: 'Ticket created successfully', ticket: newTicket });
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ message: 'Failed to create ticket', error: error.message });
  }
};
