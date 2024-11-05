import { create } from 'zustand';
import axios from 'axios';

// Determine API URL based on environment
const API_URL = import.meta.env.MODE === "development" 
  ? "http://localhost:5000/api/supporttickets" 
  : "/api/supporttickets";
  const API_URL_SUPPORT = import.meta.env.MODE === "development" 
  ? "http://localhost:5000/api/tickets" 
  : "/api/tickets";
  const API_URL_FIELD = import.meta.env.MODE === "development" 
  ? "http://localhost:5000/api/tickets" 
  : "/api/tickets";

axios.defaults.withCredentials = true;

// Create Zustand store
export const useSupportTicketStore = create((set, get) => ({
  pendingSupportTickets: 0,
  supportTicketHistory: { raised: 0, closed: 0 },
  supportTicketsRaised: 0,
  supportTickets: [], // Initialize tickets array
  formData: {
    name: '',
    companyName: '',
    emailId: '',
    complaint: '',
    phoneNumber: '',
    type: '',
  },
  
  // Fetch data from backend for support tickets
  fetchSupportData: async () => {
    try {
      const [pendingResponse, historyResponse, raisedResponse, ticketsResponse] = await Promise.all([
        axios.get(`${API_URL}/pending-tickets`),
        axios.get(`${API_URL}/closed-tickets`),
        axios.get(`${API_URL}/raised-tickets`),
        axios.get(`${API_URL}/ticket-details`)
      ]);

      set({
        pendingSupportTickets: pendingResponse.data.count || 0,
        supportTicketHistory: {
          raised: historyResponse.data?.raised || 0,
          closed: historyResponse.data?.closed || 0,
        },
        supportTicketsRaised: raisedResponse.data.count || 0,
        supportTickets: ticketsResponse.data || [],
      });

      console.log("Updated State:", {
        pendingSupportTickets: pendingResponse.data.count,
        supportTicketHistory: historyResponse.data,
        supportTicketsRaised: raisedResponse.data.count,
        supportTickets: ticketsResponse.data,
      });
    } catch (error) {
      console.error('Error fetching support ticket data:', error.response?.data?.message || error.message);
    }
  },
    fetchAssignedTickets: async (engineerId) => {
    try {
      const response = await axios.get(`${API_URL_FIELD}/assigned-tickets/${engineerId}`);
      set({ assignedTickets: response.data.tickets || [] });
      console.log('Fetched assigned tickets:', response.data.tickets);
    } catch (error) {
      console.error('Error fetching assigned tickets:', error.response?.data?.message || error.message);
    }
  },
    closeTicket: async (ticketId) => {
    try {
      const response = await axios.put(`${API_URL_SUPPORT}/support/close/${ticketId}`);
      alert(response.data.message); // Notify the user
      // Re-fetch the tickets to update the list after closing
      await useSupportTicketStore.getState().fetchFieldClosedTickets();
    } catch (error) {
      console.error('Failed to close ticket:', error);
      alert('Error closing ticket. Please try again.');
    }
  },

   fetchFieldEngineers: async () => {
    try {
      const response = await axios.get(`${API_URL_SUPPORT}/supports/getfieldengineer`);
      set({ fieldEngineers: response.data || [] });
      console.log('Fetched field engineers:', response.data);
    } catch (error) {
      console.error('Error fetching field engineers:', error.response?.data?.message || error.message);
    }
  },
     completeFieldWork: async (ticketId) => {
    try {
      const response = await axios.put(`${API_URL_SUPPORT}/field/complete/${ticketId}`);
      console.log('Field work completed successfully:', response.data);
      // Refresh data to ensure counts are updated
      await get().fetchSupportData();
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Error completing field work:', error.response?.data?.message || error.message);
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },
     

  // Submit new support ticket data to backend
  submitSupportTicket: async () => {
    const { formData } = get();
    try {
      const response = await axios.post(`${API_URL}/create`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Support ticket created successfully:', response.data);

      // Update the ticket counts and reset form data after creation
      set((state) => ({
        supportTicketsRaised: state.supportTicketsRaised + 1,
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
      await get().fetchSupportData();
    } catch (error) {
      console.error('Error submitting support ticket:', error.response?.data?.message || error.message);
    }
  },

  assignTicketToFieldEngineer: async (ticketId, fieldEngineerId) => {
    try {
      const response = await axios.put(`${API_URL_SUPPORT}/support/assign/${ticketId}`, { fieldEngineerId }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Ticket assigned to field engineer successfully:', response.data);

      // Refresh data after assignment to update the state
      await get().fetchSupportData();

      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Error assigning ticket:', error.response?.data?.message || error.message);
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  // Verify a specific support ticket
  verifySupportTicket: async (ticketId) => {
  try {
    console.log(ticketId);

    // Send request to verify the ticket
    const response = await axios.put(`${API_URL_SUPPORT}/supports/verify/${ticketId}`);
    console.log('Ticket verified successfully:', response.data);

    // Update only the `supportTickets` array by marking the specific ticket as verified
    set((state) => {
      const updatedTickets = state.supportTickets.map((ticket) => {
        // Check if this is the ticket being verified
        if (ticket._id === ticketId) {
          // Return the updated ticket with the verification status
          return { ...ticket, isVerified: true }; // Modify as per your ticket structure
        }
        return ticket; // Return the ticket unchanged
      });

      // Return the new state, leaving pendingSupportTickets unchanged
      return {
        supportTickets: updatedTickets,
        // Ensure pendingSupportTickets is not modified here
      };
    });

  } catch (error) {
    console.error('Error verifying ticket:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else {
      console.error('Error message:', error.message);
    }
  }
},


  // Fetch all field-closed tickets from the backend
fetchFieldClosedTickets: async () => {
  try {
    const response = await axios.get(`${API_URL_FIELD}/support/field-closed`); // Adjust the URL if needed
    set({ fieldClosedTickets: response.data || [] });
    console.log('Fetched field-closed tickets:', response.data);
  } catch (error) {
    console.error('Error fetching field-closed tickets:', error.response?.data?.message || error.message);
  }
},




  // Update form data for support tickets
  updateSupportFormData: (field, value) => {
    set((state) => ({
      formData: {
        ...state.formData,
        [field]: value,
      },
    }));
  },

  // Update support ticket status
  updateSupportTicketStatus: async (ticketId, newStatus) => {
    try {
      const response = await axios.put(`${API_URL}/update-status/${ticketId}`, { status: newStatus }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Support ticket status updated successfully:', response.data);

      // Re-fetch data to get the updated counts
      await get().fetchSupportData();
    } catch (error) {
      console.error('Error updating support ticket status:', error.response?.data?.message || error.message);
    }
  },

  // Reset form data for support tickets
  resetSupportFormData: () => {
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

export default useSupportTicketStore;
