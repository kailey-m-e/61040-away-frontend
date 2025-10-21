<template>
  <div class="auth-status">
    <div v-if="isAuthenticated" class="auth-status__authenticated">
      <div class="auth-status__user-info">
        <div class="auth-status__avatar">
          {{ userInitials }}
        </div>
        <div class="auth-status__details">
          <span class="auth-status__username">{{ username }}</span>
          <span class="auth-status__label">Signed in</span>
        </div>
      </div>

      <div class="auth-status__actions">
        <button
          @click="showUserMenu = !showUserMenu"
          class="auth-status__menu-button"
          :aria-expanded="showUserMenu"
          aria-label="User menu"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414L11.414 12l3.293 3.293a1 1 0 01-1.414 1.414L10 13.414l-3.293 3.293a1 1 0 01-1.414-1.414L8.586 12 5.293 8.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>

        <div v-if="showUserMenu" class="auth-status__menu">
          <UserMenu @close="showUserMenu = false" />
        </div>
      </div>
    </div>

    <div v-else class="auth-status__unauthenticated">
      <AuthButton
        variant="outline"
        size="small"
        @click="goToLogin"
      >
        Sign In
      </AuthButton>
      <AuthButton
        variant="primary"
        size="small"
        @click="goToRegister"
      >
        Sign Up
      </AuthButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AuthButton from '@/components/ui/AuthButton.vue'
import UserMenu from './UserMenu.vue'

const router = useRouter()
const authStore = useAuthStore()

const showUserMenu = ref(false)

const isAuthenticated = computed(() => authStore.isAuthenticated)
const username = computed(() => authStore.username || '')
const userInitials = computed(() => {
  const name = username.value
  return name ? name.charAt(0).toUpperCase() : 'U'
})

const goToLogin = () => {
  router.push('/login')
}

const goToRegister = () => {
  router.push('/register')
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.auth-status__actions')) {
    showUserMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.auth-status {
  position: relative;
}

.auth-status__authenticated {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.auth-status__user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.auth-status__avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #42b883 0%, #369870 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
}

.auth-status__details {
  display: flex;
  flex-direction: column;
}

.auth-status__username {
  font-weight: 500;
  color: #1f2937;
  font-size: 0.875rem;
}

.auth-status__label {
  font-size: 0.75rem;
  color: #6b7280;
}

.auth-status__actions {
  position: relative;
}

.auth-status__menu-button {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: color 0.2s, background-color 0.2s;
}

.auth-status__menu-button:hover {
  color: #374151;
  background-color: #f3f4f6;
}

.auth-status__menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  z-index: 50;
}

.auth-status__unauthenticated {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

@media (max-width: 640px) {
  .auth-status__unauthenticated {
    flex-direction: column;
    gap: 0.75rem;
  }

  .auth-status__unauthenticated .auth-button {
    width: 100%;
    min-width: 120px;
  }
}
</style>
