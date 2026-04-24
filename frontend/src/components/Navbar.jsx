import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Menu, X, Sun, Moon, Bell, AlertCircle, UserPlus, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();
  const [isDark, setIsDark] = React.useState(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  const [activities, setActivities] = React.useState([]);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [lastReadTime, setLastReadTime] = React.useState(new Date(0).toISOString());
  const notifRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    const handleEsc = (e) => {
      if (e.key === 'Escape') setShowNotifications(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  React.useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await api.get('/activities');
        setActivities(res.data);
      } catch (err) {}
    };
    fetchActivities();
    const int = setInterval(fetchActivities, 10000);
    return () => clearInterval(int);
  }, []);

  React.useEffect(() => {
    if (showNotifications) setLastReadTime(new Date().toISOString());
  }, [showNotifications]);

  const unreadCount = activities.filter(a => new Date(a.timestamp) > new Date(lastReadTime)).length;

  React.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Request Help', path: '/request-help' },
    { name: 'Volunteer', path: '/volunteer' },
    { name: 'Dashboard', path: '/dashboard' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass-card bg-white/80 dark:bg-[#0B1220]/80 border-b border-gray-100 dark:border-[#374151] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <motion.div 
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Heart className="h-8 w-8 text-blue-600 fill-blue-600 group-hover:text-red-500 group-hover:fill-red-500 transition-colors" />
              </motion.div>
              <span className="font-bold text-2xl tracking-tight text-gray-900 dark:text-white">
                Care<span className="text-blue-600 dark:text-blue-400">Bridge</span>
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors relative ${
                  isActive(link.path) ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-6 left-0 right-0 h-0.5 bg-blue-600"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors relative bg-gray-100 dark:bg-[#1F2937] focus:outline-none"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#1F2937] rounded-xl shadow-xl border border-gray-100 dark:border-[#374151] overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-[#374151] font-semibold text-gray-900 dark:text-white flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          Notifications
                          {unreadCount > 0 && <span className="text-[10px] bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full">{unreadCount} New</span>}
                        </div>
                        {activities.length > 0 && (
                          <button onClick={() => setLastReadTime(new Date().toISOString())} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">Mark all read</button>
                        )}
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {activities.length === 0 ? (
                          <div className="p-8 text-sm text-gray-500 dark:text-gray-400 flex flex-col items-center justify-center gap-2">
                            <Bell className="w-8 h-8 opacity-20" />
                            <p>No new notifications</p>
                          </div>
                        ) : (
                          activities.slice(0, 5).map(act => (
                            <div key={act.id} className="p-4 border-b border-gray-50 dark:border-[#374151] hover:bg-gray-50 dark:hover:bg-[#374151]/50 transition-colors flex gap-3">
                              <div className="mt-0.5">
                                {act.type === 'alert' ? <AlertCircle className="w-4 h-4 text-red-500" /> :
                                 act.type === 'user-plus' ? <UserPlus className="w-4 h-4 text-emerald-500" /> :
                                 <CheckCircle className="w-4 h-4 text-blue-500" />}
                              </div>
                              <div>
                                <p className="text-sm text-gray-800 dark:text-gray-200">{act.text}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{new Date(act.timestamp).toLocaleTimeString()}</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors bg-gray-100 dark:bg-[#1F2937] focus:outline-none overflow-hidden"
            >
              <motion.div
                initial={false}
                animate={{ rotate: isDark ? 180 : 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </motion.div>
            </button>
            <Link to="/request-help" className="ml-2">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium shadow-md shadow-blue-200 dark:shadow-none hover:bg-blue-700 transition-colors"
              >
                Get Support
              </motion.button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-card dark:bg-[#0B1220]/90 border-t border-gray-100 dark:border-[#374151] overflow-hidden"
          >
            <div className="px-4 pt-2 pb-4 space-y-1">
              {links.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-3 rounded-md text-base font-medium ${
                    isActive(link.path)
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="px-3 py-3">
                <button
                  onClick={() => setIsDark(!isDark)}
                  className="flex items-center justify-between w-full px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1F2937]"
                >
                  <span className="flex items-center gap-2">
                    <motion.div animate={{ rotate: isDark ? 180 : 0 }} transition={{ duration: 0.3 }}>
                      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </motion.div>
                    {isDark ? 'Light Mode' : 'Dark Mode'}
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
