<template>
  <div class="place-card" :class="{ 'place-card--removing': removing }">
    <div class="place-card__content">
      <div class="place-card__location">
        <svg class="place-card__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
        <h3 class="place-card__text">{{ place.city }}, {{ place.region }}, {{ place.country }}</h3>
      </div>

      <button
        @click="handleRemove"
        class="place-card__remove"
        :disabled="removing"
      >
        <span v-if="removing" class="loading-spinner-small"></span>
        <span v-else>X</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { WishlistPlace } from '@/types/api'
import { useWishlistStore } from '@/stores/wishlistStore'

const props = defineProps<{
  place: WishlistPlace
}>()

const wishlistStore = useWishlistStore()
const removing = ref(false)

const handleRemove = async () => {
  if (!props.place._id) return

  removing.value = true
  try {
    await wishlistStore.removePlace(props.place._id)
  } catch (error) {
    console.error('Error removing place:', error)
  } finally {
    removing.value = false
  }
}
</script>

<style scoped>
.place-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: opacity 0.2s;
}

.place-card--removing {
  opacity: 0.6;
}

.place-card__content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.place-card__location {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.place-card__icon {
  flex-shrink: 0;
  color: #e19e8e;
}

.place-card__text {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.place-card__remove {
  background: transparent;
  color: #dc2626;
  border: 1px solid #dc2626;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.place-card__remove:hover:not(:disabled) {
  background: #dc2626;
  color: white;
}

.place-card__remove:disabled {
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

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
