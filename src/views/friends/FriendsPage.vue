<template>
  <div class="friends-page">
    <div class="friends-page__container">
      <!-- Badge and Form Row (Centered) -->
      <div class="friends-page__header-section">
        <div v-if="friends.length" class="friends-page__count-badge">
          <div class="count-badge__number">{{ friends.length }}</div>
          <div class="count-badge__label">Friends</div>
        </div>
        <div class="friends-page__form-wrapper">
          <FriendRequestForm />
        </div>
      </div>

      <!-- Requests Row -->
      <div class="friends-page__requests-section">
        <!-- Friend Requests - Side by Side -->
        <div class="friends-page__requests">
          <!-- Incoming Requests -->
          <div class="friends-page__requests-column" data-dropdown="incoming">
            <button
              type="button"
              @click.stop.prevent="toggleIncoming"
              class="friends-page__dropdown-header"
              :class="{ 'friends-page__dropdown-header--open': isIncomingOpen }"
            >
              <span class="friends-page__dropdown-title">
                <svg class="friends-page__arrow-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <polyline points="19 12 12 19 5 12"></polyline>
                </svg>
                <span v-if="incomingRequests.length" class="friends-page__badge">
                  {{ incomingRequests.length }}
                </span>
              </span>
              <span class="friends-page__dropdown-icon">
                {{ isIncomingOpen ? '▼' : '▶' }}
              </span>
            </button>

            <div v-if="isIncomingOpen" class="friends-page__dropdown-content" key="incoming-content">
              <div v-if="loading && !incomingRequests.length" class="friends-page__loading">
                <div class="loading-spinner"></div>
                <p>Loading requests...</p>
              </div>

              <div v-else-if="!incomingRequests.length" class="friends-page__empty">
                <p>No incoming friend requests</p>
              </div>

              <div v-else class="friends-page__request-list">
                <div
                  v-for="username in incomingRequests"
                  :key="username"
                  class="friends-page__request-item"
                >
                  <span class="friends-page__request-username">{{ username }}</span>
                  <div class="friends-page__request-actions">
                    <button
                      @click="handleAccept(username)"
                      class="friends-page__request-button friends-page__request-button--accept"
                      :disabled="loadingRequest === username"
                    >
                      <span v-if="loadingRequest === username && requestAction === 'accept'" class="loading-spinner-small"></span>
                      <span v-else>Accept</span>
                    </button>
                    <button
                      @click="handleReject(username)"
                      class="friends-page__request-button friends-page__request-button--reject"
                      :disabled="loadingRequest === username"
                    >
                      <span v-if="loadingRequest === username && requestAction === 'reject'" class="loading-spinner-small"></span>
                      <span v-else>Deny</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Outgoing Requests -->
          <div class="friends-page__requests-column" data-dropdown="outgoing">
            <button
              type="button"
              @click.stop.prevent="toggleOutgoing"
              class="friends-page__dropdown-header"
              :class="{ 'friends-page__dropdown-header--open': isOutgoingOpen }"
            >
              <span class="friends-page__dropdown-title">

                <svg class="friends-page__arrow-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="19" x2="12" y2="5"></line>
                  <polyline points="5 12 12 5 19 12"></polyline>
                </svg>
                <span v-if="outgoingRequests.length" class="friends-page__badge">
                  {{ outgoingRequests.length }}
                </span>
              </span>
              <span class="friends-page__dropdown-icon">
                {{ isOutgoingOpen ? '▼' : '▶' }}
              </span>
            </button>

            <div v-if="isOutgoingOpen" class="friends-page__dropdown-content" key="outgoing-content">
              <div v-if="!outgoingRequests.length" class="friends-page__empty">
                <p>No outgoing friend requests</p>
              </div>

              <div v-else class="friends-page__request-list">
                <div
                  v-for="username in outgoingRequests"
                  :key="username"
                  class="friends-page__request-item"
                >
                  <span class="friends-page__request-username">{{ username }}</span>
                  <div class="friends-page__request-actions">
                    <button
                      @click="handleCancel(username)"
                      class="friends-page__request-button friends-page__request-button--cancel"
                      :disabled="loadingRequest === username"
                    >
                      <span v-if="loadingRequest === username && requestAction === 'cancel'" class="loading-spinner-small"></span>
                      <span v-else>Cancel</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Friends List -->
      <div class="friends-page__section">
        <div v-if="!friends.length" class="friends-page__empty">
          <p>You don't have any friends yet</p>
        </div>

        <div v-else class="friends-page__friends-grid">
          <button
            v-for="username in friends"
            :key="username"
            @click="navigateToFriend(username)"
            class="friends-page__friend-avatar"
            :title="`View ${username}'s profile`"
          >
            <div class="friends-page__friend-avatar-circle">
              <span class="friends-page__friend-avatar-initial">
                {{ username.charAt(0).toUpperCase() }}
              </span>
            </div>
            <span class="friends-page__friend-name">{{ username }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useFriendingStore } from '@/stores/friendingStore'
import FriendRequestForm from '@/components/friending/FriendRequestForm.vue'

const router = useRouter()
const friendingStore = useFriendingStore()
const { incomingRequests, friends, outgoingRequests, loading } = storeToRefs(friendingStore)

// Dropdown states
const isIncomingOpen = ref(false)
const isOutgoingOpen = ref(false)

// Request loading states
const loadingRequest = ref<string | null>(null)
const requestAction = ref<'accept' | 'reject' | 'cancel' | null>(null)

const toggleIncoming = () => {
  isIncomingOpen.value = !isIncomingOpen.value
}

const toggleOutgoing = () => {
  isOutgoingOpen.value = !isOutgoingOpen.value
}

const handleAccept = async (username: string) => {
  loadingRequest.value = username
  requestAction.value = 'accept'
  try {
    await friendingStore.acceptFriendRequest(username)
  } catch (error) {
    console.error('Error accepting friend request:', error)
  } finally {
    loadingRequest.value = null
    requestAction.value = null
  }
}

const handleReject = async (username: string) => {
  loadingRequest.value = username
  requestAction.value = 'reject'
  try {
    await friendingStore.rejectFriendRequest(username)
  } catch (error) {
    console.error('Error rejecting friend request:', error)
  } finally {
    loadingRequest.value = null
    requestAction.value = null
  }
}

const handleCancel = async (username: string) => {
  loadingRequest.value = username
  requestAction.value = 'cancel'
  try {
    await friendingStore.cancelFriendRequest(username)
  } catch (error) {
    console.error('Error canceling friend request:', error)
  } finally {
    loadingRequest.value = null
    requestAction.value = null
  }
}

const navigateToFriend = (username: string) => {
  router.push(`/friends/${username}`)
}

onMounted(() => {
  // Clear previous user's data before fetching new data
  friendingStore.clearState()
  // Fetch all friend-related data
  friendingStore.fetchAllFriendData()
})
</script>

<style scoped>
.friends-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 2rem;
}

.friends-page__container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Header Section: Badge and Form (Centered) */
.friends-page__header-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
}

.friends-page__count-badge {
  background: white;
  padding: 0.75rem 1.25rem;
  border-radius: 0.75rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-width: 80px;
  flex-shrink: 0;
}

.count-badge__number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ff6b6b;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.count-badge__label {
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.friends-page__form-wrapper {
  flex-shrink: 0;
}

/* Requests Section */
.friends-page__requests-section {
  margin-bottom: 2rem;
}

/* Friend Requests Side-by-Side Container */
.friends-page__requests {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.friends-page__section {
  margin-bottom: 2rem;
}

.friends-page__badge {
  background: #ff6b6b;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  min-width: 1.5rem;
  text-align: center;
}

.friends-page__loading,
.friends-page__empty {
  background: white;
  border-radius: 0.75rem;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.friends-page__loading {
  color: #6b7280;
}

.friends-page__empty {
  color: #9ca3af;
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

.friends-page__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

/* Friends Avatar Grid */
.friends-page__friends-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1.5rem;
  padding: 1rem 0;
}

.friends-page__friend-avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.75rem;
  transition: all 0.2s;
}

.friends-page__friend-avatar:hover {
  background: #f9fafb;
  transform: translateY(-2px);
}

.friends-page__friend-avatar-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee9027 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.friends-page__friend-avatar:hover .friends-page__friend-avatar-circle {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transform: scale(1.05);
}

.friends-page__friend-avatar-initial {
  font-size: 2rem;
  font-weight: 700;
  color: white;
}

.friends-page__friend-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1f2937;
  text-align: center;
  word-break: break-word;
}

.friends-page__requests-column {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  height: fit-content; /* Only take up space needed */
}

/* Dropdown Header */
.friends-page__dropdown-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  background: white;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
  text-align: left;
}

.friends-page__dropdown-header:hover {
  background: #f9fafb;
}

.friends-page__dropdown-header--open {
  border-bottom: 1px solid #e5e7eb;
}

.friends-page__dropdown-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.friends-page__arrow-icon {
  flex-shrink: 0;
  color: #ff6b6b;
}

.friends-page__dropdown-icon {
  font-size: 0.875rem;
  color: #6b7280;
  transition: transform 0.2s;
}

/* Dropdown Content */
.friends-page__dropdown-content {
  padding: 1rem;
}

/* Request List */
.friends-page__request-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.friends-page__request-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.friends-page__request-username {
  font-size: 1rem;
  font-weight: 500;
  color: #1f2937;
}

.friends-page__request-actions {
  display: flex;
  gap: 0.5rem;
}

.friends-page__request-button {
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
  min-width: 70px;
  justify-content: center;
}

.friends-page__request-button--accept {
  background: #10b981;
  color: white;
}

.friends-page__request-button--accept:hover:not(:disabled) {
  background: #059669;
}

.friends-page__request-button--reject {
  background: transparent;
  color: #dc2626;
  border: 1px solid #dc2626;
}

.friends-page__request-button--reject:hover:not(:disabled) {
  background: #dc2626;
  color: white;
}

.friends-page__request-button--cancel {
  background: #6b7280;
  color: white;
}

.friends-page__request-button--cancel:hover:not(:disabled) {
  background: #4b5563;
}

.friends-page__request-button:disabled {
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

@media (max-width: 768px) {
  .friends-page {
    padding: 1rem;
  }

  .friends-page__header-section {
    flex-direction: column;
    align-items: stretch;
  }

  .friends-page__requests {
    grid-template-columns: 1fr;
  }

  .friends-page__grid {
    grid-template-columns: 1fr;
  }

  .friends-page__friends-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 1rem;
  }

  .friends-page__friend-avatar-circle {
    width: 60px;
    height: 60px;
  }

  .friends-page__friend-avatar-initial {
    font-size: 1.5rem;
  }
}
</style>
