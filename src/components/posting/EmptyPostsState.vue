<template>
  <div class="empty-posts-state">
    <div class="empty-posts-state__icon">
      <svg class="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
      </svg>
    </div>

    <h3 class="empty-posts-state__title">No Posts Yet</h3>

    <p class="empty-posts-state__message">{{ message }}</p>

    <button
      @click="handleAction"
      class="empty-posts-state__button"
    >
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
      </svg>
      {{ actionText }}
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message: string
  actionText: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  action: []
}>()

const handleAction = () => {
  emit('action')
}
</script>

<style scoped>
.empty-posts-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  text-align: center;
}

.empty-posts-state__icon {
  color: #d1d5db;
  margin-bottom: 1.5rem;
}

.empty-posts-state__title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 1rem 0;
}

.empty-posts-state__message {
  font-size: 1rem;
  color: #6b7280;
  margin: 0 0 2rem 0;
  max-width: 400px;
  line-height: 1.6;
}

.empty-posts-state__button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #ff6b6b;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.empty-posts-state__button:hover {
  background-color: #ff5252;
}

@media (max-width: 768px) {
  .empty-posts-state {
    padding: 2rem 1rem;
  }

  .empty-posts-state__icon {
    margin-bottom: 1rem;
  }

  .empty-posts-state__title {
    font-size: 1.25rem;
  }

  .empty-posts-state__message {
    font-size: 0.875rem;
    margin-bottom: 1.5rem;
  }
}
</style>
