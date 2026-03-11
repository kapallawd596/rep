import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  Settings,
  ChevronLeft,
  ChevronRight,
  User,
  Briefcase,
  ShoppingBag,
  Home,
  FolderKanban,
  LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Sidebar = ({ 
  collapsed, 
  setCollapsed, 
  onBoardChange,
  onPageChange,
  onLogout,
  currentUser 
}) => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('dashboard');
  const [activeProject, setActiveProject] = useState('personal');

  // Set active page based on currentUser
  useEffect(() => {
    if (currentUser) {
      console.log('Current user:', currentUser);
    }
  }, [currentUser]);

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'projects', icon: FolderKanban, label: 'Projects' },
    { id: 'tasks', icon: CheckSquare, label: 'Tasks' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
  ];

  const projectItems = [
    { id: 'personal', icon: Home, label: 'Personal', color: 'text-blue-500' },
    { id: 'work', icon: Briefcase, label: 'Work', color: 'text-purple-500' },
    { id: 'shopping', icon: ShoppingBag, label: 'Shopping', color: 'text-green-500' },
  ];

  const handlePageClick = (pageId) => {
    setActivePage(pageId);
    onPageChange(pageId);
  };

  const handleProjectClick = (projectId) => {
    console.log('Project clicked:', projectId);
    setActiveProject(projectId);
    setActivePage('projects');
    onBoardChange(projectId);
  };

  const handleSettingsClick = () => {
    setActivePage('settings');
    onPageChange('settings');
  };

  const handleLogoutClick = () => {
    // Tampilkan loading toast
    const loadingToast = toast.loading('Logging out...');
    
    // Hapus data autentikasi
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
    
    // Dismiss loading toast
    toast.dismiss(loadingToast);
    
    // Tampilkan success toast
    toast.success('Logged out successfully! 👋', {
      duration: 1500,
      icon: '👋',
    });
    
    // Panggil onLogout dari props (dari App.jsx)
    if (onLogout) {
      setTimeout(() => {
        onLogout();
      }, 500);
    } else {
      // Fallback: redirect manual
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (currentUser?.name) {
      return currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    }
    return 'JD';
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      className="relative h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg"
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-1.5 shadow-md hover:shadow-lg transition-shadow z-10"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <div className="p-4 h-full flex flex-col">
        {/* Logo */}
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <CheckSquare className="text-white" size={20} />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="font-bold text-xl dark:text-white"
              >
                Agendaku
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-1 overflow-y-auto space-y-6">
          {/* Main Menu */}
          <div>
            <AnimatePresence>
              {!collapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2"
                >
                  Menu
                </motion.p>
              )}
            </AnimatePresence>
            
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handlePageClick(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors mb-1 ${
                  activePage === item.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <item.icon size={20} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex-1 text-left"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            ))}
          </div>

          {/* Projects Section - Muncul hanya jika activePage adalah 'projects' */}
          {activePage === 'projects' && (
            <div>
              <AnimatePresence>
                {!collapsed && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2"
                  >
                    Your Projects
                  </motion.p>
                )}
              </AnimatePresence>

              {projectItems.map((project) => (
                <button
                  key={project.id}
                  onClick={() => handleProjectClick(project.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors mb-1 ${
                    activeProject === project.id
                      ? 'bg-blue-50 dark:bg-blue-900/20'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <project.icon size={20} className={project.color} />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 text-left text-gray-700 dark:text-gray-300"
                      >
                        {project.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  
                  {/* Badge untuk project aktif */}
                  {!collapsed && activeProject === project.id && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  )}
                </button>
              ))}
            </div>
          )}
        </nav>

        {/* Settings, Logout & Profile - Fixed at bottom */}
        <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          {/* Settings Button */}
          <button
            onClick={handleSettingsClick}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Settings size={20} className="text-gray-600 dark:text-gray-300" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-gray-700 dark:text-gray-300"
                >
                  Settings
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Logout Button */}
          {currentUser && (
            <button
              onClick={handleLogoutClick}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut size={20} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 text-left"
                  >
                    Logout
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          )}

          {/* User Profile */}
          <div className="mt-4 flex items-center space-x-3 px-3 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center ring-2 ring-white dark:ring-gray-800">
              <span className="text-xs text-white font-medium">
                {currentUser ? getUserInitials() : 'JD'}
              </span>
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 min-w-0"
                >
                  <p className="text-sm font-medium dark:text-white truncate">
                    {currentUser?.name || 'John Doe'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {currentUser?.role || 'User'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;