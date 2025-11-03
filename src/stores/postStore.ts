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
    // If already loading, just return - don't start a new request
    if (loading.value) {
      console.log('Already loading posts, skipping duplicate request')
      return
    }

    const auth = useAuthStore()
    const user = auth.user
    const sessionId = auth.sessionId

    if (!user || !sessionId) {
      error.value = 'User not authenticated or session invalid'
      posts.value = []
      return
    }

    loading.value = true
    error.value = null

    try {
      console.log('Loading posts for user:', user._id)
      console.log('Using session ID:', sessionId)

      // Call getPosts through the Requesting system with the session ID
      // The backend GetPostsRequest sync will use the session to get the user
      // and then fetch posts for that user
      const response = await PostingService.getPosts({ session: sessionId })

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

      console.log('postStore: Received posts data:', postsData)
      console.log('postStore: Number of posts received:', postsData.length)
      console.log('postStore: Current posts.value before update:', posts.value)
      console.log('postStore: Current posts.value length before update:', posts.value.length)

      // Update the posts array with the validated data
      posts.value = postsData

      console.log('postStore: Updated posts.value after assignment:', posts.value)
      console.log('postStore: posts.value length after update:', posts.value.length)
      console.log('Posts loaded successfully:', posts.value.length, 'posts')
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
  const createPost = async (postData: Omit<CreatePostRequest, 'session'>) => {
    const auth = useAuthStore()
    const sessionId = auth.sessionId

    if (!sessionId) {
      error.value = 'User not authenticated'
      throw new Error('User not authenticated')
    }

    loading.value = true
    error.value = null

    try {
      const fullPostData: CreatePostRequest = {
        ...postData,
        session: sessionId
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

      // Reset loading before reloading to avoid the duplicate request check
      loading.value = false

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
      loading.value = false
      throw err
    }
  }

  // Delete a post via API
  const deletePost = async (postId: string) => {
    const auth = useAuthStore()
    const sessionId = auth.sessionId

    if (!sessionId) {
      throw new Error('User not authenticated')
    }

    loading.value = true
    error.value = null

    try {
      const response = await PostingService.deletePost({ session: sessionId, post: postId })
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
    const sessionId = auth.sessionId

    if (!sessionId) {
      throw new Error('User not authenticated')
    }

    try {
      const response = await PostingService.editTitle({
        session: sessionId,
        post: postId,
        title,
      })
      if (response.error) {
        throw new Error(response.error)
      }

      // Update local state
      const postIndex = posts.value.findIndex((p) => p._id === postId)
      if (postIndex !== -1) {
        posts.value[postIndex] = { ...posts.value[postIndex], title }
      }
    } catch (err) {
      console.error('Error editing post title:', err)
      throw err
    }
  }  // Edit post place
  const editPostPlace = async (
    postId: string,
    city: string,
    region: string,
    country: string,
  ) => {
    const auth = useAuthStore()
    const sessionId = auth.sessionId

    if (!sessionId) {
      throw new Error('User not authenticated')
    }

    try {
      const response = await PostingService.editPlace({
        session: sessionId,
        post: postId,
        city,
        region,
        country,
      })
      if (response.error) {
        throw new Error(response.error)
      }

      // Update local state
      const postIndex = posts.value.findIndex((p) => p._id === postId)
      if (postIndex !== -1) {
        posts.value[postIndex] = {
          ...posts.value[postIndex],
          city,
          region,
          country,
        }
      }
    } catch (err) {
      console.error('Error editing post place:', err)
      throw err
    }
  }

  // Edit post dates
  const editPostDates = async (postId: string, start: string, end: string) => {
    const auth = useAuthStore()
    const sessionId = auth.sessionId

    if (!sessionId) {
      throw new Error('User not authenticated')
    }

    try {
      const response = await PostingService.editDates({
        session: sessionId,
        post: postId,
        start,
        end,
      })
      if (response.error) {
        throw new Error(response.error)
      }

      // Update local state
      const postIndex = posts.value.findIndex((p) => p._id === postId)
      if (postIndex !== -1) {
        posts.value[postIndex] = { ...posts.value[postIndex], start, end }
      }
    } catch (err) {
      console.error('Error editing post dates:', err)
      throw err
    }
  }  // Edit post description
  const editPostDescription = async (postId: string, description: string) => {
    const auth = useAuthStore()
    const sessionId = auth.sessionId

    if (!sessionId) {
      throw new Error('User not authenticated')
    }

    try {
      const response = await PostingService.editDescription({
        session: sessionId,
        post: postId,
        description
      })
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
