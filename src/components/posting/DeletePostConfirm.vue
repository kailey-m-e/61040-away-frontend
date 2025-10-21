<template>
  <div v-if="isOpen" class="delete-post-modal">
    <div class="delete-post-modal__overlay" @click="handleClose"></div>

    <div class="delete-post-modal__content">
      <div class="delete-post-modal__header">
        <h3 class="delete-post-modal__title">Delete Post</h3>
        <button
          @click="handleClose"
          class="delete-post-modal__close"
          aria-label="Close modal"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>

      <div class="delete-post-modal__body">
        <div class="delete-post-modal__warning">
          <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </div>

        <p class="delete-post-modal__message">
          Are you sure you want to delete "<strong>{{ post?.title }}</strong>"?
          This action cannot be undone.
        </p>
      </div>

      <div class="delete-post-modal__footer">
        <button
          @click="handleClose"
          class="delete-post-modal__button delete-post-modal__button--cancel"
          :disabled="loading"
        >
          Cancel
        </button>
        <button
          @click="handleConfirm"
          class="delete-post-modal__button delete-post-modal__button--delete"
          :disabled="loading"
        >
          <div v-if="loading" class="delete-post-modal__spinner"></div>
          {{ loading ? 'Deleting...' : 'Delete Post' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Post } from '@/types'

interface Props {
  post: Post | null
  isOpen: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'post-deleted': [post: Post]
  'modal-closed': []
}>()

const loading = ref(false)

const handleClose = () => {
  if (!loading.value) {
    emit('modal-closed')
  }
}

const handleConfirm = async () => {
  if (!props.post) return

  loading.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    emit('post-deleted', props.post)
    emit('modal-closed')
  } catch (error) {
    console.error('Delete error:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.delete-post-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.delete-post-modal__overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.delete-post-modal__content {
  position: relative;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  width: 100%;
  max-width: 400px;
  max-height: 90vh;
  overflow-y: auto;
}

.delete-post-modal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.5rem 0;
}

.delete-post-modal__title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.delete-post-modal__close {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: color 0.2s, background-color 0.2s;
}

.delete-post-modal__close:hover {
  color: #374151;
  background-color: #f3f4f6;
}

.delete-post-modal__body {
  padding: 1.5rem;
  text-align: center;
}

.delete-post-modal__warning {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
  color: #ef4444;
}

.delete-post-modal__message {
  color: #374151;
  line-height: 1.6;
  margin: 0;
}

.delete-post-modal__footer {
  display: flex;
  gap: 1rem;
  padding: 0 1.5rem 1.5rem;
}

.delete-post-modal__button {
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.delete-post-modal__button--cancel {
  background-color: white;
  color: #6b7280;
  border: 1px solid #d1d5db;
}

.delete-post-modal__button--cancel:hover:not(:disabled) {
  border-color: #9ca3af;
  color: #374151;
}

.delete-post-modal__button--delete {
  background-color: #ef4444;
  color: white;
}

.delete-post-modal__button--delete:hover:not(:disabled) {
  background-color: #dc2626;
}

.delete-post-modal__button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.delete-post-modal__spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 640px) {
  .delete-post-modal {
    padding: 0.5rem;
  }

  .delete-post-modal__footer {
    flex-direction: column;
  }
}
</style>
