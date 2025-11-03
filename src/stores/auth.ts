import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { UserAuthenticationService, SessioningService } from '@/services'
import type { User, AuthState, LoginForm, RegisterForm } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const sessionId = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!user.value && !!sessionId.value)
  const username = computed(() => user.value?.username || null)

  // Actions
  const login = async (credentials: LoginForm): Promise<void> => {
    isLoading.value = true
    error.value = null

    try {
      console.log('Attempting to authenticate user:', credentials.username)

      const response = await UserAuthenticationService.authenticate({
        username: credentials.username,
        password: credentials.password,
      })

      console.log('Authentication response received:', response)

      if (response.error) {
        error.value = response.error
        console.error('Authentication failed with error:', response.error)
        throw new Error(response.error)
      }

      // Verify we have a successful response with data
      if (!response.data) {
        error.value = 'Authentication failed: Invalid response from server'
        console.error('Authentication failed: No data in response')
        throw new Error('Authentication failed: Invalid response from server')
      }

      console.log('Authentication successful for user:', credentials.username)

      // The LoginResponseSuccess sync responds with { session: "ID" }
      const authData = response.data as Record<string, unknown>
      console.log('Auth response keys:', Object.keys(authData))
      console.log('Full auth response:', JSON.stringify(authData, null, 2))

      // Extract session from the response
      if ('session' in authData && typeof authData.session === 'string') {
        sessionId.value = authData.session
        console.log('Session ID received from LoginResponseSuccess:', sessionId.value)
      } else {
        console.error('No session in response! LoginResponseSuccess may have failed')
        error.value = 'Authentication succeeded but no session was created'
        throw new Error('Authentication succeeded but no session was created')
      }

      // Extract user ID from the response
      if ('user' in authData && typeof authData.user === 'string') {
        // Use the actual user ID from backend
        user.value = {
          _id: authData.user,  // ✅ Actual user ID
          username: credentials.username,
        }
        console.log('User ID received from backend:', authData.user)
      } else {
        console.error('No user ID in response!')
        error.value = 'Authentication succeeded but no user ID returned'
        throw new Error('Authentication succeeded but no user ID returned')
      }

      // Store authentication state in localStorage
      localStorage.setItem('authUser', JSON.stringify(user.value))
      if (sessionId.value) {
        localStorage.setItem('sessionId', sessionId.value)
      }
    } catch (err: unknown) {
      const errorObj = err as Error
      error.value = errorObj.message || 'Login failed'
      console.error('Login error:', err)
      throw err
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
        throw new Error(response.error)
      }

      // Registration successful - user needs to log in separately
      if (response.data?.user) {
        console.log('Registration successful for user:', userData.username)
        // Don't automatically log in - let the user do it manually
      }
    } catch (err: unknown) {
      const errorObj = err as Error
      error.value = errorObj.message || 'Registration failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = (): void => {
    // Try to delete the session on the backend (don't wait for it)
    if (sessionId.value) {
      // Fire and forget - don't block logout on backend response
      SessioningService.deleteSession(sessionId.value).catch((err) => {
        console.error('Failed to delete session on server:', err)
      })
    }

    // Immediately clear local state
    user.value = null
    sessionId.value = null
    error.value = null
    localStorage.removeItem('authUser')
    localStorage.removeItem('sessionId')

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
      const storedSessionId = localStorage.getItem('sessionId')

      if (storedUser && storedSessionId) {
        user.value = JSON.parse(storedUser)
        sessionId.value = storedSessionId
        console.log('Restored authentication state from localStorage')

        // Note: We don't validate the session here because _getUser times out.
        // The session will be validated implicitly when making authenticated requests.
        // If the session is invalid, the 401 interceptor will handle logout.
      }
    } catch (err) {
      console.error('Failed to initialize auth state:', err)
      localStorage.removeItem('authUser')
      localStorage.removeItem('sessionId')
      user.value = null
      sessionId.value = null
    }
  }

  // Listen for 401 unauthorized events from apiClient
  // This handles automatic logout when session expires
  if (typeof globalThis !== 'undefined' && globalThis.addEventListener) {
    globalThis.addEventListener('auth:unauthorized', () => {
      console.warn('Received unauthorized event - logging out')
      // Use void operator to handle the promise without awaiting
      void logout()
    })
  }

  // Auto-initialize on store creation
  initializeAuth()

  return {
    // State
    user,
    sessionId,
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
