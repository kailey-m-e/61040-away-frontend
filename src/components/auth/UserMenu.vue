<template>
  <div class="user-menu">
    <div class="user-menu__content">
      <div class="user-menu__header">
        <div class="user-menu__avatar">
          {{ userInitials }}
        </div>
        <div class="user-menu__info">
          <div class="user-menu__username">{{ username }}</div>
          <div class="user-menu__email">{{ username }}@away.com</div>
        </div>
      </div>

      <div class="user-menu__divider"></div>

      <div class="user-menu__items">
        <button
          @click="goToProfile"
          class="user-menu__item"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
          </svg>
          Profile
        </button>

        <button
          @click="goToWishlist"
          class="user-menu__item"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zm7-10a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L13 5.414V9a1 1 0 11-2 0V5.414L9.707 6.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0112 2z" clip-rule="evenodd" />
          </svg>
          Wishlist
        </button>

        <button
          @click="goToSettings"
          class="user-menu__item"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
          </svg>
          Settings
        </button>

        <div class="user-menu__divider"></div>

        <button
          @click="handleLogout"
          class="user-menu__item user-menu__item--danger"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd" />
          </svg>
          Sign Out
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore, useAppStore } from '@/stores'

const router = useRouter()
const authStore = useAuthStore()
const appStore = useAppStore()

const username = computed(() => authStore.username || '')
const userInitials = computed(() => {
  const name = username.value
  return name ? name.charAt(0).toUpperCase() : 'U'
})

const emit = defineEmits<{
  close: []
}>()

const goToProfile = () => {
  emit('close')
  router.push('/profile')
}

const goToSettings = () => {
  emit('close')
  router.push('/settings')
}

const goToWishlist = () => {
  emit('close')
  router.push('/wishlist')
}

const handleLogout = () => {
  authStore.logout()
  appStore.showSuccess('You have been signed out')
  emit('close')
  router.push('/login')
}
</script>

<style scoped>
.user-menu {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid #e5e7eb;
  min-width: 200px;
  overflow: hidden;
}

.user-menu__content {
  padding: 0;
}

.user-menu__header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background-color: #f8fafc;
}

.user-menu__avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #42b883 0%, #369870 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1rem;
}

.user-menu__info {
  flex: 1;
}

.user-menu__username {
  font-weight: 500;
  color: #1f2937;
  font-size: 0.875rem;
}

.user-menu__email {
  font-size: 0.75rem;
  color: #6b7280;
}

.user-menu__divider {
  height: 1px;
  background-color: #e5e7eb;
}

.user-menu__items {
  padding: 0.5rem 0;
}

.user-menu__item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  color: #374151;
  font-size: 0.875rem;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s;
}

.user-menu__item:hover {
  background-color: #f3f4f6;
}

.user-menu__item--danger {
  color: #ef4444;
}

.user-menu__item--danger:hover {
  background-color: #fef2f2;
}
</style>
