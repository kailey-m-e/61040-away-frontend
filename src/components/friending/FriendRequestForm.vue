<template>
  <form @submit.prevent="handleSubmit" class="friend-request-form">
    <div class="friend-request-form__content">
      <div class="friend-request-form__field">
        <label for="username" class="friend-request-form__label">Username</label>
        <input
          id="username"
          v-model="username"
          type="text"
          class="friend-request-form__input"
          placeholder="Enter username"
          required
        />
      </div>

      <button
        type="submit"
        class="friend-request-form__button"
        :disabled="loading || !username.trim()"
      >
        <span v-if="loading" class="loading-spinner-small"></span>
        {{ loading ? 'Sending...' : 'Send Request' }}
      </button>
    </div>

    <div v-if="error" class="friend-request-form__error">
      {{ error }}
    </div>

    <div v-if="success" class="friend-request-form__success">
      Friend request sent successfully!
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useFriendingStore } from '@/stores/friendingStore'
import { useAuthStore } from '@/stores/auth'

const friendingStore = useFriendingStore()
const authStore = useAuthStore()

const username = ref('')
const loading = ref(false)
const error = ref('')
const success = ref(false)

const handleSubmit = async () => {
  if (!username.value.trim()) {
    return
  }

  // Check if user is trying to friend themselves
  if (authStore.user && username.value.trim().toLowerCase() === authStore.user.username.toLowerCase()) {
    error.value = 'You cannot send a friend request to yourself'
    return
  }

  loading.value = true
  error.value = ''
  success.value = false

  try {
    await friendingStore.sendFriendRequest(username.value.trim())
    success.value = true
    username.value = ''

    // Clear success message after 3 seconds
    setTimeout(() => {
      success.value = false
    }, 3000)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to send friend request'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.friend-request-form {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.friend-request-form__content {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
}

.friend-request-form__field {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.friend-request-form__label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.friend-request-form__input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: all 0.2s;
}

.friend-request-form__input:focus {
  outline: none;
  border-color: #ff6b6b;
  box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1);
}

.friend-request-form__button {
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.friend-request-form__button:hover:not(:disabled) {
  background: #ff5252;
}

.friend-request-form__button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.friend-request-form__error {
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 1rem;
}

.friend-request-form__success {
  color: #10b981;
  font-size: 0.875rem;
  margin-top: 1rem;
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

@media (max-width: 768px) {
  .friend-request-form__content {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
