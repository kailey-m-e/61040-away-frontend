<template>
  <div class="post-actions">
    <button
      @click="handleEdit"
      class="post-actions__button post-actions__button--edit"
      :disabled="loading"
      title="Edit post"
    >
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
      </svg>
      <span>Edit</span>
    </button>

    <button
      @click="handleDelete"
      class="post-actions__button post-actions__button--delete"
      :disabled="loading"
      title="Delete post"
    >
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
      <span>Delete</span>
    </button>

    <button
      @click="handleShare"
      class="post-actions__button post-actions__button--share"
      :disabled="loading"
      title="Share post"
    >
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3 3 0 000-2.318l4.94-2.47A3 3 0 0015 8z" />
      </svg>
      <span>Share</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Post } from '@/types'

interface Props {
  post: Post
  user?: any
  permissions?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  permissions: () => ['edit', 'delete', 'share'],
})

const emit = defineEmits<{
  'action-triggered': [action: string]
}>()

const loading = ref(false)

const handleEdit = () => {
  loading.value = true
  emit('action-triggered', 'edit')
  setTimeout(() => {
    loading.value = false
  }, 500)
}

const handleDelete = () => {
  loading.value = true
  emit('action-triggered', 'delete')
  setTimeout(() => {
    loading.value = false
  }, 500)
}

const handleShare = () => {
  loading.value = true
  emit('action-triggered', 'share')
  setTimeout(() => {
    loading.value = false
  }, 500)
}
</script>

<style scoped>
.post-actions {
  display: flex;
  gap: 0.5rem;
}

.post-actions__button {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background: none;
}

.post-actions__button--edit {
  color: #6b7280;
  border: 1px solid #d1d5db;
}

.post-actions__button--edit:hover:not(:disabled) {
  background-color: #f3f4f6;
  border-color: #ff6b6b;
  color: #ff6b6b;
}

.post-actions__button--delete {
  color: #ef4444;
  border: 1px solid #fecaca;
}

.post-actions__button--delete:hover:not(:disabled) {
  background-color: #fef2f2;
  border-color: #dc2626;
}

.post-actions__button--share {
  color: #6b7280;
  border: 1px solid #d1d5db;
}

.post-actions__button--share:hover:not(:disabled) {
  background-color: #f3f4f6;
  border-color: #ff6b6b;
  color: #ff6b6b;
}

.post-actions__button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.post-actions__button span {
  display: none;
}

@media (min-width: 640px) {
  .post-actions__button span {
    display: inline;
  }
}
</style>
