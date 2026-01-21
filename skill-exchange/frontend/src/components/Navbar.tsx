
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
    Repeat,
    Search,
    MessageCircle,
    LogOut,
    Coins,
    Sun,
    Moon
} from 'lucide-react';

export default function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container" style={{ display: 'flex', alignItems: 'center' }}>
                {/* Left - Logo */}
                <Link to="/" className="navbar-brand" style={{ flex: '0 0 auto' }}>
                    <div className="navbar-brand-icon">
                        <Repeat size={20} />
                    </div>
                    SkillSwap
                </Link>

                {isAuthenticated ? (
                    <>
                        {/* Center - Main Nav Links */}
                        <ul className="navbar-nav" style={{
                            flex: '1 1 auto',
                            display: 'flex',
                            justifyContent: 'center',
                            margin: '0'
                        }}>
                            <li>
                                <Link to="/explore" className="navbar-link">
                                    <Search size={16} style={{ marginRight: 6 }} />
                                    Explore
                                </Link>
                            </li>
                            <li>
                                <Link to="/my-skills" className="navbar-link">
                                    My Skills
                                </Link>
                            </li>
                            <li>
                                <Link to="/sessions" className="navbar-link">
                                    Sessions
                                </Link>
                            </li>
                            <li>
                                <Link to="/messages" className="navbar-link">
                                    <MessageCircle size={16} style={{ marginRight: 6 }} />
                                    Messages
                                </Link>
                            </li>
                        </ul>

                        {/* Right - Actions */}
                        <div className="navbar-actions" style={{ flex: '0 0 auto' }}>
                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="btn btn-ghost btn-icon theme-toggle"
                                style={{ marginRight: 'var(--spacing-sm)' }}
                            >
                                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                            </button>

                            <div className="points-display">
                                <Coins size={16} />
                                {user?.points || 0}
                            </div>

                            <div className="dropdown" style={{ position: 'relative' }}>
                                <Link to="/profile" className="avatar">
                                    {user?.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt={user.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-full)' }}
                                        />
                                    ) : (
                                        user?.name?.charAt(0).toUpperCase() || 'U'
                                    )}
                                </Link>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="btn btn-ghost btn-icon"
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Center spacer for non-authenticated users */}
                        <div style={{ flex: '1 1 auto' }}></div>

                        {/* Right - Auth buttons */}
                        <div className="navbar-actions" style={{ flex: '0 0 auto' }}>
                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="btn btn-ghost btn-icon theme-toggle"
                                style={{ marginRight: 'var(--spacing-sm)' }}
                            >
                                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                            </button>

                            <Link to="/login" className="btn btn-ghost">
                                Sign In
                            </Link>
                            <Link to="/register" className="btn btn-primary">
                                Get Started
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </nav>
    );
}
