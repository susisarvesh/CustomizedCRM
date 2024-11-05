import axios from 'axios';

const API_BASE_URL = "http://localhost:5000"; // Replace with your actual backend URL

export const fetchPendingTickets = () => {
  return axios.get(`${API_BASE_URL}/tickets/pending`);
};

export const fetchTicketHistory = () => {
  return axios.get(`${API_BASE_URL}/tickets/history`);
};

export const createTicket = (ticketData) => {
  return axios.post(`${API_BASE_URL}/tickets/create`, ticketData);
};
