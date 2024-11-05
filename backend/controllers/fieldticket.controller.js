// controllers/fieldEngineerController.js
import CustomerTicket from '../models/tickets.model.js';
import { Field } from '../models/field.model.js'; // Using the specified import

// Mark field work as completed
export const completeFieldWork = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const ticket = await CustomerTicket.findOneAndUpdate(
      { ticketId },
      { isFieldClosed: true },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json({ message: 'Field work completed', ticket });
  } catch (error) {
    res.status(500).json({ message: 'Failed to complete field work', error: error.message });
  }
};

// Get assigned tickets for a specific field engineer
// Get all tickets assigned to a specific field engineer
export const getAssignedTickets = async (req, res) => {
  try {
    // Use the userId from the verified token
    const engineerId = req.userId; // Get the engineerId from the token's decoded payload

    // Find the field engineer by ID and populate assignedTickets
    const engineer = await Field.findById(engineerId).populate('assignedTickets');

    if (!engineer) {
      return res.status(404).json({ message: 'Field Engineer not found' });
    }

    // If the engineer has no assigned tickets
    if (!engineer.assignedTickets || engineer.assignedTickets.length === 0) {
      return res.status(404).json({ message: 'No assigned tickets found for this engineer' });
    }

    res.json({ message: 'Assigned tickets retrieved successfully', tickets: engineer.assignedTickets });
  } catch (error) {
    console.error("Error retrieving assigned tickets:", error);
    res.status(500).json({ message: 'Failed to retrieve assigned tickets', error: error.message });
  }
};

