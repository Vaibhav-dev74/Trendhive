// models/supportTicket.js
import mongoose from 'mongoose';

const supportTicketSchema = mongoose.Schema(
  {
    ticketId: {
      type: String,
      required: true,
      unique: true,
      default: function () {
        return 'TICK-' + Math.floor(100000 + Math.random() * 900000);
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Order Tracking & Delivery',
        'Damaged or Defective Item',
        'Payment & Refund Issue',
        'Order Cancellation',
        'Account & Login',
        'Merchant Inquiry',
        'Other General Query',
      ],
      default: 'Order Tracking & Delivery',
    },
    orderId: {
      type: String,
      default: '',
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
      default: 'Open',
    },
    adminResponse: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const SupportTicket = mongoose.model('SupportTicket', supportTicketSchema);
export { SupportTicket };
export default SupportTicket;
