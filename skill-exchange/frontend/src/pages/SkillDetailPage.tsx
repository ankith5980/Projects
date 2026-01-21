import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { skillsApi, sessionsApi, ratingsApi } from '../services/api';
import { Skill, User, Rating, ApiResponse, PaginatedResponse } from '../types';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import RatingStars from '../components/RatingStars';
import Modal from '../components/Modal';
import CustomDateTimePicker from '../components/CustomDateTimePicker';
import {
    Clock,
    Users,
    Coins,
    Calendar,
    Star,
    ArrowLeft,
    MessageCircle,
    AlertCircle
} from 'lucide-react';

export default function SkillDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user, isAuthenticated, updateUser } = useAuth();

    const [skill, setSkill] = useState<Skill | null>(null);
    const [ratings, setRatings] = useState<Rating[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isBooking, setIsBooking] = useState(false);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [bookingDate, setBookingDate] = useState('');
    const [bookingNotes, setBookingNotes] = useState('');
    const [bookingError, setBookingError] = useState('');

    useEffect(() => {
        if (id) {
            fetchSkillDetails();
            fetchRatings();
        }
    }, [id]);

    const fetchSkillDetails = async () => {
        try {
            const response = await skillsApi.getById(id!) as ApiResponse<Skill>;
            setSkill(response.data);
        } catch (error) {
            console.error('Failed to fetch skill:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchRatings = async () => {
        try {
            const response = await ratingsApi.getForSkill(id!, { limit: 5 }) as PaginatedResponse<Rating>;
            setRatings(response.data);
        } catch (error) {
            console.error('Failed to fetch ratings:', error);
        }
    };

    const handleBookSession = async () => {
        if (!bookingDate) {
            setBookingError('Please select a date and time');
            return;
        }

        setIsBooking(true);
        setBookingError('');

        try {
            await sessionsApi.create({
                skillId: id!,
                scheduledAt: new Date(bookingDate).toISOString(),
                notes: bookingNotes
            });

            // Update user points locally
            if (user && skill) {
                updateUser({ points: user.points - skill.pointsCost });
            }

            setShowBookingModal(false);
            navigate('/sessions');
        } catch (error: any) {
            setBookingError(error.message || 'Failed to book session');
        } finally {
            setIsBooking(false);
        }
    };

    if (isLoading) {
        return <LoadingSpinner text="Loading skill details..." />;
    }

    if (!skill) {
        return (
            <div className="main-content">
                <div className="empty-state">
                    <h3>Skill not found</h3>
                    <Link to="/explore" className="btn btn-primary mt-lg">
                        Back to Explore
                    </Link>
                </div>
            </div>
        );
    }

    const teacher = skill.teacher as User;
    const isOwnSkill = user && teacher._id === user._id;
    const canBook = isAuthenticated && !isOwnSkill && user && user.points >= skill.pointsCost;

    return (
        <div className="main-content">
            <button
                onClick={() => navigate(-1)}
                className="btn btn-ghost mb-lg"
            >
                <ArrowLeft size={18} />
                Back
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: 'var(--spacing-xl)' }}>
                {/* Main Content */}
                <div>
                    <span className="badge badge-primary mb-sm">{skill.category}</span>
                    <h1 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--spacing-md)' }}>
                        {skill.title}
                    </h1>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                            <Clock size={18} color="var(--color-text-muted)" />
                            <span>{skill.duration} minutes</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                            <Users size={18} color="var(--color-text-muted)" />
                            <span>{skill.totalBookings} sessions</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                            <Star size={18} color="var(--color-warning)" />
                            <span>{skill.averageRating.toFixed(1)} ({skill.totalRatings} reviews)</span>
                        </div>
                        <span className="badge">{skill.level}</span>
                    </div>

                    <div className="card mb-xl">
                        <h3 className="card-title mb-md">Description</h3>
                        <p style={{ lineHeight: 1.8 }}>{skill.description}</p>
                    </div>

                    {skill.tags && skill.tags.length > 0 && (
                        <div className="card mb-xl">
                            <h3 className="card-title mb-md">Tags</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}>
                                {skill.tags.map((tag) => (
                                    <span key={tag} className="badge badge-secondary">{tag}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Reviews */}
                    <div className="card">
                        <h3 className="card-title mb-md">Reviews</h3>
                        {ratings.length === 0 ? (
                            <p className="text-muted">No reviews yet</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                                {ratings.map((rating) => {
                                    const rater = rating.rater as User;
                                    return (
                                        <div key={rating._id} style={{
                                            paddingBottom: 'var(--spacing-lg)',
                                            borderBottom: '1px solid var(--color-border)'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-sm)' }}>
                                                <div className="avatar avatar-sm">
                                                    {rater?.name?.charAt(0) || '?'}
                                                </div>
                                                <span style={{ fontWeight: 500 }}>{rater?.name || 'Anonymous'}</span>
                                                <RatingStars rating={rating.rating} size={14} />
                                            </div>
                                            {rating.review && <p style={{ color: 'var(--color-text-secondary)' }}>{rating.review}</p>}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div>
                    <div className="card" style={{ position: 'sticky', top: 100 }}>
                        <div style={{
                            fontSize: 'var(--font-size-3xl)',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--spacing-sm)',
                            marginBottom: 'var(--spacing-lg)'
                        }}>
                            <Coins size={28} color="var(--color-primary)" />
                            {skill.pointsCost} points
                        </div>

                        {/* Teacher Info */}
                        <div
                            className="card-body"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--spacing-md)',
                                padding: 'var(--spacing-md)',
                                background: 'var(--color-surface)',
                                borderRadius: 'var(--radius-lg)',
                                marginBottom: 'var(--spacing-lg)'
                            }}
                        >
                            <div className="avatar avatar-lg">
                                {teacher.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div style={{ fontWeight: 600 }}>{teacher.name}</div>
                                <RatingStars rating={teacher.averageRating} totalRatings={teacher.totalRatings} size={14} />
                            </div>
                        </div>

                        {isOwnSkill ? (
                            <Link to={`/skills/${skill._id}/edit`} className="btn btn-secondary w-full">
                                Edit Skill
                            </Link>
                        ) : isAuthenticated ? (
                            <>
                                <button
                                    className="btn btn-primary w-full mb-md"
                                    onClick={() => setShowBookingModal(true)}
                                    disabled={!canBook}
                                >
                                    <Calendar size={18} />
                                    Book Session
                                </button>

                                {user && user.points < skill.pointsCost && (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--spacing-sm)',
                                        color: 'var(--color-error)',
                                        fontSize: 'var(--font-size-sm)',
                                        marginBottom: 'var(--spacing-md)'
                                    }}>
                                        <AlertCircle size={16} />
                                        Insufficient points ({user.points} available)
                                    </div>
                                )}

                                <Link
                                    to={`/messages?userId=${teacher._id}`}
                                    className="btn btn-secondary w-full"
                                >
                                    <MessageCircle size={18} />
                                    Message Teacher
                                </Link>
                            </>
                        ) : (
                            <Link to="/login" className="btn btn-primary w-full">
                                Sign in to Book
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Booking Modal */}
            <Modal
                isOpen={showBookingModal}
                onClose={() => setShowBookingModal(false)}
                title="Book Session"
                footer={
                    <>
                        <button className="btn btn-secondary" onClick={() => setShowBookingModal(false)}>
                            Cancel
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleBookSession}
                            disabled={isBooking}
                        >
                            {isBooking ? 'Booking...' : `Book for ${skill.pointsCost} points`}
                        </button>
                    </>
                }
            >
                {bookingError && (
                    <div className="badge badge-error w-full mb-md" style={{ justifyContent: 'center', padding: 'var(--spacing-sm)' }}>
                        {bookingError}
                    </div>
                )}

                <div className="input-group">
                    <label className="input-label">Date & Time</label>
                    <CustomDateTimePicker
                        value={bookingDate}
                        onChange={(value) => setBookingDate(value)}
                    />
                </div>

                <div className="input-group">
                    <label className="input-label">Notes (Optional)</label>
                    <textarea
                        className="input textarea"
                        placeholder="Any specific topics or questions you'd like to cover..."
                        value={bookingNotes}
                        onChange={(e) => setBookingNotes(e.target.value)}
                    />
                </div>

                <div style={{
                    marginTop: 'var(--spacing-md)',
                    padding: 'var(--spacing-md)',
                    background: 'var(--color-surface)',
                    borderRadius: 'var(--radius-lg)'
                }}>
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-tertiary)' }}>
                        <strong>Your balance:</strong> {user?.points} points<br />
                        <strong>Session cost:</strong> {skill.pointsCost} points<br />
                        <strong>After booking:</strong> {(user?.points || 0) - skill.pointsCost} points
                    </p>
                </div>
            </Modal>
        </div>
    );
}
