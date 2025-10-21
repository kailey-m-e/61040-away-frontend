import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { UserAuthenticationService } from '@/services'
import type { User, AuthState, LoginForm, RegisterForm } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const username = computed(() => user.value?.username || null)

  // Actions
  const login = async (credentials: LoginForm): Promise<void> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await UserAuthenticationService.authenticate({
        username: credentials.username,
        password: credentials.password,
      })

      if (response.error) {
        error.value = response.error
        return
      }

      // On successful authentication, set the user
      // Note: The API doesn't return user data on authentication,
      // so we'll create a minimal user object with the username
      user.value = {
        _id: credentials.username, // Using username as ID for now
        username: credentials.username,
      }

      // Store authentication state in localStorage
      localStorage.setItem('authUser', JSON.stringify(user.value))
    } catch (err: any) {
      error.value = err.message || 'Login failed'
    } finally {
      isLoading.value = false
    }
  }

  const register = async (userData: RegisterForm): Promise<void> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await UserAuthenticationService.register({
        username: userData.username,
        password: userData.password,
      })

      if (response.error) {
        error.value = response.error
        return
      }

      // On successful registration, set the user
      if (response.data?.user) {
        user.value = {
          _id: response.data.user,
          username: userData.username,
        }

        // Store authentication state in localStorage
        localStorage.setItem('authUser', JSON.stringify(user.value))
      }
    } catch (err: any) {
      error.value = err.message || 'Registration failed'
    } finally {
      isLoading.value = false
    }
  }

  const logout = (): void => {
    user.value = null
    error.value = null
    localStorage.removeItem('authUser')

    // Clear other stores on logout
    // Import and clear friending store
    import('./friendingStore').then(({ useFriendingStore }) => {
      const friendingStore = useFriendingStore()
      friendingStore.clearState()
    })

    // Clear wishlist store if it exists
    import('./wishlistStore').then(({ useWishlistStore }) => {
      const wishlistStore = useWishlistStore()
      if (wishlistStore.$reset) {
        wishlistStore.$reset()
      }
    }).catch(() => {
      // Wishlist store might not exist, ignore error
    })
  }

  const clearError = (): void => {
    error.value = null
  }

  const setLoading = (loading: boolean): void => {
    isLoading.value = loading
  }

  // Initialize auth state from localStorage
  const initializeAuth = (): void => {
    try {
      const storedUser = localStorage.getItem('authUser')
      if (storedUser) {
        user.value = JSON.parse(storedUser)
      }
    } catch (err) {
      console.error('Failed to initialize auth state:', err)
      localStorage.removeItem('authUser')
    }
  }

  // Auto-initialize on store creation
  initializeAuth()

  return {
    // State
    user,
    isLoading,
    error,

    // Getters
    isAuthenticated,
    username,

    // Actions
    login,
    register,
    logout,
    clearError,
    setLoading,
    initializeAuth,
  }
})
