<template>
  <div id="app">
    <!-- Top navigation bar -->
    <nav v-if="showNavbar" class="top-nav">
      <div class="top-nav__brand">
        <RouterLink to="/" class="top-nav__logo">
          <img src="./assets/awayLogo.png" alt="away logo" width="120">
        </RouterLink>
      </div>

      <div v-if="isAuthenticated" class="top-nav__links">
        <RouterLink
          to="/postcards"
          class="top-nav__link"
          :class="{ 'router-link-active': isPostcardsActive }"
        >
          <svg class="top-nav__icon" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 7.5L12 2l9 5.5M21 7.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7.5"></path>
            <path d="M3 7.5l9 5.5 9-5.5"></path>
            <rect x="9" y="12" width="6" height="5" rx="1"></rect>
          </svg>
          <span class="top-nav__label">Postcards</span>
        </RouterLink>
        <RouterLink to="/wishlist" class="top-nav__link">
          <svg class="top-nav__icon" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          <span class="top-nav__label">Wishlist</span>
        </RouterLink>
        <RouterLink to="/friends" class="top-nav__link" :class="{ 'router-link-active': isFriendsActive }">
          <svg class="top-nav__icon" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <span class="top-nav__label">Friends</span>
        </RouterLink>
      </div>

      <div class="top-nav__user">
        <template v-if="isAuthenticated">
          <div class="top-nav__user-menu" ref="userMenuRef">
            <button @click="toggleUserMenu" class="top-nav__avatar-button">
              <div class="top-nav__avatar">
                {{ userInitial }}
              </div>
            </button>

            <div v-if="showUserMenu" class="top-nav__dropdown">
              <div class="top-nav__dropdown-username">{{ username }}</div>
              <button @click="handleLogout" class="top-nav__dropdown-logout">
                Logout
              </button>
            </div>
          </div>
        </template>
        <template v-else>
          <RouterLink to="/login" class="top-nav__auth-link">Login</RouterLink>
          <RouterLink to="/register" class="top-nav__auth-link">Register</RouterLink>
        </template>
      </div>
    </nav>

    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, computed, nextTick, ref } from 'vue'
import { RouterLink, RouterView, useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// User menu state
const showUserMenu = ref(false)
const userMenuRef = ref<HTMLElement | null>(null)

// Computed properties to ensure reactivity
const isAuthenticated = computed(() => authStore.isAuthenticated)
const username = computed(() => authStore.username)
const userInitial = computed(() => {
  const name = authStore.username
  return name ? name.charAt(0).toUpperCase() : ''
})

// Hide navbar on login and register pages
const showNavbar = computed(() => {
  const hideOnRoutes = ['/login', '/register']
  return !hideOnRoutes.includes(route.path)
})

// Check if we're on postcards or related pages (create/edit post)
const isPostcardsActive = computed(() => {
  const postcardsRoutes = ['/postcards', '/posts/my', '/posts/create']
  const isPostcardsRoute = postcardsRoutes.includes(route.path)
  const isEditRoute = route.path.startsWith('/posts/') && route.path.endsWith('/edit')
  const isDetailRoute = route.path.startsWith('/posts/') && route.path.match(/^\/posts\/[^/]+$/)
  return isPostcardsRoute || isEditRoute || isDetailRoute
})

// Check if we're on friends or friend profile page
const isFriendsActive = computed(() => {
  return route.path === '/friends' || route.path.startsWith('/friends/')
})

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const handleLogout = async () => {
  // Close the menu
  showUserMenu.value = false

  // Clear auth state
  authStore.logout()

  // Force reactivity update
  await nextTick()

  // Redirect to login page
  await router.push('/login')
}

// Close menu when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
    showUserMenu.value = false
  }
}

// Initialize auth store on app start
onMounted(() => {
  authStore.initializeAuth()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
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

/* Top Navigation */
.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
  position: relative;
}

.top-nav__brand {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.top-nav__logo {
  font-family: Oduda, sans-serif;
  font-weight: 700;
  font-size: 2.2rem;
  color: #ff6b6b;
  text-decoration: none;
  transition: color 0.2s;
  margin-left: 1rem;
  margin-top: 1rem;
}

.top-nav__logo:hover {
  color: #ff5252;
}

.top-nav__links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3rem;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.top-nav__link {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  transition: all 0.2s;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
}

.top-nav__icon {
  flex-shrink: 0;
  stroke: #9ca3af;
  transition: stroke 0.2s;
}

.top-nav__label {
  font-weight: 500;
  font-size: 0.875rem;
  color: #9ca3af;
  transition: color 0.2s;
}

.top-nav__link:hover .top-nav__icon,
.top-nav__link:hover .top-nav__label {
  stroke: #6b7280;
  color: #6b7280;
}

.top-nav__link.router-link-active .top-nav__icon {
  stroke: #ff6b6b;
}

.top-nav__link.router-link-active .top-nav__label {
  color: #ff6b6b;
}

.top-nav__user {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-shrink: 0;
}

.top-nav__user-menu {
  position: relative;
}

.top-nav__avatar-button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: transform 0.2s;
  margin-right: 1rem;
}

.top-nav__avatar-button:hover {
  transform: scale(1.05);
}

.top-nav__avatar {
  width: 3rem;
  height: 3rem;
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

.top-nav__dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  min-width: 200px;
  overflow: hidden;
  z-index: 50;
  animation: dropdownFadeIn 0.2s ease-out;
}

@keyframes dropdownFadeIn {
  from {
    opacity: 0;
    transform: translateY(-0.5rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.top-nav__dropdown-username {
  padding: 1rem;
  font-weight: 500;
  color: #1f2937;
  font-size: 0.875rem;
  border-bottom: 1px solid #e5e7eb;
  background-color: #f8fafc;
}

.top-nav__dropdown-logout {
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  color: #ef4444;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s;
}

.top-nav__dropdown-logout:hover {
  background-color: #fef2f2;
}

.top-nav__auth-link {
  font-weight: 500;
  font-size: 1rem;
  color: #374151;
  text-decoration: none;
  transition: color 0.2s;
  padding: 0.5rem 1rem;
}

.top-nav__auth-link:hover {
  color: #ff6b6b;
}

/* Main content */
.main-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

@media (max-width: 768px) {
  .top-nav {
    flex-direction: column;
    gap: 1rem;
  }

  .top-nav__links {
    position: static;
    transform: none;
    width: 100%;
    gap: 1.5rem;
  }

  .top-nav__icon {
    width: 30px;
    height: 30px;
  }

  .top-nav__label {
    font-size: 1rem;
  }
}
</style>
