import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  LifeBuoy,
  MessageSquare,
  Mail,
  Phone,
  Clock,
  ChevronDown,
  ChevronUp,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Search,
  Package,
  ShieldCheck,
  RefreshCw,
  FileText,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const FAQS = [
  {
    q: "How can I track my order delivery in real time?",
    a: "You can track your order at any time using our Track Order tool. Simply enter your Order ID (found in your confirmation email or Purchased History) or your Tracking Number (e.g. TH-XXXXXX). You will see a live 5-step delivery tracker from order placement to doorstep arrival.",
    category: "Tracking",
  },
  {
    q: "What should I do if money was deducted from my bank but the order failed?",
    a: "Do not worry! If an online payment was deducted via Razorpay UPI or card but order creation was interrupted, Razorpay automatically initiates a reversal. Your bank will credit the full amount back to your original source within 3 to 5 business days. You can also file a ticket below with your bank transaction reference.",
    category: "Payments",
  },
  {
    q: "Can I cancel my order or modify the shipping address?",
    a: "You can cancel or update your address as long as the order status is still 'Order Placed' or 'Order Confirmed'. Once a parcel has been marked 'Shipped', it is in custody of the courier and cannot be rerouted. Contact our support team immediately if you need an urgent change.",
    category: "Orders",
  },
  {
    q: "What payment options are supported on TrendHive?",
    a: "We support Online Payments via Razorpay (UPI, Google Pay, PhonePe, Paytm, Credit & Debit Cards, Net Banking) as well as Cash on Delivery (COD) across eligible pin codes in India.",
    category: "Payments",
  },
  {
    q: "What is your return & refund timeline?",
    a: "We offer an easy 7-day return window from the date of delivery for items that are defective, damaged, or significantly different from the product listing. Once received and inspected by the merchant, refunds are issued within 48-72 hours.",
    category: "Returns",
  },
  {
    q: "How do I become a verified merchant or seller on TrendHive?",
    a: "TrendHive welcomes local shopkeepers and direct brand manufacturers. Simply sign up for a merchant account via the Shopkeeper Portal (/admin/login) or reach out to merchant-support@trendhive.com.",
    category: "Merchants",
  },
];

const Support = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const queryOrderId = searchParams.get("orderId") || "";

  // Form state
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [category, setCategory] = useState("Order Tracking & Delivery");
  const [orderId, setOrderId] = useState(queryOrderId);
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);
  const [formError, setFormError] = useState("");

  // Recent orders for dropdown selector
  const [userOrders, setUserOrders] = useState([]);
  const [myTickets, setMyTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);

  // FAQ state
  const [faqSearch, setFaqSearch] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

  // Sync user info if loaded later
  useEffect(() => {
    if (user) {
      if (!name) setName(user.name || "");
      if (!email) setEmail(user.email || "");

      // Fetch user's orders to help them pick an order ID
      const fetchOrders = async () => {
        try {
          const config = { headers: { Authorization: `Bearer ${user.token}` } };
          const { data } = await axios.get("/api/orders/myorders", config);
          if (Array.isArray(data)) setUserOrders(data);
        } catch {
          // ignore
        }
      };

      // Fetch user's existing tickets
      const fetchTickets = async () => {
        try {
          setLoadingTickets(true);
          const config = { headers: { Authorization: `Bearer ${user.token}` } };
          const { data } = await axios.get("/api/support/my-tickets", config);
          if (Array.isArray(data)) setMyTickets(data);
        } catch {
          // ignore
        } finally {
          setLoadingTickets(false);
        }
      };

      fetchOrders();
      fetchTickets();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!name.trim() || !email.trim() || !message.trim()) {
      setFormError("Please fill out your name, email, and message.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        name: name.trim(),
        email: email.trim(),
        category,
        orderId: orderId.trim(),
        message: message.trim(),
      };

      const config = user?.token
        ? { headers: { Authorization: `Bearer ${user.token}` } }
        : {};

      const { data } = await axios.post("/api/support", payload, config);

      setSubmittedTicket(data.ticket || { ticketId: data.ticketId, ...payload });
      setMessage("");
      // Add to myTickets if user is logged in
      if (data.ticket) {
        setMyTickets((prev) => [data.ticket, ...prev]);
      }
    } catch (err) {
      console.error("Ticket submission error:", err);
      setFormError(
        err.response?.data?.message ||
          "Failed to submit support ticket. Please try again or email support@trendhive.com directly."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const filteredFaqs = FAQS.filter(
    (item) =>
      item.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
      item.a.toLowerCase().includes(faqSearch.toLowerCase()) ||
      item.category.toLowerCase().includes(faqSearch.toLowerCase())
  );

  return (
    <div className="max-w-5xl px-4 py-8 mx-auto space-y-12">
      {/* Hero Banner */}
      <div className="max-w-2xl mx-auto space-y-3 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-bold text-blue-700 bg-blue-100 rounded-full dark:bg-blue-900/40 dark:text-blue-300">
          <LifeBuoy className="w-3.5 h-3.5" /> 24/7 Dedicated Support Desk
        </div>
        <h1 className="text-3xl font-black text-gray-900 sm:text-4xl dark:text-white">
          How can we help you today?
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Have questions regarding your order, payment, or delivery? Reach out to our dedicated support specialists or find instant answers below.
        </p>
      </div>

      {/* Support Channels 3 Cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="p-6 space-y-3 bg-white border border-gray-100 shadow-sm rounded-3xl dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center justify-center w-12 h-12 text-blue-600 rounded-2xl bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400">
            <Mail className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">Email Us</h3>
          <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
            Write to us anytime. We answer 98% of customer queries within 2 hours.
          </p>
          <a
            href="mailto:support@trendhive.com"
            className="inline-block text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            support@trendhive.com →
          </a>
        </div>

        <div className="p-6 space-y-3 bg-white border border-gray-100 shadow-sm rounded-3xl dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center justify-center w-12 h-12 text-green-600 rounded-2xl bg-green-50 dark:bg-green-900/30 dark:text-green-400">
            <Phone className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">Direct Helpline</h3>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">Customer Helpline</h3>
          <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
            Speak directly with our logistics team for urgent in-transit delivery updates.
            Phone assistance is being upgraded. Please use our 24/7 Email or the Support Request form below for fast resolution.
          </p>
          <span className="block text-xs font-bold text-green-600 dark:text-green-400">
            +91 98765 43210 (9 AM - 8 PM)
          </span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-gray-500 dark:text-gray-400">
              1800-XXX-XXXX
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
              Coming Soon
            </span>
          </div>
        </div>

        <div className="p-6 space-y-3 bg-white border border-gray-100 shadow-sm rounded-3xl dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center justify-center w-12 h-12 text-purple-600 rounded-2xl bg-purple-50 dark:bg-purple-900/30 dark:text-purple-400">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">Fast Parcel Tracker</h3>
          <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
            Check the live location and dispatch status of your package instantly.
          </p>
          <Link
            to="/track-order"
            className="inline-block text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline"
          >
            Open Order Tracker →
          </Link>
        </div>
      </div>

      {/* Ticket Submission Form & Active Tickets Section */}
      <div className="grid items-start grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Form: 7 cols */}
        <div className="p-6 space-y-6 bg-white border border-gray-100 shadow-sm lg:col-span-7 rounded-3xl sm:p-8 dark:bg-gray-800 dark:border-gray-700">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-black text-gray-900 dark:text-white">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              Submit a Support Request
            </h2>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Provide your details and order ID. A dedicated support agent will be assigned to resolve your issue.
            </p>
          </div>

          {/* Submitted Banner */}
          {submittedTicket && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-5 space-y-2 text-xs text-green-800 border border-green-200 bg-green-50 dark:bg-green-900/30 dark:border-green-800 rounded-2xl dark:text-green-300"
            >
              <div className="flex items-center gap-2 text-sm font-bold">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span>Ticket Created: #{submittedTicket.ticketId}</span>
              </div>
              <p>
                We have recorded your ticket for category <strong>{submittedTicket.category}</strong>. Our support team has sent an acknowledgement to <strong>{submittedTicket.email}</strong>.
              </p>
              <button
                onClick={() => setSubmittedTicket(null)}
                className="block pt-1 text-xs font-bold underline hover:no-underline"
              >
                Submit another inquiry
              </button>
            </motion.div>
          )}

          {formError && (
            <div className="flex items-center gap-2 p-4 text-xs text-red-700 border border-red-200 bg-red-50 dark:bg-red-900/30 dark:border-red-800 rounded-2xl dark:text-red-300">
              <AlertCircle className="flex-shrink-0 w-4 h-4" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block mb-1 text-xs font-bold text-gray-700 dark:text-gray-300">
                  Your Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  required
                  className="w-full px-3.5 py-2.5 text-xs bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-1 text-xs font-bold text-gray-700 dark:text-gray-300">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full px-3.5 py-2.5 text-xs bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block mb-1 text-xs font-bold text-gray-700 dark:text-gray-300">
                  Issue Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Order Tracking & Delivery">Order Tracking & Delivery</option>
                  <option value="Payment & Refund Issue">Payment & Refund Issue</option>
                  <option value="Damaged or Defective Item">Damaged or Defective Item</option>
                  <option value="Order Cancellation">Order Cancellation</option>
                  <option value="Account & Login">Account & Login</option>
                  <option value="Merchant Inquiry">Merchant Inquiry</option>
                  <option value="Other General Query">Other General Query</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-xs font-bold text-gray-700 dark:text-gray-300">
                  Order Reference (Optional)
                </label>
                {userOrders.length > 0 ? (
                  <select
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Select from recent orders...</option>
                    {userOrders.map((o) => (
                      <option key={o._id} value={o._id}>
                        Order #{o._id?.slice(-8).toUpperCase()} (₹{o.totalPrice})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="e.g. 65f2a1b9c..."
                    className="w-full px-3.5 py-2.5 text-xs bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                )}
              </div>
            </div>

            <div>
              <label className="block mb-1 text-xs font-bold text-gray-700 dark:text-gray-300">
                Describe the issue or question *
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please include relevant details such as product name, payment transaction ID, or delivery delay..."
                required
                className="w-full px-3.5 py-2.5 text-xs bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center justify-center w-full gap-2 px-5 py-3 text-xs font-bold text-white transition bg-blue-600 shadow-md hover:bg-blue-700 disabled:opacity-50 rounded-xl shadow-blue-600/20"
            >
              {submitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Submitting Ticket...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Ticket</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: User's Active Tickets (5 cols) */}
        <div className="space-y-6 lg:col-span-5">
          <div className="p-6 space-y-4 bg-white border border-gray-100 shadow-sm rounded-3xl dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
                <FileText className="w-4 h-4 text-blue-600" />
                Your Support Tickets
              </h3>
              {myTickets.length > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 font-bold">
                  {myTickets.length}
                </span>
              )}
            </div>

            {loadingTickets ? (
              <div className="py-8 text-xs text-center text-gray-400">
                Loading your tickets...
              </div>
            ) : myTickets.length === 0 ? (
              <div className="p-6 space-y-1 text-xs text-center text-gray-500 bg-gray-50 dark:bg-gray-750 rounded-2xl dark:text-gray-400">
                <p className="font-semibold text-gray-700 dark:text-gray-300">
                  No active support tickets
                </p>
                <p>
                  Tickets you submit will be tracked here with live status updates.
                </p>
              </div>
            ) : (
              <div className="pr-1 space-y-3 overflow-y-auto max-h-96">
                {myTickets.map((t) => (
                  <div
                    key={t._id || t.ticketId}
                    className="p-3.5 bg-gray-50 dark:bg-gray-750 rounded-2xl text-xs space-y-2 border border-gray-100 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-gray-900 dark:text-white">
                        #{t.ticketId}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          t.status === "Resolved"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                            : t.status === "In Progress"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>

                    <p className="font-semibold text-gray-800 dark:text-gray-200 text-[11px]">
                      {t.category}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 line-clamp-2 text-[11px]">
                      {t.message}
                    </p>

                    {t.adminResponse && (
                      <div className="p-2 bg-blue-50/80 dark:bg-blue-900/20 rounded-xl text-[11px] text-blue-800 dark:text-blue-300 border border-blue-100 dark:border-blue-800/50">
                        <strong>Support Team:</strong> {t.adminResponse}
                      </div>
                    )}

                    <span className="text-[10px] text-gray-400 block pt-1">
                      {t.createdAt
                        ? new Date(t.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Just now"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions (FAQ) Accordion */}
      <div className="pt-8 space-y-6 border-t border-gray-200 dark:border-gray-800">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-black text-gray-900 dark:text-white">
              <HelpCircle className="w-6 h-6 text-blue-600" />
              Frequently Asked Questions
            </h2>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Find instant solutions to the most common questions regarding orders, payments, and shipping.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              placeholder="Search FAQs..."
              className="w-full py-2 pr-4 text-xs text-gray-900 bg-white border border-gray-200 pl-9 dark:border-gray-700 rounded-xl dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="overflow-hidden transition bg-white border border-gray-100 shadow-sm rounded-2xl dark:bg-gray-800 dark:border-gray-700"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="flex items-center justify-between w-full p-4 text-xs font-bold text-left text-gray-900 transition sm:p-5 sm:text-sm dark:text-white hover:bg-gray-50 dark:hover:bg-gray-750"
                >
                  <span className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                      {faq.category}
                    </span>
                    <span>{faq.q}</span>
                  </span>
                  {isOpen ? (
                    <ChevronUp className="flex-shrink-0 w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="flex-shrink-0 w-4 h-4 text-gray-400" />
                  )}
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 pt-3 pb-4 text-xs leading-relaxed text-gray-600 border-t border-gray-100 sm:px-5 sm:pb-5 dark:text-gray-300 dark:border-gray-700/60"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Support;

