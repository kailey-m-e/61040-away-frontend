<template>
  <div id="app">
    <nav>
      <div class="nav__brand">
        <RouterLink to="/" class="nav__logo">
          away
        </RouterLink>
      </div>

      <div class="nav__links">
        <RouterLink v-if="isAuthenticated" to="/postcards">Postcards</RouterLink>
        <RouterLink v-if="isAuthenticated" to="/wishlist">Wishlist</RouterLink>
        <RouterLink v-if="isAuthenticated" to="/friends">Friends</RouterLink>

        <template v-if="isAuthenticated">
          <div class="nav__user-menu" ref="userMenuRef">
            <button @click="toggleUserMenu" class="nav__avatar-button">
              <div class="nav__avatar">
                {{ userInitial }}
              </div>
            </button>

            <div v-if="showUserMenu" class="nav__dropdown">
              <div class="nav__dropdown-username">{{ username }}</div>
              <button @click="handleLogout" class="nav__dropdown-logout">
                Logout
              </button>
            </div>
          </div>
        </template>
        <template v-else>
          <RouterLink to="/login">Login</RouterLink>
          <RouterLink to="/register">Register</RouterLink>
        </template>
      </div>
    </nav>

    <main>
      <RouterView v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </RouterView>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, computed, nextTick, ref } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
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

nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.nav__brand {
  display: flex;
  align-items: center;
}

.nav__logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: Oduda, sans-serif;
  font-weight: 700;
  font-size: 2.2rem;
  color: #ff6b6b;
  text-decoration: none;
  transition: color 0.2s;
}

.nav__logo:hover {
  color: #ff5252;
}

.nav__links {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav__links a {
  font-weight: 500;
  font-size: 1.25rem;
  color: #374151;
  text-decoration: none;
  transition: color 0.2s;
}

.nav__links a:hover {
  color: #ff6b6b;
}

.nav__links a.router-link-exact-active {
  color: #ff6b6b;
}

.nav__user-menu {
  position: relative;
}

.nav__avatar-button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: transform 0.2s;
}

.nav__avatar-button:hover {
  transform: scale(1.05);
}

.nav__avatar {
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

.nav__dropdown {
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

.nav__dropdown-username {
  padding: 1rem;
  font-weight: 500;
  color: #1f2937;
  font-size: 0.875rem;
  border-bottom: 1px solid #e5e7eb;
  background-color: #f8fafc;
}

.nav__dropdown-logout {
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

.nav__dropdown-logout:hover {
  background-color: #fef2f2;
}

.nav__auth {
  display: flex;
  align-items: center;
}

main {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

@media (max-width: 768px) {
  nav {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }

  .nav__links {
    gap: 1rem;
  }
}
</style>
