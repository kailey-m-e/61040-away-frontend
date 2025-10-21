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
    } catch (error: any) {
      return { error: error.response?.data?.error || 'Failed to edit title' }
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
   */
  static async getPosts(data: GetPostsRequest): Promise<ApiResponse<GetPostsResponse>> {
    try {
      // Query endpoints use GET with query parameters
      const response = await apiClient.get('/api/Posting/_getPosts', { params: data })
      console.log('Raw API response:', response) // Debug log

      // Ensure we have valid response data
      if (!response.data) {
        throw new Error('No data in response')
      }

      // The response might be nested in a data property
      const responseData = response.data.data || response.data
      console.log('Processed response data:', responseData)

      // Handle different possible response structures
      let posts
      if (Array.isArray(responseData)) {
        posts = responseData
      } else if (responseData.posts && Array.isArray(responseData.posts)) {
        posts = responseData.posts
      } else {
        posts = []
      }

      console.log('Final posts array:', posts)
      return { data: { posts } }
    } catch (error: any) {
      console.error('Error in getPosts:', error)
      return { error: error.response?.data?.error || 'Failed to get posts' }
    }
  }
}
