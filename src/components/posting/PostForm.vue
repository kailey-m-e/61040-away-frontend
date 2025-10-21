<template>
  <form @submit.prevent="handleSubmit" class="post-form">
    <h2 class="post-form__title">{{ isEditing ? 'Edit Post' : 'Create New Post' }}</h2>

    <div class="post-form__field">
      <label for="title" class="post-form__label">
        Title <span class="required">*</span>
      </label>
      <input
        id="title"
        v-model="form.title"
        type="text"
        placeholder="Enter post title"
        :disabled="loading"
        class="post-form__input"
        @blur="validateField('title')"
      />
      <div v-if="errors.title" class="post-form__error">
        {{ errors.title }}
      </div>
    </div>

    <div class="post-form__field">
      <label class="post-form__label">
        Location <span class="required">*</span>
      </label>
      <LocationInput
        v-model="form.location"
        :disabled="loading"
        @location-changed="handleLocationChange"
      />
    </div>

    <div class="post-form__field">
      <label class="post-form__label">
        Travel Dates <span class="required">*</span>
      </label>
      <DateRangePicker
        v-model:start-date="form.startDate"
        v-model:end-date="form.endDate"
        :disabled="loading"
        @dates-changed="handleDatesChange"
      />
    </div>

    <div class="post-form__field">
      <label for="description" class="post-form__label">
        Description <span class="required">*</span>
      </label>
      <textarea
        id="description"
        v-model="form.description"
        placeholder="Describe your trip..."
        :disabled="loading"
        rows="6"
        class="post-form__textarea"
        @blur="validateField('description')"
      ></textarea>
      <div v-if="errors.description" class="post-form__error">
        {{ errors.description }}
      </div>
    </div>

    <div class="post-form__actions">
      <button
        type="button"
        @click="handleCancel"
        class="post-form__button post-form__button--secondary"
        :disabled="loading"
      >
        Cancel
      </button>
      <button
        type="submit"
        class="post-form__button post-form__button--primary"
        :disabled="!isFormValid || loading"
      >
        {{ loading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Post' : 'Create Post') }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import LocationInput from './LocationInput.vue'
import DateRangePicker from './DateRangePicker.vue'
import type { Post, PostForm } from '@/types'

interface Props {
  initialData?: Partial<Post>
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<{
  'post-created': [post: PostForm]
  'post-updated': [post: PostForm]
  'form-cancelled': []
}>()

const form = reactive<PostForm>({
  title: '',
  location: {
    city: '',
    region: '',
    country: ''
  },
  startDate: '',
  endDate: '',
  description: '',
})

const errors = reactive({
  title: '',
  location: '',
  dates: '',
  description: '',
})

const isEditing = computed(() => !!props.initialData?._id)

const isFormValid = computed(() => {
  return form.title.trim() !== '' &&
         form.location.city.trim() !== '' &&
         form.location.region.trim() !== '' &&
         form.location.country.trim() !== '' &&
         form.startDate !== '' &&
         form.endDate !== '' &&
         form.description.trim() !== '' &&
         Object.values(errors).every(error => !error)
})

const validateField = (field: keyof typeof errors) => {
  switch (field) {
    case 'title':
      errors.title = form.title.trim() === '' ? 'Title is required' : ''
      break
    case 'description':
      errors.description = form.description.trim() === '' ? 'Description is required' : ''
      break
  }
}

const validateForm = () => {
  validateField('title')
  validateField('description')

  // Validate location
  if (!form.location.city.trim() || !form.location.region.trim() || !form.location.country.trim()) {
    errors.location = 'All location fields are required'
  } else {
    errors.location = ''
  }

  // Validate dates
  if (!form.startDate || !form.endDate) {
    errors.dates = 'Both start and end dates are required'
  } else {
    const startDate = new Date(form.startDate)
    const endDate = new Date(form.endDate)
    const today = new Date()

    if (endDate <= startDate) {
      errors.dates = 'End date must be after start date'
    } else if (endDate > today) {
      errors.dates = 'End date must be in the past'
    } else {
      errors.dates = ''
    }
  }

  return Object.values(errors).every(error => !error)
}

const handleLocationChange = (location: { city: string; region: string; country: string }) => {
  form.location = location
}

const handleDatesChange = (dates: { startDate: string; endDate: string }) => {
  form.startDate = dates.startDate
  form.endDate = dates.endDate
}

const handleSubmit = () => {
  if (!validateForm()) {
    return
  }

  if (isEditing.value) {
    emit('post-updated', form)
  } else {
    emit('post-created', form)
  }
}

const handleCancel = () => {
  emit('form-cancelled')
}

const resetForm = () => {
  form.title = ''
  form.location = {
    city: '',
    region: '',
    country: ''
  }
  form.startDate = ''
  form.endDate = ''
  form.description = ''

  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
}

onMounted(() => {
  if (props.initialData) {
    form.title = props.initialData.title || ''
    form.location = {
      city: props.initialData.city || '',
      region: props.initialData.region || '',
      country: props.initialData.country || ''
    }
    form.startDate = props.initialData.start || ''
    form.endDate = props.initialData.end || ''
    form.description = props.initialData.description || ''
  }
})
</script>

<style scoped>
.post-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

.post-form__title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 2rem;
  text-align: center;
}

.post-form__field {
  margin-bottom: 2rem;
}

.post-form__label {
  display: block;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.required {
  color: #ef4444;
}

.post-form__input,
.post-form__textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
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

.post-form__input:disabled,
.post-form__textarea:disabled {
  background-color: #f9fafb;
  color: #6b7280;
  cursor: not-allowed;
}

.post-form__error {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #ef4444;
}

.post-form__actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.post-form__button {
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.post-form__button--primary {
  background-color: #ff6b6b;
  color: white;
}

.post-form__button--primary:hover:not(:disabled) {
  background-color: #ff5252;
}

.post-form__button--secondary {
  background-color: white;
  color: #6b7280;
  border: 1px solid #d1d5db;
}

.post-form__button--secondary:hover:not(:disabled) {
  border-color: #ff6b6b;
  color: #ff6b6b;
}

.post-form__button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .post-form {
    padding: 1.5rem;
    margin: 1rem;
  }

  .post-form__actions {
    flex-direction: column;
  }

  .post-form__button {
    width: 100%;
  }
}
</style>
