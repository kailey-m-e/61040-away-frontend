<template>
  <div class="location-input">
    <div class="location-input__fields">
      <div class="location-input__field">
        <label for="city" class="location-input__label">
          City <span v-if="required" class="required">*</span>
        </label>
        <input
          id="city"
          v-model="localCity"
          type="text"
          :placeholder="cityPlaceholder"
          :disabled="disabled"
          class="location-input__input"
          @blur="validateField('city')"
        />
        <div v-if="errors.city" class="location-input__error">
          {{ errors.city }}
        </div>
      </div>

      <div class="location-input__field">
        <label for="region" class="location-input__label">
          Region <span v-if="required" class="required">*</span>
        </label>
        <input
          id="region"
          v-model="localRegion"
          type="text"
          :placeholder="regionPlaceholder"
          :disabled="disabled"
          class="location-input__input"
          @blur="validateField('region')"
        />
        <div v-if="errors.region" class="location-input__error">
          {{ errors.region }}
        </div>
      </div>

      <div class="location-input__field">
        <label for="country" class="location-input__label">
          Country <span v-if="required" class="required">*</span>
        </label>
        <input
          id="country"
          v-model="localCountry"
          type="text"
          :placeholder="countryPlaceholder"
          :disabled="disabled"
          class="location-input__input"
          @blur="validateField('country')"
        />
        <div v-if="errors.country" class="location-input__error">
          {{ errors.country }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, reactive } from 'vue'

interface Location {
  city: string
  region: string
  country: string
}

interface Props {
  modelValue: Location
  required?: boolean
  disabled?: boolean
  cityPlaceholder?: string
  regionPlaceholder?: string
  countryPlaceholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  required: true,
  disabled: false,
  cityPlaceholder: 'Enter city',
  regionPlaceholder: 'Enter region/state',
  countryPlaceholder: 'Enter country',
})

const emit = defineEmits<{
  'update:modelValue': [value: Location]
  'location-changed': [value: Location]
}>()

const localCity = ref(props.modelValue.city || '')
const localRegion = ref(props.modelValue.region || '')
const localCountry = ref(props.modelValue.country || '')

const errors = reactive({
  city: '',
  region: '',
  country: '',
})

const location = computed(() => ({
  city: localCity.value,
  region: localRegion.value,
  country: localCountry.value,
}))

const validateField = (field: keyof typeof errors) => {
  const value = location.value[field]

  if (props.required && !value.trim()) {
    errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
  } else {
    errors[field] = ''
  }
}

const validateAll = () => {
  validateField('city')
  validateField('region')
  validateField('country')
  return Object.values(errors).every(error => !error)
}

watch(location, (newLocation) => {
  emit('update:modelValue', newLocation)
  emit('location-changed', newLocation)
}, { deep: true })

watch(() => props.modelValue, (newValue) => {
  localCity.value = newValue.city || ''
  localRegion.value = newValue.region || ''
  localCountry.value = newValue.country || ''
})

defineExpose({
  validate: validateAll,
})
</script>

<style scoped>
.location-input {
  width: 100%;
}

.location-input__fields {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1.5rem;
}

.location-input__field {
  display: flex;
  flex-direction: column;
}

.location-input__label {
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.required {
  color: #ef4444;
}

.location-input__input {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
}

.location-input__input:focus {
  outline: none;
  border-color: #ff6b6b;
  box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1);
}

.location-input__input:disabled {
  background-color: #f9fafb;
  color: #6b7280;
  cursor: not-allowed;
}

.location-input__error {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #ef4444;
}

@media (max-width: 768px) {
  .location-input__fields {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
}
</style>
