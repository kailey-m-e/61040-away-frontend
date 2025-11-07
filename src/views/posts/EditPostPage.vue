<template>
  <div class="edit-post-page">
    <div class="edit-post-page__container">
      <div class="edit-post-page__header">
        <button @click="goBack" class="edit-post-page__back-button">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div class="edit-post-page__title-section">
          <h1 class="edit-post-page__title">Edit Postcard</h1>
        </div>
      </div>

      <div v-if="loading" class="edit-post-page__loading">
        <div class="loading-spinner"></div>
        <p>Loading post...</p>
      </div>

      <div v-else-if="error" class="edit-post-page__error">
        <p>{{ error }}</p>
        <button @click="goBack" class="edit-post-page__button">Go Back</button>
      </div>

      <div v-else class="edit-post-page__content">
        <form @submit.prevent="handleSubmit" class="post-form">
          <div class="post-form__section">
            <label for="title" class="post-form__label">Trip Title *</label>
            <input
              id="title"
              v-model="form.title"
              type="text"
              class="post-form__input"
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
              rows="6"
              required
            ></textarea>
            <div v-if="errors.description" class="post-form__error">{{ errors.description }}</div>
          </div>

          <div class="post-form__actions">
            <button type="button" @click="goBack" class="post-form__button post-form__button--secondary">
              Cancel
            </button>
            <button type="submit" class="post-form__button post-form__button--primary" :disabled="saving">
              <span v-if="saving" class="loading-spinner-small"></span>
              {{ saving ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usePostStore } from '@/stores/postStore'
import type { Post } from '@/types'

const router = useRouter()
const route = useRoute()
const postStore = usePostStore()

// Form state
const loading = ref(true)
const saving = ref(false)
const error = ref<string | null>(null)
const errors = ref<Record<string, string>>({})

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

// Load post data
const loadPost = async () => {
  const postId = route.params.id as string

  try {
    loading.value = true
    error.value = null

    // Load posts if not already loaded
    await postStore.loadPosts()

    // Find the post
    const post = postStore.getPost(postId)
    if (!post) {
      throw new Error('Post not found')
    }

    // Populate form with post data
    form.title = post.title
    form.city = post.city
    form.region = post.region || ''
    form.country = post.country || ''
    form.start = post.start || ''
    form.end = post.end || ''
    form.description = post.description || ''
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load post'
    console.error('Error loading post:', err)
  } finally {
    loading.value = false
  }
}

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
    today.setHours(0, 0, 0, 0)

    if (startDate >= today) {
      errors.value.start = 'Start date must be in the past'
    }
  }

  if (!form.end) {
    errors.value.end = 'End date is required'
  } else {
    const endDate = new Date(form.end)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (endDate >= today) {
      errors.value.end = 'End date must be in the past'
    } else if (form.start && new Date(form.end) < new Date(form.start)) {
      errors.value.end = 'End date must be after start date'
    }
  }

  if (!form.description.trim()) {
    errors.value.description = 'Description is required'
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  const postId = route.params.id as string
  saving.value = true

  try {
    // Save each field individually as per API design
    await postStore.editPostTitle(postId, form.title.trim())
    await postStore.editPostPlace(postId, form.city.trim(), form.region.trim(), form.country.trim())
    await postStore.editPostDates(postId, form.start, form.end)
    await postStore.editPostDescription(postId, form.description.trim())

    // Show success and redirect
    // alert('Post updated successfully!')
    router.push('/postcards')
  } catch (err) {
    console.error('Error updating post:', err)
    alert('Failed to update post. Please try again.')
  } finally {
    saving.value = false
  }
}

const goBack = () => {
  router.push('/postcards')
}

onMounted(() => {
  loadPost()
})
</script>

<style scoped>
.edit-post-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 2rem;
}

.edit-post-page__container {
  max-width: 800px;
  margin: 0 auto;
}

.edit-post-page__header {
  margin-bottom: 2rem;
}

.edit-post-page__back-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  color: #6b7280;
  border: 1px solid #e5e7eb;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.edit-post-page__back-button:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

.edit-post-page__back-button svg {
  width: 1.25rem;
  height: 1.25rem;
}

.edit-post-page__title-section {
  text-align: center;
}

.edit-post-page__title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #374151;
  margin: 0 0 0.5rem 0;
}

.edit-post-page__subtitle {
  font-size: 1.125rem;
  color: #6b7280;
  margin: 0;
}

.edit-post-page__loading,
.edit-post-page__error {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 4rem 2rem;
  text-align: center;
}

.edit-post-page__loading {
  color: #6b7280;
}

.edit-post-page__error {
  color: #dc2626;
}

.edit-post-page__error p {
  margin: 0 0 1.5rem 0;
}

.edit-post-page__button {
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

.edit-post-page__button:hover {
  background-color: #ff5252;
}

.edit-post-page__content {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #ff6b6b;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

.loading-spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
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
  font-family: sans-serif;
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

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .edit-post-page {
    padding: 1rem;
  }

  .edit-post-page__title {
    font-size: 2rem;
  }

  .edit-post-page__content {
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
