<template>
  <form @submit.prevent="handleSubmit" class="register-form">
    <h2 class="register-form__title">Create your account</h2>
    <p class="register-form__subtitle">Join Away to start documenting your travels</p>

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
          placeholder="Choose a username"
          :check-availability="true"
          @blur="validateField('username')"
          @availability-check="handleAvailabilityCheck"
        />
      </template>
    </FormField>

    <FormField label="Password" :error="fieldErrors.password" required>
      <template #default="{ fieldId }">
        <PasswordInput
          :id="fieldId"
          v-model="form.password"
          placeholder="Create a password"
          :show-strength="true"
          @blur="validateField('password')"
        />
      </template>
    </FormField>

    <FormField label="Confirm Password" :error="fieldErrors.confirmPassword" required>
      <template #default="{ fieldId }">
        <PasswordInput
          :id="fieldId"
          v-model="form.confirmPassword"
          placeholder="Confirm your password"
          @blur="validateField('confirmPassword')"
        />
      </template>
    </FormField>

    <div class="register-form__terms">
      <label class="register-form__terms-label">
        <input
          v-model="form.acceptTerms"
          type="checkbox"
          class="register-form__checkbox"
          required
        />
        <span class="register-form__terms-text">
          I agree to the
          <a href="/terms" target="_blank" class="register-form__link">Terms of Service</a>
          and
          <a href="/privacy" target="_blank" class="register-form__link">Privacy Policy</a>
        </span>
      </label>
      <div v-if="fieldErrors.acceptTerms" class="register-form__terms-error">
        {{ fieldErrors.acceptTerms }}
      </div>
    </div>

    <AuthButton
      type="submit"
      :loading="loading"
      :disabled="!isFormValid"
      class="register-form__submit"
    >
      Create Account
    </AuthButton>

    <div class="register-form__divider">
      <span>or</span>
    </div>

    <AuthButton
      variant="outline"
      @click="$emit('switch-to-login')"
      class="register-form__login"
    >
      Sign in to existing account
    </AuthButton>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore, useAppStore } from '@/stores'
import type { RegisterForm } from '@/types'
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
  'register-success': []
  'register-error': [error: string]
  'switch-to-login': []
}>()

const router = useRouter()
const authStore = useAuthStore()
const appStore = useAppStore()

const form = reactive<RegisterForm & { acceptTerms: boolean }>({
  username: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
})

const fieldErrors = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  acceptTerms: '',
})

const usernameAvailable = ref(false)
const loading = computed(() => authStore.isLoading)
const error = computed(() => authStore.error)

const isFormValid = computed(() => {
  return form.username.trim() !== '' &&
         form.password.trim() !== '' &&
         form.confirmPassword.trim() !== '' &&
         form.acceptTerms &&
         usernameAvailable.value &&
         !Object.values(fieldErrors).some(err => err !== '')
})

const validateField = (field: keyof typeof fieldErrors) => {
  switch (field) {
    case 'username':
      fieldErrors.username = form.username.trim() === '' ? 'Username is required' : ''
      break
    case 'password':
      fieldErrors.password = form.password.trim() === '' ? 'Password is required' :
                            form.password.length < 8 ? 'Password must be at least 8 characters' : ''
      break
    case 'confirmPassword':
      fieldErrors.confirmPassword = form.confirmPassword.trim() === '' ? 'Please confirm your password' :
                                   form.password !== form.confirmPassword ? 'Passwords do not match' : ''
      break
    case 'acceptTerms':
      fieldErrors.acceptTerms = !form.acceptTerms ? 'You must accept the terms and conditions' : ''
      break
  }
}

const validateForm = () => {
  validateField('username')
  validateField('password')
  validateField('confirmPassword')
  validateField('acceptTerms')
  return Object.values(fieldErrors).every(err => err === '')
}

const handleAvailabilityCheck = (available: boolean) => {
  usernameAvailable.value = available
  if (!available && form.username.trim() !== '') {
    fieldErrors.username = 'This username is already taken'
  } else if (available && fieldErrors.username === 'This username is already taken') {
    fieldErrors.username = ''
  }
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  if (!usernameAvailable.value) {
    fieldErrors.username = 'Please choose a different username'
    return
  }

  try {
    await authStore.register({
      username: form.username.trim(),
      password: form.password
    })

    if (authStore.isAuthenticated) {
      appStore.showSuccess('Account created successfully! Welcome to Away!')
      emit('register-success')

      // Redirect to intended page or dashboard
      const redirectPath = props.redirectTo || '/dashboard'
      await router.push(redirectPath)
    }
  } catch (err: any) {
    const errorMessage = err.message || 'Registration failed. Please try again.'
    emit('register-error', errorMessage)
    appStore.showError(errorMessage)
  }
}

const clearError = () => {
  authStore.clearError()
}
</script>

<style scoped>
.register-form {
  width: 100%;
}

.register-form__title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
  text-align: center;
}

.register-form__subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 1.5rem 0;
  text-align: center;
}

.register-form__terms {
  margin-bottom: 1.5rem;
}

.register-form__terms-label {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  cursor: pointer;
}

.register-form__checkbox {
  width: 1rem;
  height: 1rem;
  accent-color: #42b883;
  margin-top: 0.125rem;
  flex-shrink: 0;
}

.register-form__terms-text {
  font-size: 0.875rem;
  color: #374151;
  line-height: 1.4;
}

.register-form__link {
  color: #42b883;
  text-decoration: none;
  transition: color 0.2s;
}

.register-form__link:hover {
  color: #369870;
  text-decoration: underline;
}

.register-form__terms-error {
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: #ef4444;
}

.register-form__submit {
  width: 100%;
  margin-bottom: 1rem;
}

.register-form__divider {
  position: relative;
  text-align: center;
  margin: 1.5rem 0;
}

.register-form__divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background-color: #e5e7eb;
}

.register-form__divider span {
  background-color: white;
  padding: 0 1rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.register-form__login {
  width: 100%;
}
</style>
