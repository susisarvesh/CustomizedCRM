import React, { useEffect, useState } from 'react';
import { fetchTicketHistory } from '../api';

const TicketHistory = () => {
  const [closedTickets, setClosedTickets] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const [error, setError] = useState(null); // Added error state

  useEffect(() => {
    const getTicketHistory = async () => {
      try {
        const response = await fetchTicketHistory();

        // Ensure response.data is an array
        if (Array.isArray(response.data)) {
          setClosedTickets(response.data);
        } else {
          console.error('Expected an array, but got:', response.data);
          setError('Failed to load ticket history.'); // Set error state
        }
      } catch (error) {
        console.error('Error fetching ticket history:', error);
        setError('Error fetching ticket history.'); // Set error state
      } finally {
        setLoading(false); // Loading complete
      }
    };

    getTicketHistory();
  }, []);

  // Loading and error handling
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Ticket History</h2>
      {closedTickets.length > 0 ? (
        <ul>
          {closedTickets.map((ticket) => (
            <li key={ticket._id}>
              {ticket.name} - {ticket.companyName} - {ticket.complaint} - {ticket.type}
            </li>
          ))}
        </ul>
      ) : (
        <p>No closed tickets found.</p>
      )}
    </div>
  );
};

export default TicketHistory;
