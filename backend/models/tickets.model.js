// models/tickets.model.js
import mongoose from 'mongoose';
import CustomerDetails from './customerTicket.model.js'; // Import CustomerDetails model
const customerTicketSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  emailId: {
    type: String,
    required: true,
  },
  complaint: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Warranty', 'AMC'],
    required: true,
  },
  ticketId: {
    type: String,
    unique: true,
    default: () => `TICKET-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
  },
  isPending: {
    type: Boolean,
    default: true,
  },
  isAssigned: {
    type: Boolean,
    default: false,
  },
  isClosed: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isFieldClosed: {
    type: Boolean,
    default: false,
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CustomerDetails',
    required: true,
  },
  fieldEngineerId: { // Track which field engineer is assigned
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Field',
    required: false,
  }
}, { timestamps: true });

// Middleware to update counts before saving the ticket
customerTicketSchema.pre('save', async function (next) {
  const ticket = this;

  if (ticket.isModified('isPending') || ticket.isModified('isAssigned') ||
      ticket.isModified('isClosed') || ticket.isModified('isVerified') ||
      ticket.isModified('isFieldClosed')) {

    const customer = await CustomerDetails.findById(ticket.customerId);

    // Update the counts based on the current state of the ticket
    if (ticket.isPending) {
      customer.pendingCount += 1;
    } else if (ticket.isModified('isPending')) {
      customer.pendingCount -= 1;
    }

    if (ticket.isAssigned) {
      customer.assignedCount += 1;
    } else if (ticket.isModified('isAssigned')) {
      customer.assignedCount -= 1;
    }

    if (ticket.isClosed) {
      customer.closedCount += 1;
    } else if (ticket.isModified('isClosed')) {
      customer.closedCount -= 1;
    }

    if (ticket.isVerified) {
      customer.verifiedCount += 1;
    } else if (ticket.isModified('isVerified')) {
      customer.verifiedCount -= 1;
    }

    if (ticket.isFieldClosed) {
      customer.fieldClosedCount += 1;
    } else if (ticket.isModified('isFieldClosed')) {
      customer.fieldClosedCount -= 1;
    }

    await customer.save();
  }

  next();
});

const CustomerTicket = mongoose.model('CustomerTicket', customerTicketSchema);
export default CustomerTicket;
