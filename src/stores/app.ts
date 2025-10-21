import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Notification, AppState } from '@/types'

export const useAppStore = defineStore('app', () => {
  // State
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const notifications = ref<Notification[]>([])

  // Actions
  const setLoading = (loading: boolean): void => {
    isLoading.value = loading
  }

  const setError = (errorMessage: string | null): void => {
    error.value = errorMessage
  }

  const addNotification = (notification: Omit<Notification, 'id'>): void => {
    const id = Date.now().toString()
    const newNotification: Notification = {
      ...notification,
      id,
    }

    notifications.value.push(newNotification)

    // Auto-remove notification after duration (default 5 seconds)
    const duration = notification.duration || 5000
    setTimeout(() => {
      removeNotification(id)
    }, duration)
  }

  const removeNotification = (id: string): void => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const clearNotifications = (): void => {
    notifications.value = []
  }

  const showSuccess = (message: string, duration?: number): void => {
    addNotification({ type: 'success', message, duration })
  }

  const showError = (message: string, duration?: number): void => {
    addNotification({ type: 'error', message, duration })
  }

  const showWarning = (message: string, duration?: number): void => {
    addNotification({ type: 'warning', message, duration })
  }

  const showInfo = (message: string, duration?: number): void => {
    addNotification({ type: 'info', message, duration })
  }

  return {
    // State
    isLoading,
    error,
    notifications,

    // Actions
    setLoading,
    setError,
    addNotification,
    removeNotification,
    clearNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  }
})
