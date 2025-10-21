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
      return { data: response.data }
    } catch (error: any) {
      return { error: error.response?.data?.error || 'Authentication failed' }
    }
  }
}
