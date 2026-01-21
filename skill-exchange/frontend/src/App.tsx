
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import LoadingSpinner from './components/LoadingSpinner';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ExplorePage from './pages/ExplorePage';
import SkillDetailPage from './pages/SkillDetailPage';
import CreateSkillPage from './pages/CreateSkillPage';
import MySkillsPage from './pages/MySkillsPage';
import SessionsPage from './pages/SessionsPage';
import MessagesPage from './pages/MessagesPage';
import ProfilePage from './pages/ProfilePage';

// Scroll to top on route change and page load
function ScrollToTop() {
    const { pathname } = useLocation();

    // Disable browser's automatic scroll restoration
    useEffect(() => {
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }
    }, []);

    // Scroll to top on route change
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, [pathname]);

    // Scroll to top on initial page load/reload
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, []);

    return null;
}

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <LoadingSpinner text="Loading..." />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return <>{children}</>;
}

// Main App Layout
function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="app-container">
            <Navbar />
            {children}
        </div>
    );
}

function AppRoutes() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <LoadingSpinner text="Loading..." />;
    }

    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<AppLayout><HomePage /></AppLayout>} />
            <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} />
            <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <RegisterPage />} />
            <Route path="/explore" element={<AppLayout><ExplorePage /></AppLayout>} />
            <Route path="/skills/:id" element={<AppLayout><SkillDetailPage /></AppLayout>} />

            {/* Protected Routes */}
            <Route path="/skills/new" element={<AppLayout><ProtectedRoute><CreateSkillPage /></ProtectedRoute></AppLayout>} />
            <Route path="/my-skills" element={<AppLayout><ProtectedRoute><MySkillsPage /></ProtectedRoute></AppLayout>} />
            <Route path="/sessions" element={<AppLayout><ProtectedRoute><SessionsPage /></ProtectedRoute></AppLayout>} />
            <Route path="/messages" element={<AppLayout><ProtectedRoute><MessagesPage /></ProtectedRoute></AppLayout>} />
            <Route path="/profile" element={<AppLayout><ProtectedRoute><ProfilePage /></ProtectedRoute></AppLayout>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

function App() {
    return (
        <ThemeProvider>
            <Router>
                <ScrollToTop />
                <AuthProvider>
                    <SocketProvider>
                        <AppRoutes />
                    </SocketProvider>
                </AuthProvider>
            </Router>
        </ThemeProvider>
    );
}

export default App;
