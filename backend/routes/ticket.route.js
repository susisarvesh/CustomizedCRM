import express from 'express';
import {
  createTicket,
  updateTicketStatus,
} from '../controllers/customerticket.controller.js'; // Import the createTicket and updateTicketStatus functions
import {
  verifyTicket,
  assignToFieldEngineer,
  closeTicket,
  getAllFieldEngineers,
  getAllFieldClosedTickets,
} from '../controllers/supportticket.controller.js'; // Import support engineer-related functions
import { completeFieldWork, getAssignedTickets } from '../controllers/fieldticket.controller.js'; // Import field engineer function
import {
  getPendingTickets,
  getRaisedTickets,
  getTicketHistory,
  raiseNewTicket,
  getCustomerTickets,
  fetchCustomerTicketDetails
} from '../controllers/ticketstate.controller.js'; // Import ticket state-related functions
import { verifyToken } from '../middleware/verifyToken.js';
const router = express.Router();

// Customer routes
router.post('/customer/create',createTicket);// Create a new ticket
router.get('/customer/tickets',verifyToken, getCustomerTickets);
router.get('/customer/raised',verifyToken, getRaisedTickets);
router.get('/pending',verifyToken,getPendingTickets); // Get all pending tickets
router.get('/history', getTicketHistory); // Get all closed tickets
router.post('/create', raiseNewTicket); // Raise a new ticket
router.put('/update-status/:ticketId', updateTicketStatus); // Update ticket status
router.get('/customer/ticket-details', verifyToken, fetchCustomerTicketDetails);
router.get('/supports/getfieldengineer', getAllFieldEngineers); // Verify a ticket

// Support engineer routes

router.put('/supports/verify/:ticketId', verifyTicket); // Verify a ticket
router.put('/support/assign/:ticketId', assignToFieldEngineer); // Assign a ticket to a field engineer
router.put('/support/close/:ticketId', closeTicket); // Close a ticket
router.get('/support/field-closed', getAllFieldClosedTickets);
// Field engineer routes

router.get('/assigned-tickets/:engineerId',verifyToken,getAssignedTickets);
router.put('/field/complete/:ticketId', completeFieldWork); // Mark field work as complete

export default router;
