import { create } from 'zustand';
import axios from 'axios';

// Determine API URL based on environment
const API_URL = import.meta.env.MODE === "development" 
  ? "http://localhost:5000/api/tickets" 
  : "/api/tickets";

axios.defaults.withCredentials = true;

// Create Zustand store
const useTicketStore = create((set, get) => ({
  pendingTickets: 0,
  ticketHistory: { raised: 0, closed: 0 },
  ticketsRaised: 0,
  tickets: [], // Initialize tickets array
  formData: {
    name: '',
    companyName: '',
    emailId: '',
    complaint: '',
    phoneNumber: '',
    type: '',
  },
  
  // Fetch data from backend
  fetchData: async () => {
    try {
        // Fetch pending tickets count
        const pendingResponse = await axios.get(`${API_URL}/pending`);
        console.log('Pending Tickets Response:', pendingResponse.data);
        const pendingCount = pendingResponse.data.count || 0;

        // Fetch ticket history
        const historyResponse = await axios.get(`${API_URL}/history`);
        console.log('Ticket History Response:', historyResponse.data);
        const ticketHistory = {
            raised: historyResponse.data.raised || 0,
            closed: historyResponse.data.closed || 0,
        };

        // Fetch tickets raised by the customer
        const raisedResponse = await axios.get(`${API_URL}/customer/raised`);
        console.log('Raised Tickets Response:', raisedResponse.data);
        const ticketsRaised = raisedResponse.data.count || 0;

        // Fetch all tickets for display
        // const ticketsResponse = await axios.get(`${API_URL}/customer/tickets`);
        // console.log('Tickets Response:', ticketsResponse.data);
        // const tickets = ticketsResponse.data || []; // Ensure tickets is an array
        const ticketsResponse = await axios.get(`${API_URL}/customer/ticket-details`);
      console.log('Tickets Response:', ticketsResponse.data);
      const tickets = ticketsResponse.data || [];
        // Update store with fetched data
        set({ 
            pendingTickets: pendingCount, 
            ticketHistory, 
            ticketsRaised, 
            tickets 
        });
      console.log("Updated State:", {
  pendingTickets: pendingCount,
  ticketHistory,
  ticketsRaised,
  // tickets,
});
    } catch (error) {
        console.error('Error fetching ticket data:', error.response?.data?.message || error.message);
    }
},

  // Submit new ticket data to backend
  submitTicket: async () => {
    const { formData } = get();
    try {
      console.log(formData, "Submitting ticket...");
      
      const response = await axios.post(`${API_URL}/customer/create`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Ticket created successfully:', response.data);

      // Update the ticket counts and reset form data after creation
      set((state) => ({
        ticketsRaised: state.ticketsRaised + 1,
        formData: {
          name: '',
          companyName: '',
          emailId: '',
          complaint: '',
          phoneNumber: '',
          type: '',
        },
      }));

      // Re-fetch data to ensure counts are updated
      await get().fetchData(); // Await fetchData to ensure completion before exiting
    } catch (error) {
      console.error('Error submitting ticket:', error.response?.data?.message || error.message);
    }
  },

  // Update form data
  updateFormData: (field, value) => {
    set((state) => ({
      formData: {
        ...state.formData,
        [field]: value,
      },
    }));
  },

  // Update ticket status
  updateTicketStatus: async (ticketId, newStatus) => {
    try {
      const response = await axios.put(`${API_URL}/support/verify/${ticketId}`, { status: newStatus }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Ticket status updated successfully:', response.data);

      // Re-fetch data to get the updated counts
      await get().fetchData(); // Await fetchData to ensure counts are updated
    } catch (error) {
      console.error('Error updating ticket status:', error.response?.data?.message || error.message);
    }
  },

  // Reset form data
  resetFormData: () => {
    set({
      formData: {
        name: '',
        companyName: '',
        emailId: '',
        complaint: '',
        phoneNumber: '',
        type: '',
      },
    });
  },
}));

export default useTicketStore;
