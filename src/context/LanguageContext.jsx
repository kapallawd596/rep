// context/LanguageContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Translations
export const translations = {
  en: {
    // Menu
    dashboard: 'Dashboard',
    projects: 'Projects',
    tasks: 'Tasks',
    calendar: 'Calendar',
    settings: 'Settings',
    
    // Projects
    personal: 'Personal',
    work: 'Work',
    shopping: 'Shopping',
    project: 'Project',
    manageTasks: 'Manage tasks for',
    
    // Board
    todo: 'To Do',
    inProgress: 'In Progress',
    done: 'Done',
    boardTasks: 'Board Tasks',
    total: 'Total',
    tasks: 'tasks',
    filterActive: 'Filter active',
    emptyBoard: 'This board is empty',
    emptyBoardDesc: 'Click the + button on any column to add your first task',
    noFilterResults: 'No tasks match your filter',
    adjustFilter: 'Try adjusting your search or filter criteria',
    
    // Task Card
    high: 'high',
    medium: 'medium',
    low: 'low',
    deleteTask: 'Delete Task',
    editTask: 'Edit Task',
    deleteConfirm: 'Are you sure you want to delete this task? This action cannot be undone.',
    
    // Settings
    profile: 'Profile',
    notifications: 'Notifications',
    appearance: 'Appearance',
    privacy: 'Privacy',
    language: 'Language',
    dataManagement: 'Data Management',
    signOut: 'Sign Out',
    profileSettings: 'Profile Settings',
    fullName: 'Full Name',
    emailAddress: 'Email Address',
    saveChanges: 'Save Changes',
    themeMode: 'Theme Mode',
    light: 'Light',
    dark: 'Dark',
    storageUsage: 'Storage Usage',
    totalProjects: 'Total Projects',
    totalTasks: 'Total Tasks',
    exportData: 'Export All Data',
    exportDesc: 'Download your tasks and projects as JSON',
    clearData: 'Clear All Data',
    clearDesc: 'Permanently delete all your tasks and projects',
    comingSoon: 'settings coming soon...',
    
    // Common
    welcome: 'Welcome back!',
    overview: 'Here\'s an overview of your projects.',
    recentActivity: 'Recent Activity',
    noActivity: 'No recent activity',
    viewDetails: 'View details',
    progress: 'Progress',
  },
  id: {
    // Menu
    dashboard: 'Dasbor',
    projects: 'Proyek',
    tasks: 'Tugas',
    calendar: 'Kalender',
    settings: 'Pengaturan',
    
    // Projects
    personal: 'Pribadi',
    work: 'Pekerjaan',
    shopping: 'Belanja',
    project: 'Proyek',
    manageTasks: 'Kelola tugas untuk',
    
    // Board
    todo: 'Harus Dikerjakan',
    inProgress: 'Sedang Dikerjakan',
    done: 'Selesai',
    boardTasks: 'Tugas Papan',
    total: 'Total',
    tasks: 'tugas',
    filterActive: 'Filter aktif',
    emptyBoard: 'Papan ini kosong',
    emptyBoardDesc: 'Klik tombol + di kolom mana pun untuk menambahkan tugas pertama Anda',
    noFilterResults: 'Tidak ada tugas yang cocok dengan filter',
    adjustFilter: 'Coba sesuaikan pencarian atau kriteria filter Anda',
    
    // Task Card
    high: 'tinggi',
    medium: 'sedang',
    low: 'rendah',
    deleteTask: 'Hapus Tugas',
    editTask: 'Edit Tugas',
    deleteConfirm: 'Apakah Anda yakin ingin menghapus tugas ini? Tindakan ini tidak dapat dibatalkan.',
    
    // Settings
    profile: 'Profil',
    notifications: 'Notifikasi',
    appearance: 'Tampilan',
    privacy: 'Privasi',
    language: 'Bahasa',
    dataManagement: 'Manajemen Data',
    signOut: 'Keluar',
    profileSettings: 'Pengaturan Profil',
    fullName: 'Nama Lengkap',
    emailAddress: 'Alamat Email',
    saveChanges: 'Simpan Perubahan',
    themeMode: 'Mode Tema',
    light: 'Terang',
    dark: 'Gelap',
    storageUsage: 'Penggunaan Penyimpanan',
    totalProjects: 'Total Proyek',
    totalTasks: 'Total Tugas',
    exportData: 'Ekspor Semua Data',
    exportDesc: 'Unduh tugas dan proyek Anda sebagai JSON',
    clearData: 'Hapus Semua Data',
    clearDesc: 'Hapus permanen semua tugas dan proyek Anda',
    comingSoon: 'pengaturan segera hadir...',
    
    // Common
    welcome: 'Selamat datang kembali!',
    overview: 'Berikut adalah ringkasan proyek Anda.',
    recentActivity: 'Aktivitas Terbaru',
    noActivity: 'Tidak ada aktivitas terbaru',
    viewDetails: 'Lihat detail',
    progress: 'Kemajuan',
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language');
    return saved || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
