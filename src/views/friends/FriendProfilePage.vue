<template>
  <div class="friend-profile-page">
    <div class="friend-profile-page__container">
      <!-- Header -->
      <div class="friend-profile-page__header">
        <button @click="goBack" class="friend-profile-page__back-button">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Friends
        </button>
        <h1 class="friend-profile-page__title">{{ friendUsername }}'s Profile</h1>
        <p class="friend-profile-page__subtitle">View their travel stories and wishlist</p>
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
              @click="handlePostSelected(post)"
            >
              <div class="post-card__header">
                <h3 class="post-card__title">{{ post.title }}</h3>
              </div>
              <div class="post-card__location">
                {{ post.city }}, {{ post.region }}, {{ post.country }}
              </div>
              <div class="post-card__dates">
                {{ post.start ? formatDate(post.start) : 'N/A' }} - {{ post.end ? formatDate(post.end) : 'N/A' }}
              </div>
              <p class="post-card__description">{{ post.description }}</p>
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
import type { Post } from '@/types'
import type { WishlistPlace } from '@/types/api'

const route = useRoute()
const router = useRouter()

const friendUsername = computed(() => route.params.username as string)
const posts = ref<Post[]>([])
const wishlistPlaces = ref<WishlistPlace[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

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

const loadData = async () => {
  loading.value = true
  error.value = null

  try {
    // Load posts and wishlist in parallel
    const [postsResult, wishlistResult] = await Promise.all([
      PostingService.getPosts({ user: friendUsername.value }),
      WishlistService.getPlaces({ user: friendUsername.value })
    ])

    // Handle posts
    if (postsResult.error) {
      throw new Error(postsResult.error)
    }
    posts.value = postsResult.data?.posts || []

    // Handle wishlist
    if (wishlistResult.error) {
      console.warn('Error loading wishlist:', wishlistResult.error)
      wishlistPlaces.value = []
    } else {
      // Handle both object and array responses
      let places: WishlistPlace[] = []
      if (Array.isArray(wishlistResult.data)) {
        places = wishlistResult.data
      } else if (wishlistResult.data && 'places' in wishlistResult.data) {
        places = wishlistResult.data.places || []
      }

      // Filter out any invalid entries (missing city, region, or country)
      wishlistPlaces.value = places.filter(place =>
        place && place.city && place.region && place.country
      )
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load profile'
    console.error('Error loading friend profile:', err)
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
  text-align: center;
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
  margin-bottom: 1rem;
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
  color: #1f2937;
  margin: 0 0 0.5rem 0;
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
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
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

.post-card__location,
.post-card__dates {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.post-card__description {
  color: #374151;
  line-height: 1.4;
  margin: 0;
  font-size: 0.875rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
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

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .friend-profile-page {
    padding: 1rem;
  }

  .friend-profile-page__title {
    font-size: 2rem;
  }

  .friend-profile-page__posts {
    grid-template-columns: 1fr;
  }

  .friend-profile-page__wishlist {
    grid-template-columns: 1fr;
  }
}
</style>
