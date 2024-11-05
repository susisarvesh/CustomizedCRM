import React, { useEffect } from 'react';
import { useSupportTicketStore } from '../store/supportticket'; // Adjust the import path accordingly

function SupportClose() {
  // Get the state and functions from the store
  const { fetchFieldClosedTickets, fieldClosedTickets, closeTicket } = useSupportTicketStore();

  // Fetch the tickets when the component mounts
  useEffect(() => {
    fetchFieldClosedTickets();
  }, [fetchFieldClosedTickets]);

  // Ensure fieldClosedTickets is defined and default to an empty array if it's undefined
  const tickets = fieldClosedTickets || [];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Closed Support Tickets</h1>
      {tickets.length === 0 ? (
        <p className="text-center text-gray-500">No closed tickets found.</p>
      ) : (
        <ul className="space-y-4">
          {tickets.map(ticket => (
            <li key={ticket.ticketId} className="p-4 border rounded-lg bg-gray-50 shadow-md hover:shadow-lg transition-shadow duration-200">
              <p className="font-semibold text-gray-700">
                <strong>Ticket ID:</strong> {ticket.ticketId}
              </p>
              <p className="text-gray-600">
                <strong>Name:</strong> {ticket.name}
              </p>
              <p className="text-gray-600">
                <strong>Company:</strong> {ticket.companyName}
              </p>
              <p className="text-gray-600">
                <strong>Status:</strong> <span className={`font-bold ${ticket.isClosed ? 'text-green-500' : 'text-red-500'}`}>{ticket.isClosed ? 'Closed' : 'Open'}</span>
              </p>
              <button
                className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
                onClick={() => closeTicket(ticket.ticketId)}
                disabled={ticket.isClosed} // Disable if the ticket is already closed
              >
                Close Ticket
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SupportClose;
 