import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { skillsApi } from '../services/api';
import { Skill, ApiResponse } from '../types';
import SkillCard from '../components/SkillCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Plus, BookOpen } from 'lucide-react';

export default function MySkillsPage() {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchMySkills();
    }, []);

    const fetchMySkills = async () => {
        try {
            const response = await skillsApi.getMy() as ApiResponse<Skill[]>;
            setSkills(response.data);
        } catch (error) {
            console.error('Failed to fetch skills:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <LoadingSpinner text="Loading your skills..." />;
    }

    return (
        <div className="main-content">
            <div className="dashboard-header">
                <div>
                    <h1 className="page-title">My Skills</h1>
                    <p className="page-subtitle">Manage the skills you're teaching</p>
                </div>
                <Link to="/skills/new" className="btn btn-primary">
                    <Plus size={18} />
                    Add New Skill
                </Link>
            </div>

            {skills.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">
                        <BookOpen size={40} />
                    </div>
                    <h3 className="empty-state-title">No skills yet</h3>
                    <p className="empty-state-description">
                        Start teaching by creating your first skill listing
                    </p>
                    <Link to="/skills/new" className="btn btn-primary">
                        <Plus size={18} />
                        Create Your First Skill
                    </Link>
                </div>
            ) : (
                <div className="grid grid-3">
                    {skills.map((skill) => (
                        <SkillCard key={skill._id} skill={skill} />
                    ))}
                </div>
            )}
        </div>
    );
}
