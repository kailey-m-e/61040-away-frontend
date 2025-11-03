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
   * Calls the UserAuthentication.authenticate endpoint directly
   * The backend will route this through the Requesting system via passthrough
   */
  static async authenticate(data: AuthenticateRequest): Promise<ApiResponse<AuthenticateResponse>> {
    try {
      console.log('Sending authentication request with data:', { username: data.username, password: '[REDACTED]' })

      // Call the authentication endpoint directly
      // The backend will add the path automatically from the URL
      // Only send username and password to match the sync pattern
      const response = await apiClient.post('/api/UserAuthentication/authenticate', {
        username: data.username,
        password: data.password
      })

      // Log the response for debugging
      console.log('Authentication response status:', response.status)
      console.log('Authentication response data:', response.data)

      // Check if the response contains an error field
      if (response.data && 'error' in response.data) {
        return { error: response.data.error as string }
      }

      // The response should contain the user ID or session
      return { data: response.data }
    } catch (error: unknown) {
      const err = error as { response?: { status?: number; data?: { error?: string; message?: string } }; message?: string }

      console.error('Authentication request failed')
      console.error('Status:', err.response?.status)
      console.error('Response data:', err.response?.data)
      console.error('Error message:', err.message)

      // Extract error message from response
      const errorMessage = err.response?.data?.error ||
                          err.response?.data?.message ||
                          err.message ||
                          'Authentication failed'

      return { error: errorMessage }
    }
  }
}
