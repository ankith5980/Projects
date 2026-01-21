import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';
import AlertDialog from '../components/AlertDialog';
import { Coins, BookOpen, Users, Star, Edit2, Save, X, Camera } from 'lucide-react';

export default function ProfilePage() {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        bio: user?.bio || '',
        avatar: user?.avatar || ''
    });
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Alert dialog state
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const handleAvatarClick = () => {
        if (isEditing && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setAlertMessage('Please select an image file (JPG, PNG, GIF, etc.)');
            setAlertOpen(true);
            return;
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            setAlertMessage('Image must be less than 2MB in size.');
            setAlertOpen(true);
            return;
        }

        // Create preview and convert to base64
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result as string;
            setAvatarPreview(base64);
            setFormData({ ...formData, avatar: base64 });
        };
        reader.readAsDataURL(file);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const response = await authApi.updateDetails(formData) as { data: { name: string; bio: string; avatar: string } };
            if (response.data) {
                updateUser(response.data);
            }
            setIsEditing(false);
            setAvatarPreview(null);
        } catch (error) {
            console.error('Failed to update profile:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setAvatarPreview(null);
        setFormData({
            bio: user?.bio || '',
            avatar: user?.avatar || ''
        });
    };

    if (!user) {
        navigate('/login');
        return null;
    }

    const stats = [
        { icon: Coins, value: user.points, label: 'Points', color: 'purple' },
        { icon: Star, value: user.averageRating.toFixed(1), label: 'Rating', color: 'orange' },
        { icon: BookOpen, value: user.totalSessionsAsTeacher, label: 'Taught', color: 'cyan' },
        { icon: Users, value: user.totalSessionsAsStudent, label: 'Learned', color: 'green' }
    ];

    const displayAvatar = avatarPreview || user.avatar;

    return (
        <div className="main-content">
            <div className="profile-header">
                {/* Avatar with edit overlay */}
                <div
                    className="profile-avatar"
                    onClick={handleAvatarClick}
                    style={{
                        cursor: isEditing ? 'pointer' : 'default',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    {displayAvatar ? (
                        <img
                            src={displayAvatar}
                            alt={user.name}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                        />
                    ) : (
                        user.name?.charAt(0).toUpperCase()
                    )}

                    {/* Edit overlay */}
                    {isEditing && (
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'rgba(0, 0, 0, 0.5)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            gap: '4px'
                        }}>
                            <Camera size={24} />
                            <span style={{ fontSize: 'var(--font-size-xs)' }}>Change</span>
                        </div>
                    )}

                    {/* Hidden file input */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                </div>

                <div className="profile-info">
                    {isEditing ? (
                        <div style={{ marginBottom: 'var(--spacing-md)' }}>
                            <h1 className="profile-name" style={{ marginBottom: 'var(--spacing-sm)' }}>{user.name}</h1>
                            <textarea
                                className="input textarea"
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                placeholder="Tell us about yourself..."
                                rows={3}
                            />
                        </div>
                    ) : (
                        <>
                            <h1 className="profile-name">{user.name}</h1>
                            <p className="profile-bio">{user.bio || 'No bio yet'}</p>
                        </>
                    )}
                    <div className="profile-stats">
                        {stats.map((stat) => (
                            <div key={stat.label} className="profile-stat">
                                <div className="profile-stat-value">{stat.value}</div>
                                <div className="profile-stat-label">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    {isEditing ? (
                        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                            <button className="btn btn-primary" onClick={handleSave} disabled={isSaving}>
                                <Save size={16} /> {isSaving ? 'Saving...' : 'Save'}
                            </button>
                            <button className="btn btn-secondary" onClick={handleCancelEdit}>
                                <X size={16} />
                            </button>
                        </div>
                    ) : (
                        <button className="btn btn-secondary" onClick={() => setIsEditing(true)}>
                            <Edit2 size={16} /> Edit
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-2">
                <div className="card">
                    <h3 className="card-title mb-md">Email</h3>
                    <p>{user.email}</p>
                </div>
                <div className="card">
                    <h3 className="card-title mb-md">Member Since</h3>
                    <p>{new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                </div>
            </div>

            {/* Alert Dialog for warnings */}
            <AlertDialog
                isOpen={alertOpen}
                onClose={() => setAlertOpen(false)}
                title="Invalid Image"
                message={alertMessage}
                type="warning"
                buttonText="OK"
            />
        </div>
    );
}
