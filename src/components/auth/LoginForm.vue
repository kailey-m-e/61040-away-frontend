<template>
  <form @submit.prevent="handleSubmit" class="login-form">

    <AuthError
      v-if="error"
      :error="error"
      @dismiss="clearError"
    />

    <FormField label="Username" :error="fieldErrors.username" required>
      <template #default="{ fieldId }">
        <UsernameInput
          :id="fieldId"
          v-model="form.username"
          placeholder="Enter your username"
          @blur="validateField('username')"
        />
      </template>
    </FormField>

    <FormField label="Password" :error="fieldErrors.password" required>
      <template #default="{ fieldId }">
        <PasswordInput
          :id="fieldId"
          v-model="form.password"
          placeholder="Enter your password"
          @blur="validateField('password')"
        />
      </template>
    </FormField>

    <div class="login-form__options">
      <label class="login-form__remember">
        <input
          v-model="form.rememberMe"
          type="checkbox"
          class="login-form__checkbox"
        />
        <span class="login-form__checkbox-text">Remember me</span>
      </label>

      <router-link to="/forgot-password" class="login-form__forgot">
        Forgot password?
      </router-link>
    </div>

    <AuthButton
      type="submit"
      :loading="loading"
      :disabled="!isFormValid"
      class="login-form__submit"
    >
      Sign In
    </AuthButton>

    <div class="login-form__divider">
      <span>or</span>
    </div>

    <AuthButton
      variant="outline"
      @click="$emit('switch-to-register')"
      class="login-form__register"
    >
      Create new account
    </AuthButton>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore, useAppStore } from '@/stores'
import type { LoginForm } from '@/types'
import AuthError from '@/components/ui/AuthError.vue'
import FormField from '@/components/ui/FormField.vue'
import UsernameInput from '@/components/ui/UsernameInput.vue'
import PasswordInput from '@/components/ui/PasswordInput.vue'
import AuthButton from '@/components/ui/AuthButton.vue'

interface Props {
  redirectTo?: string
}

const props = withDefaults(defineProps<Props>(), {
  redirectTo: '/dashboard',
})

const emit = defineEmits<{
  'login-success': []
  'login-error': [error: string]
  'switch-to-register': []
}>()

const router = useRouter()
const authStore = useAuthStore()
const appStore = useAppStore()

const form = reactive<LoginForm & { rememberMe: boolean }>({
  username: '',
  password: '',
  rememberMe: false,
})

const fieldErrors = reactive({
  username: '',
  password: '',
})

const loading = computed(() => authStore.isLoading)
const error = computed(() => authStore.error)

const isFormValid = computed(() => {
  return form.username.trim() !== '' &&
         form.password.trim() !== '' &&
         !Object.values(fieldErrors).some(err => err !== '')
})

const validateField = (field: keyof typeof fieldErrors) => {
  switch (field) {
    case 'username':
      fieldErrors.username = form.username.trim() === '' ? 'Username is required' : ''
      break
    case 'password':
      fieldErrors.password = form.password.trim() === '' ? 'Password is required' : ''
      break
  }
}

const validateForm = () => {
  validateField('username')
  validateField('password')
  return Object.values(fieldErrors).every(err => err === '')
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  try {
    await authStore.login({
      username: form.username.trim(),
      password: form.password,
    })

    if (authStore.isAuthenticated) {
      appStore.showSuccess('Welcome back!')
      emit('login-success')

      // Redirect to intended page or dashboard
      const redirectPath = props.redirectTo || '/dashboard'
      await router.push(redirectPath)
    }
  } catch (err: any) {
    const errorMessage = err.message || 'Login failed. Please try again.'
    emit('login-error', errorMessage)
    appStore.showError(errorMessage)
  }
}

const clearError = () => {
  authStore.clearError()
}
</script>

<style scoped>
.login-form {
  width: 100%;
}

.login-form__options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.login-form__remember {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.login-form__checkbox {
  width: 1rem;
  height: 1rem;
  accent-color: #42b883;
}

.login-form__checkbox-text {
  font-size: 0.875rem;
  color: #374151;
}

.login-form__forgot {
  font-size: 0.875rem;
  color: #42b883;
  text-decoration: none;
  transition: color 0.2s;
}

.login-form__forgot:hover {
  color: #369870;
  text-decoration: underline;
}

.login-form__submit {
  width: 100%;
  margin-bottom: 1rem;
}

.login-form__divider {
  position: relative;
  text-align: center;
  margin: 1.5rem 0;
}

.login-form__divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background-color: #e5e7eb;
}

.login-form__divider span {
  background-color: white;
  padding: 0 1rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.login-form__register {
  width: 100%;
}
</style>
