// models/order.js
import mongoose from 'mongoose';

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
      },
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
    orderStatus: {
      type: String,
      enum: ['Order Placed', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'],
      default: 'Order Placed',
    },
    trackingNumber: {
      type: String,
      default: function () {
        return 'TH-' + Math.random().toString(36).substring(2, 9).toUpperCase();
      },
    },
    carrier: {
      type: String,
      default: 'TrendHive Express',
    },
    estimatedDelivery: {
      type: Date,
      default: function () {
        return new Date(Date.now() + 4 * 24 * 60 * 60 * 1000); // 4 days delivery default
      },
    },
    statusHistory: [
      {
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        note: { type: String, default: '' },
      },
    ],
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
export { Order };
export default Order;
