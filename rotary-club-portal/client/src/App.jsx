import { useEffect, useState, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Toaster } from './components/ui/toaster';
import SplashScreen from './components/SplashScreen';
import AnimatedBackground from './components/AnimatedBackground';
import Layout from './layouts/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages (lazy loaded)
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const Members = lazy(() => import('./pages/Members'));
const AddMember = lazy(() => import('./pages/AddMember'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const Payments = lazy(() => import('./pages/Payments'));
const PaymentSettings = lazy(() => import('./pages/PaymentSettings'));
const QuickPay = lazy(() => import('./pages/QuickPay'));
const Notifications = lazy(() => import('./pages/Notifications'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Hide splash screen after 3 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
            <Route path="register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />
            
            {/* Public Projects */}
            <Route path="projects" element={<Projects />} />
            <Route path="projects/:id" element={<ProjectDetail />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="members" element={<Members />} />
              <Route path="members/add" element={<AddMember />} />
              <Route path="members/:id" element={<Profile />} />
              <Route path="payments" element={<Payments />} />
              <Route path="quick-pay" element={<QuickPay />} />
              <Route path="payment-settings" element={<PaymentSettings />} />
              <Route path="notifications" element={<Notifications />} />

              {/* Admin routes */}
              <Route
                path="admin/*"
                element={
                  <ProtectedRoute roles={['admin', 'super_admin']}>
                    <Routes>
                      <Route path="dashboard" element={<AdminDashboard />} />
                    </Routes>
                  </ProtectedRoute>
                }
              />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>

      <Toaster />
    </div>
  );
}

export default App;
