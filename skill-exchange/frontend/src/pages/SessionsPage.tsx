import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { sessionsApi, ratingsApi } from '../services/api';
import { Session, Skill, User, PaginatedResponse, SessionStatus } from '../types';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import RatingStars from '../components/RatingStars';
import CustomDropdown from '../components/CustomDropdown';
import ConfirmDialog from '../components/ConfirmDialog';
import AlertDialog from '../components/AlertDialog';
import {
    Calendar,
    Clock,
    Coins,
    Check,
    X,
    MessageCircle,
    Star
} from 'lucide-react';

const statusColors: Record<SessionStatus, string> = {
    'pending': 'warning',
    'confirmed': 'primary',
    'in-progress': 'secondary',
    'completed': 'success',
    'cancelled': 'error'
};

export default function SessionsPage() {
    const { user, updateUser } = useAuth();
    const [sessions, setSessions] = useState<Session[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'all' | 'teaching' | 'learning'>('all');
    const [statusFilter, setStatusFilter] = useState<string>('');

    // Rating modal state
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [selectedSession, setSelectedSession] = useState<Session | null>(null);
    const [rating, setRating] = useState(5);
    const [review, setReview] = useState('');
    const [isSubmittingRating, setIsSubmittingRating] = useState(false);

    // Cancel confirmation state
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [sessionToCancel, setSessionToCancel] = useState<Session | null>(null);
    const [isCancelling, setIsCancelling] = useState(false);

    // Error alert state
    const [errorAlert, setErrorAlert] = useState({ open: false, message: '' });

    useEffect(() => {
        fetchSessions();
    }, [activeTab, statusFilter]);

    const fetchSessions = async () => {
        setIsLoading(true);
        try {
            const params: Record<string, string> = {};
            if (activeTab !== 'all') {
                params.role = activeTab === 'teaching' ? 'teacher' : 'student';
            }
            if (statusFilter) {
                params.status = statusFilter;
            }

            const response = await sessionsApi.getAll(params) as PaginatedResponse<Session>;
            setSessions(response.data);
        } catch (error) {
            console.error('Failed to fetch sessions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateStatus = async (sessionId: string, status: SessionStatus) => {
        try {
            await sessionsApi.update(sessionId, { status });
            fetchSessions();
        } catch (error) {
            console.error('Failed to update session:', error);
        }
    };

    const handleOpenRating = (session: Session) => {
        setSelectedSession(session);
        setRating(5);
        setReview('');
        setShowRatingModal(true);
    };

    const handleSubmitRating = async () => {
        if (!selectedSession) return;

        setIsSubmittingRating(true);
        try {
            await ratingsApi.create({
                sessionId: selectedSession._id,
                rating,
                review
            });
            setShowRatingModal(false);
            fetchSessions();
        } catch (error: any) {
            setErrorAlert({ open: true, message: error.message || 'Failed to submit rating' });
        } finally {
            setIsSubmittingRating(false);
        }
    };

    const handleOpenCancelDialog = (session: Session) => {
        setSessionToCancel(session);
        setShowCancelConfirm(true);
    };

    const handleConfirmCancel = async () => {
        if (!sessionToCancel) return;

        setIsCancelling(true);
        try {
            await sessionsApi.update(sessionToCancel._id, { status: 'cancelled' as SessionStatus });

            // Refund points in user context so UI updates immediately
            if (user) {
                updateUser({ points: user.points + sessionToCancel.pointsTransferred });
            }

            setShowCancelConfirm(false);
            setSessionToCancel(null);
            fetchSessions();
        } catch (error: any) {
            setErrorAlert({ open: true, message: error.message || 'Failed to cancel session' });
        } finally {
            setIsCancelling(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const isTeacher = (session: Session) => {
        const teacher = session.teacher as User;
        return teacher._id === user?._id;
    };

    const canRate = (session: Session) => {
        if (session.status !== 'completed') return false;
        // Publishers (teachers) cannot rate sessions for their own skills
        // Only the student (learner) can rate the session
        if (isTeacher(session)) return false;
        return !session.teacherRated;
    };

    const canStudentCancel = (session: Session) => {
        // Only students can use this cancellation
        if (isTeacher(session)) return false;
        // Can only cancel pending or confirmed sessions
        if (!['pending', 'confirmed'].includes(session.status)) return false;
        // Check if within 24 hours of booking
        const hoursSinceBooking = (Date.now() - new Date(session.createdAt).getTime()) / (1000 * 60 * 60);
        return hoursSinceBooking <= 24;
    };

    return (
        <div className="main-content">
            <div className="page-header">
                <h1 className="page-title">Sessions</h1>
                <p className="page-subtitle">Manage your teaching and learning sessions</p>
            </div>

            {/* Tabs */}
            <div style={{
                display: 'flex',
                gap: 'var(--spacing-md)',
                marginBottom: 'var(--spacing-xl)',
                borderBottom: '1px solid var(--color-border)',
                paddingBottom: 'var(--spacing-md)'
            }}>
                {[
                    { key: 'all', label: 'All Sessions' },
                    { key: 'teaching', label: 'Teaching' },
                    { key: 'learning', label: 'Learning' }
                ].map((tab) => (
                    <button
                        key={tab.key}
                        className="btn"
                        onClick={() => setActiveTab(tab.key as typeof activeTab)}
                        style={{
                            minWidth: tab.key === 'all' ? '115px' : '95px',
                            background: activeTab === tab.key ? 'var(--gradient-primary)' : 'transparent',
                            color: activeTab === tab.key ? '#ffffff' : 'var(--color-text-secondary)',
                            boxShadow: 'none',
                            border: 'none'
                        }}
                    >
                        {tab.label}
                    </button>
                ))}

                <div style={{ marginLeft: 'auto' }}>
                    <CustomDropdown
                        options={[
                            { value: '', label: 'All Status' },
                            { value: 'pending', label: 'Pending' },
                            { value: 'confirmed', label: 'Confirmed' },
                            { value: 'completed', label: 'Completed' },
                            { value: 'cancelled', label: 'Cancelled' }
                        ]}
                        value={statusFilter}
                        onChange={(value) => setStatusFilter(value)}
                        placeholder="All Status"
                        minWidth="140px"
                    />
                </div>
            </div>

            {isLoading ? (
                <LoadingSpinner text="Loading sessions..." />
            ) : sessions.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">
                        <Calendar size={40} />
                    </div>
                    <h3 className="empty-state-title">No sessions found</h3>
                    <p className="empty-state-description">
                        {activeTab === 'teaching'
                            ? 'No one has booked your skills yet'
                            : activeTab === 'learning'
                                ? "You haven't booked any sessions"
                                : 'No sessions to display'}
                    </p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                    {sessions.map((session) => {
                        const skill = session.skill as Skill;
                        const teacher = session.teacher as User;
                        const student = session.student as User;
                        const amTeacher = isTeacher(session);
                        const otherUser = amTeacher ? student : teacher;

                        return (
                            <div key={session._id} className="session-card">
                                <div className="session-card-info">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-sm)' }}>
                                        <span className={`badge badge-${statusColors[session.status]}`}>
                                            {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                                        </span>
                                        <span className="badge">
                                            {amTeacher ? 'Teaching' : 'Learning'}
                                        </span>
                                    </div>

                                    <h3 className="session-card-title">{skill?.title || 'Unknown Skill'}</h3>

                                    <div className="session-card-meta">
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                                            <Calendar size={14} />
                                            {formatDate(session.scheduledAt)}
                                        </span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                                            <Clock size={14} />
                                            {session.duration} min
                                        </span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                                            <Coins size={14} />
                                            {session.pointsTransferred} pts
                                        </span>
                                        <span>
                                            with <strong>{otherUser?.name || 'Unknown'}</strong>
                                        </span>
                                    </div>

                                    {session.notes && (
                                        <p style={{
                                            marginTop: 'var(--spacing-sm)',
                                            fontSize: 'var(--font-size-sm)',
                                            color: 'var(--color-text-tertiary)'
                                        }}>
                                            Notes: {session.notes}
                                        </p>
                                    )}
                                </div>

                                <div className="session-card-actions">
                                    {session.status === 'pending' && amTeacher && (
                                        <>
                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() => handleUpdateStatus(session._id, 'confirmed')}
                                            >
                                                <Check size={14} />
                                                Confirm
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleUpdateStatus(session._id, 'cancelled')}
                                            >
                                                <X size={14} />
                                                Decline
                                            </button>
                                        </>
                                    )}

                                    {session.status === 'confirmed' && amTeacher && (
                                        <>
                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() => handleUpdateStatus(session._id, 'completed')}
                                            >
                                                <Check size={14} />
                                                Complete
                                            </button>
                                        </>
                                    )}

                                    {session.status === 'completed' && canRate(session) && (
                                        <button
                                            className="btn btn-secondary btn-sm"
                                            onClick={() => handleOpenRating(session)}
                                        >
                                            <Star size={14} />
                                            Rate Session
                                        </button>
                                    )}

                                    {canStudentCancel(session) && (
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleOpenCancelDialog(session)}
                                        >
                                            <X size={14} />
                                            Cancel Session
                                        </button>
                                    )}

                                    <Link
                                        to={`/messages?userId=${otherUser?._id}`}
                                        className="btn btn-ghost btn-sm"
                                    >
                                        <MessageCircle size={14} />
                                        Message
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Rating Modal */}
            <Modal
                isOpen={showRatingModal}
                onClose={() => setShowRatingModal(false)}
                title="Rate Session"
                footer={
                    <>
                        <button className="btn btn-secondary" onClick={() => setShowRatingModal(false)}>
                            Cancel
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleSubmitRating}
                            disabled={isSubmittingRating}
                        >
                            {isSubmittingRating ? 'Submitting...' : 'Submit Rating'}
                        </button>
                    </>
                }
            >
                <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-lg)' }}>
                    <p style={{ marginBottom: 'var(--spacing-md)' }}>
                        How was your session with{' '}
                        <strong>
                            {selectedSession && (
                                isTeacher(selectedSession)
                                    ? (selectedSession.student as User)?.name
                                    : (selectedSession.teacher as User)?.name
                            )}
                        </strong>?
                    </p>
                    <RatingStars rating={rating} interactive onRate={setRating} size={32} />
                </div>

                <div className="input-group">
                    <label className="input-label">Review (Optional)</label>
                    <textarea
                        className="input textarea"
                        placeholder="Share your experience..."
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        rows={4}
                    />
                </div>
            </Modal>

            {/* Cancel Confirmation Dialog */}
            <ConfirmDialog
                isOpen={showCancelConfirm}
                onClose={() => {
                    setShowCancelConfirm(false);
                    setSessionToCancel(null);
                }}
                onConfirm={handleConfirmCancel}
                title="Cancel Session"
                message={
                    <>
                        Are you sure you want to cancel this session?
                        <br /><br />
                        <strong style={{ color: 'var(--color-success)' }}>
                            Your {sessionToCancel?.pointsTransferred || 0} points will be refunded.
                        </strong>
                    </>
                }
                confirmText="Yes, Cancel Session"
                cancelText="Keep Session"
                variant="danger"
                isLoading={isCancelling}
            />

            {/* Error Alert Dialog */}
            <AlertDialog
                isOpen={errorAlert.open}
                onClose={() => setErrorAlert({ open: false, message: '' })}
                title="Error"
                message={errorAlert.message}
                type="error"
                buttonText="OK"
            />
        </div>
    );
}
