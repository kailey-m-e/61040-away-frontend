<template>
  <div class="post-detail-page">
    <div class="post-detail-page__container">
      <div class="post-detail-page__header">
        <button @click="goBack" class="post-detail-page__back-button">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="post-detail-page__loading">
        <div class="loading-spinner"></div>
        <p>Loading post...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="post-detail-page__error">
        <svg class="error-icon" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <p>{{ error }}</p>
        <button @click="goBack" class="error-button">Go Back</button>
      </div>

      <!-- Post Content -->
      <div v-else-if="post" class="post-detail-page__content">
        <article class="post-detail">
          <!-- Post Header -->
          <div class="post-detail__header">
            <h1 class="post-detail__title">{{ post.title }}</h1>
            <div class="post-detail__meta">
              <div class="post-detail__location">
                <svg class="icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                </svg>
                <span>{{ formatLocation(post) }}</span>
              </div>
              <div v-if="post.start && post.end" class="post-detail__dates">
                <svg class="icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                </svg>
                <span>{{ formatDateRange(post.start, post.end) }}</span>
              </div>
            </div>
          </div>

          <!-- Post Description -->
          <div v-if="post.description" class="post-detail__description">
            <h2 class="post-detail__section-title">Description</h2>
            <p class="post-detail__text">{{ post.description }}</p>
          </div>

          <!-- Actions (if user owns the post) -->
          <div v-if="isOwner" class="post-detail__actions">
            <button @click="handleEdit" class="post-detail__action-button post-detail__action-button--edit">
              <svg class="icon" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit
            </button>
            <button @click="handleDelete" class="post-detail__action-button post-detail__action-button--delete">
              <svg class="icon" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              Delete
            </button>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePostStore } from '@/stores/postStore'
import { useAuthStore } from '@/stores/auth'
import type { Post } from '@/types/api'

const route = useRoute()
const router = useRouter()
const postStore = usePostStore()
const authStore = useAuthStore()

const post = ref<Post | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const postId = computed(() => route.params.id as string)
const isOwner = computed(() => {
  return post.value && authStore.user && post.value.creator === authStore.user._id
})

const formatLocation = (post: Post) => {
  const parts = [post.city, post.region, post.country].filter(Boolean)
  return parts.join(', ')
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatDateRange = (start: string, end: string) => {
  const startDate = formatDate(start)
  const endDate = formatDate(end)
  return `${startDate} - ${endDate}`
}

const goBack = () => {
  router.back()
}

const handleEdit = () => {
  router.push(`/posts/${postId.value}/edit`)
}

const handleDelete = async () => {
  if (!post.value) return

  if (confirm(`Are you sure you want to delete "${post.value.title}"?`)) {
    try {
      await postStore.deletePost(postId.value)
      router.push('/posts/my')
    } catch (err) {
      alert('Failed to delete post. Please try again.')
    }
  }
}

const loadPost = async () => {
  loading.value = true
  error.value = null

  try {
    // First, try to get the post from the store
    let foundPost = postStore.getPost(postId.value)

    // If not found in store, load all posts and try again
    if (!foundPost) {
      await postStore.loadPosts()
      foundPost = postStore.getPost(postId.value)
    }

    if (!foundPost) {
      error.value = 'Post not found'
    } else {
      post.value = foundPost
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load post'
    console.error('Error loading post:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadPost()
})
</script>

<style scoped>
.post-detail-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 2rem;
}

.post-detail-page__container {
  max-width: 800px;
  margin: 0 auto;
}

.post-detail-page__header {
  margin-bottom: 2rem;
}

.post-detail-page__back-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  color: #6b7280;
  border: 1px solid #e5e7eb;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.post-detail-page__back-button:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

.post-detail-page__back-button svg {
  width: 1.25rem;
  height: 1.25rem;
}

.post-detail-page__loading,
.post-detail-page__error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.post-detail-page__loading {
  color: #6b7280;
}

.post-detail-page__error {
  color: #dc2626;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #ff6b6b;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.error-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 1rem;
}

.error-button {
  margin-top: 1rem;
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.error-button:hover {
  background: #ff5252;
}

.post-detail {
  background: white;
  border-radius: 0.75rem;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.post-detail__header {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #f3f4f6;
}

.post-detail__title {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 1rem 0;
  line-height: 1.2;
}

.post-detail__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.post-detail__location,
.post-detail__dates {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 1rem;
  font-weight: 500;
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

.post-detail__description {
  margin-bottom: 2rem;
}

.post-detail__section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 1rem 0;
}

.post-detail__text {
  font-size: 1rem;
  line-height: 1.6;
  color: #374151;
  margin: 0;
  white-space: pre-wrap;
}

.post-detail__actions {
  display: flex;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 2px solid #f3f4f6;
}

.post-detail__action-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.post-detail__action-button--edit {
  background: transparent;
  color: #ff6b6b;
  border: 1px solid #ff6b6b;
}

.post-detail__action-button--edit:hover {
  background: #ff5252;
  color: white;
}

.post-detail__action-button--delete {
  background: transparent;
  color: #dc2626;
  border: 1px solid #dc2626;
}

.post-detail__action-button--delete:hover {
  background: #dc2626;
  color: white;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .post-detail-page {
    padding: 1rem;
  }

  .post-detail {
    padding: 1.5rem;
  }

  .post-detail__title {
    font-size: 1.5rem;
  }

  .post-detail__meta {
    flex-direction: column;
    gap: 0.75rem;
  }

  .post-detail__actions {
    flex-direction: column;
  }

  .post-detail__action-button {
    width: 100%;
    justify-content: center;
  }
}
</style>
