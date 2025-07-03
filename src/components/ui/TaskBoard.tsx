import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/AppContext';
import { TaskCard } from '@/components/ui/TaskCard';
import { TaskModal } from '@/components/ui/TaskModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DndContext, DragEndEvent, DragOverEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { KanbanColumn } from '@/components/ui/KanbanColumn';
import { 
  Plus, 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  Target, 
  Clock, 
  CheckCircle,
  AlertCircle,
  BarChart3,
  Sun,
  Moon,
  TrendingUp,
  Zap,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDate, generateId } from '@/lib/utilities';
import { useNotifications } from '@/contexts/AppContext';

interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'done';
  tags?: string[];
  assignee?: string;
  createdAt: string;
  updatedAt: string;
}

// Sample tasks data
const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Complete React Components',
    description: 'Build TaskCard, TaskModal, and KanbanColumn components with proper TypeScript interfaces.',
    dueDate: '2024-07-08',
    priority: 'high',
    status: 'in-progress',
    tags: ['React', 'TypeScript', 'UI'],
    assignee: 'Myself',
    createdAt: '2024-07-01T10:00:00Z',
    updatedAt: '2024-07-03T08:30:00Z'
  },
  {
    id: '2',
    title: 'Study Data Structures',
    description: 'Review linked lists, trees, and graph algorithms for upcoming technical interview.',
    dueDate: '2024-07-10',
    priority: 'high',
    status: 'todo',
    tags: ['Study', 'DSA', 'Interview'],
    assignee: 'Myself',
    createdAt: '2024-07-02T09:00:00Z',
    updatedAt: '2024-07-02T09:00:00Z'
  },
  {
    id: '3',
    title: 'Write Documentation',
    description: 'Create comprehensive documentation for the task management system.',
    dueDate: '2024-07-05',
    priority: 'medium',
    status: 'todo',
    tags: ['Documentation', 'Writing'],
    assignee: 'Myself',
    createdAt: '2024-07-01T14:00:00Z',
    updatedAt: '2024-07-01T14:00:00Z'
  },
  {
    id: '4',
    title: 'Set up CI/CD Pipeline',
    description: 'Configure GitHub Actions for automated testing and deployment.',
    dueDate: '2024-07-15',
    priority: 'low',
    status: 'done',
    tags: ['DevOps', 'CI/CD', 'GitHub'],
    assignee: 'Myself',
    createdAt: '2024-06-28T16:00:00Z',
    updatedAt: '2024-07-01T11:00:00Z'
  },
  {
    id: '5',
    title: 'Prepare for Math Exam',
    description: 'Review calculus, linear algebra, and statistics chapters.',
    dueDate: '2024-07-06',
    priority: 'high',
    status: 'in-progress',
    tags: ['Study', 'Math', 'Exam'],
    assignee: 'Myself',
    createdAt: '2024-06-30T12:00:00Z',
    updatedAt: '2024-07-02T15:30:00Z'
  },
  {
    id: '6',
    title: 'Research Internship Applications',
    description: 'Find and apply to software engineering internships for next summer.',
    dueDate: '2024-07-20',
    priority: 'medium',
    status: 'todo',
    tags: ['Career', 'Research', 'Applications'],
    assignee: 'Myself',
    createdAt: '2024-07-01T18:00:00Z',
    updatedAt: '2024-07-01T18:00:00Z'
  }
];

export function TaskBoard() {
  const [tasks, setTasks] = useState(initialTasks);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [kanbanView, setKanbanView] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'todo' | 'in-progress' | 'done'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const { theme, setTheme } = useTheme();
  const { addNotification } = useNotifications();

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (task.tags && task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Task statistics
  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    done: tasks.filter(t => t.status === 'done').length,
    overdue: tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'done').length,
  };

  const handleTaskDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const activeTask = tasks.find(task => task.id === active.id);
    if (!activeTask) return;

    // Handle column drop (status change)
    if (over.id === 'todo' || over.id === 'in-progress' || over.id === 'done') {
      const newStatus = over.id as Task['status'];
      if (activeTask.status !== newStatus) {
        handleTaskStatusChange(activeTask.id, newStatus);
      }
      return;
    }

    // Handle task reordering
    if (active.id !== over.id) {
      setTasks((items) => {
        const oldIndex = items.findIndex(task => task.id === active.id);
        const newIndex = items.findIndex(task => task.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleTaskSave = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    
    if (editingTask) {
      // Update existing task
      setTasks(prev => prev.map(task => 
        task.id === editingTask.id 
          ? { ...task, ...taskData, updatedAt: now }
          : task
      ));
      addNotification({
        type: 'success',
        title: 'Task Updated',
        message: `"${taskData.title}" has been updated successfully.`
      });
    } else {
      // Create new task
      const newTask: Task = {
        ...taskData,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      };
      setTasks(prev => [newTask, ...prev]);
      addNotification({
        type: 'success',
        title: 'Task Created',
        message: `"${taskData.title}" has been added to your tasks.`
      });
    }
    
    setEditingTask(null);
  };

  const handleTaskEdit = (task: Task) => {
    setEditingTask(task);
    setTaskModalOpen(true);
  };

  const handleTaskDelete = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    setTasks(prev => prev.filter(t => t.id !== taskId));
    
    if (task) {
      addNotification({
        type: 'success',
        title: 'Task Deleted',
        message: `"${task.title}" has been deleted.`
      });
    }
  };

  const handleTaskStatusChange = (taskId: string, newStatus: Task['status']) => {
    const task = tasks.find(t => t.id === taskId);
    setTasks(prev => prev.map(t => 
      t.id === taskId 
        ? { ...t, status: newStatus, updatedAt: new Date().toISOString() }
        : t
    ));
    
    if (task) {
      const statusText = newStatus === 'todo' ? 'To Do' : 
                        newStatus === 'in-progress' ? 'In Progress' : 'Done';
      addNotification({
        type: newStatus === 'done' ? 'success' : 'info',
        title: 'Status Updated',
        message: `"${task.title}" moved to ${statusText}.`
      });
    }
  };

  const handleAddTask = (status?: Task['status']) => {
    setEditingTask(null);
    setTaskModalOpen(true);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Clean Header */}
        <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Tasks
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage your tasks efficiently
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setTheme('light')}
                className={cn(
                  "p-1.5 rounded-md transition-all duration-200",
                  theme === 'light' ? "bg-white dark:bg-gray-700 shadow-sm" : "hover:bg-gray-200 dark:hover:bg-gray-700"
                )}
              >
                <Sun className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={cn(
                  "p-1.5 rounded-md transition-all duration-200",
                  theme === 'dark' ? "bg-white dark:bg-gray-700 shadow-sm" : "hover:bg-gray-200 dark:hover:bg-gray-700"
                )}
              >
                <Moon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            <Button
              onClick={handleAddTask}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium gap-2"
            >
              <Plus className="h-4 w-4" />
              New Task
            </Button>
          </div>
        </div>

        {/* Clean Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
              <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <Target className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">To Do</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.todo}</p>
              </div>
              <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">In Progress</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.inProgress}</p>
              </div>
              <div className="w-8 h-8 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Done</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.done}</p>
              </div>
              <div className="w-8 h-8 bg-green-50 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Clean Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tasks..."
                className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            
            {/* Status Filters */}
            <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setStatusFilter('all')}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200",
                  statusFilter === 'all'
                    ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('todo')}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200",
                  statusFilter === 'todo'
                    ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                To Do
              </button>
              <button
                onClick={() => setStatusFilter('in-progress')}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200",
                  statusFilter === 'in-progress'
                    ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                In Progress
              </button>
              <button
                onClick={() => setStatusFilter('done')}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200",
                  statusFilter === 'done'
                    ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                Done
              </button>
            </div>
            
            {/* View Toggle */}
            <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setKanbanView(true)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200",
                  kanbanView
                    ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                <LayoutGrid className="h-4 w-4" />
                Board
              </button>
              <button
                onClick={() => setKanbanView(false)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200",
                  !kanbanView
                    ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                <List className="h-4 w-4" />
                List
              </button>
            </div>
          </div>
        </div>

        {/* Task View */}
        <DndContext onDragEnd={handleTaskDragEnd}>
          {kanbanView ? (
            <div className="flex gap-6 overflow-x-auto pb-4">
              {['Todo', 'In Progress', 'Done'].map(status => (
                <KanbanColumn 
                  key={status} 
                  status={status} 
                  tasks={filteredTasks}
                  onTaskEdit={handleTaskEdit}
                  onTaskDelete={handleTaskDelete}
                  onTaskStatusChange={handleTaskStatusChange}
                  onAddTask={handleAddTask}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <SortableContext
                items={filteredTasks.map(task => task.id)}
                strategy={verticalListSortingStrategy}
              >
                {filteredTasks.map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task}
                    onEdit={handleTaskEdit}
                    onDelete={handleTaskDelete}
                    onStatusChange={handleTaskStatusChange}
                  />
                ))}
              </SortableContext>
              
              {filteredTasks.length === 0 && (
                <Card className="p-12 text-center">
                  <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Target className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">No tasks found</h3>
                  <p className="text-text-secondary mb-4">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'Try adjusting your search or filters' 
                      : 'Get started by creating your first task'
                    }
                  </p>
                  <Button onClick={handleAddTask} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Task
                  </Button>
                </Card>
              )}
            </div>
          )}
        </DndContext>

        {/* Task Modal */}
        <TaskModal
          isOpen={taskModalOpen}
          onClose={() => {
            setTaskModalOpen(false);
            setEditingTask(null);
          }}
          onSave={handleTaskSave}
          task={editingTask || undefined}
        />
      </div>
    </div>
  );
}

