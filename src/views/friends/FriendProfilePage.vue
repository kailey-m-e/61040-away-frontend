<template>
  <div class="friend-profile-page">
    <div class="friend-profile-page__container">
      <!-- Header -->
      <div class="friend-profile-page__header">
        <button @click="goBack" class="friend-profile-page__back-button">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <h1 class="friend-profile-page__title">{{ friendUsername }}</h1>
        <button
          @click="handleRemoveFriend"
          class="friend-profile-page__remove-button"
          :disabled="removingFriend"
        >
          <span v-if="removingFriend" class="loading-spinner-small"></span>
          <span v-else>Remove Friend</span>
        </button>
      </div>

      <!-- Error State -->
      <div v-if="error" class="friend-profile-page__error">
        <p>{{ error }}</p>
        <button @click="loadData" class="friend-profile-page__retry-button">
          Retry
        </button>
      </div>

      <!-- Loading State -->
      <div v-else-if="loading" class="friend-profile-page__loading">
        <div class="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>

      <!-- Content -->
      <div v-else class="friend-profile-page__content">
        <!-- Posts Section -->
        <div class="friend-profile-page__section">
          <h2 class="friend-profile-page__section-title">
            Postcards
            <span v-if="posts.length" class="friend-profile-page__badge">
              {{ posts.length }}
            </span>
          </h2>

          <div v-if="!posts.length" class="friend-profile-page__empty">
            <p>{{ friendUsername }} hasn't shared any postcards yet</p>
          </div>

          <div v-else class="friend-profile-page__posts">
            <div
              v-for="post in posts"
              :key="post._id"
              class="post-card"
            >
              <div class="post-card__header">
                <h3 class="post-card__title">{{ post.title }}</h3>
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
              <div class="post-card__description-wrapper">
                <p class="post-card__description">{{ post.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Wishlist Section -->
        <div class="friend-profile-page__section">
          <h2 class="friend-profile-page__section-title">
            Wishlist
            <span v-if="wishlistPlaces.length" class="friend-profile-page__badge">
              {{ wishlistPlaces.length }}
            </span>
          </h2>

          <div v-if="!wishlistPlaces.length" class="friend-profile-page__empty">
            <p>{{ friendUsername }} hasn't added any places to their wishlist yet</p>
          </div>

          <div v-else class="friend-profile-page__wishlist">
            <div
              v-for="place in wishlistPlaces"
              :key="place._id"
              class="place-card"
            >
              <div class="place-card__content">
                <div class="place-card__location">
                  <h3 class="place-card__text">{{ place.city }}, {{ place.region }}, {{ place.country }}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { PostingService } from '@/services/postingService'
import { WishlistService } from '@/services/wishlistService'
import { useFriendingStore } from '@/stores/friendingStore'
import { useAuthStore } from '@/stores/auth'
import type { Post } from '@/types'
import type { WishlistPlace } from '@/types/api'

const route = useRoute()
const router = useRouter()
const friendingStore = useFriendingStore()
const authStore = useAuthStore()

const friendUsername = computed(() => route.params.username as string)
const posts = ref<Post[]>([])
const wishlistPlaces = ref<WishlistPlace[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const removingFriend = ref(false)

const goBack = () => {
  router.push('/friends')
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const handlePostSelected = (post: Post) => {
  router.push(`/posts/${post._id}`)
}

const handleRemoveFriend = async () => {
  const confirmRemove = confirm(`Are you sure you want to remove ${friendUsername.value} from your friends?`)

  if (!confirmRemove) {
    return
  }

  removingFriend.value = true

  try {
    await friendingStore.removeFriend(friendUsername.value)
    removingFriend.value = false
    await router.push('/friends')
  } catch (err) {
    removingFriend.value = false
    console.error('Error removing friend:', err)
    alert(err instanceof Error ? err.message : 'Failed to remove friend')
  }
}

const loadData = async () => {
  loading.value = true
  error.value = null

  try {
    const sessionId = authStore.sessionId
    if (!sessionId) {
      throw new Error('Not authenticated')
    }

    // Fetch friend's posts using the GetFriendPostsRequest sync
    console.log('=== FriendProfilePage: Loading data for friend ===')
    console.log('FriendProfilePage: Friend username:', friendUsername.value)
    console.log('FriendProfilePage: Session ID:', sessionId)
    console.log('FriendProfilePage: Calling PostingService.getPosts with friend parameter')

    const postsResult = await PostingService.getPosts({
      session: sessionId,
      friend: friendUsername.value // This should trigger GetFriendPostsRequest sync
    })

    console.log('FriendProfilePage: Posts result:', postsResult)

    // Handle posts
    if (postsResult.error) {
      throw new Error(postsResult.error)
    }
    posts.value = postsResult.data?.posts || []
    console.log('FriendProfilePage: Loaded friend posts:', posts.value)
    console.log('FriendProfilePage: Number of posts:', posts.value.length)

    if (posts.value.length > 0) {
      console.log('FriendProfilePage: First post creator:', posts.value[0].creator)
      console.log('FriendProfilePage: Current user ID:', authStore.user?._id)
      console.log('FriendProfilePage: Friend username we requested:', friendUsername.value)
      if (posts.value[0].creator === authStore.user?._id) {
        console.error('❌ ERROR: Showing current user\'s posts instead of friend\'s posts!')
      } else {
        console.log('✅ SUCCESS: Showing friend\'s posts (creator ID is different from current user)')
      }
    }

    // Clear wishlist since backend doesn't support viewing other users' wishlists yet
    wishlistPlaces.value = []
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load profile'
    console.error('FriendProfilePage: Error loading friend profile:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.friend-profile-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 2rem;
}

.friend-profile-page__container {
  max-width: 1200px;
  margin: 0 auto;
}

.friend-profile-page__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.friend-profile-page__back-button {
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

.friend-profile-page__back-button:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

.friend-profile-page__back-button svg {
  width: 1.25rem;
  height: 1.25rem;
}

.friend-profile-page__title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #374151;
  margin: 0;
  text-align: center;
  flex: 1;
}

.friend-profile-page__remove-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: transparent;
  color: #dc2626;
  border: 1px solid #dc2626;
  font-size: 0.875rem;
}

.friend-profile-page__remove-button:hover:not(:disabled) {
  background: #dc2626;
  color: white;
}

.friend-profile-page__remove-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.friend-profile-page__subtitle {
  font-size: 1.125rem;
  color: #6b7280;
  margin: 0;
}

.friend-profile-page__error,
.friend-profile-page__loading,
.friend-profile-page__empty {
  background: white;
  border-radius: 0.75rem;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.friend-profile-page__error {
  color: #dc2626;
}

.friend-profile-page__loading {
  color: #6b7280;
}

.friend-profile-page__empty {
  color: #9ca3af;
}

.friend-profile-page__retry-button {
  margin-top: 1rem;
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.friend-profile-page__retry-button:hover {
  background: #ff5252;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #ff6b6b;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

.friend-profile-page__content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.friend-profile-page__section {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

}

.friend-profile-page__section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.friend-profile-page__badge {
  background: #ff6b6b;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  min-width: 1.5rem;
  text-align: center;
}

.friend-profile-page__posts {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.post-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s;
  cursor: default;
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

.post-card__location,
.post-card__dates {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.post-card__description-wrapper {
  max-height: 150px;
  overflow-y: auto;
  margin-top: 0.5rem;
  padding-right: 0.5rem;
}

.post-card__description-wrapper::-webkit-scrollbar {
  width: 6px;
}

.post-card__description-wrapper::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.post-card__description-wrapper::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.post-card__description-wrapper::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.post-card__description {
  color: #374151;
  line-height: 1.4;
  margin: 0;
  font-size: 0.875rem;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.friend-profile-page__wishlist {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.place-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.place-card__content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.place-card__location {
  flex: 1;
}

.place-card__text {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
  margin-bottom: -0.2rem;
  margin-right: 0.2rem;
  color: #e19e8e;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .friend-profile-page {
    padding: 1rem;
  }

  .friend-profile-page__header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .friend-profile-page__title {
    font-size: 2rem;
    text-align: center;
  }

  .friend-profile-page__back-button,
  .friend-profile-page__remove-button {
    width: 100%;
    justify-content: center;
  }

  .friend-profile-page__posts {
    grid-template-columns: 1fr;
  }

  .friend-profile-page__wishlist {
    grid-template-columns: 1fr;
  }
}
</style>
