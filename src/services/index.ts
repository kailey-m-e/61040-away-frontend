// Export all API services
export { UserAuthenticationService } from './userAuthenticationService'
export { PostingService } from './postingService'
export { FriendingService } from './friendingService'
export { WishlistService } from './wishlistService'
export { SessioningService } from './sessioningService'

// Export the API client for direct use if needed
export { default as apiClient } from './apiClient'

// Export all types
export * from '@/types/api'
