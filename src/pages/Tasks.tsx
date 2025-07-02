import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Calendar, Trash2, Check, Clock, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  dueDate: string;
  status: 'pending' | 'done';
  priority: 'low' | 'medium' | 'high';
}

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Complete React Project', dueDate: '2024-07-15', status: 'pending', priority: 'high' },
    { id: '2', title: 'Study for Math Exam', dueDate: '2024-07-20', status: 'done', priority: 'medium' },
    { id: '3', title: 'Submit Assignment', dueDate: '2024-07-18', status: 'pending', priority: 'high' },
  ]);
  
  const [filter, setFilter] = useState<'all' | 'pending' | 'done'>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState<{ title: string; dueDate: string; priority: 'low' | 'medium' | 'high' }>({ title: '', dueDate: '', priority: 'medium' });

  const filteredTasks = tasks.filter(task => 
    filter === 'all' || task.status === filter
  );

  const toggleTaskStatus = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, status: task.status === 'done' ? 'pending' : 'done' } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const addTask = () => {
    if (newTask.title && newTask.dueDate) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask.title,
        dueDate: newTask.dueDate,
        status: 'pending',
        priority: newTask.priority
      };
      setTasks([...tasks, task]);
      setNewTask({ title: '', dueDate: '', priority: 'medium' });
      setIsDialogOpen(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'medium': return 'bg-warning/10 text-warning border-warning/20';
      case 'low': return 'bg-success/10 text-success border-success/20';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-surface">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-text-primary mb-2">Task Manager</h1>
          <p className="text-text-secondary">Organize and track your academic tasks efficiently</p>
        </div>

        {/* Filters & Add Button */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              All ({tasks.length})
            </Button>
            <Button
              variant={filter === 'pending' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('pending')}
              className="gap-2"
            >
              <Clock className="h-4 w-4" />
              In Progress ({tasks.filter(t => t.status === 'pending').length})
            </Button>
            <Button
              variant={filter === 'done' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('done')}
              className="gap-2"
            >
              <Check className="h-4 w-4" />
              Done ({tasks.filter(t => t.status === 'done').length})
            </Button>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-gradient-primary text-white shadow-glow">
                <Plus className="h-4 w-4" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Task Title</Label>
                  <Input
                    id="title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="Enter task title..."
                  />
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  />
                </div>
                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <select
                        id="priority"
                        value={newTask.priority}
                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as 'low' | 'medium' | 'high' })}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                <Button onClick={addTask} className="w-full">
                  Create Task
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tasks Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => (
            <Card key={task.id} className={cn(
              "card-interactive transition-all duration-200",
              task.status === 'done' && "opacity-75"
            )}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className={cn(
                    "text-lg",
                    task.status === 'done' && "line-through text-muted-foreground"
                  )}>
                    {task.title}
                  </CardTitle>
                  <Badge className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Calendar className="h-4 w-4" />
                  {new Date(task.dueDate).toLocaleDateString()}
                </div>
                
                <div className="flex items-center justify-between">
                  <Button
                    variant={task.status === 'done' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleTaskStatus(task.id)}
                    className={cn(
                      "gap-2",
                      task.status === 'done' && "bg-success text-success-foreground"
                    )}
                  >
                    <Check className="h-4 w-4" />
                    {task.status === 'done' ? 'Done' : 'Mark Done'}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTask(task.id)}
                    className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Clock className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">No tasks found</h3>
            <p className="text-text-secondary">
              {filter === 'all' ? 'Get started by creating your first task!' : `No ${filter} tasks at the moment.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksPage;