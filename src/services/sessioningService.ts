import apiClient from './apiClient'
import type { ApiResponse } from '@/types/api'

export interface GetUserResponse {
  user: string
}

export interface CreateSessionResponse {
  session: string
}

export class SessioningService {
  /**
   * Create a new session for a user after authentication.
   * Returns the session ID that must be passed in subsequent requests.
   */
  static async createSession(userId: string): Promise<ApiResponse<CreateSessionResponse>> {
    try {
      console.log('Creating session for user:', userId)
      const response = await apiClient.post('/api/Sessioning/create', { user: userId })

      console.log('Create session response status:', response.status)
      console.log('Create session response data:', response.data)
      console.log('Response data type:', typeof response.data)
      console.log('Response data keys:', response.data ? Object.keys(response.data) : 'null/undefined')

      if (response.data && 'error' in response.data) {
        console.error('Session creation returned error:', response.data.error)
        return { error: response.data.error as string }
      }

      // Response format from spec: { session: "ID" }
      if (response.data && 'session' in response.data) {
        console.log('Session ID found in response:', response.data.session)
        return { data: { session: response.data.session } }
      }

      // If response is directly the session ID string
      if (typeof response.data === 'string') {
        console.log('Session ID is direct string:', response.data)
        return { data: { session: response.data } }
      }

      console.error('Invalid session creation response format:', response.data)
      return { error: 'Invalid session creation response format' }
    } catch (error: unknown) {
      const err = error as { response?: { status?: number; data?: { error?: string } }; message?: string }

      console.error('Session creation request failed')
      console.error('Status:', err.response?.status)
      console.error('Response data:', err.response?.data)
      console.error('Error message:', err.message)

      return { error: err.response?.data?.error || err.message || 'Failed to create session' }
    }
  }
  /**
   * Validate a session by checking if a user is associated with it.
   * Returns the user ID if valid, or an error if session is invalid/expired.
   */
  static async validateSession(sessionId: string): Promise<ApiResponse<GetUserResponse>> {
    try {
      // Backend _getUser endpoint expects { session: "ID" } in body
      const response = await apiClient.post('/api/Sessioning/_getUser', { session: sessionId })

      console.log('Session validation response:', response.data)

      if (response.data && 'error' in response.data) {
        return { error: response.data.error as string }
      }

      // Response format from spec: [{ user: "ID" }]
      if (Array.isArray(response.data) && response.data.length > 0) {
        return { data: { user: response.data[0].user } }
      }

      // If response is direct object { user: "ID" }
      if (response.data && 'user' in response.data) {
        return { data: { user: response.data.user } }
      }

      return { error: 'Invalid session response format' }
    } catch (error: unknown) {
      const err = error as { response?: { status?: number; data?: { error?: string } } }

      // 401 means session is invalid/expired
      if (err.response?.status === 401) {
        return { error: 'Session expired' }
      }

      return { error: err.response?.data?.error || 'Failed to validate session' }
    }
  }

  /**
   * Delete a session (logout)
   */
  static async deleteSession(sessionId: string): Promise<ApiResponse<Record<string, never>>> {
    try {
      // Backend expects { session: "ID" } in body
      const response = await apiClient.post('/api/Sessioning/delete', { session: sessionId })
      return { data: response.data }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } }
      return { error: err.response?.data?.error || 'Failed to delete session' }
    }
  }
}
