<template>
  <div class="post-list">
    <div v-if="loading" class="post-list__loading">
      <PostSkeleton v-for="n in 3" :key="n" />
    </div>

    <div v-else-if="posts.length === 0" class="post-list__empty">
      <EmptyPostsState
        :message="emptyMessage"
        :action-text="emptyActionText"
        @action="handleEmptyAction"
      />
    </div>

    <div v-else class="post-list__content">
      <div class="post-list__header">
        <h2 class="post-list__title">{{ title }}</h2>
        <div class="post-list__controls">
          <button
            @click="toggleViewMode"
            class="post-list__view-toggle"
            :class="{ 'active': viewMode === 'grid' }"
          >
            <svg v-if="viewMode === 'list'" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <div
        class="post-list__grid"
        :class="{
          'post-list__grid--list': viewMode === 'list',
          'post-list__grid--grid': viewMode === 'grid'
        }"
      >
        <PostCard
          v-for="post in sortedPosts"
          :key="post._id"
          :post="post"
          :show-actions="showActions"
          :user="user"
          @edit-post="handleEditPost"
          @delete-post="handleDeletePost"
          @view-post="handleViewPost"
        />
      </div>

      <div v-if="hasMore" class="post-list__pagination">
        <button
          @click="loadMore"
          class="post-list__load-more"
          :disabled="loadingMore"
        >
          {{ loadingMore ? 'Loading...' : 'Load More' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import PostCard from './PostCard.vue'
import PostSkeleton from './PostSkeleton.vue'
import EmptyPostsState from './EmptyPostsState.vue'
import type { Post, User } from '@/types'

interface Props {
  posts: Post[]
  user?: User | null
  loading?: boolean
  title?: string
  emptyMessage?: string
  emptyActionText?: string
  showActions?: boolean
  hasMore?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  title: 'Posts',
  emptyMessage: 'No posts found',
  showActions: true,
  hasMore: false,
})

const emit = defineEmits<{
  'post-selected': [post: Post]
  'edit-post': [post: Post]
  'delete-post': [post: Post]
  'view-post': [post: Post]
  'load-more': []
  'empty-action': []
}>()

const viewMode = ref<'grid' | 'list'>('grid')
const loadingMore = ref(false)

const sortedPosts = computed(() => {
  return [...props.posts].sort((a, b) => {
    const dateA = a.start ? new Date(a.start) : new Date(0)
    const dateB = b.start ? new Date(b.start) : new Date(0)
    return dateB.getTime() - dateA.getTime() // Most recent first
  })
})

const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid'
}

const handleEditPost = (post: Post) => {
  emit('edit-post', post)
}

const handleDeletePost = (post: Post) => {
  emit('delete-post', post)
}

const handleViewPost = (post: Post) => {
  emit('view-post', post)
}

const handleEmptyAction = () => {
  emit('empty-action')
}

const loadMore = async () => {
  loadingMore.value = true
  emit('load-more')
  setTimeout(() => {
    loadingMore.value = false
  }, 1000)
}
</script>

<style scoped>
.post-list {
  width: 100%;
}

.post-list__loading {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.post-list__empty {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.post-list__content {
  width: 100%;
}

.post-list__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.post-list__title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.post-list__controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.post-list__view-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: white;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.post-list__view-toggle:hover {
  border-color: #ff6b6b;
  color: #ff6b6b;
}

.post-list__view-toggle.active {
  border-color: #ff6b6b;
  background-color: #ff6b6b;
  color: white;
}

.post-list__grid {
  display: grid;
  gap: 1.5rem;
}

.post-list__grid--grid {
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

.post-list__grid--list {
  grid-template-columns: 1fr;
}

.post-list__pagination {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.post-list__load-more {
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

.post-list__load-more:hover:not(:disabled) {
  background-color: #ff5252;
}

.post-list__load-more:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .post-list__header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .post-list__grid--grid {
    grid-template-columns: 1fr;
  }
}
</style>
