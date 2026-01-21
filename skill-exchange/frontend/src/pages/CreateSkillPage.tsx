import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { skillsApi } from '../services/api';
import { SkillCategory, SkillLevel } from '../types';
import CustomDropdown from '../components/CustomDropdown';
import { ArrowLeft, Plus, X } from 'lucide-react';

const categories: SkillCategory[] = [
    'Programming', 'Design', 'Marketing', 'Music', 'Languages',
    'Business', 'Photography', 'Writing', 'Fitness', 'Cooking',
    'Arts & Crafts', 'Finance', 'Science', 'Other'
];

const levels: SkillLevel[] = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];

export default function CreateSkillPage() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [tagInput, setTagInput] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Programming' as SkillCategory,
        pointsCost: 20,
        duration: 60,
        level: 'All Levels' as SkillLevel,
        tags: [] as string[]
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'pointsCost' || name === 'duration' ? parseInt(value) : value
        });
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
            setTagInput('');
        }
    };

    const handleRemoveTag = (tag: string) => {
        setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            await skillsApi.create(formData);
            navigate('/my-skills');
        } catch (err: any) {
            setError(err.message || 'Failed to create skill');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="main-content" style={{ maxWidth: 700 }}>
            <button onClick={() => navigate(-1)} className="btn btn-ghost mb-lg">
                <ArrowLeft size={18} />
                Back
            </button>

            <div className="page-header">
                <h1 className="page-title">Create New Skill</h1>
                <p className="page-subtitle">Share your expertise and earn points</p>
            </div>

            <div className="card">
                <form onSubmit={handleSubmit}>
                    {error && (
                        <div className="badge badge-error mb-lg" style={{ width: '100%', justifyContent: 'center', padding: 'var(--spacing-sm)' }}>
                            {error}
                        </div>
                    )}

                    <div className="input-group">
                        <label className="input-label">Skill Title *</label>
                        <input
                            type="text"
                            name="title"
                            className="input"
                            placeholder="e.g., JavaScript Fundamentals"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            maxLength={100}
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Description *</label>
                        <textarea
                            name="description"
                            className="input textarea"
                            placeholder="Describe what you'll teach and what learners will gain..."
                            value={formData.description}
                            onChange={handleChange}
                            required
                            maxLength={1000}
                            rows={5}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                        <div className="input-group">
                            <label className="input-label">Category *</label>
                            <CustomDropdown
                                options={categories.map(cat => ({ value: cat, label: cat }))}
                                value={formData.category}
                                onChange={(value) => setFormData({ ...formData, category: value as SkillCategory })}
                                placeholder="Select Category"
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Level *</label>
                            <CustomDropdown
                                options={levels.map(level => ({ value: level, label: level }))}
                                value={formData.level}
                                onChange={(value) => setFormData({ ...formData, level: value as SkillLevel })}
                                placeholder="Select Level"
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                        <div className="input-group">
                            <label className="input-label">Points Cost * (5-500)</label>
                            <input
                                type="number"
                                name="pointsCost"
                                className="input"
                                value={formData.pointsCost}
                                onChange={handleChange}
                                min={5}
                                max={500}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Duration (minutes) * (15-180)</label>
                            <input
                                type="number"
                                name="duration"
                                className="input"
                                value={formData.duration}
                                onChange={handleChange}
                                min={15}
                                max={180}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Tags (Optional)</label>
                        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                            <input
                                type="text"
                                className="input"
                                placeholder="Add a tag"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                            />
                            <button type="button" className="btn btn-secondary" onClick={handleAddTag}>
                                <Plus size={18} />
                            </button>
                        </div>
                        {formData.tags.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-sm)' }}>
                                {formData.tags.map((tag) => (
                                    <span key={tag} className="badge badge-secondary" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTag(tag)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'inherit' }}
                                        >
                                            <X size={14} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div style={{
                        marginTop: 'var(--spacing-lg)',
                        padding: 'var(--spacing-md)',
                        background: 'var(--color-surface)',
                        borderRadius: 'var(--radius-lg)'
                    }}>
                        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-tertiary)' }}>
                            💡 <strong>Tip:</strong> Set a fair point cost based on the session duration and complexity.
                            You'll earn {formData.pointsCost} points each time someone books this skill!
                        </p>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg w-full"
                        disabled={isSubmitting}
                        style={{ marginTop: 'var(--spacing-xl)' }}
                    >
                        {isSubmitting ? 'Creating...' : 'Create Skill'}
                    </button>
                </form>
            </div>
        </div>
    );
}
