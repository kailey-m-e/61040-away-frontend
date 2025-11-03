import { defineStore } from 'pinia'
import { WishlistService } from '@/services/wishlistService'
import { useAuthStore } from './auth'
import type { WishlistPlace } from '@/types/api'

interface WishlistState {
  places: WishlistPlace[]
  loading: boolean
  error: string | null
}

export const useWishlistStore = defineStore('wishlist', {
  state: (): WishlistState => ({
    places: [],
    loading: false,
    error: null
  }),

  getters: {
    getPlaces: (state) => state.places,
    isLoading: (state) => state.loading,
    hasError: (state) => state.error !== null
  },

  actions: {
    async fetchPlaces() {
      const auth = useAuthStore()
      const sessionId = auth.sessionId

      if (!sessionId) {
        console.warn('wishlistStore.fetchPlaces: no session - aborting')
        this.error = 'Not authenticated'
        return
      }

      // If already loading, skip duplicate request
      if (this.loading) {
        console.log('Already loading wishlist places, skipping duplicate request')
        return
      }

      this.loading = true
      this.error = null

      try {
        console.log('Fetching places with session:', sessionId)
        const result = await WishlistService.getPlaces(sessionId)
        console.log('Fetch places result:', result)
        console.log('Result data type:', typeof result.data)
        console.log('Result data keys:', result.data ? Object.keys(result.data) : 'null')

        if (result.error) {
          throw new Error(result.error)
        }

        // Backend returns { results: WishlistPlace[] }
        if (result.data && 'results' in result.data) {
          console.log('Response has results property:', result.data.results)
          console.log('Results length:', result.data.results?.length)
          this.places = result.data.results.filter((place: WishlistPlace) => place._id && place.city)
          console.log('Filtered places:', this.places)
        } else if (Array.isArray(result.data)) {
          // Fallback for direct array response
          console.log('Response is array:', result.data)
          this.places = (result.data as WishlistPlace[]).filter((place: WishlistPlace) => place._id && place.city)
        } else {
          console.error('Unexpected response format:', result.data)
          this.places = []
        }

        console.log('Updated places in store:', this.places)
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch places'
        console.error('Error fetching places:', error)
      } finally {
        this.loading = false
      }
    },

    async addPlace(city: string, region: string, country: string) {
      const auth = useAuthStore()
      const sessionId = auth.sessionId

      if (!sessionId) {
        console.warn('wishlistStore.addPlace: no session - aborting')
        throw new Error('Not authenticated')
      }

      this.loading = true
      this.error = null

      try {
        const result = await WishlistService.addPlace({
          session: sessionId,
          city,
          region,
          country
        })
        console.log('Add place result:', result)
        if (result.error) {
          throw new Error(result.error)
        }

        // Reset loading before fetching to avoid the duplicate request check
        this.loading = false

        // Re-fetch the full list to ensure consistent state
        await this.fetchPlaces()
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to add place'
        console.error('Error adding place:', error)
        this.loading = false
        throw error
      }
    },

    async removePlace(placeId: string) {
      const auth = useAuthStore()
      const sessionId = auth.sessionId

      if (!sessionId) {
        console.warn('wishlistStore.removePlace: no session - aborting')
        throw new Error('Not authenticated')
      }

      this.loading = true
      this.error = null

      try {
        console.log('Removing place with ID:', placeId)
        console.log('Using session:', sessionId)
        const result = await WishlistService.removePlace({
          session: sessionId,
          place: placeId
        })
        console.log('Remove place result:', result)
        if (result.error) {
          throw new Error(result.error)
        }
        console.log('Place removed successfully, refreshing list...')

        // Reset loading state before fetching to avoid the duplicate request check
        this.loading = false
        await this.fetchPlaces() // Refresh the list
        console.log('List refreshed after removal')
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to remove place'
        console.error('Error removing place:', error)
        this.loading = false
        throw error
      }
    }
  }
})
