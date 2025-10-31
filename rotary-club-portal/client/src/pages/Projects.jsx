import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Plus,
  Calendar,
  MapPin,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  PauseCircle,
  XCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../services/api';

const Projects = () => {
  const navigate = useNavigate();
  const { user, member, isAuthenticated } = useSelector((state) => state.auth);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Check if user has admin position (President, Secretary, or Treasurer)
  const hasAdminPosition = () => {
    if (!member || !member.committees) return false;
    
    const adminPositions = ['president', 'secretary', 'treasurer'];
    return member.committees.some((committee) => {
      const position = committee.position?.toLowerCase() || '';
      return adminPositions.some((adminPos) => position.includes(adminPos));
    });
  };

  const isAdmin = user?.role === 'super_admin' || hasAdminPosition();

  useEffect(() => {
    fetchProjects();
  }, [searchTerm, filterStatus, filterType, currentPage]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 9,
      };

      if (searchTerm) params.search = searchTerm;
      if (filterStatus !== 'all') params.status = filterStatus;
      if (filterType !== 'all') params.type = filterType;

      const response = await api.get('/projects', { params });
      setProjects(response.data.data.projects);
      setTotalPages(response.data.data.pagination.pages);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <TrendingUp className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'planning':
        return <Clock className="w-4 h-4" />;
      case 'on-hold':
        return <PauseCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'completed':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'planning':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'on-hold':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
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
            <h1 className="text-4xl font-bold text-white mb-2">Projects</h1>
            <p className="text-blue-200">Rotary Club initiatives and community projects</p>
          </div>

          {isAdmin && (
            <button
              onClick={() => navigate('/projects/create')}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white hover:from-blue-700 hover:to-purple-700 transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              New Project
            </button>
          )}
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-8 border border-white/20"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300 w-5 h-5" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all flex items-center gap-2"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-white/20 grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div>
                <label className="block text-blue-200 mb-2">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all" className="bg-slate-800">All Status</option>
                  <option value="planning" className="bg-slate-800">Planning</option>
                  <option value="active" className="bg-slate-800">Active</option>
                  <option value="completed" className="bg-slate-800">Completed</option>
                  <option value="on-hold" className="bg-slate-800">On Hold</option>
                  <option value="cancelled" className="bg-slate-800">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-blue-200 mb-2">Project Type</label>
                <select
                  value={filterType}
                  onChange={(e) => {
                    setFilterType(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all" className="bg-slate-800">All Types</option>
                  <option value="community-service" className="bg-slate-800">Community Service</option>
                  <option value="humanitarian" className="bg-slate-800">Humanitarian</option>
                  <option value="education" className="bg-slate-800">Education</option>
                  <option value="environment" className="bg-slate-800">Environment</option>
                  <option value="health" className="bg-slate-800">Health</option>
                  <option value="vocational" className="bg-slate-800">Vocational</option>
                  <option value="youth" className="bg-slate-800">Youth</option>
                </select>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 animate-pulse"
              >
                <div className="h-40 bg-white/20 rounded-lg mb-4" />
                <div className="h-6 bg-white/20 rounded mb-2" />
                <div className="h-4 bg-white/20 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20"
          >
            <p className="text-blue-200 text-lg">No projects found</p>
            <p className="text-blue-300 mt-2">Try adjusting your filters or search term</p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {projects.map((project) => (
              <motion.div
                key={project._id}
                variants={cardVariants}
                whileHover={{ scale: 1.03, y: -8 }}
                className="bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden border border-white/20 hover:bg-white/20 transition-all cursor-pointer group"
                onClick={() => navigate(`/projects/${project._id}`)}
              >
                {/* Project Image/Banner */}
                <div className="h-48 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute top-4 right-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 backdrop-blur-lg ${getStatusColor(
                        project.status
                      )}`}
                    >
                      {getStatusIcon(project.status)}
                      {project.status}
                    </span>
                  </div>
                </div>

                {/* Project Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors line-clamp-2">
                    {project.name}
                  </h3>
                  
                  <p className="text-blue-200 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Project Meta */}
                  <div className="space-y-2 mb-4">
                    {project.startDate && (
                      <div className="flex items-center gap-2 text-blue-300 text-sm">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(project.startDate).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    )}

                    {project.location && (
                      <div className="flex items-center gap-2 text-blue-300 text-sm">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">{project.location}</span>
                      </div>
                    )}

                    {project.team && project.team.length > 0 && (
                      <div className="flex items-center gap-2 text-blue-300 text-sm">
                        <Users className="w-4 h-4" />
                        <span>{project.team.length} team members</span>
                      </div>
                    )}
                  </div>

                  {/* Project Type Badge */}
                  <div className="pt-4 border-t border-white/20">
                    <span className="text-xs text-blue-300 capitalize">
                      {project.type?.replace('-', ' ')}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
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
};

export default Projects;
