<template>
  <div class="login-page">
    <div class="login-page__left">
      <img src="@/assets/awayLogo.png" alt="Away Logo" class="login-page__logo" />
    </div>
    <div class="login-page__right">
      <div class="login-page__container">
        <h1 class="login-page__title">Login</h1>
        <form @submit.prevent="handleSubmit" class="login-form">
        <div class="form-group">
          <label for="username">Username</label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            placeholder="Enter your username"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            placeholder="Enter your password"
            required
          />
        </div>

        <div v-if="authStore.error" class="error-message">
          {{ authStore.error }}
        </div>

        <button type="submit" :disabled="authStore.isLoading">
          {{ authStore.isLoading ? 'Signing in...' : 'Sign In' }}
        </button>

        <p class="login-page__register-link">
          Don't have an account?
          <router-link to="/register">Sign up</router-link>
        </p>
      </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  username: '',
  password: ''
})

const handleSubmit = async () => {
  if (!form.username || !form.password) {
    return
  }
  try {
    await authStore.login({
      username: form.username,
      password: form.password
    })

    // Redirect to postcards page on successful login
    router.push('/postcards')
  } catch (error) {
    // Error is handled by the auth store
    console.error('Login failed:', error)
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  flex-direction: row;
}

.login-page__left {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  padding: 2rem;
}

.login-page__logo {
  display: block;
  max-width: 400px;
  height: auto;
}

.login-page__right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  padding: 2rem;
}

.login-page__container {
  width: 100%;
  max-width: 450px;
  padding: 0;
}

@media (max-width: 768px) {
  .login-page {
    flex-direction: column;
  }

  .login-page__left {
    min-height: 30vh;
  }

  .login-page__logo {
    max-width: 250px;
  }

  .login-page__right {
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

input {
  width: 100%;
  box-sizing: border-box;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: border-color 0.2s;
}

input:focus {
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

.login-page__title {
  margin-bottom: 2rem;
}

.login-page__register-link {
  text-align: center;
  font-size: 0.875rem;
  color: #6b7280;
}

.login-page__register-link a {
  color: #ff6b6b;
  text-decoration: none;
  font-weight: 500;
}

.login-page__register-link a:hover {
  text-decoration: underline;
}
</style>
