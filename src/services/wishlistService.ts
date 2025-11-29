import apiClient from './apiClient'
import type {
  WishlistPlace,
  AddPlaceRequest,
  AddPlaceResponse,
  RemovePlaceRequest,
  GetPlacesResponse,
  ApiResponse,
} from '@/types/api'

export class WishlistService {
  /**
   * Add a new place to wishlist
   */
  static async addPlace(data: AddPlaceRequest): Promise<ApiResponse<AddPlaceResponse>> {
    try {
      console.log('WishlistService: Adding place, request:', data)
      const response = await apiClient.post('/api/Wishlist/addPlace', data)
      console.log('WishlistService: Add place response:', response.data)
      return { data: response.data }
    } catch (error: any) {
      console.error('WishlistService: Error adding place:', error.response?.data || error)
      return { error: error.response?.data?.error || 'Failed to add place to wishlist' }
    }
  }

  /**
   * Remove a place from wishlist
   */
  static async removePlace(data: RemovePlaceRequest): Promise<ApiResponse<{}>> {
    try {
      console.log('WishlistService: Removing place, request:', data)
      const response = await apiClient.post('/api/Wishlist/removePlace', data)
      console.log('WishlistService: Remove place response:', response.data)
      return { data: response.data }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } }; message?: string }
      console.error('WishlistService: Error removing place:', err.response?.data || err)
      return { error: err.response?.data?.error || 'Failed to remove place from wishlist' }
    }
  }

  /**
   * Get all places in user's wishlist
   * If friend parameter is provided, fetches friend's wishlist instead
   * @param sessionId - Current user's session ID
   * @param friendUsername - Optional username of friend whose wishlist to fetch
   */
  static async getPlaces(sessionId: string, friendUsername?: string): Promise<ApiResponse<GetPlacesResponse>> {
    try {
      // Build request body similar to getPosts
      const requestBody: { session: string; friendUsername?: string } = {
        session: sessionId
      }

      // Only add friendUsername to request body if it's provided
      if (friendUsername) {
        requestBody.friendUsername = friendUsername
        console.log('WishlistService: Fetching FRIEND wishlist for:', friendUsername)
      } else {
        console.log('WishlistService: Fetching OWN wishlist (no friend parameter)')
      }

      console.log('WishlistService: Request body:', JSON.stringify(requestBody))
      const response = await apiClient.post('/api/Wishlist/_getPlaces', requestBody)
      console.log('WishlistService: Raw response:', response)
      console.log('WishlistService: Response data:', response.data)

      // Handle the response structure from the sync
      const responseData = response.data
      let places: WishlistPlace[] = []

      if (responseData.results && Array.isArray(responseData.results)) {
        // Backend sync returns results as array of { place: ID, placeData: {...} }
        // Extract the placeData from each object
        places = responseData.results.map((item: { place?: string; placeData?: WishlistPlace } & Partial<WishlistPlace>) => {
          console.log('WishlistService: Processing place item:', item)

          // If item has placeData, use it; otherwise treat the whole item as a place
          if (item.placeData) {
            return item.placeData
          }
          // Fallback: if the item itself looks like a place (has expected fields)
          return item as WishlistPlace
        }).filter((p: WishlistPlace | null | undefined): p is WishlistPlace => p !== null && p !== undefined)
      } else if (Array.isArray(responseData)) {
        // Fallback: response is directly an array
        places = responseData
      } else {
        places = []
      }

      console.log('WishlistService: Processed places:', places)
      console.log('WishlistService: Number of places:', places.length)
      return { data: { results: places } }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } }; message?: string }
      console.error('WishlistService: Error getting places:', err.response?.data || err)
      return { error: err.response?.data?.error || 'Failed to get wishlist places' }
    }
  }
}
