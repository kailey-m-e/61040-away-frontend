import apiClient from './apiClient'
import type {
  FriendActionRequest,
  GetIncomingRequestsResponse,
  GetOutgoingRequestsResponse,
  GetFriendsResponse,
  ApiResponse,
} from '@/types/api'

export class FriendingService {
  /**
   * Request a new friend
   */
  static async requestFriend(data: FriendActionRequest): Promise<ApiResponse<Record<string, never>>> {
    try {
      console.log('FriendingService: Sending friend request:', data)
      console.log('FriendingService: Request URL:', '/api/Friending/requestFriend')
      const response = await apiClient.post('/api/Friending/requestFriend', data)
      console.log('FriendingService: Friend request response:', response.data)
      return { data: response.data }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string }, status?: number }; message?: string; code?: string }
      console.error('FriendingService: Friend request error:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
        code: err.code,
        fullError: error
      })

      // Handle timeout errors
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        return { error: 'Request timed out. The server may be slow or unreachable. Please try again.' }
      }

      // Provide more helpful error messages
      if (err.response?.status === 500) {
        const errorMsg = err.response?.data?.error || 'An internal server error occurred.'
        // Check for common backend issues
        if (errorMsg.includes('null') || errorMsg.includes('undefined')) {
          return { error: 'Backend error: User may not be initialized in Friending system. Please try logging out and back in.' }
        }
        return { error: errorMsg }
      }

      return { error: err.response?.data?.error || err.message || 'Failed to request friend' }
    }
  }

  /**
   * Cancel an outgoing friend request
   */
  static async unrequestFriend(data: FriendActionRequest): Promise<ApiResponse<Record<string, never>>> {
    try {
      const response = await apiClient.post('/api/Friending/unrequestFriend', data)
      return { data: response.data }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } }
      return { error: err.response?.data?.error || 'Failed to cancel friend request' }
    }
  }

  /**
   * Accept an incoming friend request
   */
  static async acceptFriend(data: FriendActionRequest): Promise<ApiResponse<Record<string, never>>> {
    try {
      const response = await apiClient.post('/api/Friending/acceptFriend', data)
      return { data: response.data }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } }
      return { error: err.response?.data?.error || 'Failed to accept friend request' }
    }
  }

  /**
   * Reject an incoming friend request
   */
  static async rejectFriend(data: FriendActionRequest): Promise<ApiResponse<Record<string, never>>> {
    try {
      const response = await apiClient.post('/api/Friending/rejectFriend', data)
      return { data: response.data }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } }
      return { error: err.response?.data?.error || 'Failed to reject friend request' }
    }
  }

  /**
   * Validate that a friendship exists
   */
  static async validateFriendship(data: FriendActionRequest): Promise<ApiResponse<Record<string, never>>> {
    try {
      const response = await apiClient.post('/api/Friending/validateFriendship', data)
      return { data: response.data }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } }
      return { error: err.response?.data?.error || 'Friendship validation failed' }
    }
  }

  /**
   * End a friendship
   */
  static async endFriendship(data: FriendActionRequest): Promise<ApiResponse<Record<string, never>>> {
    try {
      const response = await apiClient.post('/api/Friending/endFriendship', data)
      return { data: response.data }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } }
      return { error: err.response?.data?.error || 'Failed to end friendship' }
    }
  }

  /**
   * Get incoming friend requests
   */
  static async getIncomingRequests(sessionId: string): Promise<ApiResponse<GetIncomingRequestsResponse>> {
    try {
      console.log('FriendingService: Fetching incoming requests with session:', sessionId)
      const response = await apiClient.post('/api/Friending/_getIncomingRequests', { session: sessionId })
      console.log('FriendingService: Raw incoming requests response:', response.data)

      // Handle the response structure - backend returns { results: [...] }
      const responseData = response.data
      let friends: string[] = []

      if (responseData.results && Array.isArray(responseData.results)) {
        // Backend sync now returns results as array of { friendId, username }
        // Extract the username from each object
        friends = responseData.results.map((item: { friendId?: string; username?: string } & Partial<{ username: string }>) => {
          console.log('FriendingService: Processing incoming request item:', item)

          // The sync collects [friendId, username], so extract username
          if (item.username && typeof item.username === 'string') {
            return item.username
          }

          // Fallback to friendId if username not present
          if (item.friendId && typeof item.friendId === 'string') {
            console.warn('FriendingService: No username found, using friendId:', item.friendId)
            return item.friendId
          }

          // Last resort: if item is just a string
          if (typeof item === 'string') {
            return item
          }

          console.warn('FriendingService: Could not extract username from item:', item)
          return String(item)
        }).filter((username: string) => username && username !== '[object Object]')
      } else if (Array.isArray(responseData)) {
        friends = responseData
      } else {
        friends = []
      }

      console.log('FriendingService: Processed incoming requests:', friends)
      return { data: { results: friends } }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } }
      console.error('FriendingService: Error fetching incoming requests:', err.response?.data)
      return { error: err.response?.data?.error || 'Failed to get incoming requests' }
    }
  }

  /**
   * Get outgoing friend requests
   */
  static async getOutgoingRequests(sessionId: string): Promise<ApiResponse<GetOutgoingRequestsResponse>> {
    try {
      console.log('FriendingService: Fetching outgoing requests with session:', sessionId)
      const response = await apiClient.post('/api/Friending/_getOutgoingRequests', { session: sessionId })
      console.log('FriendingService: Raw outgoing requests response:', response.data)

      // Handle the response structure - backend returns { results: [...] }
      const responseData = response.data
      let friends: string[] = []

      if (responseData.results && Array.isArray(responseData.results)) {
        // Backend sync now returns results as array of { friendId, username }
        // Extract the username from each object
        friends = responseData.results.map((item: { friendId?: string; username?: string } & Partial<{ username: string }>) => {
          console.log('FriendingService: Processing outgoing request item:', item)

          // The sync collects [friendId, username], so extract username
          if (item.username && typeof item.username === 'string') {
            return item.username
          }

          // Fallback to friendId if username not present
          if (item.friendId && typeof item.friendId === 'string') {
            console.warn('FriendingService: No username found, using friendId:', item.friendId)
            return item.friendId
          }

          // Last resort: if item is just a string
          if (typeof item === 'string') {
            return item
          }

          console.warn('FriendingService: Could not extract username from item:', item)
          return String(item)
        }).filter((username: string) => username && username !== '[object Object]')
      } else if (Array.isArray(responseData)) {
        friends = responseData
      } else {
        friends = []
      }

      console.log('FriendingService: Processed outgoing requests:', friends)
      return { data: { results: friends } }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } }
      console.error('FriendingService: Error fetching outgoing requests:', err.response?.data)
      return { error: err.response?.data?.error || 'Failed to get outgoing requests' }
    }
  }

  /**
   * Get friends list
   */
  static async getFriends(sessionId: string): Promise<ApiResponse<GetFriendsResponse>> {
    try {
      console.log('FriendingService: Fetching friends with session:', sessionId)
      const response = await apiClient.post('/api/Friending/_getFriends', { session: sessionId })
      console.log('FriendingService: Raw friends response:', response.data)

      // Handle the response structure - backend returns { results: [...] }
      const responseData = response.data
      let friends: string[] = []

      if (responseData.results && Array.isArray(responseData.results)) {
        // Backend sync now returns results as array of { friendId, username }
        // Extract the username from each object
        friends = responseData.results.map((item: { friendId?: string; username?: string } & Partial<{ username: string }>) => {
          console.log('FriendingService: Processing friend item:', item)

          // The sync collects [friendId, username], so extract username
          if (item.username && typeof item.username === 'string') {
            return item.username
          }

          // Fallback to friendId if username not present
          if (item.friendId && typeof item.friendId === 'string') {
            console.warn('FriendingService: No username found, using friendId:', item.friendId)
            return item.friendId
          }

          // Last resort: if item is just a string
          if (typeof item === 'string') {
            return item
          }

          console.warn('FriendingService: Could not extract username from item:', item)
          return String(item)
        }).filter((username: string) => username && username !== '[object Object]')
      } else if (Array.isArray(responseData)) {
        friends = responseData
      } else {
        friends = []
      }

      console.log('FriendingService: Processed friends:', friends)
      return { data: { results: friends } }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } }
      console.error('FriendingService: Error fetching friends:', err.response?.data)
      return { error: err.response?.data?.error || 'Failed to get friends' }
    }
  }
}
