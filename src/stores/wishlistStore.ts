import { defineStore } from 'pinia'
import { WishlistService } from '@/services/wishlistService'
import { useAuthStore } from './auth'
import type { WishlistPlace, GetPlacesResponse } from '@/types/api'

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
      if (!auth.user) {
        console.warn('wishlistStore.fetchPlaces: no authenticated user - aborting')
        throw new Error('Not authenticated')
      }

      this.loading = true
      this.error = null

      try {
        console.log('Fetching places for user:', auth.user.username)
        const result = await WishlistService.getPlaces({ user: auth.user.username })
        console.log('Fetch places result:', result)

        if (result.error) {
          throw new Error(result.error)
        }

        // Handle the response - backend returns an array directly
        if (Array.isArray(result.data)) {
          console.log('Response is array:', result.data)
          this.places = result.data.filter((place: WishlistPlace) => place._id && place.city)
        } else if (result.data && 'places' in result.data) {
          console.log('Response has places property:', result.data)
          const response = result.data as GetPlacesResponse
          this.places = response.places.filter((place: WishlistPlace) => place._id && place.city)
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
      if (!auth.user) {
        console.warn('wishlistStore.addPlace: no authenticated user - aborting')
        throw new Error('Not authenticated')
      }

      this.loading = true
      this.error = null

      try {
        const result = await WishlistService.addPlace({
          user: auth.user.username,
          city,
          region,
          country
        })
        console.log('Add place result:', result)
        if (result.error) {
          throw new Error(result.error)
        }

        // Re-fetch the full list to ensure consistent state
        await this.fetchPlaces()
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to add place'
        console.error('Error adding place:', error)
      } finally {
        this.loading = false
      }
    },

    async removePlace(placeId: string) {
      const auth = useAuthStore()
      if (!auth.user) {
        console.warn('wishlistStore.removePlace: no authenticated user - aborting')
        throw new Error('Not authenticated')
      }

      this.loading = true
      this.error = null

      try {
        const result = await WishlistService.removePlace({
          user: auth.user.username,
          place: placeId
        })
        if (result.error) {
          throw new Error(result.error)
        }
        await this.fetchPlaces() // Refresh the list
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to remove place'
        console.error('Error removing place:', error)
      } finally {
        this.loading = false
      }
    }
  }
})
