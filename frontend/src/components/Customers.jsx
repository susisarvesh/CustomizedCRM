import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function Customers() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/customers');
        setCustomers(response.data);
      } catch (err) {
        console.error('Error fetching customers:', err);
        setError('Error fetching customers');
      }
    };
    fetchCustomers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !email || !phone || !companyName) {
      setError('Please fill out all fields.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/customers', {
        name,
        email,
        phone,
        companyName,
      });

      setSuccess(response.data.message);
      setTimeout(() => setSuccess(''), 3000); // Clear success message after 3 seconds
      const updatedResponse = await axios.get('http://localhost:5000/api/customers');
      setCustomers(updatedResponse.data);

      setName('');
      setEmail('');
      setPhone('');
      setCompanyName('');
    } catch (err) {
      console.error('Error:', err);
      setError(err.response ? err.response.data.message : 'Error creating customer');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/customers/${id}`);
      setCustomers(customers.filter(customer => customer._id !== id));
      setSuccess('Customer deleted successfully.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error deleting customer:', err);
      setError('Error deleting customer');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-semibold text-orange-800 mb-6">Add Customer</h1>

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
          className="w-full bg-orange-600 text-white rounded-md py-2 hover:bg-orange-700 transition"
        >
          Add Customer 
        </button>

        {error && <p className="mt-4 text-red-600">{error}</p>}
        {success && <p className="mt-4 text-green-600">{success}</p>}
      </form>

      <h2 className="text-xl font-semibold text-orange-800 mt-6">Customers List</h2>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {customers.map((customer) => (
          <motion.div
            key={customer._id}
            className="bg-gray-50 p-4 rounded-lg shadow hover:shadow-lg transition-shadow"
            variants={cardVariants}
          >
            <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
            <p className="text-gray-700"><strong>Email:</strong> {customer.email}</p>
            <p className="text-gray-700"><strong>Phone:</strong> {customer.phone}</p>
            <p className="text-gray-700"><strong>Company:</strong> {customer.companyName}</p>
            <button
              onClick={() => handleDelete(customer._id)}
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
