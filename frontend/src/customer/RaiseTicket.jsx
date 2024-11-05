import { useState } from "react";
import axios from "axios"; // For API requests

export default function RaiseTicket() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    complaint: "",
    ticketType: "issue", // Default ticket type
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/tickets/create", formData);
      alert("Ticket created successfully!");
      // Optionally, reset form
      setFormData({
        name: "",
        company: "",
        email: "",
        complaint: "",
        ticketType: "issue",
      });
    } catch (error) {
      console.error("Error creating ticket", error);
      alert("Failed to create ticket");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md">
      <div className="mb-4">
        <label className="block mb-1">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Company</label>
        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Complaint</label>
        <textarea
          name="complaint"
          value={formData.complaint}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Ticket Type</label>
        <select
          name="ticketType"
          value={formData.ticketType}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border"
        >
          <option value="issue">Issue</option>
          <option value="feature-request">Feature Request</option>
        </select>
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Submit
      </button>
    </form>
  );
}
