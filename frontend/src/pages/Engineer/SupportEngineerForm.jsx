import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion'; // Import framer-motion

export default function SupportEngineerForm() {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [engineers, setEngineers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api";

  useEffect(() => {
    const fetchEngineers = async () => {
      try {
        const response = await axios.get(`${API_URL}/users`);
        setEngineers(response.data);
      } catch (err) {
        console.error('Error fetching engineers:', err);
        setError('Error fetching engineers');
      }
    };

    fetchEngineers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !position || !email || !phone || !companyName) {
      setError('Please fill out all fields.');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/users`, {
        name,
        position,
        email,
        phone,
        companyName,
      });

      setSuccess(response.data.message);
      const updatedResponse = await axios.get(`${API_URL}/users`);
      setEngineers(updatedResponse.data);

      setName('');
      setPosition('');
      setEmail('');
      setPhone('');
      setCompanyName('');
    } catch (err) {
      console.error('Error:', err);
      setError(err.response ? err.response.data.message : 'Error creating user');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/users/${id}`);
      setEngineers(engineers.filter(engineer => engineer._id !== id));
      setSuccess('Engineer deleted successfully.');
    } catch (err) {
      console.error('Error deleting engineer:', err);
      setError('Error deleting engineer');
    }
  };

  // Animation variants for staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Stagger the animation by 0.1 seconds for each card
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 }, // Cards start off invisible and slightly below the normal position
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }, // Fade in and move upwards
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-semibold text-orange-800 mb-6">Add Engineer</h1>

      {/* Form for adding an engineer */}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700" htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 h-10 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-orange-200"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700" htmlFor="position">Position</label>
          <input
            type="text"
            id="position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            required
            className="mt-1 h-10 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-orange-200"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 h-10 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-orange-200"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700" htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="mt-1 h-10 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-orange-200"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700" htmlFor="companyName">Company Name</label>
          <input
            type="text"
            id="companyName"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
            className="mt-1 h-10 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-orange-200"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-orange-600 text-white rounded-md py-2 hover:bg-orange-700"
        >
          Add Engineer
        </button>

        {error && <p className="mt-4 text-red-600">{error}</p>}
        {success && <p className="mt-4 text-green-600">{success}</p>}
      </form>

      {/* Displaying the list of engineers as cards with animation */}
      <h2 className="text-xl font-semibold text-orange-800 mt-6">Engineers List</h2>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {engineers.map((engineer, index) => (
          <motion.div
            key={engineer._id}
            className="bg-gray-50 p-4 rounded-lg shadow hover:shadow-lg transition-shadow"
            variants={cardVariants}
          >
            <h3 className="text-lg font-semibold text-gray-900">{engineer.name}</h3>
            <p className="text-gray-700"><strong>Position:</strong> {engineer.position}</p>
            <p className="text-gray-700"><strong>Email:</strong> {engineer.email}</p>
            <p className="text-gray-700"><strong>Phone:</strong> {engineer.phone}</p>
            <p className="text-gray-700"><strong>Company:</strong> {engineer.companyName}</p>
            <button
              onClick={() => handleDelete(engineer._id)}
              className="mt-4 text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
