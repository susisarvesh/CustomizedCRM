import React from 'react';
import useTicketStore from '../store/ticketStore.js';

function CustomerTicketPending() {
  const { tickets } = useTicketStore(); // Assuming you're using Zustand for state management

  return (
    <div className="max-w-4xl mx-auto mt-10 p-5 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Customer Ticket Pending</h2>
      <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-4 py-2">Ticket ID</th>
            <th className="border px-4 py-2">Type</th>
            <th className="border px-4 py-2">Complaint</th>
            <th className="border px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {tickets.length > 0 ? (
            tickets.map((ticket) => (
              <tr key={ticket._id} className="hover:bg-gray-100 transition-colors duration-300">
                <td className="border px-4 py-2">{ticket._id}</td>
                <td className="border px-4 py-2">{ticket.type}</td>
                <td className="border px-4 py-2">{ticket.complaint}</td>
                <td className="border px-4 py-2">{ticket.isClosed ? 'Closed' : 'Pending'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="border px-4 py-2 text-center text-gray-500">No tickets found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default CustomerTicketPending;
