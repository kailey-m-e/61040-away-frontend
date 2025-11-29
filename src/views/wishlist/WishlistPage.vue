<template>
  <div class="wishlist-page">
    <div class="wishlist-page__container">
      <!-- Add Place Form -->
      <div class="wishlist-page__form">
        <WishlistPlaceForm @added="loadPlaces" />
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="my-posts-page__loading">
          <div class="loading-spinner"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="wishlist-page__error">
        <p>{{ error }}</p>
        <button @click="loadPlaces" class="wishlist-page__retry">
          Try Again
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="!places.length" class="wishlist-page__empty">
          <svg class="empty-state__icon" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        <h3 class="wishlist-page__empty-title">No wishlist yet...</h3>
        <p class="wishlist-page__empty-text">
          Where do you want to go next?
        </p>
      </div>

      <!-- Places Grid -->
      <div v-else class="wishlist-page__grid">
        <WishlistPlaceCard
          v-for="place in places"
          :key="place._id"
          :place="place"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useWishlistStore } from '@/stores/wishlistStore'
import WishlistPlaceForm from '@/components/wishlist/WishlistPlaceForm.vue'
import WishlistPlaceCard from '@/components/wishlist/WishlistPlaceCard.vue'

// Import dependencies first
import { storeToRefs } from 'pinia'
import { computed, watch } from 'vue'

const wishlistStore = useWishlistStore()

// Set up reactive state
const store = storeToRefs(wishlistStore)
const loading = computed(() => store.loading.value)
const error = computed(() => store.error.value)

// Sort places alphabetically by city name
const places = computed(() => {
  return [...store.places.value].sort((a, b) => {
    return a.city.localeCompare(b.city)
  })
})

// Define functions
const loadPlaces = async () => {
  console.log('WishlistPage: Loading places...')
  try {
    await wishlistStore.fetchPlaces()
    console.log('WishlistPage: Places loaded, current places:', places.value)
  } catch (err) {
    console.error('WishlistPage: Error loading places:', err)
  }
}

// Watch for changes in the places array
watch(places, (newPlaces) => {
  console.log('WishlistPage: Places updated:', newPlaces)
}, { deep: true })

onMounted(() => {
  console.log('WishlistPage: Component mounted, loading places...')
  loadPlaces()
})
</script>

<style scoped>
.wishlist-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 2rem;
}

.wishlist-page__container {
  max-width: 1200px;
  margin: 0 auto;
  margin-top: 2rem;
}

.wishlist-page__form {
  margin-bottom: 2rem;
}

.wishlist-page__loading,
.wishlist-page__error,
.wishlist-page__empty {
  padding: 4rem 2rem;
  margin-top: 3rem;
  text-align: center;
}

.wishlist-page__loading {
  color: #6b7280;
}

.wishlist-page__error {
  color: #dc2626;
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

.wishlist-page__retry {
  background: #dc2626;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 1rem;
}

.wishlist-page__retry:hover {
  background: #b91c1c;
}

.empty-state__icon {
  width: 64px;
  height: 64px;
  color: #d1d5db;
  margin: 0 auto 1rem;
}


.wishlist-page__empty-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 0.5rem 0;
}

.wishlist-page__empty-text {
  color: #6b7280;
  margin: 0;
}

.wishlist-page__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .wishlist-page {
    padding: 1rem;
  }

  .wishlist-page__title {
    font-size: 2rem;
  }

  .wishlist-page__grid {
    grid-template-columns: 1fr;
  }
}
</style>
