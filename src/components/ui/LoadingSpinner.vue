<template>
  <div class="loading-spinner" :class="[`spinner-${size}`, `spinner-${color}`]">
    <div class="spinner"></div>
    <p v-if="text" class="spinner-text">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  size?: 'small' | 'medium' | 'large'
  color?: 'primary' | 'secondary' | 'white'
  text?: string
}

withDefaults(defineProps<Props>(), {
  size: 'medium',
  color: 'primary',
})
</script>

<style scoped>
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.spinner {
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner-small .spinner {
  width: 16px;
  height: 16px;
}

.spinner-medium .spinner {
  width: 24px;
  height: 24px;
}

.spinner-large .spinner {
  width: 32px;
  height: 32px;
}

.spinner-primary {
  color: #42b883;
}

.spinner-secondary {
  color: #64748b;
}

.spinner-white {
  color: white;
}

.spinner-text {
  margin: 0;
  font-size: 0.875rem;
  color: currentColor;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
