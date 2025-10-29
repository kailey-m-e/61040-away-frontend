import apiClient from './apiClient'
import type {
  RegisterRequest,
  RegisterResponse,
  AuthenticateRequest,
  AuthenticateResponse,
  ApiResponse,
} from '@/types/api'

export class UserAuthenticationService {
  /**
   * Register a new user
   */
  static async register(data: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
    try {
      const response = await apiClient.post('/api/UserAuthentication/register', data)

      // Check if the response contains an error field
      // Backend may return {error: "message"} for failures even with HTTP 200
      if (response.data && 'error' in response.data) {
        return { error: response.data.error as string }
      }

      return { data: response.data }
    } catch (error: any) {
      return { error: error.response?.data?.error || 'Registration failed' }
    }
  }

  /**
   * Authenticate a user
   */
  static async authenticate(data: AuthenticateRequest): Promise<ApiResponse<AuthenticateResponse>> {
    try {
      const response = await apiClient.post('/api/UserAuthentication/authenticate', data)

      // Log the response for debugging
      console.log('Authentication response:', response.data)

      // Check if the response contains an error field
      // Backend returns {error: "message"} for failures even with HTTP 200
      if (response.data && 'error' in response.data) {
        return { error: response.data.error as string }
      }

      // Backend returns empty object {} on success
      // If we get a response without error, consider it success
      return { data: response.data }
    } catch (error: any) {
      console.error('Authentication error:', error.response?.data)

      // Extract error message from response
      const errorMessage = error.response?.data?.error ||
                          error.response?.data?.message ||
                          error.message ||
                          'Authentication failed'

      return { error: errorMessage }
    }
  }
}
