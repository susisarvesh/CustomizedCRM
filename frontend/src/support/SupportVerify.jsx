import React, { useEffect } from 'react';
import useSupportTicketStore from '../store/supportticket.js';

function SupportVerify() {
  const {
    supportTickets,
    fetchSupportData,
    verifySupportTicket,
  } = useSupportTicketStore();

  useEffect(() => {
    fetchSupportData(); // Fetch all support tickets when component mounts
  }, [fetchSupportData]);

  const handleVerifyClick = async (ticketId) => {
    if (ticketId) {
      try {
        await verifySupportTicket(ticketId); // Call the verify function with ticketId
        alert('Ticket verified successfully!');
      } catch (error) {
        alert('Failed to verify ticket: ' + error.message);
      }
    }
  };

  if (!supportTickets.length) {
    return <div>Loading support tickets...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Support Tickets</h2>
      {supportTickets.map((ticket) => (
        <div key={ticket.ticketId} className="p-4 border rounded shadow-lg mb-4">
          <h3 className="text-lg font-medium">Ticket ID: {ticket.ticketId}</h3>
          <p><strong>Name:</strong> {ticket.name}</p>
          <p><strong>Company:</strong> {ticket.companyName}</p>
          <p><strong>Email:</strong> {ticket.emailId}</p>
          <p><strong>Complaint:</strong> {ticket.complaint}</p>
          <p><strong>Phone Number:</strong> {ticket.phoneNumber}</p>
          <p><strong>Type:</strong> {ticket.type}</p>
          <button 
            onClick={() => handleVerifyClick(ticket.ticketId)} // Pass ticketId to the handler
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Verify Ticket
          </button>
        </div>
      ))}
    </div>
  );
}

export default SupportVerify;
