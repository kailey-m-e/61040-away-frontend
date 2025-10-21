// API service for posts based on the API specification
export interface Post {
  _id: string
  creator: string
  title: string
  city: string
  region: string
  country: string
  start: string
  end: string
  description: string
}

export interface CreatePostRequest {
  creator: string
  title: string
  city: string
  region: string
  country: string
  start: string
  end: string
  description: string
}

export interface CreatePostResponse {
  post: string
}

export interface GetPostsResponse {
  posts: Post[]
}

import { API_CONFIG, API_ENDPOINTS } from '@/config/api'

// API implementation connecting to backend

class PostsApi {
  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`

    const defaultHeaders = {
      'Content-Type': 'application/json',
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Network error occurred')
    }
  }

  async createPost(postData: CreatePostRequest): Promise<CreatePostResponse> {
    return this.makeRequest(API_ENDPOINTS.POSTING.CREATE, {
      method: 'POST',
      body: JSON.stringify(postData),
    })
  }

  async getPosts(userId: string): Promise<Post[]> {
    return this.makeRequest(API_ENDPOINTS.POSTING.GET_POSTS, {
      method: 'POST',
      body: JSON.stringify({ user: userId }),
    })
  }

  async deletePost(userId: string, postId: string): Promise<void> {
    return this.makeRequest(API_ENDPOINTS.POSTING.DELETE, {
      method: 'POST',
      body: JSON.stringify({ user: userId, post: postId }),
    })
  }

  async editPostTitle(userId: string, postId: string, title: string): Promise<void> {
    return this.makeRequest(API_ENDPOINTS.POSTING.EDIT_TITLE, {
      method: 'POST',
      body: JSON.stringify({ user: userId, post: postId, title }),
    })
  }

  async editPostPlace(userId: string, postId: string, city: string, region: string, country: string): Promise<void> {
    return this.makeRequest(API_ENDPOINTS.POSTING.EDIT_PLACE, {
      method: 'POST',
      body: JSON.stringify({ user: userId, post: postId, city, region, country }),
    })
  }

  async editPostDates(userId: string, postId: string, start: string, end: string): Promise<void> {
    return this.makeRequest(API_ENDPOINTS.POSTING.EDIT_DATES, {
      method: 'POST',
      body: JSON.stringify({ user: userId, post: postId, start, end }),
    })
  }

  async editPostDescription(userId: string, postId: string, description: string): Promise<void> {
    return this.makeRequest(API_ENDPOINTS.POSTING.EDIT_DESCRIPTION, {
      method: 'POST',
      body: JSON.stringify({ user: userId, post: postId, description }),
    })
  }
}

export const postsApi = new PostsApi()
