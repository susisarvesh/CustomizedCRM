import CustomerTicket from "../models/tickets.model.js"; // Import the correct CustomerTicket model
import CustomerDetails from "../models/customerTicket.model.js";

// Fetch total number of pending tickets across all customers
export const getTotalPendingTickets = async (req, res) => {
    try {
        // Aggregate the total pending count from all customers
        const totalPendingCount = await CustomerDetails.aggregate([
            { $group: { _id: null, totalPending: { $sum: "$pendingCount" } } }
        ]);

        // Extract the total pending count or default to 0 if not found
        const pendingCount = totalPendingCount.length > 0 ? totalPendingCount[0].totalPending : 0;

        // Log the total pending count
        console.log("Total pending tickets across all customers:", pendingCount);

        // Send the response
        res.json({ count: pendingCount });
    } catch (error) {
        console.error("Error fetching total pending tickets :", error);
        res.status(500).json({ message: "Error fetching total pending tickets", error });
    }
};

// Fetch all tickets across all customers
export const getAllCustomerTickets = async (req, res) => {
    try {
        // Fetch all tickets from the CustomerTicket collection
        const tickets = await CustomerTicket.find();

        if (!tickets || tickets.length === 0) {
            return res.status(404).json({ message: 'No tickets found' });
        }

        // Log the number of tickets found
        console.log("Total tickets found:", tickets.length);

        // Send the response with the list of tickets
        res.status(200).json(tickets);
    } catch (error) {
        console.error("Error fetching all customer tickets:", error);
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};

// Fetch the total number of raised tickets across all customers
export const getTotalRaisedTickets = async (req, res) => {
    try {
        // Aggregate the total number of raised tickets from all customers
        const totalRaisedCount = await CustomerDetails.aggregate([
            { $group: { _id: null, totalRaised: { $sum: { $size: "$tickets" } } } }
        ]);

        // Extract the total raised count or default to 0 if not found
        const raisedCount = totalRaisedCount.length > 0 ? totalRaisedCount[0].totalRaised : 0;

        // Log the total raised count
        console.log("Total raised tickets across all customers:", raisedCount);

        // Send the response
        res.status(200).json({ count: raisedCount });
    } catch (error) {
        console.error("Error fetching total raised tickets:", error);
        res.status(500).json({ message: "Error fetching total raised tickets", error });
    }
};
// Fetch closed ticket history across all customers
export const getAllTicketHistory = async (req, res) => {
    try {
        // Fetch all closed tickets from the CustomerTicket collection
        const closedTickets = await CustomerTicket.find({ isClosed: true });

        if (!closedTickets || closedTickets.length === 0) {
            return res.status(200).json({ closedResult: 0 });
        }

        // Log the number of closed tickets found
        console.log("Total closed tickets found:", closedTickets.length);

        // Send the response with the list of closed tickets
        res.json(closedTickets);
    } catch (error) {
        console.error("Error fetching closed ticket history:", error);
        res.status(500).json({ message: "Error fetching closed ticket history", error });
    }
};
// Fetch specific details of all customer tickets
export const fetchAllCustomerTicketDetails = async (req, res) => {
    try {
        // Fetch all tickets with the specified fields
        const tickets = await CustomerTicket.find(
            {},
            { _id: 1,name:1,companyName:1,phoneNumber:1 , complaint: 1, type: 1, status: 1,createdAt:1,ticketId:1,isClosed:1,isVerified:1,isFieldClosed:1,isAssigned:1} // Project specific fields
        );

        if (!tickets || tickets.length === 0) {
            return res.status(404).json({ message: 'No tickets found' });
        }

        // Log the number of tickets found
        console.log("Total tickets with specific details found:", tickets.length);

        // Send the response with the found ticket details
        res.status(200).json(tickets);
    } catch (error) {
        console.error("Error fetching specific ticket details:", error);
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};
