import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Filter,
  Search,
  X,
  AlertCircle,
  Calendar,
  Settings,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import api from '../services/api';
import socketService from '../services/socket';

export default function Notifications() {
  const { member } = useSelector((state) => state.auth);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [filterRead, setFilterRead] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [unreadCount, setUnreadCount] = useState(0);
  const [stats, setStats] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchNotifications();
    fetchStats();

    // Connect to socket for real-time updates
    if (member?._id) {
      socketService.connect(member._id);

      // Listen for real-time notification events
      socketService.on('notification:new', (notification) => {
        // Add new notification to the beginning
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);
        fetchStats();
      });

      socketService.on('notification:read', ({ notificationId }) => {
        setNotifications((prev) =>
          prev.map((n) => (n._id === notificationId ? { ...n, isRead: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
        fetchStats();
      });

      socketService.on('notification:allRead', () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
        fetchStats();
      });

      socketService.on('notification:deleted', ({ notificationId }) => {
        setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
        fetchStats();
      });
    }

    return () => {
      socketService.off('notification:new');
      socketService.off('notification:read');
      socketService.off('notification:allRead');
      socketService.off('notification:deleted');
    };
  }, [filterType, filterRead, currentPage, member?._id]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 20,
      };

      if (filterType !== 'all') params.type = filterType;
      if (filterRead !== 'all') params.isRead = filterRead === 'read';

      const response = await api.get('/notifications', { params });
      setNotifications(response.data.data.notifications || []);
      setTotalPages(response.data.data.pagination.pages);
      setUnreadCount(response.data.data.unreadCount || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/notifications/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      fetchNotifications();
      fetchStats();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      fetchNotifications();
      fetchStats();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleDelete = async (notificationId) => {
    if (!confirm('Delete this notification?')) return;
    
    try {
      await api.delete(`/notifications/${notificationId}`);
      fetchNotifications();
      fetchStats();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleDeleteAllRead = async () => {
    if (!confirm('Delete all read notifications?')) return;

    try {
      await api.delete('/notifications/clear-read');
      fetchNotifications();
      fetchStats();
    } catch (error) {
      console.error('Error deleting read notifications:', error);
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      payment_reminder: '💳',
      payment_success: '✅',
      payment_failed: '❌',
      project_update: '📋',
      meeting_reminder: '📅',
      event_invitation: '🎉',
      announcement: '📢',
      birthday: '🎂',
      anniversary: '🎊',
      system: '⚙️',
      other: '📬',
    };
    return icons[type] || '📬';
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return new Date(date).toLocaleDateString();
  };

  const filteredNotifications = notifications.filter((notification) =>
    notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notification.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <Bell className="w-8 h-8" />
                Notifications
              </h1>
              <p className="text-blue-200">Stay updated with all your activities</p>
            </div>

            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all flex items-center gap-2"
                >
                  <CheckCheck className="w-4 h-4" />
                  Mark All Read
                </button>
              )}
              <button
                onClick={handleDeleteAllRead}
                className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 rounded-lg transition-all flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear Read
              </button>
            </div>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
                <p className="text-blue-200 text-sm mb-1">Total Notifications</p>
                <p className="text-3xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="bg-blue-600/20 backdrop-blur-lg rounded-xl p-4 border border-blue-500/30">
                <p className="text-blue-200 text-sm mb-1">Unread</p>
                <p className="text-3xl font-bold text-white">{stats.unread}</p>
              </div>
              <div className="bg-green-600/20 backdrop-blur-lg rounded-xl p-4 border border-green-500/30">
                <p className="text-blue-200 text-sm mb-1">Read</p>
                <p className="text-3xl font-bold text-white">{stats.total - stats.unread}</p>
              </div>
            </div>
          )}

          {/* Search and Filters */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-6 py-3 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all flex items-center gap-2"
              >
                <Filter className="w-5 h-5" />
                Filters
              </button>
            </div>

            {/* Filter Options */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-white/20 grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div>
                    <label className="block text-blue-200 mb-2 text-sm">Type</label>
                    <select
                      value={filterType}
                      onChange={(e) => {
                        setFilterType(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all" className="bg-slate-800">All Types</option>
                      <option value="payment_reminder" className="bg-slate-800">Payment Reminders</option>
                      <option value="payment_success" className="bg-slate-800">Payment Success</option>
                      <option value="project_update" className="bg-slate-800">Project Updates</option>
                      <option value="meeting_reminder" className="bg-slate-800">Meeting Reminders</option>
                      <option value="event_invitation" className="bg-slate-800">Event Invitations</option>
                      <option value="announcement" className="bg-slate-800">Announcements</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-blue-200 mb-2 text-sm">Status</label>
                    <select
                      value={filterRead}
                      onChange={(e) => {
                        setFilterRead(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all" className="bg-slate-800">All Status</option>
                      <option value="unread" className="bg-slate-800">Unread</option>
                      <option value="read" className="bg-slate-800">Read</option>
                    </select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Notifications List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 animate-pulse"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 bg-white/20 rounded mb-2 w-3/4" />
                    <div className="h-3 bg-white/20 rounded w-full" />
                    <div className="h-3 bg-white/20 rounded w-2/3 mt-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredNotifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20"
          >
            <Bell className="w-16 h-16 text-blue-300 mx-auto mb-4 opacity-50" />
            <p className="text-blue-200 text-lg mb-2">No notifications found</p>
            <p className="text-blue-300">
              {searchTerm ? 'Try adjusting your search' : "You're all caught up!"}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification, index) => (
              <motion.div
                key={notification._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white/10 backdrop-blur-lg rounded-xl p-6 border transition-all hover:bg-white/15 ${
                  notification.isRead ? 'border-white/20' : 'border-blue-500/30 bg-blue-600/10'
                }`}
              >
                <div className="flex items-start gap-4">
                  <span className="text-4xl flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3 className={`text-lg font-semibold ${
                          notification.isRead ? 'text-blue-200' : 'text-white'
                        }`}>
                          {notification.title}
                        </h3>
                        <span className="text-blue-400 text-xs flex items-center gap-1 mt-1">
                          <Calendar className="w-3 h-3" />
                          {getTimeAgo(notification.createdAt)}
                        </span>
                      </div>
                      {!notification.isRead && (
                        <span className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0 animate-pulse" />
                      )}
                    </div>

                    <p className="text-blue-300 mb-4">{notification.message}</p>

                    {notification.actionUrl && (
                      <a
                        href={notification.actionUrl}
                        className="inline-block text-yellow-400 hover:text-yellow-300 text-sm font-medium mb-4"
                      >
                        {notification.actionText || 'View Details'} →
                      </a>
                    )}

                    <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notification._id)}
                          className="text-blue-300 hover:text-green-400 transition-colors flex items-center gap-1 text-sm"
                        >
                          <Check className="w-4 h-4" />
                          Mark as Read
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification._id)}
                        className="text-blue-300 hover:text-red-400 transition-colors flex items-center gap-1 text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                      <span className="text-blue-400 text-xs capitalize ml-auto">
                        {notification.type.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 flex justify-center gap-2"
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
}
