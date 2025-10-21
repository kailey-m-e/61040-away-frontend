<template>
  <div class="username-input">
    <div class="username-input__wrapper">
      <input
        :id="fieldId"
        type="text"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        class="username-input__field"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />

      <div v-if="checkingAvailability" class="username-input__indicator">
        <LoadingSpinner size="small" color="secondary" />
      </div>

      <div v-else-if="availabilityStatus" class="username-input__indicator">
        <svg v-if="availabilityStatus === 'available'" class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <svg v-else-if="availabilityStatus === 'unavailable'" class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>

    <div v-if="validationError" class="username-input__error">
      {{ validationError }}
    </div>

    <div v-if="hint && !validationError" class="username-input__hint">
      {{ hint }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import LoadingSpinner from './LoadingSpinner.vue'

interface Props {
  modelValue: string
  placeholder?: string
  disabled?: boolean
  checkAvailability?: boolean
  hint?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Enter username',
  disabled: false,
  checkAvailability: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: []
  focus: []
  'availability-check': [available: boolean]
}>()

const checkingAvailability = ref(false)
const availabilityStatus = ref<'available' | 'unavailable' | null>(null)
const validationError = ref('')
const fieldId = `username-${Math.random().toString(36).substr(2, 9)}`

let availabilityTimeout: ReturnType<typeof setTimeout> | null = null

const validateUsername = (username: string): string => {
  if (!username) return ''

  if (username.length < 3) {
    return 'Username must be at least 3 characters long'
  }

  if (username.length > 20) {
    return 'Username must be no more than 20 characters long'
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return 'Username can only contain letters, numbers, and underscores'
  }

  return ''
}

const checkUsernameAvailability = async (username: string) => {
  if (!props.checkAvailability || !username || validationError.value) {
    return
  }

  checkingAvailability.value = true
  availabilityStatus.value = null

  try {
    // Simulate API call - replace with actual availability check
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Mock availability check (replace with actual API call)
    const isAvailable = !['admin', 'user', 'test', 'demo'].includes(username.toLowerCase())
    availabilityStatus.value = isAvailable ? 'available' : 'unavailable'

    emit('availability-check', isAvailable)
  } catch (error) {
    console.error('Availability check failed:', error)
  } finally {
    checkingAvailability.value = false
  }
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value

  emit('update:modelValue', value)

  // Clear previous timeout
  if (availabilityTimeout) {
    clearTimeout(availabilityTimeout)
  }

  // Validate immediately
  validationError.value = validateUsername(value)

  // Check availability after a delay
  if (props.checkAvailability && value && !validationError.value) {
    availabilityTimeout = setTimeout(() => {
      checkUsernameAvailability(value)
    }, 500)
  } else {
    availabilityStatus.value = null
  }
}

const handleBlur = () => {
  emit('blur')
}

const handleFocus = () => {
  emit('focus')
}

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  validationError.value = validateUsername(newValue)
})
</script>

<style scoped>
.username-input {
  width: 100%;
  box-sizing: border-box;
}

.username-input__wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
}

.username-input__field {
  width: 100%;
  padding: 0.75rem 3rem 0.75rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
}

.username-input__field:focus {
  outline: none;
  border-color: #42b883;
  box-shadow: 0 0 0 1px #42b883;
}

.username-input__field:disabled {
  background-color: #f9fafb;
  color: #6b7280;
  cursor: not-allowed;
}

.username-input__indicator {
  position: absolute;
  right: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.username-input__error {
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: #ef4444;
}

.username-input__hint {
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: #6b7280;
}
</style>
