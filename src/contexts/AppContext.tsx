import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, Notification, Analytics, ThemeMode } from '@/types';
import useLocalStorage from '@/hooks/useLocalStorage';

// State interface
interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  theme: ThemeMode;
  notifications: Notification[];
  analytics: Analytics | null;
  isLoading: boolean;
  error: string | null;
  settings: {
    defaultFocusDuration: number;
    breakDuration: number;
    longBreakDuration: number;
    autoStartBreaks: boolean;
    backgroundSounds: boolean;
    notificationsEnabled: boolean;
    soundEnabled: boolean;
  };
}

// Action types
type AppAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_THEME'; payload: ThemeMode }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'SET_ANALYTICS'; payload: Analytics }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppState['settings']> }
  | { type: 'HYDRATE_STATE'; payload: Partial<AppState> };

// Initial state
const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  theme: 'system',
  notifications: [],
  analytics: null,
  isLoading: false,
  error: null,
  settings: {
    defaultFocusDuration: 25,
    breakDuration: 5,
    longBreakDuration: 15,
    autoStartBreaks: false,
    backgroundSounds: false,
    notificationsEnabled: true,
    soundEnabled: true,
  },
};

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        error: null,
      };

    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        notifications: [],
        analytics: null,
      };

    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload,
      };

    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
      };

    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
      };

    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
      };

    case 'SET_ANALYTICS':
      return {
        ...state,
        analytics: action.payload,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload,
        },
      };

    case 'HYDRATE_STATE':
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
};

// Context interface
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Helper functions
  login: (user: User) => void;
  logout: () => void;
  setTheme: (theme: ThemeMode) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  removeNotification: (id: string) => void;
  markNotificationRead: (id: string) => void;
  updateSettings: (settings: Partial<AppState['settings']>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [persistedState, setPersistedState] = useLocalStorage('focusprep-state', {});

  // Hydrate state from localStorage on mount
  useEffect(() => {
    if (persistedState && Object.keys(persistedState).length > 0) {
      dispatch({ type: 'HYDRATE_STATE', payload: persistedState });
    }
  }, [persistedState]);

  // Persist state changes to localStorage
  useEffect(() => {
    const stateToPersist = {
      user: state.user,
      isAuthenticated: state.isAuthenticated,
      theme: state.theme,
      settings: state.settings,
    };
    setPersistedState(stateToPersist);
  }, [state.user, state.isAuthenticated, state.theme, state.settings, setPersistedState]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    if (state.theme === 'dark') {
      root.classList.add('dark');
    } else if (state.theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System theme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [state.theme]);

  // Helper functions
  const login = (user: User) => {
    dispatch({ type: 'SET_USER', payload: user });
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    // Clear persisted state
    setPersistedState({});
  };

  const setTheme = (theme: ThemeMode) => {
    dispatch({ type: 'SET_THEME', payload: theme });
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      read: false,
    };
    dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });

    // Auto-remove notification after 5 seconds for non-persistent types
    if (!notification.type || notification.type === 'info') {
      setTimeout(() => {
        dispatch({ type: 'REMOVE_NOTIFICATION', payload: newNotification.id });
      }, 5000);
    }
  };

  const removeNotification = (id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  };

  const markNotificationRead = (id: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
  };

  const updateSettings = (settings: Partial<AppState['settings']>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const value: AppContextType = {
    state,
    dispatch,
    login,
    logout,
    setTheme,
    addNotification,
    removeNotification,
    markNotificationRead,
    updateSettings,
    setLoading,
    setError,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// Selector hooks for specific state slices
export function useAuth() {
  const { state, login, logout } = useApp();
  return {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    login,
    logout,
  };
}

export function useTheme() {
  const { state, setTheme } = useApp();
  return {
    theme: state.theme,
    setTheme,
  };
}

export function useNotifications() {
  const { state, addNotification, removeNotification, markNotificationRead } = useApp();
  return {
    notifications: state.notifications,
    addNotification,
    removeNotification,
    markNotificationRead,
    unreadCount: state.notifications.filter(n => !n.read).length,
  };
}

export function useSettings() {
  const { state, updateSettings } = useApp();
  return {
    settings: state.settings,
    updateSettings,
  };
}

export default AppContext;
