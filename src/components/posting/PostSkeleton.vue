<template>
  <div class="post-skeleton">
    <div class="post-skeleton__header">
      <div class="post-skeleton__title"></div>
      <div class="post-skeleton__actions"></div>
    </div>

    <div class="post-skeleton__location">
      <div class="post-skeleton__icon"></div>
      <div class="post-skeleton__text"></div>
    </div>

    <div class="post-skeleton__dates">
      <div class="post-skeleton__icon"></div>
      <div class="post-skeleton__text"></div>
    </div>

    <div class="post-skeleton__description">
      <div class="post-skeleton__line"></div>
      <div class="post-skeleton__line"></div>
      <div class="post-skeleton__line post-skeleton__line--short"></div>
    </div>

    <div class="post-skeleton__footer">
      <div class="post-skeleton__meta"></div>
      <div class="post-skeleton__button"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  count?: number
}

withDefaults(defineProps<Props>(), {
  count: 1,
})
</script>

<style scoped>
.post-skeleton {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
  animation: pulse 2s infinite;
}

.post-skeleton__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.post-skeleton__title {
  height: 1.5rem;
  width: 60%;
  background-color: #e5e7eb;
  border-radius: 0.25rem;
}

.post-skeleton__actions {
  height: 2rem;
  width: 6rem;
  background-color: #e5e7eb;
  border-radius: 0.375rem;
}

.post-skeleton__location,
.post-skeleton__dates {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.post-skeleton__icon {
  width: 1rem;
  height: 1rem;
  background-color: #e5e7eb;
  border-radius: 50%;
}

.post-skeleton__text {
  height: 0.875rem;
  width: 40%;
  background-color: #e5e7eb;
  border-radius: 0.25rem;
}

.post-skeleton__description {
  margin-bottom: 1rem;
}

.post-skeleton__line {
  height: 0.875rem;
  background-color: #e5e7eb;
  border-radius: 0.25rem;
  margin-bottom: 0.5rem;
}

.post-skeleton__line:first-child {
  width: 100%;
}

.post-skeleton__line:nth-child(2) {
  width: 80%;
}

.post-skeleton__line--short {
  width: 60%;
  margin-bottom: 0;
}

.post-skeleton__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.post-skeleton__meta {
  height: 0.875rem;
  width: 5rem;
  background-color: #e5e7eb;
  border-radius: 0.25rem;
}

.post-skeleton__button {
  height: 2rem;
  width: 6rem;
  background-color: #e5e7eb;
  border-radius: 0.375rem;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@media (max-width: 768px) {
  .post-skeleton {
    padding: 1rem;
  }

  .post-skeleton__header {
    flex-direction: column;
    gap: 1rem;
  }

  .post-skeleton__footer {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style>
