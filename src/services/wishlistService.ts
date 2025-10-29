import apiClient from './apiClient'
import type {
  WishlistPlace,
  AddPlaceRequest,
  AddPlaceResponse,
  RemovePlaceRequest,
  GetPlacesRequest,
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
      const response = await apiClient.post('/api/Wishlist/removePlace', data)
      return { data: response.data }
    } catch (error: any) {
      return { error: error.response?.data?.error || 'Failed to remove place from wishlist' }
    }
  }

  /**
   * Get all places in user's wishlist
   */
  static async getPlaces(data: GetPlacesRequest): Promise<ApiResponse<GetPlacesResponse>> {
    try {
      console.log('WishlistService: Fetching places, request:', data)
      // Query endpoints use POST with query parameters
      const response = await apiClient.post('/api/Wishlist/_getPlaces', data)
      console.log('WishlistService: Get places response:', response.data)
      return { data: response.data }
    } catch (error: any) {
      console.error('WishlistService: Error getting places:', error.response?.data || error)
      return { error: error.response?.data?.error || 'Failed to get wishlist places' }
    }
  }
}
