import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utilities';
import { 
  Calendar, 
  Clock, 
  Edit3, 
  Trash2, 
  Check, 
  MoreHorizontal,
  Flag,
  User,
  GripVertical
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onStatusChange?: (taskId: string, newStatus: Task['status']) => void;
  isDragging?: boolean;
  isKanban?: boolean;
}

export function TaskCard({ 
  task, 
  onEdit, 
  onDelete, 
  onStatusChange,
  isDragging = false,
  isKanban = false 
}: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: sortableIsDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-500 bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800';
      case 'medium':
        return 'text-yellow-500 bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800';
      case 'low':
        return 'text-green-500 bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800';
      default:
        return 'text-gray-500 bg-gray-50 border-gray-200 dark:bg-gray-950 dark:border-gray-800';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'done':
        return 'text-green-600 bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800';
      case 'in-progress':
        return 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800';
      case 'todo':
        return 'text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-950 dark:border-gray-800';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-950 dark:border-gray-800';
    }
  };

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'done';
  const isDueSoon = new Date(task.dueDate).getTime() - new Date().getTime() < 24 * 60 * 60 * 1000 && task.status !== 'done';

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative transition-all duration-200 cursor-pointer border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800',
        'hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600',
        task.status === 'done' && 'opacity-60',
        sortableIsDragging && 'shadow-lg scale-105 z-50 rotate-1',
        isOverdue && 'border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20',
        isDueSoon && !isOverdue && 'border-yellow-200 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-950/20'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...attributes}
    >
      {/* Drag Handle */}
      <div
        {...listeners}
        className={cn(
          'absolute left-2 top-2 opacity-0 group-hover:opacity-100',
          'transition-opacity duration-200 cursor-grab active:cursor-grabbing'
        )}
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>

      <CardHeader className="pb-3 pl-8">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-1">
            <CardTitle className={cn(
              'text-base font-semibold line-clamp-2',
              task.status === 'done' && 'line-through text-muted-foreground'
            )}>
              {task.title}
            </CardTitle>
            
            {task.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {task.description}
              </p>
            )}
          </div>

          {/* Actions Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'h-8 w-8 p-0 opacity-0 group-hover:opacity-100',
                  'transition-opacity duration-200'
                )}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(task)}>
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete?.(task.id)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs px-2 py-0.5 rounded-full"
              >
                {tag}
              </Badge>
            ))}
            {task.tags.length > 3 && (
              <Badge variant="outline" className="text-xs px-2 py-0.5 rounded-full">
                +{task.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Meta Information */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            {/* Priority */}
            <div className="flex items-center gap-1">
              <Flag className={cn('h-3 w-3', {
                'text-red-500': task.priority === 'high',
                'text-yellow-500': task.priority === 'medium',
                'text-green-500': task.priority === 'low',
              })} />
              <span className="capitalize">{task.priority}</span>
            </div>

            {/* Due Date */}
            <div className={cn('flex items-center gap-1', {
              'text-red-600': isOverdue,
              'text-yellow-600': isDueSoon && !isOverdue,
            })}>
              <Calendar className="h-3 w-3" />
              <span>{formatDate(task.dueDate, 'MMM dd')}</span>
            </div>

            {/* Assignee */}
            {task.assignee && (
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{task.assignee}</span>
              </div>
            )}
          </div>

          {/* Status Indicator */}
          <Badge className={cn('text-xs', getStatusColor(task.status))}>
            {task.status === 'todo' && 'To Do'}
            {task.status === 'in-progress' && 'In Progress'}
            {task.status === 'done' && 'Done'}
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-1">
            {task.status !== 'done' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onStatusChange?.(task.id, 'done')}
                className="h-7 px-3 text-xs hover:bg-green-50 hover:border-green-300 hover:text-green-700 dark:hover:bg-green-950"
              >
                <Check className="h-3 w-3 mr-1" />
                Mark Done
              </Button>
            )}

            {task.status === 'done' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onStatusChange?.(task.id, 'todo')}
                className="h-7 px-3 text-xs hover:bg-gray-50 hover:border-gray-300 dark:hover:bg-gray-950"
              >
                <Clock className="h-3 w-3 mr-1" />
                Reopen
              </Button>
            )}

            {task.status === 'todo' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onStatusChange?.(task.id, 'in-progress')}
                className="h-7 px-3 text-xs hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 dark:hover:bg-blue-950"
              >
                Start
              </Button>
            )}
          </div>

          {/* Quick Edit */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit?.(task)}
            className={cn(
              'h-7 w-7 p-0 opacity-0 group-hover:opacity-100',
              'transition-opacity duration-200'
            )}
          >
            <Edit3 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>

      {/* Status Line */}
      <div className={cn(
        'absolute bottom-0 left-0 right-0 h-1 rounded-b-lg',
        {
          'bg-green-500': task.status === 'done',
          'bg-blue-500': task.status === 'in-progress',
          'bg-gray-300': task.status === 'todo',
        }
      )} />
    </Card>
  );
}
