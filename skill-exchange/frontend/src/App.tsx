
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import LoadingSpinner from './components/LoadingSpinner';
import PageTransition from './components/PageTransition';

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

function AnimatedRoutes() {
    const location = useLocation();
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <LoadingSpinner text="Loading..." />;
    }

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                {/* Public Routes */}
                <Route path="/" element={<AppLayout><PageTransition><HomePage /></PageTransition></AppLayout>} />
                <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <PageTransition><LoginPage /></PageTransition>} />
                <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <PageTransition><RegisterPage /></PageTransition>} />
                <Route path="/explore" element={<AppLayout><PageTransition><ExplorePage /></PageTransition></AppLayout>} />
                <Route path="/skills/:id" element={<AppLayout><PageTransition><SkillDetailPage /></PageTransition></AppLayout>} />

                {/* Protected Routes */}
                <Route path="/skills/new" element={<AppLayout><ProtectedRoute><PageTransition><CreateSkillPage /></PageTransition></ProtectedRoute></AppLayout>} />
                <Route path="/my-skills" element={<AppLayout><ProtectedRoute><PageTransition><MySkillsPage /></PageTransition></ProtectedRoute></AppLayout>} />
                <Route path="/sessions" element={<AppLayout><ProtectedRoute><PageTransition><SessionsPage /></PageTransition></ProtectedRoute></AppLayout>} />
                <Route path="/messages" element={<AppLayout><ProtectedRoute><PageTransition><MessagesPage /></PageTransition></ProtectedRoute></AppLayout>} />
                <Route path="/profile" element={<AppLayout><ProtectedRoute><PageTransition><ProfilePage /></PageTransition></ProtectedRoute></AppLayout>} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </AnimatePresence>
    );
}

function App() {
    return (
        <ThemeProvider>
            <Router>
                <ScrollToTop />
                <AuthProvider>
                    <SocketProvider>
                        <AnimatedRoutes />
                    </SocketProvider>
                </AuthProvider>
            </Router>
        </ThemeProvider>
    );
}

export default App;
