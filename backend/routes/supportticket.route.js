import express from 'express';
import {
    getTotalPendingTickets,
    getAllCustomerTickets,
    getTotalRaisedTickets,
    getAllTicketHistory,
    fetchAllCustomerTicketDetails
} from '../controllers/ticketstatesupport.controller.js';

const router = express.Router();

// Route to fetch total number of pending support tickets across all customers
router.get('/pending-tickets', getTotalPendingTickets);

// Route to fetch all support tickets across all customers
router.get('/all-tickets', getAllCustomerTickets);

// Route to fetch total number of raised support tickets across all customers
router.get('/raised-tickets',getTotalRaisedTickets);

// Route to fetch closed support ticket history across all customers
router.get('/closed-tickets',getAllTicketHistory);

// Route to fetch specific details of all support tickets
router.get('/ticket-details', fetchAllCustomerTicketDetails);

export default router;
