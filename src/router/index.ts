import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/postcards'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginPage.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/auth/RegisterPage.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/postcards',
      name: 'postcards',
      component: () => import('../views/posts/MyPostsPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/posts/my',
      redirect: '/postcards'
    },
    {
      path: '/posts/create',
      name: 'create-post',
      component: () => import('../views/posts/CreatePostPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/posts/:id',
      name: 'post-detail',
      component: () => import('../views/posts/PostDetailPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/posts/:id/edit',
      name: 'edit-post',
      component: () => import('../views/posts/EditPostPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/wishlist',
      name: 'wishlist',
      component: () => import('../views/wishlist/WishlistPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/friends',
      name: 'friends',
      component: () => import('../views/friends/FriendsPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/friends/:username',
      name: 'friend-profile',
      component: () => import('../views/friends/FriendProfilePage.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

// Navigation guard to handle authentication
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()

  const requiresAuth = to.meta.requiresAuth !== false // Default to true
  const isAuthenticated = authStore.isAuthenticated

  if (requiresAuth && !isAuthenticated) {
    // Redirect to login if route requires auth and user is not authenticated
    next('/login')
  } else if ((to.path === '/login' || to.path === '/register') && isAuthenticated) {
    // Redirect to postcards if already authenticated and trying to access login/register
    next('/postcards')
  } else {
    next()
  }
})

export default router
