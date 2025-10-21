<template>
  <div class="post-card">
    <div class="post-card__header">
      <h3 class="post-card__title">{{ post.title }}</h3>
      <div v-if="showActions && isOwner" class="post-card__actions">
        <PostActions
          :post="post"
          :user="user"
          @action-triggered="handleAction"
        />
      </div>
    </div>

    <div class="post-card__location">
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
      </svg>
      <span>{{ locationText }}</span>
    </div>

    <div class="post-card__dates">
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
      </svg>
      <span>{{ dateText }}</span>
    </div>

    <div class="post-card__description">
      <p v-if="!showFullDescription">{{ truncatedDescription }}</p>
      <p v-else>{{ post.description }}</p>
      <button
        v-if="shouldShowReadMore"
        @click="toggleDescription"
        class="post-card__read-more"
      >
        {{ showFullDescription ? 'Read less' : 'Read more' }}
      </button>
    </div>

    <div class="post-card__footer">
      <div class="post-card__meta">
        <span class="post-card__creator">by {{ post.creator }}</span>
      </div>
      <button
        v-if="!showActions"
        @click="handleViewPost"
        class="post-card__view-button"
      >
        View Post
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import PostActions from './PostActions.vue'
import type { Post, User } from '@/types'

interface Props {
  post: Post
  showActions?: boolean
  user?: User | null
}

const props = withDefaults(defineProps<Props>(), {
  showActions: true,
  user: null,
})

const emit = defineEmits<{
  'edit-post': [post: Post]
  'delete-post': [post: Post]
  'view-post': [post: Post]
}>()

const showFullDescription = ref(false)

const isOwner = computed(() => {
  return props.user && props.post.creator === props.user._id
})

const locationText = computed(() => {
  const { city, region, country } = props.post
  return `${city}, ${region}, ${country}`
})

const dateText = computed(() => {
  const startDate = props.post.start ? new Date(props.post.start).toLocaleDateString() : 'N/A'
  const endDate = props.post.end ? new Date(props.post.end).toLocaleDateString() : 'N/A'
  return `${startDate} - ${endDate}`
})

const truncatedDescription = computed(() => {
  const maxLength = 150
  const description = props.post.description || ''
  if (description.length <= maxLength) {
    return description
  }
  return description.substring(0, maxLength) + '...'
})

const shouldShowReadMore = computed(() => {
  return (props.post.description?.length ?? 0) > 150
})

const toggleDescription = () => {
  showFullDescription.value = !showFullDescription.value
}

const handleAction = (action: string) => {
  switch (action) {
    case 'edit':
      emit('edit-post', props.post)
      break
    case 'delete':
      emit('delete-post', props.post)
      break
  }
}

const handleViewPost = () => {
  emit('view-post', props.post)
}
</script>

<style scoped>
.post-card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
  transition: all 0.2s;
}

.post-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.post-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.post-card__title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  flex: 1;
  margin-right: 1rem;
}

.post-card__actions {
  flex-shrink: 0;
}

.post-card__location,
.post-card__dates {
  display: flex;
  think-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.post-card__description {
  margin-bottom: 1rem;
}

.post-card__description p {
  color: #374151;
  line-height: 1.6;
  margin: 0;
}

.post-card__read-more {
  background: none;
  border: none;
  color: #ff6b6b;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  margin-top: 0.5rem;
  transition: color 0.2s;
}

.post-card__read-more:hover {
  color: #ff5252;
  text-decoration: underline;
}

.post-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.post-card__meta {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.post-card__creator {
  font-size: 0.875rem;
  color: #6b7280;
}

.post-card__view-button {
  background-color: #ff6b6b;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.post-card__view-button:hover {
  background-color: #ff5252;
}

@media (max-width: 768px) {
  .post-card {
    padding: 1rem;
  }

  .post-card__header {
    flex-direction: column;
    gap: 1rem;
  }

  .post-card__title {
    margin-right: 0;
  }

  .post-card__footer {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style>
