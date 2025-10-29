<template>
  <div class="my-posts-page">
    <div class="my-posts-page__container">
      <div class="my-posts-page__header">
        <h1 class="my-posts-page__title">Postcards</h1>

        <div class="my-posts-page__header-stats">
          <div class="my-posts-page__stat-badge">
            {{ posts.length }} Posts
          </div>
          <div class="my-posts-page__stat-badge">
            {{ uniqueCountries }} Countries
          </div>
          <div class="my-posts-page__stat-badge">
            {{ uniqueStates }} States
          </div>
        </div>

        <div class="my-posts-page__actions">
          <button
            @click="handleCreatePost"
            class="my-posts-page__create-button"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            Create
          </button>
        </div>
      </div>

      <div class="my-posts-page__content">
        <div v-if="error" class="my-posts-page__error">
          <svg class="error-icon" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          <p>{{ error }}</p>
          <button @click="loadPosts" class="error-retry-button">Try Again</button>
        </div>

        <div v-else-if="loading" class="my-posts-page__loading">
          <div class="loading-spinner"></div>
          <p>Loading your posts...</p>
        </div>

        <div v-else-if="posts.length === 0" class="my-posts-page__empty">
          <div class="empty-state">
            <svg class="empty-state__icon" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
            </svg>
            <h3 class="empty-state__title">No posts yet</h3>
            <p class="empty-state__description">
              You haven't created any posts yet.
            </p>
            <button @click="handleCreatePost" class="empty-state__button">
              Create your first post
            </button>
          </div>
        </div>

        <div v-else class="my-posts-page__posts">
          <div
            v-for="post in posts"
            :key="post._id"
            class="post-card"
            @click="handlePostSelected(post)"
          >
            <div class="post-card__header">
              <h3 class="post-card__title">{{ post.title }}</h3>
              <div class="post-card__actions">
                <button @click.stop="handleEditPost(post)" class="post-card__action" title="Edit postcard">
                  <svg class="icon" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
                <button @click.stop="handleDeletePost(post)" class="post-card__action post-card__action--danger" title="Delete postcard">
                  <svg class="icon" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            <div class="post-card__location">
              <svg class="icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
              </svg>
              {{ post.city }}, {{ post.region }}, {{ post.country }}
            </div>
            <div class="post-card__dates">
              <svg class="icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
              </svg>
              {{ post.start ? formatDate(post.start) : 'N/A' }} - {{ post.end ? formatDate(post.end) : 'N/A' }}
            </div>
            <p class="post-card__description">{{ post.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usePostStore } from '@/stores/postStore'
import type { Post } from '@/types'

const router = useRouter()
const route = useRoute()
const postStore = usePostStore()

// Use posts and loading from store
  const posts = computed(() => postStore.posts)
  const loading = computed(() => postStore.loading)
  const error = computed(() => postStore.error)

  const uniqueCountries = computed(() => {
    const countries = new Set(posts.value.map(post => post.country))
    return countries.size
})

  const uniqueStates = computed(() => {
    const states = new Set(posts.value.map(post => post.region))
    return states.size
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const loadPosts = async () => {
  await postStore.loadPosts()
}

const handleCreatePost = () => {
  router.push('/posts/create')
}

const handlePostSelected = (post: Post) => {
  router.push(`/posts/${post._id}`)
}

const handleEditPost = (post: Post) => {
  router.push(`/posts/${post._id}/edit`)
}

const handleDeletePost = async (post: Post) => {
  if (confirm(`Are you sure you want to delete "${post.title}"?`)) {
    try {
      await postStore.deletePost(post._id)
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Failed to delete post. Please try again.')
    }
  }
}

onMounted(async () => {
  await loadPosts()
})

// Reload posts when navigating back to this route
watch(() => route.path, async (newPath) => {
  if (newPath === '/postcards' || newPath === '/posts/my') {
    await loadPosts()
  }
})
</script>

<style scoped>
.my-posts-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 2rem;
}

.my-posts-page__container {
  max-width: 1200px;
  margin: 0 auto;
}

.my-posts-page__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
}

.my-posts-page__title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #374151;
  margin: 0;
  flex-shrink: 0;
}

.my-posts-page__header-stats {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.my-posts-page__stat-inline {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.my-posts-page__stat-badge {
  background: white;
  font-size: 1.25rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  min-width: 1.5rem;
  text-align: center;
  color: #ff6b6b;
  box-shadow: 0 2px 3px -1px rgba(0, 0, 0, 0.1);
}

.my-posts-page__actions {
  flex-shrink: 0;
}

.my-posts-page__create-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #ff6b6b;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.my-posts-page__create-button svg {
  height: 2rem;
}

.my-posts-page__create-button:hover {
  background-color: #ff5252;
}

.my-posts-page__loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  color: #6b7280;
}

.my-posts-page__error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  color: #dc2626;
  text-align: center;
}

.my-posts-page__error .error-icon {
  width: 40px;
  height: 40px;
  margin-bottom: 1rem;
}

.my-posts-page__error p {
  margin: 0 0 1rem 0;
  font-weight: 500;
}

.my-posts-page__error .error-retry-button {
  background-color: #dc2626;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.my-posts-page__error .error-retry-button:hover {
  background-color: #b91c1c;
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

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-state__icon {
  width: 64px;
  height: 64px;
  color: #d1d5db;
  margin: 0 auto 1rem;
}

.empty-state__title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 0.5rem 0;
}

.empty-state__description {
  color: #6b7280;
  margin: 0 0 2rem 0;
}

.empty-state__button {
  background-color: #ff6b6b;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.empty-state__button:hover {
  background-color: #ff5252;
}

.my-posts-page__posts {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.post-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.post-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px -3px rgba(0, 0, 0, 0.1);
}

.post-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.post-card__title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  flex: 1;
  line-height: 1.3;
}

.post-card__actions {
  display: flex;
  gap: 0.2rem;
  flex-shrink: 0;
}

.post-card__action {
  padding: 0.5rem 0.5rem;
  background: white;
  color: #374151;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.2rem;
  border: none;
}

.post-card__action svg {
  color: #ff6b6b;
}

.post-card__action:hover {
  background: #f9fafb;
}

.post-card__action--danger {
  color: #dc2626;
  border-color: #fecaca;
}

.post-card__action--danger svg {
  color: #dc2626;
}

.post-card__action--danger:hover {
  background: #fef2f2;
}

.post-card__location,
.post-card__dates {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.post-card__description {
  color: black;
  line-height: 1.4;
  margin: 0;
  font-size: 0.875rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
  margin-bottom: -0.2rem;
  color: #e19e8e;
}

@media (max-width: 768px) {
  .my-posts-page {
    padding: 1rem;
  }

  .my-posts-page__header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .my-posts-page__title {
    font-size: 2rem;
    width: 100%;
  }

  .my-posts-page__header-stats {
    width: 100%;
    justify-content: space-between;
    gap: 1rem;
  }

  .my-posts-page__stat-inline-number {
    font-size: 1.25rem;
  }

  .my-posts-page__stat-inline-label {
    font-size: 0.875rem;
  }

  .my-posts-page__stat-badge {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }

  .my-posts-page__actions {
    width: 100%;
  }

  .my-posts-page__create-button {
    width: 100%;
    justify-content: center;
  }

  .my-posts-page__posts {
    grid-template-columns: 1fr;
  }

  .post-card__header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .post-card__actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
