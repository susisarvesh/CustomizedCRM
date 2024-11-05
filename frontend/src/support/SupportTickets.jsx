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
} from "../components/ui/Dialog";
import useSupportTicketStore from '../store/supportticket.js'; // Use the new store
import { useAuthStore } from '../store/authStore';

export default function SupportTickets() {
  const [isComplaintOpen, setIsComplaintOpen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  

  const {
    pendingSupportTickets,
    supportTicketHistory,
    supportTicketsRaised,
    formData,
    supportTickets,
    fetchSupportData,
    updateSupportFormData,
    submitSupportTicket,
  } = useSupportTicketStore(); // Use the support ticket store

  const { user } = useAuthStore();

  useEffect(() => {
    fetchSupportData();
  }, [user, reloadKey]);

  useEffect(() => {
    if (user) {
      updateSupportFormData('name', user.name);
      updateSupportFormData('companyName', user.companyName);
      updateSupportFormData('emailId', user.email);
      updateSupportFormData('phoneNumber', user.phoneNumber);
    }
  }, [user, updateSupportFormData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateSupportFormData(name, value);
  };

  const handleTypeChange = (selectedOption) => {
    updateSupportFormData('type', selectedOption.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.companyName || !formData.emailId || !formData.phoneNumber || !formData.complaint || !formData.type) {
      alert('Please fill in all required fields before submitting.');
      return;
    }

    try {
      await submitSupportTicket();
      setIsComplaintOpen(false);
      setReloadKey(prev => prev + 1);
    } catch (error) {
      console.error('Error submitting ticket:', error);
      alert('Failed to submit ticket. Please try again.');
    }
  };

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
        <StatCard icon={Clock} title="Pending Tickets" value={pendingSupportTickets} subtext="Awaiting Action" bgColor="bg-yellow-400" />
        <StatCard icon={Archive} title="Ticket History" value={supportTicketHistory.closed} subtext="Last 30 Days" bgColor="bg-blue-500" />
        <StatCard icon={Ticket} title="Tickets Raised" value={supportTicketsRaised} subtext="Today" bgColor="bg-green-500" />
      </div>

      <div className="mb-6 flex flex-wrap gap-4">
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
                  <Label htmlFor="type">Complaint Type</Label>
                  <Select
                    id="type"
                    options={typeOptions}
                    onChange={handleTypeChange}
                    placeholder="Select complaint type"
                    isClearable
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="complaint">Complaint</Label>
                  <Input
                    id="complaint"
                    name="complaint"
                    value={formData.complaint || ''}
                    onChange={handleInputChange}
                    placeholder="Describe your complaint"
                    required
                  />
                </div>
                <Button type="submit" variant="primary" className="w-full mt-4">Submit</Button>
              </form>
            </motion.div>
          </DialogContent>
        </Dialog>
        {/* <Button onClick={() => setIsComplaintOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Raise a New Complaint
        </Button> */}
      </div>
      
      <div className="container mx-auto px-4">
    <h2 className="text-2xl font-bold mb-4 text-center">All Support Tickets</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Map through the supportTickets to display them */}
        {supportTickets.map(ticket => (
            <div key={ticket._id} className="bg-white shadow-md rounded-lg p-4 transition-transform transform hover:scale-105">
                <h3 className="font-semibold text-lg text-red-500 mb-2">{ticket.complaint}</h3>
                <p className="text-gray-600"><strong>Status:</strong> {ticket.isClosed ? "Closed" : "Open"}</p>
                <p className="text-gray-600"><strong>Date Raised:</strong> {new Date(ticket.createdAt).toLocaleDateString()}</p>
                <p className="text-gray-600"><strong>Name:</strong> {ticket.name}</p>
                <p className="text-gray-600"><strong>Company Name:</strong> {ticket.companyName}</p>
                <p className="text-gray-600"><strong>Phone Number:</strong> {ticket.phoneNumber}</p>
                <p className="text-gray-600"><strong>Type:</strong> {ticket.type}</p>
            </div>
        ))}
    </div>
</div>

    </motion.div>
  );
}

const StatCard = ({ icon: Icon, title, value, subtext, bgColor }) => (
  <div className={`p-4 rounded-lg shadow-lg ${bgColor} text-white`}>
    <div className="flex items-center">
      <Icon className="w-6 h-6 mr-2" />
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className='text-2xl'>{value}</p>
        <small className="text-sm">{subtext}</small>
      </div>
    </div>
  </div>
);
