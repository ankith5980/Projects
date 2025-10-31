import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Edit2,
  Save,
  X,
  UserPlus,
  Trash2,
  Award,
  Camera,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import FileUpload from '../components/FileUpload';

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);

  const isOwnProfile = !id || member?.user?._id === user?._id;
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const canEdit = isOwnProfile || isAdmin;

  useEffect(() => {
    fetchMemberProfile();
  }, [id]);

  const fetchMemberProfile = async () => {
    try {
      setLoading(true);
      const endpoint = id ? `/members/${id}` : '/members/me';
      const response = await api.get(endpoint);
      setMember(response.data.data);
      setEditForm(response.data.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const endpoint = id ? `/members/${id}` : `/members/${member._id}`;
      await api.put(endpoint, editForm);
      await fetchMemberProfile();
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert(error.response?.data?.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleAddFamilyMember = async () => {
    const name = prompt('Enter family member name:');
    const relation = prompt('Enter relation (spouse/child/parent):');
    
    if (!name || !relation) return;

    try {
      await api.post(`/members/${member._id}/family`, { name, relation });
      await fetchMemberProfile();
    } catch (error) {
      console.error('Error adding family member:', error);
      alert('Failed to add family member');
    }
  };

  const handleDeleteFamilyMember = async (familyId) => {
    if (!confirm('Are you sure you want to remove this family member?')) return;

    try {
      await api.delete(`/members/${member._id}/family/${familyId}`);
      await fetchMemberProfile();
    } catch (error) {
      console.error('Error deleting family member:', error);
      alert('Failed to delete family member');
    }
  };

  const handlePhotoUploadSuccess = async (data) => {
    // Refresh profile to show new photo
    await fetchMemberProfile();
    setShowPhotoUpload(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Member not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with Edit Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Member Profile</h1>
            <p className="text-blue-200">
              {isOwnProfile ? 'Your profile information' : 'View member details'}
            </p>
          </div>

          {canEdit && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white hover:from-blue-700 hover:to-purple-700 transition-all flex items-center gap-2"
            >
              <Edit2 className="w-5 h-5" />
              Edit Profile
            </button>
          )}

          {isEditing && (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all flex items-center gap-2"
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg text-white hover:from-green-700 hover:to-emerald-700 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              {/* Avatar */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative group">
                  {member.profilePhoto ? (
                    <img
                      src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${member.profilePhoto}`}
                      alt={`${member.firstName} ${member.lastName}`}
                      className="w-32 h-32 rounded-full object-cover border-4 border-blue-500/30"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-4xl font-bold">
                      {member.firstName?.[0]}{member.lastName?.[0]}
                    </div>
                  )}
                  
                  {canEdit && (
                    <button
                      onClick={() => setShowPhotoUpload(true)}
                      className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 rounded-full p-2 shadow-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Camera className="w-4 h-4 text-white" />
                    </button>
                  )}
                </div>
                
                <h2 className="text-2xl font-bold text-white text-center mt-4">
                  {member.firstName} {member.lastName}
                </h2>
                <p className="text-blue-300">{member.memberId}</p>
                
                {/* Display admin position if present */}
                {(() => {
                  const adminPositions = ['president', 'secretary', 'treasurer'];
                  const adminCommittee = member.committees?.find((committee) => {
                    const position = committee.position?.toLowerCase() || '';
                    return adminPositions.some((adminPos) => position.includes(adminPos));
                  });
                  if (adminCommittee) {
                    return (
                      <div className="mt-3 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg">
                        <p className="text-yellow-300 font-bold text-sm text-center flex items-center justify-center gap-2">
                          <Award className="w-4 h-4" />
                          {adminCommittee.position}
                        </p>
                        <p className="text-yellow-200 text-xs text-center">
                          {adminCommittee.year}
                        </p>
                      </div>
                    );
                  }
                  
                  return (
                    <div className="mt-3 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <p className="text-blue-300 text-sm text-center">
                        Regular Member
                      </p>
                    </div>
                  );
                })()}
                
                <div className="mt-4 flex gap-2 flex-wrap justify-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      member.status === 'active'
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                        : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                    }`}
                  >
                    {member.status}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30 capitalize">
                    {member.membershipType}
                  </span>
                </div>
              </div>

              {/* Quick Info */}
              <div className="space-y-3">
                {member.email && (
                  <div className="flex items-center gap-3 text-blue-200">
                    <Mail className="w-5 h-5 text-blue-400" />
                    <span className="text-sm break-all">{member.email}</span>
                  </div>
                )}
                {member.phone && (
                  <div className="flex items-center gap-3 text-blue-200">
                    <Phone className="w-5 h-5 text-blue-400" />
                    <span className="text-sm">{member.phone}</span>
                  </div>
                )}
                {member.occupation && (
                  <div className="flex items-center gap-3 text-blue-200">
                    <Briefcase className="w-5 h-5 text-blue-400" />
                    <span className="text-sm">{member.occupation}</span>
                  </div>
                )}
                {member.dateOfBirth && (
                  <div className="flex items-center gap-3 text-blue-200">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    <span className="text-sm">
                      {new Date(member.dateOfBirth).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Committees */}
            {member.committees && member.committees.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-6 bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
              >
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Committees
                </h3>
                <div className="space-y-2">
                  {member.committees.map((committee, index) => {
                    const isAdminPosition = ['president', 'secretary', 'treasurer'].some(
                      pos => committee.position?.toLowerCase().includes(pos)
                    );
                    
                    return (
                      <div
                        key={index}
                        className={`px-3 py-2 rounded-lg border ${
                          isAdminPosition
                            ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30'
                            : 'bg-white/5 border-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={`font-medium ${isAdminPosition ? 'text-yellow-300' : 'text-white'}`}>
                              {committee.name}
                            </p>
                            <p className={`text-sm ${isAdminPosition ? 'text-yellow-200' : 'text-blue-300'}`}>
                              {committee.position} • {committee.year}
                            </p>
                          </div>
                          {isAdminPosition && (
                            <Award className="w-5 h-5 text-yellow-400" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Right Column - Detailed Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Personal Information */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-blue-200 text-sm mb-2">First Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.firstName || ''}
                      onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-white">{member.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-blue-200 text-sm mb-2">Last Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.lastName || ''}
                      onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-white">{member.lastName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-blue-200 text-sm mb-2">Gender</label>
                  {isEditing ? (
                    <select
                      value={editForm.gender || ''}
                      onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="male" className="bg-slate-800">Male</option>
                      <option value="female" className="bg-slate-800">Female</option>
                      <option value="other" className="bg-slate-800">Other</option>
                    </select>
                  ) : (
                    <p className="text-white capitalize">{member.gender}</p>
                  )}
                </div>

                <div>
                  <label className="block text-blue-200 text-sm mb-2">Occupation</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.occupation || ''}
                      onChange={(e) => setEditForm({ ...editForm, occupation: e.target.value })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-white">{member.occupation || 'Not specified'}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-blue-200 text-sm mb-2">Address</label>
                  {isEditing ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Street"
                        value={editForm.address?.street || ''}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            address: { ...editForm.address, street: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="City"
                          value={editForm.address?.city || ''}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              address: { ...editForm.address, city: e.target.value },
                            })
                          }
                          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          placeholder="State"
                          value={editForm.address?.state || ''}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              address: { ...editForm.address, state: e.target.value },
                            })
                          }
                          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Pincode"
                        value={editForm.address?.pincode || ''}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            address: { ...editForm.address, pincode: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ) : (
                    <p className="text-white">
                      {member.address?.street && `${member.address.street}, `}
                      {member.address?.city && `${member.address.city}, `}
                      {member.address?.state && `${member.address.state} `}
                      {member.address?.pincode || 'Not specified'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Family Members */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">Family Members</h3>
                {canEdit && !isEditing && (
                  <button
                    onClick={handleAddFamilyMember}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm flex items-center gap-2 transition-all"
                  >
                    <UserPlus className="w-4 h-4" />
                    Add
                  </button>
                )}
              </div>

              {member.familyMembers && member.familyMembers.length > 0 ? (
                <div className="space-y-3">
                  {member.familyMembers.map((family) => (
                    <div
                      key={family._id}
                      className="flex justify-between items-center px-4 py-3 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div>
                        <p className="text-white font-medium">{family.name}</p>
                        <p className="text-blue-300 text-sm capitalize">{family.relation}</p>
                      </div>
                      {canEdit && !isEditing && (
                        <button
                          onClick={() => handleDeleteFamilyMember(family._id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-blue-300">No family members added</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Photo Upload Modal */}
        {showPhotoUpload && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900 rounded-xl p-6 max-w-lg w-full border border-white/20"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Upload Profile Photo</h3>
                <button
                  onClick={() => setShowPhotoUpload(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <FileUpload
                endpoint="/upload/profile-photo"
                fieldName="profilePhoto"
                accept="image/*"
                maxSize={10}
                label="Profile Photo"
                description="Upload your profile photo"
                additionalData={{ memberId: member._id }}
                onSuccess={handlePhotoUploadSuccess}
                onError={(error) => {
                  alert(error.response?.data?.message || 'Upload failed');
                }}
              />
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
