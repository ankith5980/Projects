import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AnimatePresence } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context Providers
import { ThemeProvider } from './context/ThemeContext.jsx';

// Components (loaded immediately - needed for layout)
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import RouteScrollToTop from './components/RouteScrollToTop.jsx';
import SmoothScroll from './components/SmoothScroll.jsx';
import GridBackdrop from './components/GridBackdrop.jsx';
import ChatWidget from './components/ChatWidget.jsx';
import CustomCursor from './components/CustomCursor.jsx';
import Preloader from './components/Preloader.jsx';

// Hooks
import useDisableInspect from './hooks/useDisableInspect.js';

// Lazy load pages for better performance with retry for chunk loading errors
const lazyWithRetry = (componentImport) =>
  lazy(async () => {
    const pageHasAlreadyBeenForceRefreshed = JSON.parse(
      window.sessionStorage.getItem('page-has-been-force-refreshed') || 'false'
    );

    try {
      const component = await componentImport();
      window.sessionStorage.setItem('page-has-been-force-refreshed', 'false');
      return component;
    } catch (error) {
      if (!pageHasAlreadyBeenForceRefreshed) {
        // Assume that the error is due to a chunk load failure (e.g. after a new Vercel deployment)
        window.sessionStorage.setItem('page-has-been-force-refreshed', 'true');
        window.location.reload();
        // Return a promise that never resolves so React doesn't render until reload
        return new Promise(() => {});
      }
      throw error;
    }
  });

const pageImports = {
  home: () => import('./pages/Home.jsx'),
  about: () => import('./pages/About.jsx'),
  projects: () => import('./pages/Projects.jsx'),
  certificates: () => import('./pages/Certificates.jsx'),
  contact: () => import('./pages/Contact.jsx'),
};

const Home = lazyWithRetry(pageImports.home);
const About = lazyWithRetry(pageImports.about);
const Projects = lazyWithRetry(pageImports.projects);
const Certificates = lazyWithRetry(pageImports.certificates);
const Contact = lazyWithRetry(pageImports.contact);

function App() {
  // Disable inspect element and developer tools
  useDisableInspect();

  // The intro runs once per browser session, not on every client-side nav.
  const [introDone, setIntroDone] = useState(
    () => sessionStorage.getItem('introPlayed') === 'true'
  );

  // Warm the page chunks while the intro is on screen, so the reveal doesn't
  // land on an empty Suspense fallback.
  useEffect(() => {
    if (introDone) return;
    Object.values(pageImports).forEach((load) => { load().catch(() => {}); });
  }, [introDone]);

  const handleIntroComplete = () => {
    sessionStorage.setItem('introPlayed', 'true');
    setIntroDone(true);
  };

  return (
    <HelmetProvider>
      <Router>
        <SmoothScroll />
        <RouteScrollToTop />
        <CustomCursor />
        <ThemeProvider>
          <AnimatePresence>
            {!introDone && <Preloader key="preloader" onComplete={handleIntroComplete} />}
          </AnimatePresence>

          <div
            className="relative min-h-screen w-full max-w-full overflow-x-hidden bg-bg text-fg transition-colors duration-300"
            style={{ minHeight: '100vh' }}
          >
            <GridBackdrop />

            {/* Shell and routes are mounted immediately so search crawlers and screen readers have full DOM access */}
            <Navbar />
            <main className="relative z-10 w-full max-w-full" style={{ minHeight: '100vh' }}>
              <Suspense fallback={null}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/certificates" element={<Certificates />} />
                  <Route path="/contact" element={<Contact />} />
                </Routes>
              </Suspense>
            </main>
            <div className="relative z-10">
              <Footer />
            </div>
            <ScrollToTop />
            <ChatWidget />
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
              theme="dark"
              toastClassName="!bg-elev !text-fg !border !border-accent/30 !rounded-xl !backdrop-blur-xl"
              progressClassName="!bg-accent"
            />
          </div>
        </ThemeProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;