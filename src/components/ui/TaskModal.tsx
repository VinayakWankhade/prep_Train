import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  CalendarIcon,
  X,
  Plus,
  Loader2,
  Flag,
  User,
  Tag as TagIcon,
} from 'lucide-react';

// Task schema for validation
const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  dueDate: z.date({
    required_error: 'Due date is required',
  }),
  priority: z.enum(['low', 'medium', 'high'], {
    required_error: 'Priority is required',
  }),
  assignee: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

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

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  task?: Task;
  defaultValues?: Partial<TaskFormData>;
}

const PREDEFINED_TAGS = [
  'Study', 'Assignment', 'Project', 'Research', 'Exam', 'Reading',
  'Math', 'Science', 'History', 'English', 'Computer Science',
  'Personal', 'Work', 'Health', 'Urgent', 'Important'
];

const ASSIGNEE_OPTIONS = [
  'Myself',
  'Study Group',
  'Team Lead',
  'Professor',
  'Partner'
];

export function TaskModal({ 
  isOpen, 
  onClose, 
  onSave, 
  task, 
  defaultValues 
}: TaskModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const isEditing = !!task;

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium',
      assignee: 'Myself',
      tags: [],
      ...defaultValues,
    },
  });

  // Initialize form when task changes
  useEffect(() => {
    if (task) {
      form.reset({
        title: task.title,
        description: task.description || '',
        dueDate: new Date(task.dueDate),
        priority: task.priority,
        assignee: task.assignee || 'Myself',
        tags: task.tags || [],
      });
      setSelectedTags(task.tags || []);
    } else {
      form.reset({
        title: '',
        description: '',
        priority: 'medium',
        assignee: 'Myself',
        tags: [],
        ...defaultValues,
      });
      setSelectedTags([]);
    }
  }, [task, defaultValues, form]);

  // Handle form submission
  const onSubmit = async (data: TaskFormData) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const taskData = {
        ...data,
        dueDate: data.dueDate.toISOString(),
        tags: selectedTags,
        status: (task?.status || 'todo') as 'todo' | 'in-progress' | 'done',
      };

      onSave(taskData);
      onClose();
      
      // Reset form
      form.reset();
      setSelectedTags([]);
      setNewTag('');
    } catch (error) {
      console.error('Error saving task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle adding new tag
  const handleAddTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !selectedTags.includes(trimmedTag)) {
      setSelectedTags([...selectedTags, trimmedTag]);
    }
    setNewTag('');
  };

  // Handle removing tag
  const handleRemoveTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  // Handle modal close
  const handleClose = () => {
    form.reset();
    setSelectedTags([]);
    setNewTag('');
    onClose();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800';
      default:
        return '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEditing ? 'Edit Task' : 'Create New Task'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update your task details below.' 
              : 'Fill in the details to create a new task.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Title *
            </Label>
            <Input
              id="title"
              placeholder="Enter task title..."
              {...form.register('title')}
              className={cn(
                form.formState.errors.title && 'border-red-500 focus:border-red-500'
              )}
            />
            {form.formState.errors.title && (
              <p className="text-sm text-red-600">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Add a description for your task..."
              rows={3}
              {...form.register('description')}
              className={cn(
                form.formState.errors.description && 'border-red-500 focus:border-red-500'
              )}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-red-600">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          {/* Priority and Due Date Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Priority */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-1">
                <Flag className="h-4 w-4" />
                Priority *
              </Label>
              <Select
                value={form.watch('priority')}
                onValueChange={(value: 'low' | 'medium' | 'high') => 
                  form.setValue('priority', value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      Low
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500" />
                      Medium
                    </div>
                  </SelectItem>
                  <SelectItem value="high">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      High
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Due Date *
              </Label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !form.watch('dueDate') && 'text-muted-foreground',
                      form.formState.errors.dueDate && 'border-red-500'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.watch('dueDate') ? (
                      format(form.watch('dueDate'), 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={form.watch('dueDate')}
                    onSelect={(date) => {
                      if (date) {
                        form.setValue('dueDate', date);
                        setCalendarOpen(false);
                      }
                    }}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {form.formState.errors.dueDate && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.dueDate.message}
                </p>
              )}
            </div>
          </div>

          {/* Assignee */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-1">
              <User className="h-4 w-4" />
              Assignee
            </Label>
            <Select
              value={form.watch('assignee') || 'Myself'}
              onValueChange={(value) => form.setValue('assignee', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select assignee" />
              </SelectTrigger>
              <SelectContent>
                {ASSIGNEE_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-1">
              <TagIcon className="h-4 w-4" />
              Tags
            </Label>
            
            {/* Selected Tags */}
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {selectedTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer hover:bg-red-100 transition-colors"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    {tag}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
            )}

            {/* Add New Tag */}
            <div className="flex gap-2">
              <Input
                placeholder="Add a tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag(newTag);
                  }
                }}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddTag(newTag)}
                disabled={!newTag.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Predefined Tags */}
            <div className="flex flex-wrap gap-1">
              {PREDEFINED_TAGS.filter(tag => !selectedTags.includes(tag)).slice(0, 8).map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => handleAddTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="min-w-[100px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                isEditing ? 'Update Task' : 'Create Task'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
