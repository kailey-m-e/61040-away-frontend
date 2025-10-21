<template>
  <div class="password-input">
    <div class="password-input__wrapper">
      <input
        :id="fieldId"
        :type="inputType"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        class="password-input__field"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />

      <button
        type="button"
        class="password-input__toggle"
        @click="toggleVisibility"
        :aria-label="showPassword ? 'Hide password' : 'Show password'"
      >
        <svg v-if="showPassword" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd" />
          <path d="M12.454 16.697L9.75 13.993a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
        </svg>
        <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
          <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>

    <div v-if="showStrength && modelValue" class="password-input__strength">
      <div class="password-input__strength-bar">
        <div
          class="password-input__strength-fill"
          :class="strengthClass"
          :style="{ width: strengthPercentage + '%' }"
        ></div>
      </div>
      <span class="password-input__strength-text">{{ strengthText }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  modelValue: string
  placeholder?: string
  disabled?: boolean
  showStrength?: boolean
  confirmValue?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Enter password',
  disabled: false,
  showStrength: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: []
  focus: []
}>()

const showPassword = ref(false)
const fieldId = `password-${Math.random().toString(36).substr(2, 9)}`

const inputType = computed(() => showPassword.value ? 'text' : 'password')

const toggleVisibility = () => {
  showPassword.value = !showPassword.value
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const handleBlur = () => {
  emit('blur')
}

const handleFocus = () => {
  emit('focus')
}

// Password strength calculation
const strengthScore = computed(() => {
  let score = 0
  const password = props.modelValue

  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1
  if (/[a-z]/.test(password)) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/[0-9]/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1

  return Math.min(score, 5)
})

const strengthPercentage = computed(() => (strengthScore.value / 5) * 100)

const strengthClass = computed(() => {
  const score = strengthScore.value
  if (score <= 2) return 'strength-weak'
  if (score <= 3) return 'strength-fair'
  if (score <= 4) return 'strength-good'
  return 'strength-strong'
})

const strengthText = computed(() => {
  const score = strengthScore.value
  if (score <= 2) return 'Weak'
  if (score <= 3) return 'Fair'
  if (score <= 4) return 'Good'
  return 'Strong'
})
</script>

<style scoped>
.password-input {
  width: 100%;
}

.password-input__wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input__field {
  width: 100%;
  padding: 0.75rem 3rem 0.75rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.password-input__field:focus {
  outline: none;
  border-color: #42b883;
  box-shadow: 0 0 0 1px #42b883;
}

.password-input__field:disabled {
  background-color: #f9fafb;
  color: #6b7280;
  cursor: not-allowed;
}

.password-input__toggle {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: color 0.2s;
}

.password-input__toggle:hover {
  color: #374151;
}

.password-input__strength {
  margin-top: 0.5rem;
}

.password-input__strength-bar {
  width: 100%;
  height: 4px;
  background-color: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
}

.password-input__strength-fill {
  height: 100%;
  transition: width 0.3s ease, background-color 0.3s ease;
}

.strength-weak {
  background-color: #ef4444;
}

.strength-fair {
  background-color: #f59e0b;
}

.strength-good {
  background-color: #3b82f6;
}

.strength-strong {
  background-color: #10b981;
}

.password-input__strength-text {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
}
</style>
