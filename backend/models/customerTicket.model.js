import mongoose from 'mongoose';

const customerDetailsSchema = new mongoose.Schema({
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
  phoneNumber: {
    type: String,
    required: true,
  },
  tickets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CustomerTicket', // Reference to the ticket model
  }],
  pendingCount: {
    type: Number,
    default: 0,
  },
  assignedCount: {
    type: Number,
    default: 0,
  },
  closedCount: {
    type: Number,
    default: 0,
  },
  verifiedCount: {
    type: Number,
    default: 0,
  },
  fieldClosedCount: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

const CustomerDetails = mongoose.model('CustomerDetails', customerDetailsSchema);
export default CustomerDetails;
