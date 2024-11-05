import { useEffect, useState } from 'react';
import { X, Clock, Archive, Ticket, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import Select from 'react-select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/Dialog";
import useTicketStore from '../store/ticketStore.js';
import { useAuthStore } from '../store/authStore'; // Import useAuthStore

export default function CustomerTickets() {
  const [isComplaintOpen, setIsComplaintOpen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0); // State variable to track reloads

  const {
    pendingTickets,
    ticketHistory,
    ticketsRaised,
    formData,
    tickets,
    fetchData,
    updateFormData,
    submitTicket,
  } = useTicketStore();

  const { user } = useAuthStore(); // Get the user data from the auth store

  useEffect(() => {
    fetchData(); // Fetch data when the component mounts
  }, [user, reloadKey]); // Removed fetchData as a dependency and added reloadKey

  useEffect(() => {
    console.log('Pending Tickets frontend:', pendingTickets);
  }, [pendingTickets]); // Log when pendingTickets changes

  // Populate formData with user data
  useEffect(() => {
    if (user) {
      updateFormData('name', user.name);
      updateFormData('companyName', user.companyName);
      updateFormData('emailId', user.email);
      updateFormData('phoneNumber', user.phoneNumber); // Set phone number from user data if available
    }
  }, [user, updateFormData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateFormData(name, value); // Update form data using Zustand's updateFormData
  };

  const handleTypeChange = (selectedOption) => {
    updateFormData('type', selectedOption.value); // Update formData.type using Zustand's updateFormData
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form Data Submitted:', formData);
    // Validate form data before submitting
    if (!formData.name || !formData.companyName || !formData.emailId || !formData.phoneNumber || !formData.complaint || !formData.type) {
      alert('Please fill in all required fields before submitting.');
      return; // Stop form submission if any required field is missing
    }

    try {
      await submitTicket(); // Submit the ticket using Zustand's submitTicket
      setIsComplaintOpen(false); // Close the complaint dialog
      setReloadKey(prev => prev + 1); // Update reloadKey to trigger a re-render
    } catch (error) {
      console.error('Error submitting ticket:', error); // Log the error for debugging
      alert('Failed to submit ticket. Please try again.'); // Notify user of the error
    }
  };

  // Options for the react-select dropdown
  const typeOptions = [
    { value: 'Warranty', label: 'Warranty' },
    { value: 'AMC', label: 'AMC' },
  ];

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-4 sm:p-6 max-w-6xl mx-auto"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard icon={Clock} title="Pending Tickets" value={pendingTickets} subtext="Awaiting Action" bgColor="bg-yellow-400" />
        <StatCard icon={Archive} title="Ticket History" value={ticketHistory.closed} subtext="Last 30 Days" bgColor="bg-blue-500" />
        <StatCard icon={Ticket} title="Tickets Raised" value={ticketsRaised} subtext="Today" bgColor="bg-green-500" />
      </div>

      <div className="mb-6 flex flex-wrap gap-4">
        <Button className="w-full flex items-center sm:w-auto" onClick={() => setIsComplaintOpen(true)}>
          <Plus className="w-5 h-5 mr-2" />
          Raise New Ticket
        </Button>
        <Dialog open={isComplaintOpen} onOpenChange={setIsComplaintOpen}>
          <DialogContent className="sm:max-w-[425px] relative">
            <DialogHeader className="flex justify-between items-start">
              <DialogTitle>Raise New Complaint</DialogTitle>
              <Button onClick={() => setIsComplaintOpen(false)} className="absolute top-2 right-2 z-10" variant="ghost" size="icon">
                <X className="w-4 h-4" />
              </Button>
            </DialogHeader>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid gap-4 py-4"
            >
              <form onSubmit={handleSubmit}>
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" value={formData.name || ''} onChange={handleInputChange} placeholder="Enter your name" readOnly />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="company">Company Name</Label>
                  <Input id="company" name="companyName" value={formData.companyName || ''} onChange={handleInputChange} placeholder="Enter company name" readOnly />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="emailId">Email ID</Label>
                  <Input id="emailId" name="emailId" type="email" value={formData.emailId || ''} onChange={handleInputChange} placeholder="Enter your email" readOnly />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input id="phoneNumber" name="phoneNumber" type="tel" value={formData.phoneNumber || ''} onChange={handleInputChange} placeholder="Enter your phone number" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="complaint">Complaint</Label>
                  <Input id="complaint" name="complaint" value={formData.complaint || ''} onChange={handleInputChange} placeholder="Describe your complaint" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    id="type"
                    name="type"
                    options={typeOptions}
                    onChange={handleTypeChange}
                    placeholder="Select ticket type"
                    required
                  />
                </div>
                <div className="mt-4">
                  <Button type="submit" className="w-full">
                    Submit Ticket
                  </Button>
                </div>
              </form>
            </motion.div>
          </DialogContent>
        </Dialog>
      </div>

      <h2 className="text-xl font-semibold mb-4">Your Tickets</h2>
      <div className="overflow-hidden rounded-lg shadow-md">
        <table className="min-w-full border-collapse bg-white">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Ticket ID</th>
              <th className="border px-4 py-2">Type</th>
              <th className="border px-4 py-2">Complaint</th>
              <th className="border px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {tickets.length > 0 ? (
              tickets.map((ticket) => (
                <tr key={ticket._id} className="hover:bg-gray-100">
                  <td className="border px-4 py-2">{ticket._id}</td>
                  <td className="border px-4 py-2">{ticket.type}</td>
                  <td className="border px-4 py-2">{ticket.complaint}</td>
                  <td className="border px-4 py-2">{ticket.isClosed ? 'Closed' : 'Pending'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="border px-4 py-2 text-center">No tickets found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

// StatCard component for displaying ticket statistics
const StatCard = ({ icon: Icon, title, value, subtext, bgColor }) => {
  return (
    <div className={`p-4 rounded-lg shadow-md ${bgColor} text-white`}>
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm">{subtext}</p>
        </div>
        <Icon className="w-12 h-12 opacity-50" />
      </div>
    </div>
  );
};
