import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTasks } from '../context/TaskContext';
import TaskCard from './TaskCard';
import { Filter, Calendar, Flag, User } from 'lucide-react';

const TasksPage = () => {
  const { tasks, boards } = useTasks();
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  // Kumpulkan semua task dari semua board
  const allTasks = [];
  Object.keys(tasks).forEach(boardId => {
    ['todo', 'inProgress', 'done'].forEach(columnId => {
      if (tasks[boardId]?.[columnId]) {
        tasks[boardId][columnId].forEach(task => {
          allTasks.push({
            ...task,
            boardId,
            columnId
          });
        });
      }
    });
  });

  // Filter tasks
  const filteredTasks = allTasks.filter(task => {
    if (filterType === 'all') return true;
    if (filterType === 'todo') return task.status === 'todo';
    if (filterType === 'inProgress') return task.status === 'inProgress';
    if (filterType === 'done') return task.status === 'done';
    return true;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.dueDate) - new Date(a.dueDate);
    }
    if (sortBy === 'priority') {
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    }
    return 0;
  });

  const getBoardName = (boardId) => {
    const names = {
      personal: 'Personal',
      work: 'Work',
      shopping: 'Shopping'
    };
    return names[boardId] || boardId;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold dark:text-white">All Tasks</h2>
        <div className="flex space-x-3">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="todo">To Do</option>
            <option value="inProgress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm dark:text-white"
          >
            <option value="date">Sort by Date</option>
            <option value="priority">Sort by Priority</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</p>
          <p className="text-2xl font-bold dark:text-white">{allTasks.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">To Do</p>
          <p className="text-2xl font-bold text-blue-600">
            {allTasks.filter(t => t.status === 'todo').length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">In Progress</p>
          <p className="text-2xl font-bold text-yellow-600">
            {allTasks.filter(t => t.status === 'inProgress').length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Done</p>
          <p className="text-2xl font-bold text-green-600">
            {allTasks.filter(t => t.status === 'done').length}
          </p>
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="space-y-4">
          {sortedTasks.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              No tasks found
            </p>
          ) : (
            sortedTasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        task.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      }`}>
                        {task.priority}
                      </span>
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                        {getBoardName(task.boardId)}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        task.status === 'todo' ? 'bg-gray-100 text-gray-700' :
                        task.status === 'inProgress' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {task.status === 'todo' ? 'To Do' : 
                         task.status === 'inProgress' ? 'In Progress' : 'Done'}
                      </span>
                    </div>
                    
                    <h3 className="font-medium dark:text-white mb-1">{task.title}</h3>
                    {task.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {task.description}
                      </p>
                    )}
                    
                    <div className="flex items-center space-x-4 text-sm">
                      {task.dueDate && (
                        <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                          <Calendar size={14} />
                          <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      
                      {task.assignedTo && (
                        <div className="flex items-center space-x-1">
                          {task.assignedTo.avatar ? (
                            <img src={task.assignedTo.avatar} alt="" className="w-5 h-5 rounded-full" />
                          ) : (
                            <User size={14} className="text-gray-500" />
                          )}
                          <span className="text-gray-600 dark:text-gray-400">{task.assignedTo.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TasksPage;