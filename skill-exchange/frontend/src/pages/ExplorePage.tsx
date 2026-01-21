import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { skillsApi } from '../services/api';
import { Skill, SkillCategory, PaginatedResponse } from '../types';
import SkillCard from '../components/SkillCard';
import LoadingSpinner from '../components/LoadingSpinner';
import CustomDropdown from '../components/CustomDropdown';
import { Search } from 'lucide-react';

const categories: SkillCategory[] = [
    'Programming', 'Design', 'Marketing', 'Music', 'Languages',
    'Business', 'Photography', 'Writing', 'Fitness', 'Cooking',
    'Arts & Crafts', 'Finance', 'Science', 'Other'
];

const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];

export default function ExplorePage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [skills, setSkills] = useState<Skill[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        category: searchParams.get('category') || '',
        level: searchParams.get('level') || '',
        sortBy: 'createdAt',
        order: 'desc'
    });

    useEffect(() => {
        fetchSkills();
    }, [filters, currentPage]);

    const fetchSkills = async () => {
        setIsLoading(true);
        try {
            const params: Record<string, string | number | undefined> = {
                page: currentPage,
                limit: 12
            };

            if (filters.search) params.search = filters.search;
            if (filters.category) params.category = filters.category;
            if (filters.level) params.level = filters.level;
            params.sortBy = filters.sortBy;
            params.order = filters.order;

            const response = await skillsApi.getAll(params) as PaginatedResponse<Skill>;
            setSkills(response.data);
            setTotalPages(response.pages);
        } catch (error) {
            console.error('Failed to fetch skills:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFilterChange = (key: string, value: string) => {
        setFilters({ ...filters, [key]: value });
        setCurrentPage(1);

        // Update URL params
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        setSearchParams(newParams);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchSkills();
    };

    return (
        <div className="main-content">
            <div className="page-header">
                <h1 className="page-title">Explore Skills</h1>
                <p className="page-subtitle">Discover skills to learn from our community of teachers</p>
            </div>

            {/* Filters */}
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 'var(--spacing-md)',
                marginBottom: 'var(--spacing-xl)',
                alignItems: 'center',
                flexWrap: 'nowrap'
            }}>
                <div className="search-input" style={{ flex: '1', minWidth: '250px' }}>
                    <Search size={18} className="search-input-icon" />
                    <input
                        type="text"
                        className="input"
                        placeholder="Search skills..."
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                        style={{ paddingLeft: 44 }}
                    />
                </div>

                <CustomDropdown
                    options={[
                        { value: '', label: 'All Categories' },
                        ...categories.map(cat => ({ value: cat, label: cat }))
                    ]}
                    value={filters.category}
                    onChange={(value) => handleFilterChange('category', value)}
                    placeholder="All Categories"
                    minWidth="160px"
                />

                <CustomDropdown
                    options={[
                        { value: '', label: 'All Levels' },
                        ...levels.filter(level => level !== 'All Levels').map(level => ({ value: level, label: level }))
                    ]}
                    value={filters.level}
                    onChange={(value) => handleFilterChange('level', value)}
                    placeholder="All Levels"
                    minWidth="140px"
                />

                <CustomDropdown
                    options={[
                        { value: 'createdAt-desc', label: 'Newest First' },
                        { value: 'createdAt-asc', label: 'Oldest First' },
                        { value: 'pointsCost-asc', label: 'Lowest Points' },
                        { value: 'pointsCost-desc', label: 'Highest Points' },
                        { value: 'averageRating-desc', label: 'Highest Rated' },
                        { value: 'totalBookings-desc', label: 'Most Popular' }
                    ]}
                    value={`${filters.sortBy}-${filters.order}`}
                    onChange={(value) => {
                        const [sortBy, order] = value.split('-');
                        setFilters({ ...filters, sortBy, order });
                    }}
                    placeholder="Sort By"
                    minWidth="150px"
                />
            </div>

            {/* Results */}
            {isLoading ? (
                <LoadingSpinner text="Loading skills..." />
            ) : skills.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">
                        <Search size={40} />
                    </div>
                    <h3 className="empty-state-title">No skills found</h3>
                    <p className="empty-state-description">
                        Try adjusting your filters or search terms
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid grid-4">
                        {skills.map((skill) => (
                            <SkillCard key={skill._id} skill={skill} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 'var(--spacing-sm)',
                            marginTop: 'var(--spacing-2xl)'
                        }}>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    className={`btn ${page === currentPage ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
