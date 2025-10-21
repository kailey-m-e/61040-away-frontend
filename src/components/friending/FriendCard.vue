<template>
  <div class="friend-card">
    <div class="friend-card__content">
      <div class="friend-card__info" @click="handleViewProfile">
        <h3 class="friend-card__username">{{ username }}</h3>
        <p class="friend-card__view-hint">Click to view profile</p>
      </div>

      <button
        @click="handleRemove"
        class="friend-card__button"
        :disabled="loading"
      >
        <span v-if="loading" class="loading-spinner-small"></span>
        <span v-else>Remove</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useFriendingStore } from '@/stores/friendingStore'

const props = defineProps<{
  username: string
}>()

const router = useRouter()
const friendingStore = useFriendingStore()
const loading = ref(false)

const handleViewProfile = () => {
  router.push(`/friends/${props.username}`)
}

const handleRemove = async () => {
  if (!confirm(`Are you sure you want to remove ${props.username} from your friends?`)) {
    return
  }

  loading.value = true
  try {
    await friendingStore.removeFriend(props.username)
  } catch (error) {
    console.error('Error removing friend:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.friend-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.friend-card__content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.friend-card__info {
  flex: 1;
  cursor: pointer;
  transition: all 0.2s;
}

.friend-card__info:hover {
  transform: translateX(4px);
}

.friend-card__username {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
}

.friend-card__view-hint {
  font-size: 0.75rem;
  color: #9ca3af;
  margin: 0;
}

.friend-card__button {
  background: transparent;
  color: #dc2626;
  border: 1px solid #dc2626;
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

.friend-card__button:hover:not(:disabled) {
  background: #dc2626;
  color: white;
}

.friend-card__button:disabled {
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
