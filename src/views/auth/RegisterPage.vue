<template>
  <div class="register-page">
    <div class="register-page__left">
      <img src="@/assets/awayLogo.png" alt="Away Logo" class="register-page__logo" />
    </div>
    <div class="register-page__right">
      <div class="register-page__container">
        <h1 class="register-page__title">Sign Up</h1>

        <form @submit.prevent="handleSubmit" class="register-form">
        <div class="form-group">
          <label for="username">Username</label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            placeholder="Choose a username"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            placeholder="Create a password"
            required
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            placeholder="Confirm your password"
            required
          />
        </div>

        <div v-if="authStore.error" class="error-message">
          {{ authStore.error }}
        </div>

        <button type="submit" :disabled="authStore.isLoading || !isFormValid">
          {{ authStore.isLoading ? 'Creating account...' : 'Create Account' }}
        </button>

        <p class="register-page__login-link">
          Already have an account?
          <router-link to="/login">Login</router-link>
        </p>
      </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  username: '',
  password: '',
  confirmPassword: '',
})

const isFormValid = computed(() => {
  return form.username.trim() !== '' &&
         form.password.trim() !== '' &&
         form.confirmPassword.trim() !== '' &&
         form.password === form.confirmPassword
})

const handleSubmit = async () => {
  if (!isFormValid.value) {
    return
  }
  try {
    await authStore.register({
      username: form.username,
      password: form.password
    })

    // Redirect to posts page on successful registration
    router.push('/posts/my')
  } catch (error) {
    // Error is handled by the auth store
    console.error('Registration failed:', error)
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  flex-direction: row;
}

.register-page__left {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  padding: 2rem;
}

.register-page__logo {
  display: block;
  width: 100%;
  max-width: 400px;
  height: auto;
}

.register-page__right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  padding: 2rem;
}

.register-page__container {
  width: 100%;
  max-width: 450px;
  padding: 0;
}

@media (max-width: 768px) {
  .register-page {
    flex-direction: column;
  }

  .register-page__left {
    min-height: 30vh;
  }

  .register-page__logo {
    max-width: 250px;
  }

  .register-page__right {
    flex: 1;
  }
}

h1 {
  text-align: center;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

p {
  text-align: center;
  color: #6b7280;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  box-sizing: border-box;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: border-color 0.2s;
}

input[type="text"]:focus,
input[type="password"]:focus {
  outline: none;
  border-color: #ff6b6b;
  box-shadow: 0 0 0 1px #ff6b6b;
}

button {
  width: 100%;
  background-color: #ff6b6b;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-bottom: 1rem;
}

button:hover:not(:disabled) {
  background-color: #ff5252;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.register-page__title {
  margin-bottom: 2rem;
}

.register-page__login-link {
  text-align: center;
  font-size: 0.875rem;
  color: #6b7280;
}

.register-page__login-link a {
  color: #ff6b6b;
  text-decoration: none;
  font-weight: 500;
}

.register-page__login-link a:hover {
  text-decoration: underline;
}
</style>
