// Global Types and Interfaces for FocusPrep Platform

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'student' | 'teacher' | 'admin';
  verified: boolean;
  joinedAt: string;
  streak: number;
  totalPoints: number;
  level: number;
  achievements: Achievement[];
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    studyReminders: boolean;
    achievements: boolean;
  };
  focus: {
    defaultSessionDuration: number;
    breakDuration: number;
    longBreakDuration: number;
    autoStartBreaks: boolean;
    backgroundSounds: boolean;
  };
  privacy: {
    showProfile: boolean;
    showProgress: boolean;
    allowMessaging: boolean;
  };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  category: 'focus' | 'learning' | 'social' | 'streak';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  status: 'pending' | 'in-progress' | 'completed' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  tags: string[];
  estimatedDuration?: number;
  actualDuration?: number;
  subtasks: SubTask[];
  attachments: Attachment[];
  reminders: Reminder[];
  userId: string;
  project?: string;
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: string;
}

export interface Reminder {
  id: string;
  datetime: string;
  message: string;
  sent: boolean;
}

export interface FocusSession {
  id: string;
  userId: string;
  startTime: string;
  endTime?: string;
  plannedDuration: number;
  actualDuration?: number;
  type: 'pomodoro' | 'deep-work' | 'study' | 'break';
  task?: string;
  distractionsBlocked: number;
  productivity: number;
  mood?: 'great' | 'good' | 'okay' | 'poor';
  notes?: string;
  tags: string[];
  interrupted: boolean;
  interruptionReason?: string;
}

export interface DistractionBlocker {
  id: string;
  name: string;
  icon: string;
  type: 'website' | 'app' | 'category';
  url?: string;
  enabled: boolean;
  schedules: BlockSchedule[];
  strictMode: boolean;
}

export interface BlockSchedule {
  id: string;
  days: number[];
  startTime: string;
  endTime: string;
  enabled: boolean;
}

export interface Question {
  id: string;
  title: string;
  category: 'UPSC' | 'NDA' | 'DSA' | 'Development' | 'General';
  subject?: string;
  topic?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  type: 'MCQ' | 'Subjective' | 'Coding' | 'True/False' | 'Fill-in-blank';
  question: string;
  options?: QuestionOption[];
  correctAnswer?: string | string[];
  explanation: string;
  hints?: string[];
  tags: string[];
  estimatedTime: number;
  points: number;
  isRecommended: boolean;
  isPopular: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  attempts: number;
  successRate: number;
  avgTimeSpent: number;
  bookmarked: boolean;
  lastAttempted?: string;
  source?: string;
  references?: string[];
}

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface QuestionAttempt {
  id: string;
  questionId: string;
  userId: string;
  answer: string | string[];
  isCorrect: boolean;
  timeSpent: number;
  attemptedAt: string;
  hintsUsed: number;
  confidence: number;
  notes?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Mixed';
  questions: string[];
  timeLimit?: number;
  passingScore: number;
  attempts: number;
  maxAttempts: number;
  tags: string[];
  createdBy: string;
  createdAt: string;
  isPublic: boolean;
  featured: boolean;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  answers: Record<string, string | string[]>;
  score: number;
  timeSpent: number;
  startedAt: string;
  completedAt?: string;
  passed: boolean;
  questionAttempts: QuestionAttempt[];
}

export interface Internship {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  type: 'remote' | 'onsite' | 'hybrid';
  location: string;
  salary?: {
    min?: number;
    max?: number;
    currency: string;
    type: 'hourly' | 'monthly' | 'yearly' | 'stipend';
  };
  duration: string;
  startDate?: string;
  applicationDeadline: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  techStack: string[];
  benefits: string[];
  applicationProcess: string[];
  tags: string[];
  postedBy: {
    id: string;
    name: string;
    role: 'teacher' | 'alumni' | 'recruiter' | 'student';
    year?: string;
    avatar: string;
    verified: boolean;
    company?: string;
  };
  postedAt: string;
  updatedAt: string;
  applicationCount: number;
  views: number;
  featured: boolean;
  urgent: boolean;
  applyLink: string;
  contactEmail?: string;
  status: 'active' | 'closed' | 'draft';
  category: string;
  experience: 'entry' | 'intermediate' | 'senior';
}

export interface InternshipApplication {
  id: string;
  internshipId: string;
  userId: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'selected';
  appliedAt: string;
  coverLetter?: string;
  resume?: string;
  portfolio?: string;
  additionalInfo?: string;
  interviews: Interview[];
}

export interface Interview {
  id: string;
  type: 'phone' | 'video' | 'onsite' | 'technical' | 'hr';
  scheduledAt: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  interviewer?: string;
  notes?: string;
  feedback?: string;
  result?: 'passed' | 'failed' | 'pending';
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  thumbnail?: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    role: 'teacher' | 'student' | 'alumni' | 'guest';
    bio?: string;
  };
  category: string;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  readTime: number;
  views: number;
  likes: number;
  comments: BlogComment[];
  bookmarked: boolean;
  seoTitle?: string;
  seoDescription?: string;
  socialImage?: string;
}

export interface BlogComment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  createdAt: string;
  updatedAt?: string;
  likes: number;
  replies: BlogComment[];
  parentId?: string;
  edited: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'achievement';
  title: string;
  message: string;
  action?: {
    label: string;
    url: string;
  };
  read: boolean;
  createdAt: string;
  expiresAt?: string;
  data?: Record<string, any>;
}

export interface Analytics {
  focusTime: {
    today: number;
    week: number;
    month: number;
    total: number;
    average: number;
    streak: number;
  };
  productivity: {
    score: number;
    trend: 'up' | 'down' | 'stable';
    factors: string[];
  };
  learning: {
    questionsAnswered: number;
    accuracy: number;
    topSubjects: string[];
    weakAreas: string[];
    improvement: number;
  };
  goals: {
    dailyFocus: {
      target: number;
      achieved: number;
      percentage: number;
    };
    weeklyLearning: {
      target: number;
      achieved: number;
      percentage: number;
    };
  };
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  lastUpdated?: string;
}

export interface SearchFilters {
  query: string;
  category?: string;
  difficulty?: string;
  type?: string;
  tags?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type RequireOnly<T, K extends keyof T> = Partial<T> & Pick<T, K>;

// Theme Types
export type ThemeMode = 'light' | 'dark' | 'system';

// Component Props
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Form Types
export interface FormFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

// Navigation Types
export interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType<any>;
  badge?: string | number;
  active?: boolean;
  disabled?: boolean;
  children?: NavItem[];
}

// Modal Types
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closable?: boolean;
}

// Toast Types
export interface ToastOptions {
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}
