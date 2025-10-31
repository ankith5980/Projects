import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { User, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';
import rotaryLogo from '../assets/Rotary_logo.svg';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const { isAuthenticated, user, member } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 backdrop-blur-lg border-b border-white/10 shadow-2xl sticky top-0 z-[100]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo - Left Side */}
          <div className="flex items-center">
            <Link to="/" className="group">
              {/* Rotary Logo */}
              <img 
                src={rotaryLogo} 
                alt="Rotary Logo" 
                className="h-28 w-28 object-contain transform group-hover:scale-110 transition-transform duration-300 filter drop-shadow-lg" 
              />
            </Link>
          </div>

          {/* Club Name Container - Center-Left */}
          <div className="absolute left-[40%] transform -translate-x-1/2 hidden lg:block pointer-events-none">
            <div className="relative px-8 py-3 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 backdrop-blur-md border border-white/20 rounded-lg overflow-hidden group">
              {/* Animated gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              
              <div className="relative">
                <h1 className="text-lg font-bold bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 bg-clip-text text-transparent tracking-wider whitespace-nowrap">
                  ROTARY CLUB OF CALICUT SOUTH
                </h1>
              </div>

              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-yellow-400"></div>
              <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-yellow-400"></div>
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-yellow-400"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-yellow-400"></div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 relative z-10">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-blue-200 hover:text-yellow-400 font-medium transition-colors duration-300">
                  Dashboard
                </Link>
                <Link to="/projects" className="text-blue-200 hover:text-yellow-400 font-medium transition-colors duration-300">
                  Projects
                </Link>
                <Link to="/members" className="text-blue-200 hover:text-yellow-400 font-medium transition-colors duration-300">
                  Members
                </Link>
                <Link to="/payments" className="text-blue-200 hover:text-yellow-400 font-medium transition-colors duration-300">
                  Payments
                </Link>

                {/* Notifications */}
                <NotificationBell />

                {/* User Menu */}
                <div className="relative group">
                  <button className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 flex items-center justify-center text-slate-900 ring-2 ring-yellow-400/50 group-hover:ring-4 transition-all duration-300">
                      {member?.photo ? (
                        <img
                          src={member.photo}
                          alt={member.fullName}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5" />
                      )}
                    </div>
                  </button>

                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-white/20 rounded-lg shadow-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all backdrop-blur-lg">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-blue-200 hover:bg-blue-600/20 hover:text-yellow-400 transition-colors"
                    >
                      Profile
                    </Link>
                    {(user?.role === 'admin' || user?.role === 'super_admin') && (
                      <>
                        <Link
                          to="/payment-settings"
                          className="block px-4 py-2 text-blue-200 hover:bg-blue-600/20 hover:text-yellow-400 transition-colors"
                        >
                          Payment Settings
                        </Link>
                        <Link
                          to="/admin/dashboard"
                          className="block px-4 py-2 text-blue-200 hover:bg-blue-600/20 hover:text-yellow-400 transition-colors"
                        >
                          Admin Panel
                        </Link>
                      </>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-600/20 flex items-center space-x-2 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/projects" className="text-blue-200 hover:text-yellow-400 font-medium transition-colors duration-300">
                  Projects
                </Link>
                <Link to="/login" className="text-blue-200 hover:text-yellow-400 font-medium transition-colors duration-300">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 px-6 py-2 rounded-lg hover:from-yellow-400 hover:to-yellow-500 font-semibold shadow-lg hover:shadow-yellow-500/50 transition-all duration-300"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-blue-200 hover:text-yellow-400 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900/95 backdrop-blur-lg border-t border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 text-blue-200 hover:bg-blue-600/20 hover:text-yellow-400 rounded transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/projects"
                  className="block px-3 py-2 text-blue-200 hover:bg-blue-600/20 hover:text-yellow-400 rounded transition-colors"
                >
                  Projects
                </Link>
                <Link
                  to="/members"
                  className="block px-3 py-2 text-blue-200 hover:bg-blue-600/20 hover:text-yellow-400 rounded transition-colors"
                >
                  Members
                </Link>
                <Link
                  to="/payments"
                  className="block px-3 py-2 text-blue-200 hover:bg-blue-600/20 hover:text-yellow-400 rounded transition-colors"
                >
                  Payments
                </Link>
                <Link
                  to="/profile"
                  className="block px-3 py-2 text-blue-200 hover:bg-blue-600/20 hover:text-yellow-400 rounded transition-colors"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-red-400 hover:bg-red-600/20 rounded transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/projects"
                  className="block px-3 py-2 text-blue-200 hover:bg-blue-600/20 hover:text-yellow-400 rounded transition-colors"
                >
                  Projects
                </Link>
                <Link
                  to="/login"
                  className="block px-3 py-2 text-blue-200 hover:bg-blue-600/20 hover:text-yellow-400 rounded transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 text-yellow-400 hover:bg-yellow-600/20 rounded transition-colors font-semibold"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
