// Import needed types from api.ts and re-export
import type { Post, WishlistPlace, ApiResponse } from './api'

export type { Post, WishlistPlace, ApiResponse }

// User Types
export interface User {
  _id: string
  username: string
  // Add other user fields as needed
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

// Application State Types
export interface AppState {
  isLoading: boolean
  error: string | null
  notifications: Notification[]
}

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
}

// Form Types
export interface LoginForm {
  username: string
  password: string
}

export interface RegisterForm {
  username: string
  password: string
  confirmPassword: string
}

// Post Form Types
export interface PostForm {
  title: string
  location: {
    city: string
    region: string
    country: string
  }
  startDate: string
  endDate: string
  description: string
}

export interface EditPostForm {
  title?: string
  city?: string
  region?: string
  country?: string
  start?: string
  end?: string
  description?: string
}

// Wishlist Form Types
export interface WishlistForm {
  city: string
  region: string
  country: string
}

// Friend Request Types
export interface FriendRequestStatus {
  isFriend: boolean
  hasOutgoingRequest: boolean
  hasIncomingRequest: boolean
}

// Store Types
export interface AuthStore {
  // State
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  // Actions
  login: (credentials: LoginForm) => Promise<void>
  register: (userData: RegisterForm) => Promise<void>
  logout: () => void
  clearError: () => void
  setLoading: (loading: boolean) => void
}

export interface AppStore {
  // State
  isLoading: boolean
  error: string | null
  notifications: Notification[]

  // Actions
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
}

// Route Types
export interface RouteMeta {
  requiresAuth?: boolean
  title?: string
}

// Component Props Types
export interface BaseComponentProps {
  class?: string
  id?: string
}

export interface FormComponentProps extends BaseComponentProps {
  onSubmit?: (data: unknown) => void
  onCancel?: () => void
  loading?: boolean
  disabled?: boolean
}

// Utility Types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

export interface AsyncState<T = unknown> {
  data: T | null
  loading: LoadingState
  error: string | null
}
