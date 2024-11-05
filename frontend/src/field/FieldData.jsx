import React, { useEffect } from 'react';
import { useSupportTicketStore } from '../store/supportticket.js';

function FieldData() {
  const fetchAssignedTickets = useSupportTicketStore((state) => state.fetchAssignedTickets);
  const assignedTickets = useSupportTicketStore((state) => state.assignedTickets || []); // Provide default empty array
  const completeFieldWork = useSupportTicketStore((state) => state.completeFieldWork);
  const setAssignedTickets = useSupportTicketStore((state) => state.setAssignedTickets);

  const engineerId = 'some_engineer_id';

  useEffect(() => {
    fetchAssignedTickets(engineerId);
  }, [fetchAssignedTickets, engineerId]);

  const handleCloseTicket = async (ticketId) => {
    const result = await completeFieldWork(ticketId);
    if (result.success) {
      alert(`Ticket ${ticketId} closed successfully.`);
      setAssignedTickets((assignedTickets || []).filter((ticket) => ticket.ticketId !== ticketId));
    } else {
      alert(`Failed to close ticket: ${result.message}`);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Assigned Tickets</h2>
      {assignedTickets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assignedTickets.map((ticket) => (
            <div
              key={ticket.ticketId}
              className="bg-white shadow-md rounded-lg p-4 border border-gray-200 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-semibold mb-2">Ticket ID: {ticket.ticketId}</h3>
                <p className="text-gray-700"><strong>Name:</strong> {ticket.name}</p>
                <p className="text-gray-700"><strong>Company:</strong> {ticket.companyName}</p>
                <p className="text-gray-700"><strong>Email:</strong> {ticket.emailId}</p>
                <p className="text-gray-700"><strong>Complaint:</strong> {ticket.complaint}</p>
                <p className="text-gray-700">
                  <strong>Status:</strong> {ticket.isFieldClosed ? 'Closed' : 'Open'}
                </p>
              </div>
              {!ticket.isFieldClosed && (
                <button
                  onClick={() => handleCloseTicket(ticket.ticketId)}
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  Close Ticket
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-700">No assigned tickets found for this engineer.</p>
      )}
    </div>
  );
}

export default FieldData;
