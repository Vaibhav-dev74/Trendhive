import asyncHandler from 'express-async-handler';
import { Order } from '../models/order.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    } else {
        const isPaid = Boolean(req.body.isPaid);
        const order = new Order({
            user: req.user._id,
            orderItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
            isPaid: isPaid,
            paidAt: isPaid ? Date.now() : null,
            paymentResult: req.body.paymentResult || null,
            orderStatus: isPaid ? 'Confirmed' : 'Order Placed',
            statusHistory: [
                {
                    status: 'Order Placed',
                    timestamp: new Date(),
                    note: 'Order placed successfully',
                },
                ...(isPaid
                    ? [
                          {
                              status: 'Confirmed',
                              timestamp: new Date(),
                              note: 'Payment verified and order confirmed',
                          },
                      ]
                    : []),
            ],
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    }
});

// @desc    Track order by ID or Tracking Number
// @route   GET /api/orders/track/:identifier
// @access  Public
const trackOrder = asyncHandler(async (req, res) => {
    const { identifier } = req.params;
    if (!identifier) {
        res.status(400);
        throw new Error('Please provide an Order ID or Tracking Number');
    }

    const trimmed = identifier.trim();
    let order = null;

    // Check if valid ObjectId
    if (trimmed.match(/^[0-9a-fA-F]{24}$/)) {
        order = await Order.findById(trimmed).populate('user', 'name email');
    }

    // If not found by _id, search by trackingNumber (case-insensitive)
    if (!order) {
        order = await Order.findOne({
            trackingNumber: { $regex: new RegExp(`^${trimmed}$`, 'i') },
        }).populate('user', 'name email');
    }

    if (order) {
        // Return public tracking info
        res.json({
            _id: order._id,
            trackingNumber: order.trackingNumber,
            carrier: order.carrier || 'TrendHive Express',
            estimatedDelivery: order.estimatedDelivery,
            orderStatus: order.orderStatus || (order.isDelivered ? 'Delivered' : 'Order Placed'),
            statusHistory: order.statusHistory || [],
            createdAt: order.createdAt,
            orderItems: order.orderItems,
            shippingAddress: order.shippingAddress,
            totalPrice: order.totalPrice,
            paymentMethod: order.paymentMethod,
            isPaid: order.isPaid,
            isDelivered: order.isDelivered,
            deliveredAt: order.deliveredAt,
        });
    } else {
        res.status(404);
        throw new Error('Order not found with provided reference or tracking number');
    }
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin/Shopkeeper
const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
        const allowedStatuses = [
            'Order Placed',
            'Confirmed',
            'Shipped',
            'Out for Delivery',
            'Delivered',
            'Cancelled',
        ];

        if (!allowedStatuses.includes(status)) {
            res.status(400);
            throw new Error(`Invalid status. Allowed: ${allowedStatuses.join(', ')}`);
        }

        order.orderStatus = status;

        if (status === 'Delivered') {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
        }

        if (!order.statusHistory) {
            order.statusHistory = [];
        }

        order.statusHistory.push({
            status,
            timestamp: new Date(),
            note: note || `Order updated to ${status}`,
        });

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
        res.json(order);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address,
        };
        if (order.orderStatus === 'Order Placed') {
            order.orderStatus = 'Confirmed';
        }
        if (!order.statusHistory) order.statusHistory = [];
        order.statusHistory.push({
            status: 'Confirmed',
            timestamp: new Date(),
            note: 'Payment verified and order confirmed',
        });

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name email').sort({ createdAt: -1 });
    res.json(orders);
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
});

export {
    createOrder,
    getOrderById,
    updateOrderToPaid,
    getOrders,
    getMyOrders,
    trackOrder,
    updateOrderStatus,
};
