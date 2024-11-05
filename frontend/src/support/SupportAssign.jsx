import React, { useState, useEffect } from 'react';
import useSupportTicketStore from '../store/supportticket.js'; // Adjust the import path as needed

function SupportAssign() {
  const [ticketId, setTicketId] = useState('');
  const [fieldEngineerId, setFieldEngineerId] = useState('');

  const { 
    assignTicketToFieldEngineer, 
    fetchSupportData, 
    fetchFieldEngineers, 
    supportTickets, 
    fieldEngineers 
  } = useSupportTicketStore();

  useEffect(() => {
    fetchFieldEngineers(); // Fetch field engineers on component mount
  }, []);

  // Handle assign button click
  const handleAssign = async () => {
    const result = await assignTicketToFieldEngineer(ticketId, fieldEngineerId);
    if (result.success) {
      alert('Ticket assigned to field engineer successfully');
    } else {
      alert(`Failed to assign ticket: ${result.message}`);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Assign Ticket to Field Engineer</h2>

      <div className="mb-4">
        <label className="block font-medium">Ticket ID:</label>
        <input
          type="text"
          value={ticketId}
          onChange={(e) => setTicketId(e.target.value)}
          className="border p-2 rounded w-full"
          placeholder="Enter Ticket ID"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium">Field Engineer:</label>
        <select
          value={fieldEngineerId}
          onChange={(e) => setFieldEngineerId(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">Select Field Engineer</option>
          {(fieldEngineers || []).map((engineer) => (
            <option key={engineer._id} value={engineer._id}>
              {engineer.name} - {engineer.position}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleAssign}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Assign Ticket
      </button>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Support Tickets</h3>
        <button onClick={fetchSupportData} className="bg-green-500 text-white px-3 py-1 rounded">
          Refresh Tickets
        </button>

        <table className="w-full table-auto border-collapse mt-4">
          <thead>
            <tr>
              <th className="border px-4 py-2">Ticket ID</th>
              <th className="border px-4 py-2">Ticket Issue</th>
              <th className="border px-4 py-2">Ticket Name</th>
              <th className="border px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {supportTickets.map((ticket) => (
              <tr key={ticket.ticketId}>
                <td className="border px-4 py-2">{ticket.ticketId}</td>
                <td className="border px-4 py-2">{ticket.complaint}</td>
                <td className="border px-4 py-2">{ticket.name || "N/A"}</td> {/* Assuming 'name' is a property */}
                <td className="border px-4 py-2">
                  {ticket.isAssigned ? 'Assigned' : 'Pending'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SupportAssign;
