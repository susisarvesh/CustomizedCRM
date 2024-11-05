import React, { useEffect, useState } from 'react';
import { fetchPendingTickets } from '../api';

const PendingTickets = () => {
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const getPendingTickets = async () => {
      try {
        const response = await fetchPendingTickets();
        setPendingCount(response.data.count);
      } catch (error) {
        console.error('Error fetching pending tickets:', error);
      }
    };
    getPendingTickets();
  }, []);

  return (
    <div>
      <h2>Pending Tickets: {pendingCount}</h2>
    </div>
  );
};

export default PendingTickets;
