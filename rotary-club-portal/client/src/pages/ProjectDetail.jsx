import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Target,
  DollarSign,
  Edit2,
  Trash2,
  Plus,
  CheckCircle2,
  MessageSquare,
  FileText,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import api from '../services/api';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, member } = useSelector((state) => state.auth);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [newUpdate, setNewUpdate] = useState('');
  const [addingUpdate, setAddingUpdate] = useState(false);

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
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/projects/${id}`);
      setProject(response.data.data);
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUpdate = async () => {
    if (!newUpdate.trim()) return;

    try {
      setAddingUpdate(true);
      await api.post(`/projects/${id}/updates`, {
        title: 'Project Update',
        description: newUpdate,
      });
      setNewUpdate('');
      await fetchProject();
    } catch (error) {
      console.error('Error adding update:', error);
      alert('Failed to add update');
    } finally {
      setAddingUpdate(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading project...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Project not found</div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/projects')}
          className="mb-6 flex items-center gap-2 text-blue-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Projects
        </motion.button>

        {/* Project Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-8 mb-6 border border-white/20"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                    project.status
                  )}`}
                >
                  {project.status}
                </span>
                <span className="text-blue-300 text-sm capitalize">
                  {project.type?.replace('-', ' ')}
                </span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-3">{project.name}</h1>
              <p className="text-blue-200 text-lg">{project.description}</p>
            </div>

            {isAdmin && (
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/projects/${id}/edit`)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-all flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this project?')) {
                      // Handle delete
                    }
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-all flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>

          {/* Project Meta Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {project.startDate && (
              <div className="flex items-center gap-3 text-blue-200">
                <Calendar className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-xs text-blue-300">Start Date</p>
                  <p className="font-medium">
                    {new Date(project.startDate).toLocaleDateString('en-IN')}
                  </p>
                </div>
              </div>
            )}

            {project.endDate && (
              <div className="flex items-center gap-3 text-blue-200">
                <Calendar className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-xs text-blue-300">End Date</p>
                  <p className="font-medium">
                    {new Date(project.endDate).toLocaleDateString('en-IN')}
                  </p>
                </div>
              </div>
            )}

            {project.location && (
              <div className="flex items-center gap-3 text-blue-200">
                <MapPin className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-xs text-blue-300">Location</p>
                  <p className="font-medium">{project.location}</p>
                </div>
              </div>
            )}

            {project.budget?.allocated && (
              <div className="flex items-center gap-3 text-blue-200">
                <DollarSign className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-xs text-blue-300">Budget</p>
                  <p className="font-medium">₹{project.budget.allocated.toLocaleString('en-IN')}</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <div className="flex gap-2 bg-white/10 backdrop-blur-lg rounded-xl p-2 border border-white/20">
            {['overview', 'milestones', 'team', 'updates'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
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

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Target Audience & Expected Outcome */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {project.targetAudience && (
                  <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                    <div className="flex items-center gap-2 mb-4">
                      <Users className="w-5 h-5 text-blue-400" />
                      <h3 className="text-xl font-bold text-white">Target Audience</h3>
                    </div>
                    <p className="text-blue-200">{project.targetAudience}</p>
                  </div>
                )}

                {project.expectedOutcome && (
                  <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                    <div className="flex items-center gap-2 mb-4">
                      <Target className="w-5 h-5 text-blue-400" />
                      <h3 className="text-xl font-bold text-white">Expected Outcome</h3>
                    </div>
                    <p className="text-blue-200">{project.expectedOutcome}</p>
                  </div>
                )}
              </div>

              {/* Budget Breakdown */}
              {project.budget && (
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                  <h3 className="text-xl font-bold text-white mb-4">Budget Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/5 rounded-lg p-4">
                      <p className="text-blue-300 text-sm mb-1">Allocated</p>
                      <p className="text-2xl font-bold text-white">
                        ₹{project.budget.allocated?.toLocaleString('en-IN') || 0}
                      </p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <p className="text-blue-300 text-sm mb-1">Spent</p>
                      <p className="text-2xl font-bold text-white">
                        ₹{project.budget.spent?.toLocaleString('en-IN') || 0}
                      </p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <p className="text-blue-300 text-sm mb-1">Remaining</p>
                      <p className="text-2xl font-bold text-green-300">
                        ₹
                        {(
                          (project.budget.allocated || 0) - (project.budget.spent || 0)
                        ).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'milestones' && (
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">Milestones</h3>
                {isAdmin && (
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-all flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Milestone
                  </button>
                )}
              </div>

              {project.milestones && project.milestones.length > 0 ? (
                <div className="space-y-4">
                  {project.milestones.map((milestone, index) => (
                    <div
                      key={milestone._id}
                      className="flex items-start gap-4 p-4 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          milestone.isCompleted
                            ? 'bg-green-500/20 text-green-300'
                            : 'bg-blue-500/20 text-blue-300'
                        }`}
                      >
                        {milestone.isCompleted ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <span>{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-white mb-1">
                          {milestone.title}
                        </h4>
                        <p className="text-blue-200 text-sm mb-2">{milestone.description}</p>
                        {milestone.dueDate && (
                          <p className="text-blue-300 text-xs">
                            Due: {new Date(milestone.dueDate).toLocaleDateString('en-IN')}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-blue-300 text-center py-8">No milestones added yet</p>
              )}
            </div>
          )}

          {activeTab === 'team' && (
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">Team Members</h3>
                {isAdmin && (
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-all flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Member
                  </button>
                )}
              </div>

              {project.team && project.team.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {project.team.map((teamMember) => (
                    <div
                      key={teamMember._id}
                      className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        {teamMember.member?.firstName?.[0]}
                        {teamMember.member?.lastName?.[0]}
                      </div>
                      <div>
                        <h4 className="text-white font-medium">
                          {teamMember.member?.firstName} {teamMember.member?.lastName}
                        </h4>
                        <p className="text-blue-300 text-sm capitalize">{teamMember.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-blue-300 text-center py-8">No team members assigned yet</p>
              )}
            </div>
          )}

          {activeTab === 'updates' && (
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6">Project Updates</h3>

              {/* Add Update Form (Admin Only) */}
              {isAdmin && (
                <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
                  <textarea
                    value={newUpdate}
                    onChange={(e) => setNewUpdate(e.target.value)}
                    placeholder="Share a project update..."
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3 min-h-[100px]"
                  />
                  <button
                    onClick={handleAddUpdate}
                    disabled={addingUpdate || !newUpdate.trim()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    <MessageSquare className="w-4 h-4" />
                    {addingUpdate ? 'Posting...' : 'Post Update'}
                  </button>
                </div>
              )}

              {/* Updates List */}
              {project.updates && project.updates.length > 0 ? (
                <div className="space-y-4">
                  {project.updates.map((update) => (
                    <div
                      key={update._id}
                      className="p-4 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-blue-400 mt-1" />
                        <div className="flex-1">
                          <h4 className="text-white font-medium mb-1">{update.title}</h4>
                          <p className="text-blue-200 text-sm mb-2">{update.description}</p>
                          <div className="flex items-center gap-4 text-blue-300 text-xs">
                            <span>
                              By {update.createdBy?.firstName} {update.createdBy?.lastName}
                            </span>
                            <span>
                              {new Date(update.createdAt).toLocaleDateString('en-IN', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-blue-300 text-center py-8">No updates yet</p>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectDetail;
