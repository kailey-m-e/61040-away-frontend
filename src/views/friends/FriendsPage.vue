<template>
  <div class="friends-page">
    <div class="friends-page__container">
      <div class="friends-page__header">
        <h1 class="friends-page__title">Friends</h1>
        <p class="friends-page__subtitle">Manage your friendships</p>
      </div>

      <!-- Friends List -->
      <div class="friends-page__section">
        <h2 class="friends-page__section-title">
          My Friends
          <span v-if="friends.length" class="friends-page__badge">
            {{ friends.length }}
          </span>
        </h2>

        <div v-if="!friends.length" class="friends-page__empty">
          <p>You don't have any friends yet</p>
        </div>

        <div v-else class="friends-page__grid">
          <FriendCard
            v-for="username in friends"
            :key="username"
            :username="username"
          />
        </div>
      </div>

      <!-- Send Friend Request -->
      <div class="friends-page__section">
        <h2 class="friends-page__section-title">Send Friend Request</h2>
        <FriendRequestForm />
      </div>

      <!-- Incoming Requests -->
      <div class="friends-page__section">
        <h2 class="friends-page__section-title">
          Incoming Requests
          <span v-if="incomingRequests.length" class="friends-page__badge">
            {{ incomingRequests.length }}
          </span>
        </h2>

        <div v-if="loading && !incomingRequests.length" class="friends-page__loading">
          <div class="loading-spinner"></div>
          <p>Loading requests...</p>
        </div>

        <div v-else-if="!incomingRequests.length" class="friends-page__empty">
          <p>No incoming friend requests</p>
        </div>

        <div v-else class="friends-page__grid">
          <IncomingRequestCard
            v-for="username in incomingRequests"
            :key="username"
            :username="username"
          />
        </div>
      </div>

      <!-- Outgoing Requests -->
      <div class="friends-page__section">
        <h2 class="friends-page__section-title">
          Outgoing Requests
          <span v-if="outgoingRequests.length" class="friends-page__badge">
            {{ outgoingRequests.length }}
          </span>
        </h2>

        <div v-if="!outgoingRequests.length" class="friends-page__empty">
          <p>No outgoing friend requests</p>
        </div>

        <div v-else class="friends-page__grid">
          <OutgoingRequestCard
            v-for="username in outgoingRequests"
            :key="username"
            :username="username"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useFriendingStore } from '@/stores/friendingStore'
import FriendRequestForm from '@/components/friending/FriendRequestForm.vue'
import IncomingRequestCard from '@/components/friending/IncomingRequestCard.vue'
import OutgoingRequestCard from '@/components/friending/OutgoingRequestCard.vue'
import FriendCard from '@/components/friending/FriendCard.vue'

const friendingStore = useFriendingStore()
const { incomingRequests, friends, outgoingRequests, loading } = storeToRefs(friendingStore)

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

.friends-page__header {
  text-align: center;
  margin-bottom: 2rem;
}

.friends-page__title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.friends-page__subtitle {
  font-size: 1.125rem;
  color: #6b7280;
  margin: 0;
}

.friends-page__section {
  margin-bottom: 2rem;
}

.friends-page__section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
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

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .friends-page {
    padding: 1rem;
  }

  .friends-page__title {
    font-size: 2rem;
  }

  .friends-page__grid {
    grid-template-columns: 1fr;
  }
}
</style>
