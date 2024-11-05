import CustomerTicket from "../models/tickets.model.js"; // Import the correct CustomerTicket model
import CustomerDetails from "../models/customerTicket.model.js"; // Import the correct CustomerDetails model

// Fetch number of pending tickets from CustomerDetails
export const getPendingTickets = async (req, res) => {
  try {
    // Use req.email from token instead of emailId in request body
    const customer = await CustomerDetails.findOne({ emailId: req.email });
    console.log({ emailId: req.email });
    const pendingCount = customer ? customer.pendingCount || 0 : 0;
    console.log("Pending tickets for customer:", req.email, "Count:", pendingCount);

    // Send the response
    res.json({ count: pendingCount });
  } catch (error) {
    // Handle errors gracefully and send a response with an error message
    console.error("Error fetching pending tickets:", error);
    res.status(500).json({ message: "Error fetching pending tickets", error });
  }
};

// Fetch all tickets associated with a customer based on their email ID
export const getCustomerTickets = async (req, res) => {
  try {
    // Use the email from the decoded token instead of req.body
    const emailId = req.email; // Assuming req.email is set in the verifyToken middleware

    console.log("Fetching tickets for email:", emailId);

    // Find the customer using the email ID from the token
    const customer = await CustomerDetails.findOne({ emailId });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Extract the ticket IDs from the customer's 'tickets' array
    const ticketIds = customer.tickets;

    if (!ticketIds || ticketIds.length === 0) {
      return res.status(404).json({ message: 'No tickets found for this customer' });
    }

    // Fetch all tickets using the IDs stored in the customer's 'tickets' array
    const tickets = await CustomerTicket.find({ _id: { $in: ticketIds } });

    res.status(200).json(tickets);
  } catch (error) {
    console.error("Error fetching customer tickets:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Fetch the total number of raised tickets (across all customers)
export const getRaisedTickets = async (req, res) => {
  try {
    const customer = await CustomerDetails.findOne({ emailId: req.email });

    if (!customer) {
      return res.status(200).json({ count: 0 });
    }

    // Calculate the number of raised tickets for this specific customer
    const raisedCount = customer.tickets.length || 0;
    console.log("Raised tickets for customer:", req.email, "Count:", raisedCount);

    res.status(200).json({ count: raisedCount });
  } catch (error) {
    console.error("Error fetching raised tickets:", error);
    res.status(500).json({ message: "Error fetching raised tickets", error: error.message });
  }
};

// Fetch closed ticket history from CustomerDetails
export const getTicketHistory = async (req, res) => {
  try {
    const customers = await CustomerDetails.find();
    const closedTickets = customers.flatMap(customer => customer.tickets.filter(ticket => ticket.isClosed));
    res.json(closedTickets);
  } catch (error) {
    res.status(500).json({ message: "Error fetching ticket history", error });
  }
};

// Fetch specific details of customer tickets from the CustomerTicket collection
export const fetchCustomerTicketDetails = async (req, res) => {
  try {
    const emailId = req.email;

    console.log("Fetching customer ticket details for email:", emailId);

    const customer = await CustomerDetails.findOne({ emailId });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const tickets = await CustomerTicket.find(
      { customerId: customer._id },
      { _id: 1, complaint: 1, type: 1, status: 1 }
    );

    if (!tickets || tickets.length === 0) {
      return res.status(404).json({ message: 'No tickets found for this customer' });
    }

    console.log("Fetched ticket details for customer:", emailId, "Tickets:", tickets);

    res.status(200).json(tickets);
  } catch (error) {
    console.error("Error fetching customer ticket details from CustomerTicket collection:", error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// Raise a new ticket
export const raiseNewTicket = async (req, res) => {
  try {
    const { name, companyName, emailId, complaint, phoneNumber, type } = req.body;

    // Find the associated customer based on emailId
    let customer = await CustomerDetails.findOne({ emailId });

    // If customer does not exist, create a new customer record
    if (!customer) {
      customer = new CustomerDetails({
        name,
        companyName,
        emailId,
        phoneNumber,
      });
      await customer.save();
    }

    // Create a new ticket linked to the customer
    const newTicket = new CustomerTicket({
      name,
      companyName,
      emailId,
      complaint,
      phoneNumber,
      type,
      isPending: true,
      customerId: customer._id,
    });

    // Save the new ticket
    await newTicket.save();

    // Add the ticket reference to the customer's tickets array and increment the pending count
    customer.tickets.push(newTicket._id);
    customer.pendingCount += 1;
    await customer.save();

    res.json({ message: "Ticket raised successfully", ticket: newTicket });
  } catch (error) {
    res.status(500).json({ message: "Error raising the ticket", error });
  }
};

// Update the ticket status
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

    res.status(200).json({ message: 'Ticket status updated successfully', ticket });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
