import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { toast } from 'react-hot-toast';

const TaskModal = ({ isOpen, onClose, boardId, columnId, task = null, isEditing = false }) => {
  const { addTask, updateTask, currentUser } = useTasks();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    assignedTo: null,
  });

  // Data team members berdasarkan validUsers di LoginPage
  const teamMembers = [
    { id: 1, name: 'Ditho Dewangga', avatar: 'DD', role: 'Admin' },
    { id: 2, name: 'Jane Smith', avatar: 'JS', role: 'Manager' },
    { id: 3, name: 'Mike Johnson', avatar: 'MJ', role: 'Developer' },
    { id: 4, name: 'Sarah Wilson', avatar: 'SW', role: 'Designer' },
  ];

  useEffect(() => {
    if (task && isEditing) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        dueDate: task.dueDate || '',
        assignedTo: task.assignedTo || null,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        assignedTo: null,
      });
    }
  }, [task, isEditing, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    
    // Validasi assignee harus dipilih
    if (!formData.assignedTo) {
      toast.error('Please assign this task to someone');
      return;
    }
    
    if (isEditing && task) {
      updateTask(boardId, columnId, task.id, formData);
      toast.success('Task updated successfully!');
    } else {
      // addTask akan otomatis menambahkan createdBy dari currentUser
      addTask(boardId, columnId, formData);
    }
    
    onClose();
  };

  // Warna background untuk avatar
  const getAvatarColor = (name) => {
    const colors = [
      'from-red-500 to-pink-500',
      'from-blue-500 to-cyan-500',
      'from-green-500 to-emerald-500',
      'from-purple-500 to-indigo-500',
      'from-yellow-500 to-orange-500',
    ];
    const index = (name?.length || 0) % colors.length;
    return colors[index];
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 overflow-y-auto"
            style={{ pointerEvents: 'none' }}
          >
            <div className="flex min-h-full items-center justify-center p-4">
              <div 
                className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl"
                style={{ pointerEvents: 'auto' }}
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold dark:text-white">
                    {isEditing ? 'Edit Task' : 'Create New Task'}
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X size={20} className="text-gray-600 dark:text-gray-300" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                      placeholder="Enter task title"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                      placeholder="Enter task description"
                      rows="3"
                    />
                  </div>

                  {/* Priority & Due Date */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Priority
                      </label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Assign to */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Assign to <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      {teamMembers.map((member) => (
                        <label
                          key={member.id}
                          className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                            formData.assignedTo?.name === member.name
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                        >
                          <input
                            type="radio"
                            name="assignedTo"
                            value={member.name}
                            checked={formData.assignedTo?.name === member.name}
                            onChange={() => {
                              setFormData({ 
                                ...formData, 
                                assignedTo: { 
                                  name: member.name, 
                                  avatar: member.avatar 
                                } 
                              });
                            }}
                            className="sr-only"
                          />
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${getAvatarColor(member.name)} flex items-center justify-center text-xs text-white font-medium mr-3`}>
                            {member.avatar}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium dark:text-white">{member.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{member.role}</p>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 ${
                            formData.assignedTo?.name === member.name
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300 dark:border-gray-600'
                          } flex items-center justify-center`}>
                            {formData.assignedTo?.name === member.name && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Info Created By (untuk new task) */}
                  {!isEditing && currentUser && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Task will be created by: <span className="font-medium text-blue-600 dark:text-blue-400">{currentUser.name}</span>
                      </p>
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                    >
                      {isEditing ? 'Update Task' : 'Create Task'}
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TaskModal;