// controllers/supportEngineerController.js
import CustomerTicket from '../models/tickets.model.js';
import { Field } from '../models/field.model.js'; // Import Field model
import nodemailer from 'nodemailer';

// Verify the ticket
export const verifyTicket = async (req, res) => {
  try {
    const ticketId = req.params.ticketId;
    console.log("Attempting to verify ticket with ID:", ticketId);

    // Fetch the ticket by ID
    const ticket = await CustomerTicket.findOne({ ticketId });

    // If ticket not found, send 404 response
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // If the ticket is already verified, send 400 response
    if (ticket.isVerified) {
      return res.status(400).json({ message: 'Ticket already verified' });
    }

    // Update the ticket's isVerified status
    ticket.isVerified = true;
    const updatedTicket = await ticket.save();

    console.log("Ticket verified successfully:", updatedTicket);

    // Send email notification to the customer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: ticket.emailId,
      subject: 'Your Ticket Has Been Verified',
      text: `Hello ${ticket.name},\n\nYour ticket with ID ${ticket.ticketId} has been verified. We will assign an engineer soon.\n\nDetails:\nComplaint: ${ticket.complaint}\nType: ${ticket.type}\nCompany: ${ticket.companyName}`,
    };

    await transporter.sendMail(mailOptions);

    // Send success response
    res.json({ message: 'Ticket verified and email sent', ticket: updatedTicket });
  } catch (error) {
    console.error("Error in verifyTicket:", error);
    res.status(500).json({ message: 'Failed to verify ticket', error: error.message });
  }
};

export const getAllFieldEngineers = async (req, res) => {
  try {
    // Query to find all documents where `isField` is true (if this flag indicates a field engineer)
    const fieldEngineers = await Field.find({ isField: true });

    // Return the field engineer data as a response
    res.status(200).json(fieldEngineers);
  } catch (error) {
    console.error('Error fetching field engineers:', error);
    res.status(500).json({ message: 'Failed to fetch field engineers' });
  }
};

// Assign ticket to a field engineer
export const assignToFieldEngineer = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { fieldEngineerId } = req.body;

    // Find the ticket and verify its existence
    const ticket = await CustomerTicket.findOne({ ticketId });
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Check if the ticket is already verified
    if (!ticket.isVerified) {
      ticket.isVerified = true; // Set verification directly here if necessary
      await ticket.save();
    }

    // Find the field engineer and check existence
    const fieldEngineer = await Field.findById(fieldEngineerId);
    if (!fieldEngineer) {
      return res.status(404).json({ message: 'Field Engineer not found' });
    }

    // Assign the ticket to the field engineer
    ticket.isAssigned = true;
    ticket.fieldEngineerId = fieldEngineerId;
    await ticket.save();

    // Add the ticket ID to the field engineer's assignedTickets array
    if (!fieldEngineer.assignedTickets.includes(ticket._id)) {
      fieldEngineer.assignedTickets.push(ticket._id);
      await fieldEngineer.save();
    }

    res.status(200).json({ message: 'Ticket assigned to field engineer', ticket });
  } catch (error) {
    console.error('Error assigning ticket:', error);
    res.status(500).json({ message: 'Failed to assign ticket', error: error.message });
  }
};


export const getAllFieldClosedTickets = async (req, res) => {
  try {
    // Find all tickets where isFieldClosed is true
    const fieldClosedTickets = await CustomerTicket.find({ isFieldClosed: true });

    // If no tickets found, send a message indicating no closed tickets
    if (fieldClosedTickets.length === 0) {
      return res.status(404).json({ message: 'No field-closed tickets found' });
    }

    // Send the fetched tickets as the response
    res.status(200).json(fieldClosedTickets);
  } catch (error) {
    console.error('Error fetching field-closed tickets:', error);
    res.status(500).json({ message: 'Failed to fetch field-closed tickets', error: error.message });
  }
};
// Close the ticket
export const closeTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const ticket = await CustomerTicket.findOneAndUpdate(
      { ticketId },
      {
        isClosed: true,
        isPending: false,
      },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Send email to the customer about ticket closure
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: ticket.emailId,
      subject: 'Your Ticket Has Been Closed',
      text: `Hello ${ticket.name},\n\nYour ticket with ID ${ticket.ticketId} has been closed. Thank you for your patience.\n\nDetails:\nComplaint: ${ticket.complaint}\nType: ${ticket.type}\nCompany: ${ticket.companyName}`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Ticket closed and email sent', ticket });
  } catch (error) {
    res.status(500).json({ message: 'Failed to close ticket', error: error.message });
  }
};
