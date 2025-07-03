import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TaskCard } from '@/components/ui/TaskCard';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  Circle, 
  Clock, 
  CheckCircle, 
  Plus,
  MoreHorizontal 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

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

interface KanbanColumnProps {
  status: string;
  tasks: Task[];
  onTaskEdit?: (task: Task) => void;
  onTaskDelete?: (taskId: string) => void;
  onTaskStatusChange?: (taskId: string, newStatus: Task['status']) => void;
  onAddTask?: (status: Task['status']) => void;
}

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'todo':
      return <Circle className="h-4 w-4 text-gray-500" />;
    case 'in progress':
    case 'in-progress':
      return <Clock className="h-4 w-4 text-blue-500" />;
    case 'done':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    default:
      return <Circle className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'todo':
      return 'border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950';
    case 'in progress':
    case 'in-progress':
      return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950';
    case 'done':
      return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950';
    default:
      return 'border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950';
  }
};

const getDroppableId = (status: string) => {
  return status.toLowerCase().replace(' ', '-');
};

export function KanbanColumn({ 
  status, 
  tasks, 
  onTaskEdit, 
  onTaskDelete, 
  onTaskStatusChange,
  onAddTask 
}: KanbanColumnProps) {
  const droppableId = getDroppableId(status);
  const statusKey = droppableId as Task['status'];
  
  const {
    setNodeRef,
    isOver,
  } = useDroppable({
    id: droppableId,
  });

  const columnTasks = tasks.filter(task => 
    getDroppableId(task.status) === droppableId
  );

  const taskIds = columnTasks.map(task => task.id);

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex flex-col w-80 min-h-[600px] bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-200',
        isOver && 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20'
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          {getStatusIcon(status)}
          <h3 className="font-semibold text-sm text-foreground">
            {status}
          </h3>
          <Badge 
            variant="secondary" 
            className="text-xs font-medium min-w-[24px] h-5 flex items-center justify-center"
          >
            {columnTasks.length}
          </Badge>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAddTask?.(statusKey)}
            className="h-7 w-7 p-0 hover:bg-primary/10"
          >
            <Plus className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 hover:bg-muted"
          >
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Tasks Container */}
      <div className="flex-1 p-3 space-y-3 overflow-y-auto">
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {columnTasks.length > 0 ? (
            columnTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onTaskEdit}
                onDelete={onTaskDelete}
                onStatusChange={onTaskStatusChange}
                isKanban={true}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className={cn(
                'w-16 h-16 rounded-full border-2 border-dashed flex items-center justify-center mb-3',
                'border-muted-foreground/30'
              )}>
                {getStatusIcon(status)}
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                No {status.toLowerCase()} tasks
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onAddTask?.(statusKey)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add task
              </Button>
            </div>
          )}
        </SortableContext>
      </div>

      {/* Drop Zone Indicator */}
      {isOver && (
        <div className="absolute inset-0 rounded-lg bg-primary/10 border-2 border-primary border-dashed pointer-events-none">
          <div className="flex items-center justify-center h-full">
            <div className="bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm font-medium">
              Drop task here
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
