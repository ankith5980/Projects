import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard,
  Wallet,
  Building2,
  Smartphone,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  IndianRupee,
  Calendar,
  Receipt,
} from 'lucide-react';
import api from '../services/api';

const QuickPay = () => {
  const navigate = useNavigate();
  const { user, member } = useSelector((state) => state.auth);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [paymentType, setPaymentType] = useState('membership_fee');

  useEffect(() => {
    fetchPendingPayments();
    loadRazorpayScript();
  }, []);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const fetchPendingPayments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/payments/my-payments', {
        params: { status: 'pending' },
      });
      setPendingPayments(response.data.data.payments || []);
    } catch (error) {
      console.error('Error fetching pending payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (payment) => {
    try {
      setProcessing(true);

      // Check if Razorpay is loaded
      if (!window.Razorpay) {
        alert('⚠️ Payment gateway not loaded. Please refresh the page and try again.');
        setProcessing(false);
        return;
      }

      // Create Razorpay order
      const orderResponse = await api.post('/payments/create-order', {
        amount: payment.amount,
        type: payment.type,
        period: payment.period,
        paymentId: payment._id,
      });

      const { orderId, amount, currency, key } = orderResponse.data.data;

      // Check if valid Razorpay key
      if (!key || key === 'your_razorpay_key_id') {
        alert('⚠️ Payment gateway not configured.\n\nPlease contact the administrator to set up Razorpay payment credentials.\n\nPayment ID for reference: ' + payment._id);
        setProcessing(false);
        return;
      }

      // Razorpay options
      const options = {
        key: key,
        amount: amount,
        currency: currency,
        name: 'Rotary Club of Calicut South',
        description: `${payment.type.replace('_', ' ')} Payment`,
        order_id: orderId,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyResponse = await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              paymentId: payment._id,
            });

            if (verifyResponse.data.success) {
              alert('Payment successful! 🎉');
              fetchPendingPayments();
              navigate('/payments');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            alert('Payment verification failed. Please contact support.');
          } finally {
            setProcessing(false);
          }
        },
        prefill: {
          name: `${member?.firstName} ${member?.lastName}`,
          email: user?.email,
          contact: member?.phone || '',
        },
        notes: {
          member_id: member?.memberId,
          payment_type: payment.type,
        },
        theme: {
          color: '#2563eb',
        },
        modal: {
          ondismiss: function () {
            setProcessing(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Error creating payment order:', error);
      alert(error.response?.data?.message || 'Failed to create payment order');
      setProcessing(false);
    }
  };

  const handleCustomPayment = async () => {
    if (!customAmount || parseFloat(customAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      setProcessing(true);

      // Check if Razorpay is configured
      if (!window.Razorpay) {
        alert('⚠️ Payment gateway not loaded. Please refresh the page and try again.');
        setProcessing(false);
        return;
      }

      // Create payment record first
      const paymentResponse = await api.post('/payments', {
        amount: parseFloat(customAmount),
        type: paymentType,
        status: 'pending',
      });

      const payment = paymentResponse.data.data;

      // Then create Razorpay order
      const orderResponse = await api.post('/payments/create-order', {
        amount: payment.amount,
        type: payment.type,
        paymentId: payment._id,
      });

      const { orderId, amount, currency, key } = orderResponse.data.data;

      // Check if valid Razorpay key
      if (!key || key === 'your_razorpay_key_id') {
        alert('⚠️ Payment gateway not configured.\n\nPlease contact the administrator to set up Razorpay payment credentials in the system configuration.\n\nFor now, you can note down this payment reference: ' + payment._id);
        setProcessing(false);
        return;
      }

      const options = {
        key: key,
        amount: amount,
        currency: currency,
        name: 'Rotary Club of Calicut South',
        description: `${paymentType.replace('_', ' ')} Payment`,
        order_id: orderId,
        handler: async function (response) {
          try {
            const verifyResponse = await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              paymentId: payment._id,
            });

            if (verifyResponse.data.success) {
              alert('Payment successful! 🎉');
              setCustomAmount('');
              fetchPendingPayments();
              navigate('/payments');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            alert('Payment verification failed. Please contact support.');
          } finally {
            setProcessing(false);
          }
        },
        prefill: {
          name: `${member?.firstName} ${member?.lastName}`,
          email: user?.email,
          contact: member?.phone || '',
        },
        theme: {
          color: '#2563eb',
        },
        modal: {
          ondismiss: function () {
            setProcessing(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Error creating custom payment:', error);
      alert(error.response?.data?.message || 'Failed to create payment');
      setProcessing(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', icon: AlertCircle },
      completed: { color: 'bg-green-500/20 text-green-300 border-green-500/30', icon: CheckCircle },
      failed: { color: 'bg-red-500/20 text-red-300 border-red-500/30', icon: AlertCircle },
    };

    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${badge.color}`}>
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/payments')}
            className="flex items-center gap-2 text-blue-200 hover:text-yellow-400 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Payments
          </button>

          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <CreditCard className="w-8 h-8" />
            Quick Pay
          </h1>
          <p className="text-blue-200">Make secure payments instantly with Razorpay</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Payments */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
          >
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Receipt className="w-6 h-6" />
              Pending Payments
            </h2>

            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white/5 rounded-lg p-4 animate-pulse">
                    <div className="h-4 bg-white/10 rounded mb-2" />
                    <div className="h-3 bg-white/10 rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : pendingPayments.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-green-300 mx-auto mb-4" />
                <p className="text-blue-200 text-lg">No pending payments</p>
                <p className="text-blue-300 text-sm mt-2">All your dues are cleared!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingPayments.map((payment, index) => (
                  <motion.div
                    key={payment._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-white font-semibold capitalize">
                          {payment.type.replace('_', ' ')}
                        </h3>
                        <p className="text-blue-300 text-sm">{payment.description || 'Payment due'}</p>
                      </div>
                      {getStatusBadge(payment.status)}
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-green-300">
                        <IndianRupee className="w-5 h-5" />
                        <span className="text-2xl font-bold">₹{payment.amount}</span>
                      </div>

                      {payment.dueDate && (
                        <div className="flex items-center gap-1 text-sm text-blue-300">
                          <Calendar className="w-4 h-4" />
                          Due: {new Date(payment.dueDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handlePayment(payment)}
                      disabled={processing}
                      className="w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white font-medium hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processing ? 'Processing...' : 'Pay Now'}
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Custom Payment */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
          >
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Wallet className="w-6 h-6" />
              Make Custom Payment
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-blue-200 mb-2">Payment Type</label>
                <select
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="membership_fee" className="bg-slate-800">Membership Fee</option>
                  <option value="project_contribution" className="bg-slate-800">Project Contribution</option>
                  <option value="event_fee" className="bg-slate-800">Event Fee</option>
                  <option value="donation" className="bg-slate-800">Donation</option>
                  <option value="fine" className="bg-slate-800">Fine</option>
                  <option value="other" className="bg-slate-800">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-blue-200 mb-2">Amount (₹)</label>
                <div className="relative">
                  <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="Enter amount"
                    min="1"
                    step="0.01"
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                onClick={handleCustomPayment}
                disabled={processing || !customAmount}
                className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg text-white font-medium hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Processing...' : 'Proceed to Pay'}
              </button>

              {/* Payment Methods Info */}
              <div className="mt-8 pt-6 border-t border-white/20">
                <h3 className="text-white font-semibold mb-4">Supported Payment Methods</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 rounded-lg p-3 flex items-center gap-2 border border-white/10">
                    <CreditCard className="w-5 h-5 text-blue-300" />
                    <span className="text-blue-200 text-sm">Cards</span>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 flex items-center gap-2 border border-white/10">
                    <Smartphone className="w-5 h-5 text-blue-300" />
                    <span className="text-blue-200 text-sm">UPI</span>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 flex items-center gap-2 border border-white/10">
                    <Building2 className="w-5 h-5 text-blue-300" />
                    <span className="text-blue-200 text-sm">Net Banking</span>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 flex items-center gap-2 border border-white/10">
                    <Wallet className="w-5 h-5 text-blue-300" />
                    <span className="text-blue-200 text-sm">Wallets</span>
                  </div>
                </div>
              </div>

              {/* Security Info */}
              <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-4 mt-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-300 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-blue-200 text-sm">
                      All payments are secured by Razorpay with industry-standard encryption
                    </p>
                  </div>
                </div>
              </div>

              {/* Configuration Notice */}
              <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4 mt-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-yellow-200 text-sm font-medium mb-1">
                      Payment Gateway Setup Required
                    </p>
                    <p className="text-yellow-200/80 text-xs">
                      If you see an error, the Razorpay payment gateway needs to be configured by the administrator. Contact support for assistance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Payment Guidelines</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center">
                  <span className="text-blue-300 font-bold">1</span>
                </div>
                <h3 className="text-white font-semibold">Select Payment</h3>
              </div>
              <p className="text-blue-300 text-sm">
                Choose from pending dues or enter a custom amount for other payments
              </p>
            </div>

            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center">
                  <span className="text-blue-300 font-bold">2</span>
                </div>
                <h3 className="text-white font-semibold">Complete Payment</h3>
              </div>
              <p className="text-blue-300 text-sm">
                Choose your preferred payment method (UPI, Card, Net Banking, Wallet)
              </p>
            </div>

            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center">
                  <span className="text-blue-300 font-bold">3</span>
                </div>
                <h3 className="text-white font-semibold">Get Receipt</h3>
              </div>
              <p className="text-blue-300 text-sm">
                Receive instant confirmation and receipt via email and in-app notification
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default QuickPay;
