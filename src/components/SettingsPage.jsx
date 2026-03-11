import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTasks } from '../context/TaskContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Database,
  ChevronRight,
  Moon,
  Sun,
  LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const SettingsPage = ({ darkMode, setDarkMode, onLogout }) => {
  const { boards, tasks } = useTasks();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  // Get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  // Hitung total data
  const totalProjects = boards.length;
  const totalTasks = Object.values(tasks).reduce((acc, board) => {
    return acc + (board.todo?.length || 0) + (board.inProgress?.length || 0) + (board.done?.length || 0);
  }, 0);

// SettingsPage.jsx bagian tabs
const tabs = [
  { id: 'profile', name: t('profile'), icon: User },
  { id: 'appearance', name: t('appearance'), icon: Palette },
  { id: 'language', name: t('language'), icon: Globe },
  { id: 'data', name: t('dataManagement'), icon: Database },
];  
  // Sign Out function
  const handleSignOut = () => {
    const loadingToast = toast.loading('Signing out...');
    
    // Hapus data autentikasi
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
    
    toast.dismiss(loadingToast);
    toast.success('Signed out successfully! 👋', {
      duration: 1500,
      icon: '👋',
    });
    
    // Panggil onLogout dari props (dari App.jsx)
    if (onLogout) {
      // Gunakan setTimeout untuk memberi waktu toast muncul
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

  const handleExportData = () => {
    try {
      const loadingToast = toast.loading('Exporting data...');
      
      const data = {
        boards,
        tasks,
        user: currentUser,
        exportDate: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Agendaku-backup-${currentUser.name || 'user'}-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast.dismiss(loadingToast);
      toast.success('Data exported successfully!');
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  const handleClearData = () => {
    if (window.confirm('⚠️ Are you sure you want to delete all data? This action cannot be undone.')) {
      try {
        const loadingToast = toast.loading('Clearing data...');
        
        const currentLanguage = localStorage.getItem('language');
        const currentDarkMode = localStorage.getItem('darkMode');
        const currentUserData = localStorage.getItem('currentUser');
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        
        // Hapus data tasks dan boards
        localStorage.removeItem('tasks');
        localStorage.removeItem('boards');
        
        // Restore preferences dan auth
        if (currentLanguage) localStorage.setItem('language', currentLanguage);
        if (currentDarkMode) localStorage.setItem('darkMode', currentDarkMode);
        if (currentUserData) localStorage.setItem('currentUser', currentUserData);
        if (isAuthenticated) localStorage.setItem('isAuthenticated', isAuthenticated);
        
        toast.dismiss(loadingToast);
        toast.success('All data cleared');
        
        // Reload page to reset state
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (error) {
        toast.error('Failed to clear data');
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold dark:text-white">{t('settings')}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          {t('overview')}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Settings */}
        <div className="md:w-64 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                <Icon size={20} />
                <span className="flex-1 text-left">{tab.name}</span>
                <ChevronRight size={16} className={activeTab === tab.id ? 'opacity-100' : 'opacity-50'} />
              </button>
            );
          })}

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors mt-8 border border-red-200 dark:border-red-800"
          >
            <LogOut size={20} />
            <span className="flex-1 text-left font-medium">{t('signOut')}</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-semibold dark:text-white mb-4">{t('profileSettings')}</h2>
              
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-2xl text-white font-bold">
                    {currentUser.avatar || currentUser.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium dark:text-white">{currentUser.name || 'User'}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{currentUser.role || 'User'}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Member since {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('fullName')}
                  </label>
                  <input
                    type="text"
                    defaultValue={currentUser.name || 'User'}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('emailAddress')}
                  </label>
                  <input
                    type="email"
                    defaultValue={`${currentUser.name?.toLowerCase() || 'user'}@example.com`}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                  />
                </div>
              </div>

              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                {t('saveChanges')}
              </button>
            </motion.div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-semibold dark:text-white mb-4">{t('appearance')}</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    {t('themeMode')}
                  </label>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setDarkMode(false)}
                      className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                        !darkMode 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <Sun size={24} className="mx-auto mb-2 text-yellow-500" />
                      <span className="block text-sm font-medium dark:text-white">{t('light')}</span>
                    </button>
                    <button
                      onClick={() => setDarkMode(true)}
                      className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                        darkMode 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <Moon size={24} className="mx-auto mb-2 text-gray-700 dark:text-gray-300" />
                      <span className="block text-sm font-medium dark:text-white">{t('dark')}</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Language Tab */}
          {activeTab === 'language' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-semibold dark:text-white mb-4">{t('language')}</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Select Language / Pilih Bahasa
                  </label>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setLanguage('en')}
                      className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                        language === 'en' 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <span className="text-2xl mb-2 block">🇬🇧</span>
                      <span className="block text-sm font-medium dark:text-white">English</span>
                    </button>
                    <button
                      onClick={() => setLanguage('id')}
                      className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                        language === 'id' 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <span className="text-2xl mb-2 block">🇮🇩</span>
                      <span className="block text-sm font-medium dark:text-white">Indonesia</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Data Management Tab */}
          {activeTab === 'data' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-semibold dark:text-white mb-4">{t('dataManagement')}</h2>
              
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h3 className="font-medium dark:text-white mb-2">{t('storageUsage')}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{t('totalProjects')}</span>
                    <span className="font-medium dark:text-white">{totalProjects}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{t('totalTasks')}</span>
                    <span className="font-medium dark:text-white">{totalTasks}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={handleExportData}
                  className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="block font-medium dark:text-white">{t('exportData')}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{t('exportDesc')}</span>
                </button>
                
                <button 
                  onClick={handleClearData}
                  className="w-full text-left px-4 py-3 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  <span className="block font-medium text-red-600 dark:text-red-400">{t('clearData')}</span>
                  <span className="text-sm text-red-500 dark:text-red-500">{t('clearDesc')}</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* Placeholder untuk tab lain */}
          {activeTab !== 'profile' && activeTab !== 'appearance' && activeTab !== 'language' && activeTab !== 'data' && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} {t('comingSoon')}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsPage;