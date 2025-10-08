import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context Providers
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

// Components
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import RouteScrollToTop from './components/RouteScrollToTop.jsx';
import ParticleBackground from './components/ParticleBackground.jsx';

// Pages
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Projects from './pages/Projects.jsx';
import Contact from './pages/Contact.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';

// Routes
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <RouteScrollToTop />
        <ThemeProvider>
          <AuthProvider>
            <div className="min-h-screen bg-white dark:bg-dark-300 text-gray-900 dark:text-white transition-colors duration-300">
            <ParticleBackground />
            <Navbar />
            <main className="relative z-10">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/projects" element={<Projects />} />
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