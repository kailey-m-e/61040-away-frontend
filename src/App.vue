<template>
  <div id="app">
    <nav>
      <div class="nav__brand">
        <RouterLink to="/" class="nav__logo">
          Away
        </RouterLink>
      </div>

      <div class="nav__links">
        <RouterLink v-if="isAuthenticated" to="/postcards">Postcards</RouterLink>
        <RouterLink v-if="isAuthenticated" to="/wishlist">Wishlist</RouterLink>
        <RouterLink v-if="isAuthenticated" to="/friends">Friends</RouterLink>

        <template v-if="isAuthenticated">
          <div class="nav__avatar">
            {{ userInitial }}
          </div>
          <button @click="handleLogout" class="nav__logout">Logout</button>
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
import { onMounted, computed, nextTick } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// Computed properties to ensure reactivity
const isAuthenticated = computed(() => authStore.isAuthenticated)
const username = computed(() => authStore.username)
const userInitial = computed(() => {
  const name = authStore.username
  return name ? name.charAt(0).toUpperCase() : ''
})

const handleLogout = async () => {
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
  font-weight: 700;
  font-size: 1.25rem;
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

.nav__avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-color: #ff6b6b;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1rem;
  flex-shrink: 0;
}

.nav__logout {
  background-color: #ff6b6b;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.nav__logout:hover {
  background-color: #ff5252;
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
