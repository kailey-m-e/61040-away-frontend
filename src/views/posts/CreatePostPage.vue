<template>
  <div class="create-post-page">
    <div class="create-post-page__container">
      <div class="create-post-page__header">
        <button @click="goBack" class="create-post-page__back-button">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
          Back to Posts
        </button>

        <div class="create-post-page__title-section">
          <h1 class="create-post-page__title">Create New Post</h1>
          <p class="create-post-page__subtitle">
            Share your travel story with the world
          </p>
        </div>
      </div>

      <div class="create-post-page__content">
        <form @submit.prevent="handleSubmit" class="post-form">
          <div class="post-form__section">
            <label for="title" class="post-form__label">Post Title *</label>
            <input
              id="title"
              v-model="form.title"
              type="text"
              class="post-form__input"
              placeholder="Enter an engaging title for your post"
              required
            />
            <div v-if="errors.title" class="post-form__error">{{ errors.title }}</div>
          </div>

          <div class="post-form__section">
            <label class="post-form__label">Location *</label>
            <div class="post-form__location-grid">
              <div class="post-form__field">
                <input
                  v-model="form.city"
                  type="text"
                  class="post-form__input"
                  placeholder="City"
                  required
                />
                <div v-if="errors.city" class="post-form__error">{{ errors.city }}</div>
              </div>
              <div class="post-form__field">
                <input
                  v-model="form.region"
                  type="text"
                  class="post-form__input"
                  placeholder="Region/State"
                  required
                />
                <div v-if="errors.region" class="post-form__error">{{ errors.region }}</div>
              </div>
              <div class="post-form__field">
                <input
                  v-model="form.country"
                  type="text"
                  class="post-form__input"
                  placeholder="Country"
                  required
                />
                <div v-if="errors.country" class="post-form__error">{{ errors.country }}</div>
              </div>
            </div>
          </div>

          <div class="post-form__section">
            <label class="post-form__label">Travel Dates *</label>
            <div class="post-form__date-grid">
              <div class="post-form__field">
                <label for="start-date" class="post-form__date-label">Start Date</label>
                <input
                  id="start-date"
                  v-model="form.start"
                  type="date"
                  class="post-form__input"
                  required
                />
                <div v-if="errors.start" class="post-form__error">{{ errors.start }}</div>
              </div>
              <div class="post-form__field">
                <label for="end-date" class="post-form__date-label">End Date</label>
                <input
                  id="end-date"
                  v-model="form.end"
                  type="date"
                  class="post-form__input"
                  required
                />
                <div v-if="errors.end" class="post-form__error">{{ errors.end }}</div>
              </div>
            </div>
          </div>

          <div class="post-form__section">
            <label for="description" class="post-form__label">Description *</label>
            <textarea
              id="description"
              v-model="form.description"
              class="post-form__textarea"
              placeholder="Tell us about your travel experience, what you did, what you saw, and any recommendations..."
              rows="6"
              required
            ></textarea>
            <div v-if="errors.description" class="post-form__error">{{ errors.description }}</div>
          </div>

          <div class="post-form__actions">
            <button type="button" @click="goBack" class="post-form__button post-form__button--secondary">
              Cancel
            </button>
            <button type="submit" class="post-form__button post-form__button--primary" :disabled="loading">
              <span v-if="loading" class="loading-spinner-small"></span>
              {{ loading ? 'Creating...' : 'Create Post' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { usePostStore } from '@/stores/postStore'
import type { Post } from '@/types'

const router = useRouter()
const postStore = usePostStore()

// Form data
const form = reactive({
  title: '',
  city: '',
  region: '',
  country: '',
  start: '',
  end: '',
  description: ''
})

// Form state
const loading = ref(false)
const errors = ref<Record<string, string>>({})

const validateForm = () => {
  errors.value = {}

  if (!form.title.trim()) {
    errors.value.title = 'Title is required'
  } else if (form.title.trim().length < 3) {
    errors.value.title = 'Title must be at least 3 characters'
  }

  if (!form.city.trim()) {
    errors.value.city = 'City is required'
  }

  if (!form.region.trim()) {
    errors.value.region = 'Region is required'
  }

  if (!form.country.trim()) {
    errors.value.country = 'Country is required'
  }

  if (!form.start) {
    errors.value.start = 'Start date is required'
  } else {
    const startDate = new Date(form.start)
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset time to start of day for accurate comparison

    if (startDate >= today) {
      errors.value.start = 'Start date must be in the past'
    }
  }

  if (!form.end) {
    errors.value.end = 'End date is required'
  } else {
    const endDate = new Date(form.end)
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset time to start of day for accurate comparison

    if (endDate >= today) {
      errors.value.end = 'End date must be in the past'
    } else if (form.start && new Date(form.end) < new Date(form.start)) {
      errors.value.end = 'End date must be after start date'
    }
  }

  if (!form.description.trim()) {
    errors.value.description = 'Description is required'
  } else if (form.description.trim().length < 10) {
    errors.value.description = 'Description must be at least 10 characters'
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  loading.value = true

  try {
    // Create post data for API
    const postData = {
      title: form.title.trim(),
      city: form.city.trim(),
      region: form.region.trim(),
      country: form.country.trim(),
      start: form.start,
      end: form.end,
      description: form.description.trim()
    }

    // Create post via API
    await postStore.createPost(postData)

    // Show success and redirect
    alert('Post created successfully!')
    router.push('/postcards')
  } catch (error) {
    console.error('Error creating post:', error)
    alert('Failed to create post. Please try again.')
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push('/postcards')
}
</script>

<style scoped>
.create-post-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 2rem;
}

.create-post-page__container {
  max-width: 800px;
  margin: 0 auto;
}

.create-post-page__header {
  margin-bottom: 2rem;
}

.create-post-page__back-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 1.5rem;
}

.create-post-page__back-button:hover {
  background: #f9fafb;
  border-color: #ff6b6b;
  color: #ff6b6b;
}

.create-post-page__title-section {
  text-align: center;
}

.create-post-page__title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.create-post-page__subtitle {
  font-size: 1.125rem;
  color: #6b7280;
  margin: 0;
}

.create-post-page__content {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.post-form__section {
  margin-bottom: 2rem;
}

.post-form__label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.post-form__input,
.post-form__textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
}

.post-form__input:focus,
.post-form__textarea:focus {
  outline: none;
  border-color: #ff6b6b;
  box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1);
}

.post-form__textarea {
  resize: vertical;
  min-height: 120px;
}

.post-form__location-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
}

.post-form__date-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.post-form__field {
  display: flex;
  flex-direction: column;
}

.post-form__date-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.post-form__error {
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.post-form__actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
}

.post-form__button {
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.post-form__button--secondary {
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
}

.post-form__button--secondary:hover {
  background: #f9fafb;
}

.post-form__button--primary {
  background-color: #ff6b6b;
  color: white;
  border: none;
}

.post-form__button--primary:hover:not(:disabled) {
  background-color: #ff5252;
}

.post-form__button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .create-post-page {
    padding: 1rem;
  }

  .create-post-page__title {
    font-size: 2rem;
  }

  .create-post-page__content {
    padding: 1.5rem;
  }

  .post-form__location-grid {
    grid-template-columns: 1fr;
  }

  .post-form__date-grid {
    grid-template-columns: 1fr;
  }

  .post-form__actions {
    flex-direction: column-reverse;
  }

  .post-form__button {
    width: 100%;
    justify-content: center;
  }
}
</style>
