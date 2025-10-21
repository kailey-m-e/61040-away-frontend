<template>
  <div class="date-range-picker">
    <div class="date-range-picker__fields">
      <div class="date-range-picker__field">
        <label for="start-date" class="date-range-picker__label">
          Start Date <span class="required">*</span>
        </label>
        <input
          id="start-date"
          v-model="localStartDate"
          type="date"
          :disabled="disabled"
          class="date-range-picker__input"
          @change="validateDates"
        />
        <div v-if="errors.startDate" class="date-range-picker__error">
          {{ errors.startDate }}
        </div>
      </div>

      <div class="date-range-picker__field">
        <label for="end-date" class="date-range-picker__label">
          End Date <span class="required">*</span>
        </label>
        <input
          id="end-date"
          v-model="localEndDate"
          type="date"
          :disabled="disabled"
          class="date-range-picker__input"
          @change="validateDates"
        />
        <div v-if="errors.endDate" class="date-range-picker__error">
          {{ errors.endDate }}
        </div>
      </div>
    </div>

    <div class="date-range-picker__actions">
      <button
        type="button"
        @click="clearDates"
        class="date-range-picker__clear"
        :disabled="disabled"
      >
        Clear Dates
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, reactive } from 'vue'

interface DateRange {
  startDate: string
  endDate: string
}

interface Props {
  startDate: string
  endDate: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

const emit = defineEmits<{
  'update:startDate': [value: string]
  'update:endDate': [value: string]
  'dates-changed': [value: DateRange]
}>()

const localStartDate = ref(props.startDate || '')
const localEndDate = ref(props.endDate || '')

const errors = reactive({
  startDate: '',
  endDate: '',
})

const dateRange = computed(() => ({
  startDate: localStartDate.value,
  endDate: localEndDate.value,
}))

const validateDates = () => {
  const startDate = new Date(localStartDate.value)
  const endDate = new Date(localEndDate.value)
  const today = new Date()

  // Clear previous errors
  errors.startDate = ''
  errors.endDate = ''

  // Validate start date
  if (!localStartDate.value) {
    errors.startDate = 'Start date is required'
  }

  // Validate end date
  if (!localEndDate.value) {
    errors.endDate = 'End date is required'
  } else if (localStartDate.value && endDate <= startDate) {
    errors.endDate = 'End date must be after start date'
  } else if (endDate > today) {
    errors.endDate = 'End date must be in the past'
  }
}

const clearDates = () => {
  localStartDate.value = ''
  localEndDate.value = ''
  errors.startDate = ''
  errors.endDate = ''
}

const isValid = computed(() => {
  return !errors.startDate && !errors.endDate && localStartDate.value && localEndDate.value
})

watch(dateRange, (newRange) => {
  emit('update:startDate', newRange.startDate)
  emit('update:endDate', newRange.endDate)
  emit('dates-changed', newRange)
}, { deep: true })

watch(() => props.startDate, (newValue) => {
  localStartDate.value = newValue || ''
})

watch(() => props.endDate, (newValue) => {
  localEndDate.value = newValue || ''
})

defineExpose({
  validate: validateDates,
  isValid,
})
</script>

<style scoped>
.date-range-picker {
  width: 100%;
}

.date-range-picker__fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.date-range-picker__field {
  display: flex;
  flex-direction: column;
}

.date-range-picker__label {
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.required {
  color: #ef4444;
}

.date-range-picker__input {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.date-range-picker__input:focus {
  outline: none;
  border-color: #ff6b6b;
  box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1);
}

.date-range-picker__input:disabled {
  background-color: #f9fafb;
  color: #6b7280;
  cursor: not-allowed;
}

.date-range-picker__error {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #ef4444;
}

.date-range-picker__actions {
  display: flex;
  justify-content: flex-end;
}

.date-range-picker__clear {
  background: none;
  border: 1px solid #d1d5db;
  color: #6b7280;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.date-range-picker__clear:hover:not(:disabled) {
  border-color: #ff6b6b;
  color: #ff6b6b;
}

.date-range-picker__clear:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .date-range-picker__fields {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
}
</style>
