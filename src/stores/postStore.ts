import { defineStore } from 'pinia'
import { ref } from 'vue'
import { PostingService } from '@/services/postingService'
import type { Post } from '@/types/api'
import type { CreatePostRequest } from '@/types/api'
import { useAuthStore } from '@/stores/auth'

export const usePostStore = defineStore('posts', () => {
  // Store state
  const posts = ref<Post[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  // Load posts from API
  const loadPosts = async () => {
    const auth = useAuthStore()
    const user = auth.user

    if (!user) {
      error.value = 'User not authenticated'
      posts.value = []
      return
    }

    loading.value = true
    error.value = null

    try {
      console.log('Loading posts for user:', user._id)
      const response = await PostingService.getPosts({ user: user._id })

      // Log the response for debugging
      console.log('Posts response:', response)

      if (response.error) {
        throw new Error(response.error)
      }

      if (!response.data) {
        throw new Error('No data received from server')
      }

      // Ensure we have a posts array, even if empty
      const postsData = response.data.posts || []
      if (!Array.isArray(postsData)) {
        console.error('Invalid posts data:', response.data)
        throw new Error('Invalid posts data received from server')
      }

      // Update the posts array with the validated data
      posts.value = postsData
      console.log('Posts loaded successfully:', posts.value.length, 'posts:', postsData)
    } catch (err) {
      // Clear the posts array on error
      posts.value = []
      if (err instanceof Error) {
        error.value = `Failed to load posts: ${err.message}`
      } else {
        error.value = 'Failed to load posts'
      }
      console.error('Error loading posts:', err)
    } finally {
      loading.value = false
    }
  }

  // Create a new post via API
  const createPost = async (postData: Omit<CreatePostRequest, 'creator'>) => {
    const auth = useAuthStore()
    const user = auth.user

    if (!user) {
      error.value = 'User not authenticated'
      throw new Error('User not authenticated')
    }

    loading.value = true
    error.value = null

    try {
      const fullPostData: CreatePostRequest = {
        ...postData,
        creator: user._id
      }

      console.log('Creating post:', fullPostData)
      const response = await PostingService.createPost(fullPostData)
      console.log('Create post response:', response)

      if (response.error) {
        error.value = response.error
        throw new Error(response.error)
      }

      if (!response.data) {
        error.value = 'Failed to create post: No data received'
        throw new Error('No data received from server')
      }

      // Only try to reload posts if creation was successful
      console.log('Post created successfully, reloading posts...')
      await loadPosts() // This will refresh the entire posts list
      console.log('Posts reloaded after creation')
      return response.data
    } catch (err) {
      if (err instanceof Error) {
        error.value = `Failed to create post: ${err.message}`
      } else {
        error.value = 'Failed to create post: Unknown error'
      }
      console.error('Error creating post:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete a post via API
  const deletePost = async (postId: string) => {
    const auth = useAuthStore()
    const user = auth.user

    if (!user) {
      throw new Error('User not authenticated')
    }

    loading.value = true
    error.value = null

    try {
      const response = await PostingService.deletePost({ user: user._id, post: postId })
      if (response.error) {
        throw new Error(response.error)
      }

      // Remove from local state
      posts.value = posts.value.filter((post: Post) => post._id !== postId)
    } catch (err) {
      error.value = 'Failed to delete post'
      console.error('Error deleting post:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get post by ID
  const getPost = (postId: string) => {
    return posts.value.find((post: Post) => post._id === postId)
  }

  // Edit post title
  const editPostTitle = async (postId: string, title: string) => {
    const auth = useAuthStore()
    const user = auth.user

    if (!user) {
      throw new Error('User not authenticated')
    }

    try {
      const response = await PostingService.editTitle({ user: user._id, post: postId, title })
      if (response.error) {
        throw new Error(response.error)
      }

      // Update local state
      const postIndex = posts.value.findIndex(p => p._id === postId)
      if (postIndex !== -1) {
        posts.value[postIndex] = { ...posts.value[postIndex], title }
      }
    } catch (err) {
      console.error('Error editing post title:', err)
      throw err
    }
  }

  // Edit post place
  const editPostPlace = async (postId: string, city: string, region: string, country: string) => {
    const auth = useAuthStore()
    const user = auth.user

    if (!user) {
      throw new Error('User not authenticated')
    }

    try {
      const response = await PostingService.editPlace({ user: user._id, post: postId, city, region, country })
      if (response.error) {
        throw new Error(response.error)
      }

      // Update local state
      const postIndex = posts.value.findIndex(p => p._id === postId)
      if (postIndex !== -1) {
        posts.value[postIndex] = { ...posts.value[postIndex], city, region, country }
      }
    } catch (err) {
      console.error('Error editing post place:', err)
      throw err
    }
  }

  // Edit post dates
  const editPostDates = async (postId: string, start: string, end: string) => {
    const auth = useAuthStore()
    const user = auth.user

    if (!user) {
      throw new Error('User not authenticated')
    }

    try {
      const response = await PostingService.editDates({ user: user._id, post: postId, start, end })
      if (response.error) {
        throw new Error(response.error)
      }

      // Update local state
      const postIndex = posts.value.findIndex(p => p._id === postId)
      if (postIndex !== -1) {
        posts.value[postIndex] = { ...posts.value[postIndex], start, end }
      }
    } catch (err) {
      console.error('Error editing post dates:', err)
      throw err
    }
  }

  // Edit post description
  const editPostDescription = async (postId: string, description: string) => {
    const auth = useAuthStore()
    const user = auth.user

    if (!user) {
      throw new Error('User not authenticated')
    }

    try {
      const response = await PostingService.editDescription({ user: user._id, post: postId, description })
      if (response.error) {
        throw new Error(response.error)
      }

      // Update local state
      const postIndex = posts.value.findIndex(p => p._id === postId)
      if (postIndex !== -1) {
        posts.value[postIndex] = { ...posts.value[postIndex], description }
      }
    } catch (err) {
      console.error('Error editing post description:', err)
      throw err
    }
  }

  return {
    posts,
    loading,
    error,
    loadPosts,
    createPost,
    deletePost,
    getPost,
    editPostTitle,
    editPostPlace,
    editPostDates,
    editPostDescription
  }
});
