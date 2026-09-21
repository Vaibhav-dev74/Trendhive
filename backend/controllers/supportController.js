// controllers/supportController.js
import asyncHandler from 'express-async-handler';
import SupportTicket from '../models/supportTicket.js';

// @desc    Create new support ticket
// @route   POST /api/support
// @access  Public (supports both guests & authenticated users)
const createTicket = asyncHandler(async (req, res) => {
  const { name, email, category, orderId, message } = req.body;

  if (!name || !email || !message) {
    res.status(400);
    throw new Error('Name, email, and message are required');
  }

  const ticket = new SupportTicket({
    user: req.user ? req.user._id : undefined,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    category: category || 'Order Tracking & Delivery',
    orderId: orderId ? orderId.trim() : '',
    message: message.trim(),
    status: 'Open',
  });

  const createdTicket = await ticket.save();

  res.status(201).json({
    success: true,
    ticketId: createdTicket.ticketId,
    message: 'Your support ticket has been submitted. Our team will get back to you within 24 hours.',
    ticket: createdTicket,
  });
});

// @desc    Get tickets for logged-in user
// @route   GET /api/support/my-tickets
// @access  Private
const getMyTickets = asyncHandler(async (req, res) => {
  const tickets = await SupportTicket.find({
    $or: [{ user: req.user._id }, { email: req.user.email }],
  }).sort({ createdAt: -1 });

  res.json(tickets);
});

// @desc    Get all tickets (Admin / Support Staff)
// @route   GET /api/support
// @access  Private/Admin
const getAllTickets = asyncHandler(async (req, res) => {
  const tickets = await SupportTicket.find({}).sort({ createdAt: -1 });
  res.json(tickets);
});

// @desc    Update ticket status / add response
// @route   PUT /api/support/:id/status
// @access  Private/Admin
const updateTicketStatus = asyncHandler(async (req, res) => {
  const { status, adminResponse } = req.body;
  const ticket = await SupportTicket.findById(req.params.id);

  if (ticket) {
    if (status) ticket.status = status;
    if (adminResponse !== undefined) ticket.adminResponse = adminResponse;

    const updated = await ticket.save();
    res.json(updated);
  } else {
    res.status(404);
    throw new Error('Support ticket not found');
  }
});

export { createTicket, getMyTickets, getAllTickets, updateTicketStatus };

