import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  User,
  CreditCard,
  FolderKanban,
  Bell,
  Calendar,
  TrendingUp,
  Award,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch member profile
      const profileResponse = await api.get('/members/me');
      console.log('Profile API Response:', profileResponse);
      console.log('Profile data:', profileResponse.data);
      
      if (profileResponse.data && profileResponse.data.data) {
        setProfile(profileResponse.data.data);
      } else if (profileResponse.data) {
        setProfile(profileResponse.data);
      }

      // Fetch pending payments
      const pendingResponse = await api.get('/payments/pending/my');
      setPendingPayments(pendingResponse.data.data || []);

      // Fetch recent payments
      const paymentsResponse = await api.get('/payments', { params: { limit: 5 } });
      setRecentPayments(paymentsResponse.data.data?.payments || []);

      // Fetch projects
      const projectsResponse = await api.get('/projects', { params: { limit: 4 } });
      setProjects(projectsResponse.data.data?.projects || []);

      // Fetch notifications
      const notificationsResponse = await api.get('/notifications', { params: { limit: 5 } });
      setNotifications(notificationsResponse.data.data?.notifications || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      console.error('Error response:', error.response);
    } finally {
      setLoading(false);
    }
  };

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

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl mb-4">Unable to load profile</div>
          <div className="text-blue-300 text-sm mb-4">
            Please check the browser console for error details
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome {profile.firstName || 'Member'}!
          </h1>
          <p className="text-blue-200">Here's what's happening with your Rotary membership</p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onClick={() => navigate('/profile')}
            className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-lg rounded-xl p-6 border border-blue-500/30 cursor-pointer hover:scale-105 transition-transform"
          >
            <User className="w-8 h-8 text-blue-400 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-1">{profile?.memberId}</h3>
            <p className="text-blue-200">Member ID</p>
            <p className="text-xs text-blue-300 mt-2 capitalize">{profile?.membershipType}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => navigate('/payments')}
            className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-lg rounded-xl p-6 border border-green-500/30 cursor-pointer hover:scale-105 transition-transform"
          >
            <CheckCircle className="w-8 h-8 text-green-400 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-1">
              {recentPayments.filter((p) => p.status === 'completed').length}
            </h3>
            <p className="text-green-200">Paid This Year</p>
            <p className="text-xs text-green-300 mt-2">
              {formatCurrency(
                recentPayments
                  .filter((p) => p.status === 'completed')
                  .reduce((sum, p) => sum + p.amount, 0)
              )}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => navigate('/projects')}
            className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-lg rounded-xl p-6 border border-purple-500/30 cursor-pointer hover:scale-105 transition-transform"
          >
            <FolderKanban className="w-8 h-8 text-purple-400 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-1">
              {projects.filter((p) => p.status === 'active').length}
            </h3>
            <p className="text-purple-200">Active Projects</p>
            <p className="text-xs text-purple-300 mt-2">{projects.length} total</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={() => navigate('/notifications')}
            className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-lg rounded-xl p-6 border border-orange-500/30 cursor-pointer hover:scale-105 transition-transform"
          >
            <Bell className="w-8 h-8 text-orange-400 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-1">
              {notifications.filter((n) => !n.isRead).length}
            </h3>
            <p className="text-orange-200">Unread Notifications</p>
            <p className="text-xs text-orange-300 mt-2">{notifications.length} total</p>
          </motion.div>
        </div>

        {/* Pending Payments Alert */}
        {pendingPayments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 mb-8"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-yellow-300 mb-3">
                  You have {pendingPayments.length} pending payment
                  {pendingPayments.length > 1 ? 's' : ''}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {pendingPayments.slice(0, 4).map((payment) => (
                    <div
                      key={payment._id}
                      className="flex justify-between items-center bg-white/5 rounded-lg p-3"
                    >
                      <div>
                        <p className="text-white font-medium capitalize">{payment.type}</p>
                        <p className="text-blue-300 text-sm">
                          {payment.period} - {formatCurrency(payment.amount)}
                        </p>
                      </div>
                      <button
                        onClick={() => navigate('/payments')}
                        className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white text-sm transition-all"
                      >
                        Pay Now
                      </button>
                    </div>
                  ))}
                </div>
                {pendingPayments.length > 4 && (
                  <button
                    onClick={() => navigate('/payments')}
                    className="mt-3 text-yellow-300 hover:text-yellow-200 text-sm flex items-center gap-1"
                  >
                    View all pending payments <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-1 bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5" />
                Your Profile
              </h3>
              <button
                onClick={() => navigate('/profile')}
                className="text-blue-300 hover:text-white transition-colors"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col items-center mb-6">
              {profile?.profilePhoto ? (
                <img
                  src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${profile.profilePhoto}`}
                  alt={`${profile.firstName} ${profile.lastName}`}
                  className="w-24 h-24 rounded-full object-cover border-4 border-blue-500/30 mb-4"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold mb-4">
                  {profile?.firstName?.[0]}
                  {profile?.lastName?.[0]}
                </div>
              )}
              <h4 className="text-xl font-bold text-white">
                {profile?.firstName} {profile?.lastName}
              </h4>
              <p className="text-blue-300">{profile?.occupation || 'Member'}</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-blue-200">
                <Calendar className="w-4 h-4 text-blue-400" />
                <span className="text-sm">
                  Member since{' '}
                  {new Date(profile?.joiningDate || profile?.createdAt).getFullYear()}
                </span>
              </div>
              {profile?.committees && profile.committees.length > 0 && (
                <div className="flex items-center gap-2 text-blue-200">
                  <Award className="w-4 h-4 text-blue-400" />
                  <span className="text-sm">{profile.committees.length} committees</span>
                </div>
              )}
              <div className="pt-3 border-t border-white/20">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    profile?.status === 'active'
                      ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                      : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                  }`}
                >
                  {profile?.status}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Recent Payments */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Recent Payments
                </h3>
                <button
                  onClick={() => navigate('/payments')}
                  className="text-blue-300 hover:text-white transition-colors flex items-center gap-1 text-sm"
                >
                  View All <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                {recentPayments.slice(0, 3).map((payment) => (
                  <div
                    key={payment._id}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          payment.status === 'completed'
                            ? 'bg-green-500/20'
                            : payment.status === 'pending'
                            ? 'bg-yellow-500/20'
                            : 'bg-red-500/20'
                        }`}
                      >
                        {payment.status === 'completed' ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : payment.status === 'pending' ? (
                          <Clock className="w-5 h-5 text-yellow-400" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium capitalize">{payment.type}</p>
                        <p className="text-blue-300 text-sm">{payment.period}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">{formatCurrency(payment.amount)}</p>
                      <p className="text-blue-300 text-xs capitalize">{payment.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Projects */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <FolderKanban className="w-5 h-5" />
                  Active Projects
                </h3>
                <button
                  onClick={() => navigate('/projects')}
                  className="text-blue-300 hover:text-white transition-colors flex items-center gap-1 text-sm"
                >
                  View All <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {projects.slice(0, 4).map((project) => (
                  <div
                    key={project._id}
                    onClick={() => navigate(`/projects/${project._id}`)}
                    className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 cursor-pointer transition-all"
                  >
                    <h4 className="text-white font-medium mb-2 line-clamp-1">
                      {project.name}
                    </h4>
                    <p className="text-blue-300 text-sm line-clamp-2 mb-3">
                      {project.description}
                    </p>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                        project.status === 'active'
                          ? 'bg-green-500/20 text-green-300'
                          : project.status === 'completed'
                          ? 'bg-blue-500/20 text-blue-300'
                          : 'bg-yellow-500/20 text-yellow-300'
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Notifications */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Recent Notifications
                </h3>
                <button
                  onClick={() => navigate('/notifications')}
                  className="text-blue-300 hover:text-white transition-colors flex items-center gap-1 text-sm"
                >
                  View All <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                {notifications.slice(0, 3).map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-3 rounded-lg border ${
                      notification.isRead
                        ? 'bg-white/5 border-white/10'
                        : 'bg-blue-500/10 border-blue-500/30'
                    }`}
                  >
                    <p className="text-white font-medium mb-1">{notification.title}</p>
                    <p className="text-blue-200 text-sm">{notification.message}</p>
                    <p className="text-blue-300 text-xs mt-2">
                      {new Date(notification.createdAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
