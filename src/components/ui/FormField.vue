<template>
  <div class="form-field" :class="{ 'form-field--error': error, 'form-field--required': required }">
    <label v-if="label" class="form-field__label" :for="fieldId">
      {{ label }}
      <span v-if="required" class="form-field__required">*</span>
    </label>

    <div class="form-field__input-wrapper">
      <slot :field-id="fieldId" />
    </div>

    <div v-if="error" class="form-field__error">
      {{ error }}
    </div>

    <div v-if="hint && !error" class="form-field__hint">
      {{ hint }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  label?: string
  error?: string
  required?: boolean
  hint?: string
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
})

const fieldId = computed(() => props.id || `field-${Math.random().toString(36).substr(2, 9)}`)
</script>

<style scoped>
.form-field {
  margin-bottom: 1.5rem;
  width: 100%;
  box-sizing: border-box;
}

.form-field__label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.form-field__required {
  color: #ef4444;
  margin-left: 0.25rem;
}

.form-field__input-wrapper {
  position: relative;
  width: 100%;
  box-sizing: border-box;
}

.form-field__error {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #ef4444;
}

.form-field__hint {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.form-field--error .form-field__label {
  color: #ef4444;
}

.form-field--error input,
.form-field--error textarea,
.form-field--error select {
  border-color: #ef4444;
  box-shadow: 0 0 0 1px #ef4444;
}
</style>
