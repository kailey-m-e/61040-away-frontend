<template>
  <div class="auth-guard">
    <LoadingSpinner
      v-if="isChecking"
      size="large"
      text="Checking authentication..."
    />

    <div v-else-if="!isAuthenticated" class="auth-guard__unauthorized">
      <div class="auth-guard__content">
        <h2 class="auth-guard__title">Authentication Required</h2>
        <p class="auth-guard__message">
          You need to be logged in to access this page.
        </p>
        <div class="auth-guard__actions">
          <AuthButton @click="goToLogin" variant="primary">
            Sign In
          </AuthButton>
          <AuthButton @click="goToRegister" variant="outline">
            Create Account
          </AuthButton>
        </div>
      </div>
    </div>

    <slot v-else />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import AuthButton from '@/components/ui/AuthButton.vue'

interface Props {
  fallback?: string
  redirectTo?: string
}

const props = withDefaults(defineProps<Props>(), {
  redirectTo: '/login',
})

const router = useRouter()
const authStore = useAuthStore()

const isChecking = ref(true)

const isAuthenticated = computed(() => authStore.isAuthenticated)

onMounted(async () => {
  // Initialize auth state if not already done
  if (!authStore.user) {
    authStore.initializeAuth()
  }

  // Small delay to ensure smooth UX
  setTimeout(() => {
    isChecking.value = false
  }, 500)
})

const goToLogin = () => {
  router.push('/login')
}

const goToRegister = () => {
  router.push('/register')
}
</script>

<style scoped>
.auth-guard {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-guard__unauthorized {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  text-align: center;
}

.auth-guard__content {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

.auth-guard__title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 1rem 0;
}

.auth-guard__message {
  font-size: 1rem;
  color: #6b7280;
  margin: 0 0 2rem 0;
}

.auth-guard__actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.auth-guard__actions .auth-button {
  min-width: 120px;
}
</style>
