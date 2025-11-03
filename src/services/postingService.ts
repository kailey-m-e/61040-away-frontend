import apiClient from './apiClient'
import type {
  Post,
  CreatePostRequest,
  CreatePostResponse,
  EditPostRequest,
  EditPostResponse,
  DeletePostRequest,
  GetPostsRequest,
  GetPostsResponse,
  ApiResponse,
} from '@/types/api'

export class PostingService {
  /**
   * Create a new post
   */
  static async createPost(data: CreatePostRequest): Promise<ApiResponse<CreatePostResponse>> {
    try {
      const response = await apiClient.post('/api/Posting/create', data)
      return { data: response.data }
    } catch (error: any) {
      return { error: error.response?.data?.error || 'Failed to create post' }
    }
  }

  /**
   * Edit a post's title
   */
  static async editTitle(data: EditPostRequest): Promise<ApiResponse<EditPostResponse>> {
    try {
      const response = await apiClient.post('/api/Posting/editTitle', data)
      return { data: response.data }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } }; message?: string }
      return { error: err.response?.data?.error || err.message || 'Failed to edit title' }
    }
  }

  /**
   * Edit a post's place (city, region, country)
   */
  static async editPlace(data: EditPostRequest): Promise<ApiResponse<EditPostResponse>> {
    try {
      const response = await apiClient.post('/api/Posting/editPlace', data)
      return { data: response.data }
    } catch (error: any) {
      return { error: error.response?.data?.error || 'Failed to edit place' }
    }
  }

  /**
   * Edit a post's dates
   */
  static async editDates(data: EditPostRequest): Promise<ApiResponse<EditPostResponse>> {
    try {
      const response = await apiClient.post('/api/Posting/editDates', data)
      return { data: response.data }
    } catch (error: any) {
      return { error: error.response?.data?.error || 'Failed to edit dates' }
    }
  }

  /**
   * Edit a post's description
   */
  static async editDescription(data: EditPostRequest): Promise<ApiResponse<EditPostResponse>> {
    try {
      const response = await apiClient.post('/api/Posting/editDescription', data)
      return { data: response.data }
    } catch (error: any) {
      return { error: error.response?.data?.error || 'Failed to edit description' }
    }
  }

  /**
   * Delete a post
   */
  static async deletePost(data: DeletePostRequest): Promise<ApiResponse<{}>> {
    try {
      const response = await apiClient.post('/api/Posting/delete', data)
      return { data: response.data }
    } catch (error: any) {
      return { error: error.response?.data?.error || 'Failed to delete post' }
    }
  }

  /**
   * Get all posts for a user
   * Calls through the Requesting system to trigger GetPostsRequest sync
   * If friend parameter is provided, triggers GetFriendPostsRequest sync instead
   * @param data - Object with session and optional friend parameter
   */
  static async getPosts(data: GetPostsRequest): Promise<ApiResponse<GetPostsResponse>> {
    try {
      // Call the Posting/_getPosts endpoint directly with session in the body
      // Only include friendUsername parameter if it's provided (not null/undefined)
      const requestBody: { session: string; friendUsername?: string } = {
        session: data.session
      }

      // Only add friendUsername to request body if it's a truthy value
      if (data.friend) {
        requestBody.friendUsername = data.friend
        console.log('PostingService: Fetching FRIEND posts for:', data.friend)
      } else {
        console.log('PostingService: Fetching OWN posts (no friend parameter)')
        // Do NOT include friendUsername property at all for own posts
      }

      console.log('PostingService: Request body:', JSON.stringify(requestBody))
      const response = await apiClient.post('/api/Posting/_getPosts', requestBody)
      console.log('PostingService: Raw API response:', response)
      console.log('PostingService: Response status:', response.status)
      console.log('PostingService: Response data:', JSON.stringify(response.data, null, 2))

      // Ensure we have valid response data
      if (!response.data) {
        throw new Error('No data in response')
      }

      // The backend returns response data with results array
      const responseData = response.data
      console.log('PostingService: Processed response data:', responseData)

      // Handle the response structure from the sync
      let posts: Post[] = []

      if (responseData.results && Array.isArray(responseData.results)) {
        // Backend sync returns results as array of { post: ID, postData: {...} }
        // Extract the postData from each object
        posts = responseData.results.map((item: { post?: string; postData?: Post } & Partial<Post>) => {
          // If item has postData, use it; otherwise treat the whole item as a post
          if (item.postData) {
            return item.postData
          }
          // Fallback: if the item itself looks like a post (has expected fields)
          return item as Post
        }).filter((p: Post | null | undefined): p is Post => p !== null && p !== undefined)
      } else if (Array.isArray(responseData)) {
        // Fallback: response is directly an array
        posts = responseData
      } else {
        posts = []
      }

      console.log('PostingService: Final posts array:', posts)
      console.log('PostingService: Number of posts:', posts.length)

      // Debug: log the structure of the first post if available
      if (posts.length > 0) {
        console.log('PostingService: First post structure:', posts[0])
        console.log('PostingService: First post _id:', posts[0]._id)
        console.log('PostingService: First post creator:', posts[0].creator)
      }

      return { data: { posts } }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string }; status?: number }; message?: string }
      console.error('PostingService: Error in getPosts:', err)
      console.error('PostingService: Error response status:', err.response?.status)
      console.error('PostingService: Error response data:', err.response?.data)
      console.error('PostingService: Error message:', err.message)
      return { error: err.response?.data?.error || err.message || 'Failed to get posts' }
    }
  }
}
