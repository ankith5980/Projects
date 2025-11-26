import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context Providers
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

// Components (loaded immediately - needed for layout)
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import RouteScrollToTop from './components/RouteScrollToTop.jsx';
import SmoothScroll from './components/SmoothScroll.jsx';
import GlassmorphismBackground from './components/GlassmorphismBackground.jsx';
import LoadingSkeleton from './components/LoadingSkeleton.jsx';

// Hooks
import useDisableInspect from './hooks/useDisableInspect.js';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const Projects = lazy(() => import('./pages/Projects.jsx'));
const Certificates = lazy(() => import('./pages/Certificates.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));

// Routes
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  // Disable inspect element and developer tools
  useDisableInspect();
  
  return (
    <HelmetProvider>
      <Router>
        <SmoothScroll />
        <RouteScrollToTop />
        <ThemeProvider>
          <AuthProvider>
            <div className="min-h-screen text-gray-900 dark:text-white transition-colors duration-300 w-full max-w-full overflow-x-hidden" style={{ minHeight: '100vh' }}>
            <GlassmorphismBackground />
            <Navbar />
            <main className="relative z-10 w-full max-w-full" style={{ minHeight: '100vh' }}>
              <Suspense fallback={null}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/certificates" element={<Certificates />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<Login />} />
                  <Route
                    path="/dashboard/*"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </Suspense>
            </main>
            <div className="relative z-10">
              <Footer />
            </div>
            <ScrollToTop />
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;