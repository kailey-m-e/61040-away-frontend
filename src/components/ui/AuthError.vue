<template>
  <div v-if="error" class="auth-error" :class="[`auth-error--${type}`, { 'auth-error--dismissible': dismissible }]">
    <div class="auth-error__content">
      <div class="auth-error__icon">
        <svg v-if="type === 'error'" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <svg v-else-if="type === 'warning'" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
        </svg>
      </div>
      <div class="auth-error__message">
        {{ error }}
      </div>
    </div>

    <button
      v-if="dismissible"
      @click="$emit('dismiss')"
      class="auth-error__dismiss"
      aria-label="Dismiss error"
    >
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  error: string
  type?: 'error' | 'warning' | 'info'
  dismissible?: boolean
}

withDefaults(defineProps<Props>(), {
  type: 'error',
  dismissible: true,
})

defineEmits<{
  dismiss: []
}>()
</script>

<style scoped>
.auth-error {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
}

.auth-error--error {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
}

.auth-error--warning {
  background-color: #fffbeb;
  border: 1px solid #fed7aa;
  color: #d97706;
}

.auth-error--info {
  background-color: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #2563eb;
}

.auth-error__content {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  flex: 1;
}

.auth-error__icon {
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.auth-error__message {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.auth-error__dismiss {
  flex-shrink: 0;
  background: none;
  border: none;
  color: currentColor;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
}

.auth-error__dismiss:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
