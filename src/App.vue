<template>
  <div id="app">
    <!-- Top bar with hamburger and logo -->
    <div class="top-bar">
      <button @click="toggleSidebar" class="hamburger-button" aria-label="Toggle navigation">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
      <div class="top-bar__logo">away</div>

      <!-- Current page indicator -->
      <div v-if="currentPageInfo" class="top-bar__current-page">
        <svg class="top-bar__page-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-html="currentPageInfo.icon"></svg>
        <span class="top-bar__page-name">{{ currentPageInfo.name }}</span>
      </div>
    </div>

    <!-- Sidebar overlay -->
    <div v-if="sidebarOpen" class="sidebar-overlay" @click="closeSidebar"></div>

    <!-- Collapsible sidebar -->
    <nav class="sidebar" :class="{ 'sidebar--open': sidebarOpen }">
      <div class="sidebar__header">
        <RouterLink to="/" class="sidebar__logo" @click="closeSidebar">
          away
        </RouterLink>
      </div>

      <div class="sidebar__nav">
        <template v-if="isAuthenticated">
          <RouterLink to="/postcards" class="sidebar__link" @click="closeSidebar">
            <svg class="sidebar__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 7.5L12 2l9 5.5M21 7.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7.5"></path>
              <path d="M3 7.5l9 5.5 9-5.5"></path>
              <rect x="9" y="12" width="6" height="5" rx="1"></rect>
            </svg>
            Postcards
          </RouterLink>
          <RouterLink to="/wishlist" class="sidebar__link" @click="closeSidebar">
            <svg class="sidebar__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            Wishlist
          </RouterLink>
          <RouterLink to="/friends" class="sidebar__link" @click="closeSidebar">
            <svg class="sidebar__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            Friends
          </RouterLink>
        </template>
      </div>

      <div class="sidebar__footer">
        <template v-if="isAuthenticated">
          <div class="sidebar__user">
            <div class="sidebar__avatar">
              {{ userInitial }}
            </div>
            <div class="sidebar__user-info">
              <div class="sidebar__username">{{ username }}</div>
              <button @click="handleLogout" class="sidebar__logout">
                Logout
              </button>
            </div>
          </div>
        </template>
        <template v-else>
          <RouterLink to="/login" class="sidebar__link" @click="closeSidebar">
            <svg class="sidebar__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
              <polyline points="10 17 15 12 10 7"></polyline>
              <line x1="15" y1="12" x2="3" y2="12"></line>
            </svg>
            Login
          </RouterLink>
          <RouterLink to="/register" class="sidebar__link" @click="closeSidebar">
            <svg class="sidebar__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="20" y1="8" x2="20" y2="14"></line>
              <line x1="23" y1="11" x2="17" y2="11"></line>
            </svg>
            Register
          </RouterLink>
        </template>
      </div>
    </nav>

    <main class="main-content" :class="{ 'main-content--shifted': sidebarOpen }">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, nextTick, ref } from 'vue'
import { RouterLink, RouterView, useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// Sidebar state
const sidebarOpen = ref(false)

// Page info mapping
const pageInfoMap: Record<string, { name: string; icon: string }> = {
  'postcards': {
    name: 'Postcards',
    icon: '<path d="M3 7.5L12 2l9 5.5M21 7.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7.5"></path><path d="M3 7.5l9 5.5 9-5.5"></path><rect x="9" y="12" width="6" height="5" rx="1"></rect>'
  },
  'wishlist': {
    name: 'Wishlist',
    icon: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>'
  },
  'friends': {
    name: 'Friends',
    icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>'
  }
}

// Current page info
const currentPageInfo = computed(() => {
  const routeName = route.name as string
  if (routeName && pageInfoMap[routeName]) {
    return pageInfoMap[routeName]
  }
  return null
})

// Computed properties to ensure reactivity
const isAuthenticated = computed(() => authStore.isAuthenticated)
const username = computed(() => authStore.username)
const userInitial = computed(() => {
  const name = authStore.username
  return name ? name.charAt(0).toUpperCase() : ''
})

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const closeSidebar = () => {
  sidebarOpen.value = false
}

const handleLogout = async () => {
  // Close the sidebar
  closeSidebar()

  // Clear auth state
  authStore.logout()

  // Force reactivity update
  await nextTick()

  // Redirect to login page
  await router.push('/login')
}

// Initialize auth store on app start
onMounted(() => {
  authStore.initializeAuth()
})
</script>

<style scoped>
#app {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Top bar */
.top-bar {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
  z-index: 40;
  gap: 1rem;
}

.hamburger-button {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: #374151;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
}

.hamburger-button:hover {
  color: #ff6b6b;
  background-color: #f9fafb;
}

.top-bar__logo {
  font-family: Oduda, sans-serif;
  font-weight: 700;
  font-size: 2rem;
  color: #ff6b6b;
}

.top-bar__current-page {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
  margin-right: 1rem;
  font-weight: 600;
  font-size: 1.5rem;
  color: #ff6b6b;
}

.top-bar__page-icon {
  flex-shrink: 0;
  stroke: currentColor;
}

/* Sidebar overlay */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 45;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Sidebar */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 280px;
  background-color: white;
  border-right: 1px solid #e5e7eb;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  transform: translateX(-100%);
  transition: transform 0.3s ease-out;
  z-index: 50;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.sidebar--open {
  transform: translateX(0);
}

.sidebar__header {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
}

.top-bar__logo {
  vertical-align: center;
}

.sidebar__logo {
  font-family: Oduda, sans-serif;
  font-weight: 700;
  font-size: 2.5rem;
  color: #ff6b6b;
  text-decoration: none;
  transition: color 0.2s;
  display: block;
}

.sidebar__logo:hover {
  color: #ff5252;
}

.sidebar__nav {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
}

.sidebar__link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.5rem;
  font-weight: 500;
  font-size: 1rem;
  color: #374151;
  text-decoration: none;
  transition: all 0.2s;
  border-left: 3px solid transparent;
}

.sidebar__link:hover {
  background-color: #f9fafb;
  color: #ff6b6b;
}

.sidebar__link.router-link-active {
  background-color: #fef2f2;
  color: #ff6b6b;
  border-left-color: #ff6b6b;
}

.sidebar__icon {
  flex-shrink: 0;
}

.sidebar__footer {
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
  flex-shrink: 0;
}

.sidebar__user {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
}

.sidebar__avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee9027 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1rem;
  flex-shrink: 0;
}

.sidebar__user-info {
  flex: 1;
  min-width: 0;
}

.sidebar__username {
  font-weight: 600;
  color: #1f2937;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sidebar__logout {
  background: none;
  border: none;
  color: #ef4444;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;
  text-align: left;
}

.sidebar__logout:hover {
  color: #dc2626;
  text-decoration: underline;
}

/* Main content */
.main-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  transition: margin-left 0.3s ease-out;
}

@media (min-width: 1024px) {
  .main-content--shifted {
    margin-left: 0;
  }
}

@media (max-width: 640px) {
  .sidebar {
    width: 100%;
    max-width: 320px;
  }
}
</style>
