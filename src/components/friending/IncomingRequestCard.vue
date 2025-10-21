<template>
  <div class="request-card">
    <div class="request-card__content">
      <div class="request-card__info">
        <h3 class="request-card__username">{{ username }}</h3>
        <p class="request-card__label">wants to be your friend</p>
      </div>

      <div class="request-card__actions">
        <button
          @click="handleAccept"
          class="request-card__button request-card__button--accept"
          :disabled="loading"
        >
          <span v-if="loading === 'accept'" class="loading-spinner-small"></span>
          <span v-else>Accept</span>
        </button>

        <button
          @click="handleReject"
          class="request-card__button request-card__button--reject"
          :disabled="loading"
        >
          <span v-if="loading === 'reject'" class="loading-spinner-small"></span>
          <span v-else>Reject</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useFriendingStore } from '@/stores/friendingStore'

const props = defineProps<{
  username: string
}>()

const friendingStore = useFriendingStore()
const loading = ref<'accept' | 'reject' | false>(false)

const handleAccept = async () => {
  loading.value = 'accept'
  try {
    await friendingStore.acceptFriendRequest(props.username)
  } catch (error) {
    console.error('Error accepting friend request:', error)
  } finally {
    loading.value = false
  }
}

const handleReject = async () => {
  loading.value = 'reject'
  try {
    await friendingStore.rejectFriendRequest(props.username)
  } catch (error) {
    console.error('Error rejecting friend request:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.request-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.request-card__content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.request-card__info {
  flex: 1;
}

.request-card__username {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
}

.request-card__label {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.request-card__actions {
  display: flex;
  gap: 0.5rem;
}

.request-card__button {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
}

.request-card__button--accept {
  background: #10b981;
  color: white;
}

.request-card__button--accept:hover:not(:disabled) {
  background: #059669;
}

.request-card__button--reject {
  background: transparent;
  color: #dc2626;
  border: 1px solid #dc2626;
}

.request-card__button--reject:hover:not(:disabled) {
  background: #dc2626;
  color: white;
}

.request-card__button:disabled {
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
