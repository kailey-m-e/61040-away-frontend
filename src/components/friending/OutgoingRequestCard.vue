<template>
  <div class="outgoing-card">
    <div class="outgoing-card__content">
      <div class="outgoing-card__info">
        <h3 class="outgoing-card__username">{{ username }}</h3>
        <p class="outgoing-card__label">Request pending</p>
      </div>

      <button
        @click="handleCancel"
        class="outgoing-card__button"
        :disabled="loading"
      >
        <span v-if="loading" class="loading-spinner-small"></span>
        <span v-else>Cancel</span>
      </button>
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
const loading = ref(false)

const handleCancel = async () => {
  loading.value = true
  try {
    await friendingStore.cancelFriendRequest(props.username)
  } catch (error) {
    console.error('Error canceling friend request:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.outgoing-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.outgoing-card__content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.outgoing-card__info {
  flex: 1;
}

.outgoing-card__username {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
}

.outgoing-card__label {
  font-size: 0.875rem;
  color: #f59e0b;
  margin: 0;
  font-weight: 500;
}

.outgoing-card__button {
  background: transparent;
  color: #6b7280;
  border: 1px solid #d1d5db;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.outgoing-card__button:hover:not(:disabled) {
  border-color: #dc2626;
  color: #dc2626;
}

.outgoing-card__button:disabled {
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
