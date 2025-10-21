<template>
  <div class="dashboard">
    <div class="dashboard__header">
      <h1 class="dashboard__title">Dashboard</h1>
      <AuthStatus />
    </div>

    <div class="dashboard__content">
      <div class="dashboard__welcome">
        <h2>Welcome back, {{ username }}!</h2>
        <p>You're successfully logged in to Away.</p>
      </div>

      <div class="dashboard__actions">
        <AuthButton @click="goToPosts" variant="primary">
          View My Posts
        </AuthButton>
        <AuthButton @click="goToWishlist" variant="outline">
          My Wishlist
        </AuthButton>
        <AuthButton @click="goToFriends" variant="outline">
          Friends
        </AuthButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores'
import AuthStatus from '@/components/auth/AuthStatus.vue'
import AuthButton from '@/components/ui/AuthButton.vue'

const router = useRouter()
const authStore = useAuthStore()

const username = computed(() => authStore.username || 'User')

const goToPosts = () => {
  router.push('/posts')
}

const goToWishlist = () => {
  router.push('/wishlist')
}

const goToFriends = () => {
  router.push('/friends')
}
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background-color: #f8fafc;
  padding: 2rem;
}

.dashboard__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.dashboard__title {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.dashboard__content {
  max-width: 800px;
  margin: 0 auto;
}

.dashboard__welcome {
  text-align: center;
  margin-bottom: 3rem;
}

.dashboard__welcome h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.dashboard__welcome p {
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
}

.dashboard__actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.dashboard__actions .auth-button {
  min-width: 150px;
}

@media (max-width: 640px) {
  .dashboard {
    padding: 1rem;
  }

  .dashboard__header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .dashboard__actions {
    flex-direction: column;
    align-items: center;
  }

  .dashboard__actions .auth-button {
    width: 100%;
    max-width: 300px;
  }
}
</style>
