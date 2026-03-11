import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const TaskContext = createContext();

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState({});
  const [boards, setBoards] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentUser, setCurrentUser] = useState(null);

  // Load current user dari localStorage
  useEffect(() => {
    const loadUser = () => {
      const user = localStorage.getItem('currentUser');
      if (user) {
        setCurrentUser(JSON.parse(user));
      } else {
        setCurrentUser(null);
      }
    };

    loadUser();
    window.addEventListener('storage', loadUser);
    return () => window.removeEventListener('storage', loadUser);
  }, []);

  // Fungsi untuk update user
  const updateCurrentUser = (user) => {
    setCurrentUser(user);
  };

  // Load data dari localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    const savedBoards = localStorage.getItem('boards');
    
    if (savedBoards) {
      setBoards(JSON.parse(savedBoards));
    } else {
      const defaultBoards = [
        { id: 'personal', name: 'Personal', color: 'blue', icon: 'Home' },
        { id: 'work', name: 'Work', color: 'purple', icon: 'Briefcase' },
        { id: 'shopping', name: 'Shopping', color: 'green', icon: 'ShoppingBag' },
      ];
      setBoards(defaultBoards);
      localStorage.setItem('boards', JSON.stringify(defaultBoards));
    }
    
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      const emptyTasks = {
        personal: { todo: [], inProgress: [], done: [] },
        work: { todo: [], inProgress: [], done: [] },
        shopping: { todo: [], inProgress: [], done: [] },
      };
      setTasks(emptyTasks);
      localStorage.setItem('tasks', JSON.stringify(emptyTasks));
    }
  }, []);

  // Save ke localStorage
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('boards', JSON.stringify(boards));
  }, [boards]);

  // Cek apakah user adalah admin/manager
  const isAdminOrManager = () => {
    return currentUser?.role === 'Admin' || currentUser?.role === 'Manager';
  };

  // Cek apakah user terlibat dalam task (sebagai creator atau assignee)
  const isUserInvolved = (task) => {
    if (!currentUser) return false;
    
    // Admin/Manager bisa lihat semua task
    if (isAdminOrManager()) return true;
    
    // User biasa: hanya lihat task yang dia buat ATAU dia yang ditugaskan
    const isCreator = task.createdBy?.name === currentUser.name;
    const isAssignee = task.assignedTo?.name === currentUser.name;
    
    return isCreator || isAssignee;
  };

  // Fungsi untuk menambah board
  const addBoard = (boardName, boardColor = 'blue', boardIcon = 'Folder') => {
    const boardId = boardName.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
    
    const newBoard = {
      id: boardId,
      name: boardName,
      color: boardColor,
      icon: boardIcon,
      createdAt: new Date().toISOString()
    };

    setBoards(prev => [...prev, newBoard]);
    setTasks(prev => ({
      ...prev,
      [boardId]: { todo: [], inProgress: [], done: [] }
    }));

    toast.success(`Project "${boardName}" created successfully!`);
    return boardId;
  };

  // Fungsi untuk menghapus board
  const deleteBoard = (boardId) => {
    if (boardId === 'personal' || boardId === 'work' || boardId === 'shopping') {
      toast.error('Default projects cannot be deleted');
      return;
    }
    
    setBoards(prev => prev.filter(board => board.id !== boardId));
    setTasks(prev => {
      const newTasks = { ...prev };
      delete newTasks[boardId];
      return newTasks;
    });
    toast.success('Project deleted successfully!');
  };

  // Fungsi untuk update board
  const updateBoard = (boardId, updates) => {
    setBoards(prev => prev.map(board => 
      board.id === boardId ? { ...board, ...updates } : board
    ));
    toast.success('Project updated successfully!');
  };

  // ADD TASK - dengan createdBy
  const addTask = (boardId, columnId, task) => {
    const currentUserData = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    const newTask = {
      ...task,
      id: Date.now().toString(),
      status: columnId,
      createdAt: new Date().toISOString(),
      createdBy: {
        name: currentUserData.name,
        avatar: currentUserData.avatar
      },
      assignedTo: task.assignedTo || null
    };

    setTasks(prevTasks => {
      const updatedTasks = { ...prevTasks };
      
      if (!updatedTasks[boardId]) {
        updatedTasks[boardId] = { todo: [], inProgress: [], done: [] };
      }
      
      if (!updatedTasks[boardId][columnId]) {
        updatedTasks[boardId][columnId] = [];
      }

      updatedTasks[boardId] = {
        ...updatedTasks[boardId],
        [columnId]: [...(updatedTasks[boardId][columnId] || []), newTask]
      };

      return updatedTasks;
    });

    toast.success('Task created successfully!');
  };

  // UPDATE TASK
  const updateTask = (boardId, columnId, taskId, updatedTask) => {
    setTasks(prev => ({
      ...prev,
      [boardId]: {
        ...prev[boardId],
        [columnId]: prev[boardId][columnId].map(task =>
          task.id === taskId ? { ...task, ...updatedTask } : task
        )
      }
    }));

    toast.success('Task updated successfully!');
  };

  // DELETE TASK
  const deleteTask = (boardId, columnId, taskId) => {
    setTasks(prev => ({
      ...prev,
      [boardId]: {
        ...prev[boardId],
        [columnId]: prev[boardId][columnId].filter(task => task.id !== taskId)
      }
    }));

    toast.success('Task deleted successfully!');
  };

  // MOVE TASK
  const moveTask = (boardId, sourceColumn, destColumn, taskId) => {
    const taskToMove = tasks[boardId]?.[sourceColumn]?.find(task => task.id === taskId);
    if (!taskToMove) return;

    setTasks(prev => {
      const updatedSource = prev[boardId][sourceColumn].filter(task => task.id !== taskId);
      const updatedTask = { ...taskToMove, status: destColumn };
      const updatedDest = [...(prev[boardId][destColumn] || []), updatedTask];

      return {
        ...prev,
        [boardId]: {
          ...prev[boardId],
          [sourceColumn]: updatedSource,
          [destColumn]: updatedDest
        }
      };
    });

    toast.success('Task moved successfully!');
  };

  // FILTER TASKS - Hanya yang melibatkan user (createdBy ATAU assignedTo)
  const getFilteredTasks = (boardId, columnId) => {
    if (!tasks[boardId] || !tasks[boardId][columnId]) return [];
    
    const columnTasks = tasks[boardId][columnId] || [];
    
    return columnTasks.filter(task => {
      // CEK APAKAH USER TERLIBAT
      if (!isUserInvolved(task)) return false;
      
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
      const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
      
      return matchesSearch && matchesPriority && matchesStatus;
    });
  };

  // KHUSUS UNTUK ADMIN - Lihat semua task (tanpa filter involvement)
  const getAllTasks = (boardId, columnId) => {
    if (!isAdminOrManager()) return []; // Panggil sebagai fungsi
    if (!tasks[boardId] || !tasks[boardId][columnId]) return [];
    
    const columnTasks = tasks[boardId][columnId] || [];
    
    return columnTasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
      const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
      
      return matchesSearch && matchesPriority && matchesStatus;
    });
  };

  // FILTER GLOBAL - Hanya yang melibatkan user
  const getGlobalFilteredTasks = () => {
    const filtered = {
      todo: [],
      inProgress: [],
      done: []
    };

    Object.keys(tasks).forEach(boardId => {
      if (tasks[boardId]) {
        ['todo', 'inProgress', 'done'].forEach(columnId => {
          const columnTasks = tasks[boardId][columnId] || [];
          const filteredTasks = columnTasks.filter(task => {
            // CEK APAKAH USER TERLIBAT
            if (!isUserInvolved(task)) return false;
            
            const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 task.description?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
            const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
            
            return matchesSearch && matchesPriority && matchesStatus;
          });

          filtered[columnId] = [
            ...filtered[columnId], 
            ...filteredTasks.map(task => ({ ...task, boardId }))
          ];
        });
      }
    });

    return filtered;
  };

  // STATS - Hitung berdasarkan task yang melibatkan user
  const getTotalStats = () => {
    let total = 0;
    let inProgress = 0;
    let completed = 0;
    let highPriority = 0;

    Object.values(tasks).forEach(board => {
      if (board) {
        const todoTasks = board.todo?.filter(task => isUserInvolved(task)) || [];
        const inProgressTasks = board.inProgress?.filter(task => isUserInvolved(task)) || [];
        const doneTasks = board.done?.filter(task => isUserInvolved(task)) || [];
        
        total += todoTasks.length + inProgressTasks.length + doneTasks.length;
        inProgress += inProgressTasks.length;
        completed += doneTasks.length;
        
        [...todoTasks, ...inProgressTasks, ...doneTasks].forEach(task => {
          if (task.priority === 'high') highPriority++;
        });
      }
    });

    return { total, inProgress, completed, highPriority };
  };

  // STATS DENGAN FILTER
  const getFilteredStats = () => {
    const filtered = getGlobalFilteredTasks();
    
    const total = filtered.todo.length + filtered.inProgress.length + filtered.done.length;
    const inProgress = filtered.inProgress.length;
    const completed = filtered.done.length;
    
    let highPriority = 0;
    [...filtered.todo, ...filtered.inProgress, ...filtered.done].forEach(task => {
      if (task.priority === 'high') highPriority++;
    });

    return { total, inProgress, completed, highPriority };
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      boards,
      currentUser,
      updateCurrentUser,
      addBoard,
      deleteBoard,
      updateBoard,
      addTask,
      updateTask,
      deleteTask,
      moveTask,
      getFilteredTasks,
      getGlobalFilteredTasks,
      getAllTasks,
      getTotalStats,
      getFilteredStats,
      isAdminOrManager: isAdminOrManager(), // Nilai boolean, bukan fungsi
      searchTerm,
      setSearchTerm,
      filterPriority,
      setFilterPriority,
      filterStatus,
      setFilterStatus,
    }}>
      {children}
    </TaskContext.Provider>
  );
};