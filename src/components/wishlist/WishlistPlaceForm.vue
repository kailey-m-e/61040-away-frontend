<template>
  <form @submit.prevent="handleSubmit" class="place-form">
    <div class="place-form__container">
      <div class="place-form__fields">
        <div class="place-form__field">
          <label for="city" class="place-form__label">City *</label>
          <input
            id="city"
            v-model="form.city"
            type="text"
            class="place-form__input"
            placeholder="Enter city"
            required
          />
        </div>

        <div class="place-form__field">
          <label for="region" class="place-form__label">Region/State *</label>
          <input
            id="region"
            v-model="form.region"
            type="text"
            class="place-form__input"
            placeholder="Enter region or state"
            required
          />
        </div>

        <div class="place-form__field">
          <label for="country" class="place-form__label">Country *</label>
          <input
            id="country"
            v-model="form.country"
            type="text"
            class="place-form__input"
            placeholder="Enter country"
            required
          />
        </div>
      </div>

      <div class="place-form__button-wrapper">
        <button
          type="submit"
          class="place-form__button"
          :disabled="loading"
        >
          <span v-if="loading" class="loading-spinner-small"></span>
          {{ loading ? 'Adding...' : 'Add' }}
        </button>
      </div>
    </div>

    <div v-if="error" class="place-form__error">
      {{ error }}
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useWishlistStore } from '@/stores/wishlistStore'

const wishlistStore = useWishlistStore()

const emit = defineEmits<{
  (e: 'added'): void
}>()

const loading = ref(false)
const error = ref('')

const form = reactive({
  city: '',
  region: '',
  country: ''
})

const handleSubmit = async () => {
  if (!form.city.trim() || !form.region.trim() || !form.country.trim()) {
    error.value = 'All fields are required'
    return
  }

  loading.value = true
  error.value = ''

  try {
    console.log('Adding place:', {
      city: form.city.trim(),
      region: form.region.trim(),
      country: form.country.trim()
    })

    await wishlistStore.addPlace(
      form.city.trim(),
      form.region.trim(),
      form.country.trim()
    )

    // Reset form on success
    form.city = ''
    form.region = ''
    form.country = ''

    // Emit success event
    emit('added')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to add place'
    console.error('Error adding place:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.place-form {
  background: white;
  border-radius: 0.75rem;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.place-form__container {
  display: flex;
  gap: 1.5rem;
  align-items: flex-end;
}

.place-form__fields {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.place-form__field {
  display: flex;
  flex-direction: column;
}

.place-form__label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.place-form__input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: all 0.2s;
  box-sizing: border-box;
}

.place-form__input:focus {
  outline: none;
  border-color: #ff6b6b;
  box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1);
}

.place-form__error {
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 1rem;
}

.place-form__button-wrapper {
  flex-shrink: 0;
}

.place-form__button {
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
  height: fit-content;
}

.place-form__button:hover:not(:disabled) {
  background: #ff5252;
}

.place-form__button:disabled {
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
  .place-form__container {
    flex-direction: column;
    align-items: stretch;
  }

  .place-form__fields {
    grid-template-columns: 1fr;
  }

  .place-form__button {
    width: 100%;
    justify-content: center;
  }
}
</style>
