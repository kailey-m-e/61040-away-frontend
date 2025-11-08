<template>
  <form @submit.prevent class="friend-request-form">
    <div class="friend-request-form__content">
      <div class="friend-request-form__field">
        <!-- Input wrapper for tag display -->
        <div class="friend-request-form__input-wrapper">
          <!-- Selected user tag -->
          <div v-if="selectedUser" class="friend-request-form__tag">
            <span class="friend-request-form__tag-text">{{ selectedUser }}</span>
            <button
              type="button"
              class="friend-request-form__tag-remove"
              @click="clearSelection"
              aria-label="Remove selection"
            >
              ×
            </button>
          </div>

          <!-- Input field -->
          <input
            v-if="!selectedUser"
            id="username"
            v-model="username"
            type="text"
            class="friend-request-form__input"
            placeholder="Username"
            @input="handleInput"
            @blur="handleBlur"
            @keydown.enter.prevent
            autocomplete="off"
          />

          <!-- Hidden input when tag is shown, handles backspace -->
          <input
            v-else
            type="text"
            class="friend-request-form__input friend-request-form__input--hidden"
            @keydown.delete="clearSelection"
            @keydown.backspace="clearSelection"
            @focus="() => {}"
            ref="hiddenInput"
          />
        </div>

        <!-- Autocomplete dropdown -->
        <div v-if="showDropdown && filteredUsernames.length > 0" class="friend-request-form__dropdown">
          <div
            v-for="user in filteredUsernames"
            :key="user"
            class="friend-request-form__dropdown-item"
            @mousedown.prevent="selectUsername(user)"
          >
            {{ user }}
          </div>
        </div>
      </div>

      <button
        type="button"
        class="friend-request-form__button"
        :disabled="loading || !selectedUser"
        @click="handleSubmit"
      >
        <span v-if="loading" class="loading-spinner-small"></span>
        {{ loading ? 'Sending...' : 'Request' }}
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
import { ref, computed, onMounted, nextTick } from 'vue'
import { useFriendingStore } from '@/stores/friendingStore'
import { useAuthStore } from '@/stores/auth'
import { UserAuthenticationService } from '@/services/userAuthenticationService'

const friendingStore = useFriendingStore()
const authStore = useAuthStore()

const username = ref('')
const selectedUser = ref('')
const loading = ref(false)
const error = ref('')
const success = ref(false)
const showDropdown = ref(false)
const allUsernames = ref<string[]>([])
const hiddenInput = ref<HTMLInputElement | null>(null)

// Fetch all usernames on component mount
onMounted(async () => {
  console.log('FriendRequestForm: Fetching usernames...')
  const result = await UserAuthenticationService.getUsernames()
  console.log('FriendRequestForm: getUsernames result:', result)
  if (result.data) {
    allUsernames.value = result.data.usernames
    console.log('FriendRequestForm: Loaded usernames:', allUsernames.value)
  } else if (result.error) {
    console.error('FriendRequestForm: Error fetching usernames:', result.error)
  }
})

// Filter usernames based on input
const filteredUsernames = computed(() => {
  const searchTerm = username.value.toLowerCase().trim()
  const currentUser = authStore.user?.username.toLowerCase()

  console.log('FriendRequestForm: Computing filtered usernames')
  console.log('  - Search term:', searchTerm)
  console.log('  - Current user:', currentUser)
  console.log('  - All usernames:', allUsernames.value)

  // Only show dropdown if user has typed something
  if (!searchTerm) {
    return []
  }

  const filtered = allUsernames.value
    .filter(u => {
      const userLower = u.toLowerCase()
      // Must match search term and not be current user
      return userLower.includes(searchTerm) && userLower !== currentUser
    })
    .slice(0, 5) // Limit to 5 suggestions

  console.log('FriendRequestForm: Filtered usernames:', filtered)
  return filtered
})

const handleInput = () => {
  // Only show dropdown if user has typed something
  showDropdown.value = username.value.trim().length > 0
  error.value = ''
}

const handleBlur = () => {
  // Delay to allow click on dropdown item
  setTimeout(() => {
    showDropdown.value = false
  }, 200)
}

const selectUsername = async (user: string) => {
  selectedUser.value = user
  username.value = ''
  showDropdown.value = false
  error.value = '' // Clear any previous errors when selecting

  // Focus the hidden input after selection
  await nextTick()
  if (hiddenInput.value) {
    hiddenInput.value.focus()
  }
}

const clearSelection = () => {
  selectedUser.value = ''
  error.value = ''
  // Don't need to refocus, the visible input will appear
}

const handleSubmit = async () => {
  const enteredUsername = selectedUser.value.trim()

  if (!enteredUsername) {
    error.value = 'Please select a username from the list'
    return
  }

  // Check if user is trying to friend themselves
  if (authStore.user && enteredUsername.toLowerCase() === authStore.user.username.toLowerCase()) {
    error.value = 'You cannot send a friend request to yourself'
    return
  }

  // Check if already friends
  if (friendingStore.friends.some(f => f.toLowerCase() === enteredUsername.toLowerCase())) {
    error.value = `You are already friends with ${enteredUsername}`
    return
  }

  // Check if already sent a request
  if (friendingStore.outgoingRequests.some(r => r.toLowerCase() === enteredUsername.toLowerCase())) {
    error.value = `You have already sent a friend request to ${enteredUsername}`
    return
  }

  // Check if they already sent you a request
  if (friendingStore.incomingRequests.some(r => r.toLowerCase() === enteredUsername.toLowerCase())) {
    error.value = `${enteredUsername} has already sent you a friend request. Please accept it instead.`
    return
  }

  loading.value = true
  error.value = ''
  success.value = false

  try {
    await friendingStore.sendFriendRequest(enteredUsername)
    success.value = true
    selectedUser.value = ''
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
  padding: 0.7rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.friend-request-form__content {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
  width: 100%;
}

.friend-request-form__field {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  position: relative;
  width: 200px;
}

.friend-request-form__label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.friend-request-form__input-wrapper {
  position: relative;
  width: 100%;
  height: 35px;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  background: white;
  display: flex;
  align-items: center;
  padding: 0.5rem;
}

.friend-request-form__input-wrapper:focus-within {
  border-color: #ff6b6b;
  box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1);
}

.friend-request-form__tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.5rem 0.5rem 0.75rem;
  background-color: white;
  color: #374151;
  border-radius: 0.25rem;
  font-size: 0.95rem;
  font-weight: 500;
  border: 1px solid #d1d5db;
  position: relative;
  z-index: 1;
  pointer-events: auto;
  max-width: 100%;
  overflow: hidden;
}

.friend-request-form__tag-text {
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.friend-request-form__tag-remove {
  background: none;
  border: none;
  color: #6b7280;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.125rem;
  transition: all 0.15s;
  margin-left: 0.25rem;
}

.friend-request-form__tag-remove:hover {
  background-color: #d1d5db;
  color: #374151;
}

.friend-request-form__tag-remove:active {
  background-color: #9ca3af;
}

.friend-request-form__input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 1rem;
  padding: 0;
  background: transparent;
  margin-left: 0.5rem;
}

.friend-request-form__input--hidden {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: default;
  pointer-events: none;
}

.friend-request-form__dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 0.25rem;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
}

.friend-request-form__dropdown-item {
  padding: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.friend-request-form__dropdown-item:hover {
  background-color: #f3f4f6;
}

.friend-request-form__dropdown-item:first-child {
  border-top-left-radius: 0.375rem;
  border-top-right-radius: 0.375rem;
}

.friend-request-form__dropdown-item:last-child {
  border-bottom-left-radius: 0.375rem;
  border-bottom-right-radius: 0.375rem;
}

.friend-request-form__button {
  background: #ff6b6b;
  color: white;
  border: none;
  height: 54px;
  min-width: 120px;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  white-space: nowrap;
  margin-left: 0.5rem;
  flex-shrink: 0;
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
  color: #374151;
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
