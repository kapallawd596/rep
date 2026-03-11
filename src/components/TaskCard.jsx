import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { Calendar, Trash2, Edit2 } from 'lucide-react';
import TaskModal from './TaskModal';
import ConfirmationModal from './ConfirmationModal';
import { useTasks } from '../context/TaskContext';

const TaskCard = ({ task, columnId, boardId, isDragging = false }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { deleteTask, currentUser, isAdminOrManager } = useTasks();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: task.id,
    data: {
      columnId,
      boardId,
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  const priorityColors = {
    low: 'text-green-600',
    medium: 'text-yellow-600',
    high: 'text-red-600',
  };

  const priorityDots = {
    low: 'bg-green-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500',
  };

  // Warna avatar berdasarkan nama
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

  // Cek apakah user bisa mengedit/menghapus task ini
  const canModify = isAdminOrManager || 
                    task.createdBy?.name === currentUser?.name || 
                    task.assignedTo?.name === currentUser?.name;

  const getDeadlineColor = () => {
    if (!task.dueDate) return 'text-gray-400';
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return 'text-red-500';
    if (diffDays <= 2) return 'text-orange-500';
    return 'text-gray-500';
  };

  const handleDelete = () => {
    deleteTask(boardId, columnId, task.id);
    setShowDeleteModal(false);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  };

  // Dapatkan inisial dari nama
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  if (isDragging) {
    return (
      <div className="p-2 bg-white dark:bg-gray-800 rounded border-2 border-blue-500 shadow-lg">
        <p className="text-sm font-medium truncate">{task.title}</p>
      </div>
    );
  }

  return (
    <>
      <motion.div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        layout
        className="group p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing mb-2"
      >
        {/* Baris 1: Priority + Title + Actions */}
        <div className="flex items-center gap-2 mb-2">
          <span className={`w-2 h-2 rounded-full ${priorityDots[task.priority]}`} />
          <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${priorityColors[task.priority]} bg-opacity-10`}>
            {task.priority === 'high' ? 'HIGH' : task.priority === 'medium' ? 'MED' : 'LOW'}
          </span>
          <span className="text-sm font-medium text-gray-900 dark:text-white truncate flex-1">
            {task.title}
          </span>
          
          {/* Actions - muncul saat hover */}
          {canModify && (
            <div className="hidden group-hover:flex items-center gap-1">
              <button 
                onClick={(e) => { e.stopPropagation(); setShowEditModal(true); }}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <Edit2 size={14} className="text-gray-500 hover:text-blue-500" />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setShowDeleteModal(true); }}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <Trash2 size={14} className="text-gray-500 hover:text-red-500" />
              </button>
            </div>
          )}
        </div>

        {/* Description (jika ada) */}
        {task.description && (
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Baris 2: From → To + Due Date */}
        <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            {/* Created By (From) */}
            {task.createdBy && (
              <div className="flex items-center gap-1">
                <span className="text-gray-400 text-[10px]">from</span>
                <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${getAvatarColor(task.createdBy.name)} flex items-center justify-center text-[8px] text-white font-medium shadow-sm`}>
                  {task.createdBy.avatar || getInitials(task.createdBy.name)}
                </div>
              </div>
            )}
            
            {/* Arrow (→) */}
            {task.createdBy && task.assignedTo && (
              <span className="text-gray-400 text-xs">→</span>
            )}
            
            {/* Assigned To (To) */}
            {task.assignedTo && (
              <div className="flex items-center gap-1">
                <span className="text-gray-400 text-[10px]">to</span>
                <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${getAvatarColor(task.assignedTo.name)} flex items-center justify-center text-[8px] text-white font-medium shadow-sm`}>
                  {task.assignedTo.avatar || getInitials(task.assignedTo.name)}
                </div>
              </div>
            )}
          </div>
          
          {/* Due Date */}
          {task.dueDate && (
            <div className={`flex items-center gap-1 ${getDeadlineColor()} bg-opacity-10 px-2 py-0.5 rounded-full`}>
              <Calendar size={12} />
              <span className="text-xs font-medium">{formatDate(task.dueDate)}</span>
            </div>
          )}
        </div>
      </motion.div>

      <TaskModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        boardId={boardId}
        columnId={columnId}
        task={task}
        isEditing
      />

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Task"
        message="Delete this task?"
      />
    </>
  );
};

export default TaskCard;