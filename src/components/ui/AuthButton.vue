<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClasses"
    @click="handleClick"
  >
    <LoadingSpinner v-if="loading" size="small" color="white" />
    <span v-else>
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import LoadingSpinner from './LoadingSpinner.vue'

interface Props {
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'danger' | 'outline'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'primary',
  size: 'medium',
  disabled: false,
  loading: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClasses = computed(() => [
  'auth-button',
  `auth-button--${props.variant}`,
  `auth-button--${props.size}`,
  {
    'auth-button--disabled': props.disabled || props.loading,
    'auth-button--loading': props.loading,
  },
])

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped>
.auth-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  text-decoration: none;
}

.auth-button:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 2px #42b883;
}

/* Variants */
.auth-button--primary {
  background-color: #42b883;
  color: white;
}

.auth-button--primary:hover:not(.auth-button--disabled) {
  background-color: #369870;
}

.auth-button--secondary {
  background-color: #64748b;
  color: white;
}

.auth-button--secondary:hover:not(.auth-button--disabled) {
  background-color: #475569;
}

.auth-button--danger {
  background-color: #ef4444;
  color: white;
}

.auth-button--danger:hover:not(.auth-button--disabled) {
  background-color: #dc2626;
}

.auth-button--outline {
  background-color: transparent;
  color: #42b883;
  border: 1px solid #42b883;
}

.auth-button--outline:hover:not(.auth-button--disabled) {
  background-color: #42b883;
  color: white;
}

/* Sizes */
.auth-button--small {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.auth-button--medium {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
}

.auth-button--large {
  padding: 1rem 2rem;
  font-size: 1.125rem;
}

/* States */
.auth-button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.auth-button--loading {
  cursor: wait;
}
</style>
