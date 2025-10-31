import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Users,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Settings,
  Filter,
  RefreshCw,
} from 'lucide-react';
import api from '../services/api';

const PaymentSettings = () => {
  const navigate = useNavigate();
  const { member } = useSelector((state) => state.auth);
  const [periods, setPeriods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    type: 'membership_fee',
    category: 'quarterly',
    amount: '',
    startDate: '',
    dueDate: '',
    finalDate: '',
    description: '',
    fiscalYear: new Date().getFullYear().toString(),
    quarter: 'Q1',
    applicableToMembers: 'active',
    reminderSchedule: {
      enabled: true,
      firstReminder: 7,
      secondReminder: 3,
      finalReminder: 1,
    },
    lateFeesEnabled: false,
    lateFees: {
      type: 'fixed',
      amount: 0,
      appliedAfter: 0,
    },
    autoCreatePayments: true,
  });

  // Check if user has admin position
  const hasAdminPosition = () => {
    if (!member || !member.committees) return false;
    const adminPositions = ['president', 'secretary', 'treasurer'];
    return member.committees.some((committee) => {
      const position = committee.position?.toLowerCase() || '';
      return adminPositions.some((adminPos) => position.includes(adminPos));
    });
  };

  useEffect(() => {
    if (!hasAdminPosition()) {
      navigate('/dashboard');
    } else {
      fetchPeriods();
    }
  }, []);

  const fetchPeriods = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterStatus !== 'all') params.status = filterStatus;
      if (filterCategory !== 'all') params.category = filterCategory;

      const response = await api.get('/payment-periods', { params });
      setPeriods(response.data.data.periods);
    } catch (error) {
      console.error('Error fetching periods:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasAdminPosition()) {
      fetchPeriods();
    }
  }, [filterStatus, filterCategory]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingPeriod) {
        await api.put(`/payment-periods/${editingPeriod._id}`, formData);
      } else {
        await api.post('/payment-periods', formData);
      }

      setShowModal(false);
      setEditingPeriod(null);
      resetForm();
      fetchPeriods();
    } catch (error) {
      console.error('Error saving period:', error);
      alert(error.response?.data?.message || 'Failed to save payment period');
    }
  };

  const handleEdit = (period) => {
    setEditingPeriod(period);
    setFormData({
      title: period.title,
      type: period.type,
      category: period.category,
      amount: period.amount,
      startDate: new Date(period.startDate).toISOString().split('T')[0],
      dueDate: new Date(period.dueDate).toISOString().split('T')[0],
      finalDate: new Date(period.finalDate).toISOString().split('T')[0],
      description: period.description || '',
      fiscalYear: period.fiscalYear,
      quarter: period.quarter,
      applicableToMembers: period.applicableToMembers,
      reminderSchedule: period.reminderSchedule,
      lateFeesEnabled: period.lateFeesEnabled,
      lateFees: period.lateFees,
      autoCreatePayments: period.autoCreatePayments,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this payment period?')) return;

    try {
      await api.delete(`/payment-periods/${id}`);
      fetchPeriods();
    } catch (error) {
      console.error('Error deleting period:', error);
      alert(error.response?.data?.message || 'Failed to delete payment period');
    }
  };

  const handleCreatePayments = async (id) => {
    if (!confirm('This will create pending payments for all applicable members. Continue?')) return;

    try {
      const response = await api.post(`/payment-periods/${id}/create-payments`);
      alert(`${response.data.data.count} payments created successfully!`);
      fetchPeriods();
    } catch (error) {
      console.error('Error creating payments:', error);
      alert(error.response?.data?.message || 'Failed to create payments');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      type: 'membership_fee',
      category: 'quarterly',
      amount: '',
      startDate: '',
      dueDate: '',
      finalDate: '',
      description: '',
      fiscalYear: new Date().getFullYear().toString(),
      quarter: 'Q1',
      applicableToMembers: 'active',
      reminderSchedule: {
        enabled: true,
        firstReminder: 7,
        secondReminder: 3,
        finalReminder: 1,
      },
      lateFeesEnabled: false,
      lateFees: {
        type: 'fixed',
        amount: 0,
        appliedAfter: 0,
      },
      autoCreatePayments: true,
    });
  };

  const getStatusBadge = (period) => {
    const status = getStatus(period);
    const badges = {
      upcoming: { color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', icon: Clock },
      active: { color: 'bg-green-500/20 text-green-300 border-green-500/30', icon: CheckCircle },
      overdue: { color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', icon: AlertCircle },
      closed: { color: 'bg-gray-500/20 text-gray-300 border-gray-500/30', icon: XCircle },
    };

    const badge = badges[status] || badges.closed;
    const Icon = badge.icon;

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${badge.color}`}>
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
  };

  const getStatus = (period) => {
    const now = new Date();
    const start = new Date(period.startDate);
    const due = new Date(period.dueDate);
    const final = new Date(period.finalDate);

    if (now < start) return 'upcoming';
    if (now >= start && now < due) return 'active';
    if (now >= due && now < final) return 'overdue';
    return 'closed';
  };

  if (!hasAdminPosition()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Settings className="w-8 h-8" />
              Payment Period Management
            </h1>
            <p className="text-blue-200">Configure payment schedules and due dates</p>
          </div>

          <button
            onClick={() => {
              resetForm();
              setEditingPeriod(null);
              setShowModal(true);
            }}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white hover:from-blue-700 hover:to-purple-700 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Payment Period
          </button>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-8 border border-white/20"
        >
          <div className="flex items-center gap-4 mb-4">
            <Filter className="w-5 h-5 text-blue-300" />
            <h3 className="text-lg font-semibold text-white">Filters</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-blue-200 mb-2 text-sm">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all" className="bg-slate-800">All Status</option>
                <option value="upcoming" className="bg-slate-800">Upcoming</option>
                <option value="active" className="bg-slate-800">Active</option>
                <option value="overdue" className="bg-slate-800">Overdue</option>
                <option value="closed" className="bg-slate-800">Closed</option>
              </select>
            </div>

            <div>
              <label className="block text-blue-200 mb-2 text-sm">Category</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all" className="bg-slate-800">All Categories</option>
                <option value="quarterly" className="bg-slate-800">Quarterly</option>
                <option value="annual" className="bg-slate-800">Annual</option>
                <option value="monthly" className="bg-slate-800">Monthly</option>
                <option value="one_time" className="bg-slate-800">One Time</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={fetchPeriods}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </motion.div>

        {/* Periods List */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 animate-pulse"
              >
                <div className="h-6 bg-white/20 rounded mb-4 w-1/3" />
                <div className="h-4 bg-white/20 rounded mb-2 w-full" />
                <div className="h-4 bg-white/20 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : periods.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20"
          >
            <Calendar className="w-16 h-16 text-blue-300 mx-auto mb-4" />
            <p className="text-blue-200 text-lg mb-2">No payment periods found</p>
            <p className="text-blue-300">Create your first payment period to get started</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {periods.map((period, index) => (
              <motion.div
                key={period._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all"
              >
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">{period.title}</h3>
                        <p className="text-blue-200 text-sm">{period.description}</p>
                      </div>
                      {getStatusBadge(period)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-blue-300">
                        <Calendar className="w-4 h-4" />
                        <div>
                          <p className="text-xs text-blue-400">Start Date</p>
                          <p className="text-sm font-medium">
                            {new Date(period.startDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-yellow-300">
                        <AlertCircle className="w-4 h-4" />
                        <div>
                          <p className="text-xs text-yellow-400">Due Date</p>
                          <p className="text-sm font-medium">
                            {new Date(period.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-red-300">
                        <XCircle className="w-4 h-4" />
                        <div>
                          <p className="text-xs text-red-400">Final Date</p>
                          <p className="text-sm font-medium">
                            {new Date(period.finalDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs border border-purple-500/30">
                        {period.type.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs border border-blue-500/30 capitalize">
                        {period.category}
                      </span>
                      <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs border border-green-500/30 flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        ₹{period.amount}
                      </span>
                      <span className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-xs border border-orange-500/30">
                        FY {period.fiscalYear}
                      </span>
                      {period.quarter !== 'N/A' && (
                        <span className="px-3 py-1 bg-teal-500/20 text-teal-300 rounded-full text-xs border border-teal-500/30">
                          {period.quarter}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-blue-300">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span className="capitalize">{period.applicableToMembers} Members</span>
                      </div>
                      {period.paymentsCreated && (
                        <span className="text-green-300 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          Payments Created
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleEdit(period)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>

                    {!period.paymentsCreated && (
                      <button
                        onClick={() => handleCreatePayments(period._id)}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Create Payments
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(period._id)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Modal for Create/Edit */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => {
                setShowModal(false);
                setEditingPeriod(null);
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-slate-900 rounded-xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/20"
              >
                <h2 className="text-2xl font-bold text-white mb-6">
                  {editingPeriod ? 'Edit Payment Period' : 'Create Payment Period'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-blue-200 mb-2">Title *</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Q1 Membership Fee 2025"
                      />
                    </div>

                    <div>
                      <label className="block text-blue-200 mb-2">Amount (₹) *</label>
                      <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="block text-blue-200 mb-2">Type *</label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      <label className="block text-blue-200 mb-2">Category *</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="quarterly" className="bg-slate-800">Quarterly</option>
                        <option value="annual" className="bg-slate-800">Annual</option>
                        <option value="monthly" className="bg-slate-800">Monthly</option>
                        <option value="one_time" className="bg-slate-800">One Time</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-blue-200 mb-2">Fiscal Year *</label>
                      <input
                        type="text"
                        name="fiscalYear"
                        value={formData.fiscalYear}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="2025"
                      />
                    </div>

                    <div>
                      <label className="block text-blue-200 mb-2">Quarter</label>
                      <select
                        name="quarter"
                        value={formData.quarter}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="N/A" className="bg-slate-800">N/A</option>
                        <option value="Q1" className="bg-slate-800">Q1</option>
                        <option value="Q2" className="bg-slate-800">Q2</option>
                        <option value="Q3" className="bg-slate-800">Q3</option>
                        <option value="Q4" className="bg-slate-800">Q4</option>
                      </select>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-blue-200 mb-2">Start Date *</label>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-blue-200 mb-2">Due Date *</label>
                      <input
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-blue-200 mb-2">Final Date *</label>
                      <input
                        type="date"
                        name="finalDate"
                        value={formData.finalDate}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-blue-200 mb-2">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Additional details about this payment period..."
                    />
                  </div>

                  {/* Applicable Members */}
                  <div>
                    <label className="block text-blue-200 mb-2">Applicable To</label>
                    <select
                      name="applicableToMembers"
                      value={formData.applicableToMembers}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all" className="bg-slate-800">All Members</option>
                      <option value="active" className="bg-slate-800">Active Members Only</option>
                      <option value="specific" className="bg-slate-800">Specific Members</option>
                    </select>
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 text-blue-200 cursor-pointer">
                      <input
                        type="checkbox"
                        name="autoCreatePayments"
                        checked={formData.autoCreatePayments}
                        onChange={handleChange}
                        className="w-5 h-5 rounded border-white/20 bg-white/10 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                      <span>Automatically create payments for applicable members</span>
                    </label>

                    <label className="flex items-center gap-3 text-blue-200 cursor-pointer">
                      <input
                        type="checkbox"
                        name="reminderSchedule.enabled"
                        checked={formData.reminderSchedule.enabled}
                        onChange={handleChange}
                        className="w-5 h-5 rounded border-white/20 bg-white/10 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                      <span>Enable payment reminders</span>
                    </label>

                    <label className="flex items-center gap-3 text-blue-200 cursor-pointer">
                      <input
                        type="checkbox"
                        name="lateFeesEnabled"
                        checked={formData.lateFeesEnabled}
                        onChange={handleChange}
                        className="w-5 h-5 rounded border-white/20 bg-white/10 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                      <span>Enable late fees</span>
                    </label>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-4 pt-4 border-t border-white/20">
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        setEditingPeriod(null);
                      }}
                      className="px-6 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white hover:from-blue-700 hover:to-purple-700 transition-all"
                    >
                      {editingPeriod ? 'Update Period' : 'Create Period'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PaymentSettings;
