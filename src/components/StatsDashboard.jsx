// components/StatsDashboard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

const StatsDashboard = () => {
  const { getTotalStats } = useTasks();
  const stats = getTotalStats();

  const statCards = [
    {
      title: 'Total Tasks',
      value: stats.total,
      icon: CheckCircle,
      color: 'blue',
      bgColor: 'bg-blue-500',
      description: 'All tasks across all projects'
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: Clock,
      color: 'yellow',
      bgColor: 'bg-yellow-500',
      description: 'Tasks currently being worked on'
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: CheckCircle,
      color: 'green',
      bgColor: 'bg-green-500',
      description: 'Tasks finished'
    },
    {
      title: 'High Priority',
      value: stats.highPriority,
      icon: AlertCircle,
      color: 'red',
      bgColor: 'bg-red-500',
      description: 'Urgent tasks need attention'
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                <p className="text-3xl font-bold dark:text-white mt-1">{stat.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">{stat.description}</p>
              </div>
              <div className={`p-3 ${stat.bgColor} bg-opacity-10 rounded-lg`}>
                <Icon className={`text-${stat.color}-500`} size={24} />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default StatsDashboard;