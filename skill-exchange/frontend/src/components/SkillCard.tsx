
import { Link } from 'react-router-dom';
import { Skill, User } from '../types';
import { Clock, Users, Star, Coins } from 'lucide-react';

interface SkillCardProps {
    skill: Skill;
}

export default function SkillCard({ skill }: SkillCardProps) {
    const teacher = skill.teacher as User;

    return (
        <Link to={`/skills/${skill._id}`} className="skill-card">
            <div className="skill-card-header">
                <span className="skill-card-category">{skill.category}</span>
                <h3 className="skill-card-title">{skill.title}</h3>
                <p className="skill-card-description">{skill.description}</p>
            </div>

            <div className="skill-card-body">
                <div className="skill-card-teacher">
                    <div className="avatar avatar-sm">
                        {teacher?.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div>
                        <div className="skill-card-teacher-name">{teacher?.name || 'Unknown'}</div>
                        <div className="skill-card-teacher-rating" onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}>
                            <Star size={12} style={{ color: 'var(--color-warning)', fill: 'var(--color-warning)', marginRight: 4 }} />
                            {skill.averageRating?.toFixed(1) || '0.0'} ({skill.totalRatings || 0} reviews)
                        </div>
                    </div>
                </div>

                <div className="skill-card-meta">
                    <div className="skill-card-stats">
                        <span className="skill-card-stat">
                            <Clock size={14} />
                            {skill.duration} min
                        </span>
                        <span className="skill-card-stat">
                            <Users size={14} />
                            {skill.totalBookings}
                        </span>
                    </div>
                    <div className="skill-card-points">
                        <Coins size={18} style={{ marginRight: 4 }} />
                        {skill.pointsCost}
                    </div>
                </div>

                <div style={{ marginTop: 'var(--spacing-sm)' }}>
                    <span className="badge">{skill.level}</span>
                </div>
            </div>
        </Link>
    );
}
