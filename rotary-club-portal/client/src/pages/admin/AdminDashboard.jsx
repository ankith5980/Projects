import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  FolderKanban,
  CreditCard,
  TrendingUp,
  Activity,
  DollarSign,
  UserPlus,
  Calendar,
  Bell,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import api from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentPayments, setRecentPayments] = useState([]);
  const [recentMembers, setRecentMembers] = useState([]);
  const [paymentStats, setPaymentStats] = useState(null);
  const [projectStats, setProjectStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch admin stats
      const statsResponse = await api.get('/admin/stats');
      setStats(statsResponse.data.data);

      // Fetch recent payments
      const paymentsResponse = await api.get('/payments', { params: { limit: 5 } });
      setRecentPayments(paymentsResponse.data.data.payments);

      // Fetch recent members
      const membersResponse = await api.get('/members', { params: { limit: 5 } });
      setRecentMembers(membersResponse.data.data.members);

      // Fetch payment statistics
      const paymentStatsResponse = await api.get('/payments/stats/summary');
      setPaymentStats(paymentStatsResponse.data.data);

      // Fetch project statistics
      const projectStatsResponse = await api.get('/projects/stats/summary');
      setProjectStats(projectStatsResponse.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  const formatCurrency = (value) => {
    return `₹${value?.toLocaleString('en-IN') || 0}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-blue-200">Overview of club statistics and activities</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-lg rounded-xl p-6 border border-blue-500/30"
          >
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-blue-400" />
              <span className="text-xs text-blue-300 bg-blue-500/20 px-2 py-1 rounded-full">
                Total
              </span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">
              {stats?.members?.total || 0}
            </h3>
            <p className="text-blue-200">Total Members</p>
            <div className="mt-2 flex items-center gap-2 text-sm">
              <span className="text-green-400">+{stats?.members?.thisMonth || 0}</span>
              <span className="text-blue-300">this month</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-lg rounded-xl p-6 border border-purple-500/30"
          >
            <div className="flex items-center justify-between mb-4">
              <FolderKanban className="w-8 h-8 text-purple-400" />
              <span className="text-xs text-purple-300 bg-purple-500/20 px-2 py-1 rounded-full">
                Active
              </span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">
              {projectStats?.byStatus?.find((s) => s._id === 'active')?.count || 0}
            </h3>
            <p className="text-purple-200">Active Projects</p>
            <div className="mt-2 text-sm text-purple-300">
              {projectStats?.total || 0} total projects
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-lg rounded-xl p-6 border border-green-500/30"
          >
            <div className="flex items-center justify-between mb-4">
              <CreditCard className="w-8 h-8 text-green-400" />
              <span className="text-xs text-green-300 bg-green-500/20 px-2 py-1 rounded-full">
                Revenue
              </span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">
              {formatCurrency(
                paymentStats?.byStatus?.find((s) => s._id === 'completed')?.totalAmount
              )}
            </h3>
            <p className="text-green-200">Total Revenue</p>
            <div className="mt-2 text-sm text-green-300">
              {paymentStats?.byStatus?.find((s) => s._id === 'completed')?.count || 0} payments
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-lg rounded-xl p-6 border border-orange-500/30"
          >
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-orange-400" />
              <span className="text-xs text-orange-300 bg-orange-500/20 px-2 py-1 rounded-full">
                Pending
              </span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">
              {formatCurrency(
                paymentStats?.byStatus?.find((s) => s._id === 'pending')?.totalAmount
              )}
            </h3>
            <p className="text-orange-200">Pending Payments</p>
            <div className="mt-2 text-sm text-orange-300">
              {paymentStats?.byStatus?.find((s) => s._id === 'pending')?.count || 0} pending
            </div>
          </motion.div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Monthly Revenue Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={paymentStats?.monthly || []}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis
                  dataKey="_id.month"
                  stroke="#93c5fd"
                  tick={{ fill: '#93c5fd' }}
                />
                <YAxis stroke="#93c5fd" tick={{ fill: '#93c5fd' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #3b82f6',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#93c5fd' }}
                  itemStyle={{ color: '#ffffff' }}
                />
                <Area
                  type="monotone"
                  dataKey="totalAmount"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Project Status Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Project Status Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={projectStats?.byStatus || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ _id, count }) => `${_id}: ${count}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {(projectStats?.byStatus || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #3b82f6',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Payment Types Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-8"
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Revenue by Payment Type
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={paymentStats?.byType || []}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="_id" stroke="#93c5fd" tick={{ fill: '#93c5fd' }} />
              <YAxis stroke="#93c5fd" tick={{ fill: '#93c5fd' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #3b82f6',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#93c5fd' }}
                itemStyle={{ color: '#ffffff' }}
              />
              <Legend wrapperStyle={{ color: '#93c5fd' }} />
              <Bar dataKey="totalAmount" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Payments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Recent Payments
            </h3>
            <div className="space-y-3">
              {recentPayments.map((payment) => (
                <div
                  key={payment._id}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium capitalize">{payment.type}</p>
                      <p className="text-blue-300 text-sm">
                        {payment.member?.firstName} {payment.member?.lastName}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">
                      {formatCurrency(payment.amount)}
                    </p>
                    <p className="text-blue-300 text-xs capitalize">{payment.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Members */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Recent Members
            </h3>
            <div className="space-y-3">
              {recentMembers.map((member) => (
                <div
                  key={member._id}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      {member.firstName?.[0]}
                      {member.lastName?.[0]}
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {member.firstName} {member.lastName}
                      </p>
                      <p className="text-blue-300 text-sm">{member.memberId}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        member.status === 'active'
                          ? 'bg-green-500/20 text-green-300'
                          : 'bg-yellow-500/20 text-yellow-300'
                      }`}
                    >
                      {member.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
