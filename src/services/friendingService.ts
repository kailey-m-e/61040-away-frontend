import apiClient from './apiClient'
import type {
  FriendActionRequest,
  GetIncomingRequestsRequest,
  GetIncomingRequestsResponse,
  GetOutgoingRequestsRequest,
  GetOutgoingRequestsResponse,
  GetFriendsRequest,
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
      const response = await apiClient.post('/api/Friending/requestFriend', data)
      console.log('FriendingService: Friend request response:', response.data)
      return { data: response.data }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string }, status?: number } }
      console.error('FriendingService: Friend request error:', {
        status: err.response?.status,
        data: err.response?.data,
        error
      })
      return { error: err.response?.data?.error || 'Failed to request friend' }
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
  static async getIncomingRequests(data: GetIncomingRequestsRequest): Promise<ApiResponse<GetIncomingRequestsResponse>> {
    try {
      console.log('FriendingService: Fetching incoming requests for:', data)
      // Query endpoints use GET with query parameters
      const response = await apiClient.get('/api/Friending/_getIncomingRequests', { params: data })
      console.log('FriendingService: Incoming requests response:', response.data)
      return { data: response.data }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } }
      console.error('FriendingService: Error fetching incoming requests:', err.response?.data)
      return { error: err.response?.data?.error || 'Failed to get incoming requests' }
    }
  }

  /**
   * Get outgoing friend requests
   */
  static async getOutgoingRequests(data: GetOutgoingRequestsRequest): Promise<ApiResponse<GetOutgoingRequestsResponse>> {
    try {
      console.log('FriendingService: Fetching outgoing requests for:', data)
      // Query endpoints use GET with query parameters
      const response = await apiClient.get('/api/Friending/_getOutgoingRequests', { params: data })
      console.log('FriendingService: Outgoing requests response:', response.data)
      return { data: response.data }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } }
      console.error('FriendingService: Error fetching outgoing requests:', err.response?.data)
      return { error: err.response?.data?.error || 'Failed to get outgoing requests' }
    }
  }

  /**
   * Get friends list
   */
  static async getFriends(data: GetFriendsRequest): Promise<ApiResponse<GetFriendsResponse>> {
    try {
      console.log('FriendingService: Fetching friends for:', data)
      // Query endpoints use GET with query parameters
      const response = await apiClient.get('/api/Friending/_getFriends', { params: data })
      console.log('FriendingService: Friends response:', response.data)
      return { data: response.data }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } }
      console.error('FriendingService: Error fetching friends:', err.response?.data)
      return { error: err.response?.data?.error || 'Failed to get friends' }
    }
  }
}
