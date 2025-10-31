import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard,
  Download,
  Filter,
  Search,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  DollarSign,
  Calendar,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';

const Payments = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [paymentStats, setPaymentStats] = useState(null);
  const [showRazorpay, setShowRazorpay] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  useEffect(() => {
    fetchPayments();
    if (activeTab === 'pending') {
      fetchPendingPayments();
    }
  }, [activeTab, searchTerm, filterStatus, currentPage]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
      };

      if (searchTerm) params.search = searchTerm;
      if (filterStatus !== 'all') params.status = filterStatus;

      const response = await api.get('/payments', { params });
      setPayments(response.data.data.payments);
      setTotalPages(response.data.data.pagination.pages);
      if (response.data.data.totals) {
        setPaymentStats(response.data.data.totals);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingPayments = async () => {
    try {
      const response = await api.get('/payments/pending/my');
      setPendingPayments(response.data.data);
    } catch (error) {
      console.error('Error fetching pending payments:', error);
    }
  };

  const handlePayment = async (payment) => {
    try {
      // Create Razorpay order
      const orderResponse = await api.post('/payments/create-order', {
        amount: payment.amount,
        type: payment.type,
        period: payment.period,
      });

      const { orderId, amount, currency, key, paymentId } = orderResponse.data.data;

      // Razorpay options
      const options = {
        key,
        amount: amount,
        currency: currency,
        name: 'Rotary Club Calicut South',
        description: `${payment.type} - ${payment.period || ''}`,
        order_id: orderId,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyResponse = await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              paymentId: paymentId,
            });

            alert('Payment successful!');
            fetchPayments();
            fetchPendingPayments();
          } catch (error) {
            console.error('Payment verification failed:', error);
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          contact: user.phone || '',
        },
        theme: {
          color: '#3b82f6',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Error initiating payment:', error);
      alert('Failed to initiate payment. Please try again.');
    }
  };

  const handleQuickPay = () => {
    navigate('/quick-pay');
  };

  const downloadInvoice = async (paymentId) => {
    try {
      const response = await api.get(`/payments/${paymentId}/invoice`);
      // TODO: Implement PDF download when backend PDF generation is ready
      alert('Invoice data retrieved. PDF download coming soon!');
      console.log('Invoice data:', response.data.data);
    } catch (error) {
      console.error('Error downloading invoice:', error);
      alert('Failed to download invoice');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'failed':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'failed':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex justify-between items-start"
        >
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Payments</h1>
            <p className="text-blue-200">Manage your payments and contributions</p>
          </div>

          <button
            onClick={handleQuickPay}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white hover:from-blue-700 hover:to-purple-700 transition-all flex items-center gap-2"
          >
            <CreditCard className="w-5 h-5" />
            Quick Pay
          </button>
        </motion.div>

        {/* Payment Stats */}
        {paymentStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-5 h-5 text-blue-400" />
                <p className="text-blue-200">Total Payments</p>
              </div>
              <p className="text-3xl font-bold text-white">
                ₹{paymentStats.totalAmount?.toLocaleString('en-IN') || 0}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <p className="text-blue-200">Completed</p>
              </div>
              <p className="text-3xl font-bold text-green-300">
                ₹{paymentStats.completedAmount?.toLocaleString('en-IN') || 0}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-yellow-400" />
                <p className="text-blue-200">Pending</p>
              </div>
              <p className="text-3xl font-bold text-yellow-300">
                ₹{paymentStats.pendingAmount?.toLocaleString('en-IN') || 0}
              </p>
            </div>
          </motion.div>
        )}

        {/* Pending Payments Alert */}
        {pendingPayments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 mb-8"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-yellow-300 mb-2">
                  You have {pendingPayments.length} pending payment{pendingPayments.length > 1 ? 's' : ''}
                </h3>
                <div className="space-y-2">
                  {pendingPayments.slice(0, 3).map((payment) => (
                    <div
                      key={payment._id}
                      className="flex justify-between items-center bg-white/5 rounded-lg p-3"
                    >
                      <div>
                        <p className="text-white font-medium capitalize">{payment.type}</p>
                        <p className="text-blue-300 text-sm">
                          {payment.period} - ₹{payment.amount.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <button
                        onClick={() => handlePayment(payment)}
                        className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white transition-all text-sm"
                      >
                        Pay Now
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tabs */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
          <div className="flex gap-2 bg-white/10 backdrop-blur-lg rounded-xl p-2 border border-white/20">
            {['all', 'completed', 'pending', 'failed'].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setFilterStatus(tab === 'all' ? 'all' : tab);
                  setCurrentPage(1);
                }}
                className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all capitalize ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'text-blue-200 hover:bg-white/10'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300 w-5 h-5" />
            <input
              type="text"
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </motion.div>

        {/* Payments List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden"
        >
          {loading ? (
            <div className="p-8 text-center text-blue-200">Loading payments...</div>
          ) : payments.length === 0 ? (
            <div className="p-8 text-center text-blue-200">No payments found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-blue-200 font-medium">Date</th>
                    <th className="px-6 py-4 text-left text-blue-200 font-medium">Type</th>
                    <th className="px-6 py-4 text-left text-blue-200 font-medium">Period</th>
                    <th className="px-6 py-4 text-left text-blue-200 font-medium">Amount</th>
                    <th className="px-6 py-4 text-left text-blue-200 font-medium">Status</th>
                    <th className="px-6 py-4 text-left text-blue-200 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {payments.map((payment) => (
                    <tr key={payment._id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-white">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-400" />
                          {new Date(payment.createdAt).toLocaleDateString('en-IN')}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white capitalize">{payment.type}</td>
                      <td className="px-6 py-4 text-blue-200">{payment.period || '-'}</td>
                      <td className="px-6 py-4 text-white font-medium">
                        ₹{payment.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 w-fit ${getStatusColor(
                            payment.status
                          )}`}
                        >
                          {getStatusIcon(payment.status)}
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {payment.status === 'completed' && (
                            <button
                              onClick={() => downloadInvoice(payment._id)}
                              className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-all"
                              title="Download Invoice"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          )}
                          {payment.status === 'pending' && (
                            <button
                              onClick={() => handlePayment(payment)}
                              className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded-lg text-white text-sm transition-all"
                            >
                              Pay Now
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 flex justify-center gap-2"
          >
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>

            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    currentPage === i + 1
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Payments;
