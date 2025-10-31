// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
}

// API Endpoints
export const API_ENDPOINTS = {
  POSTING: {
    CREATE: '/api/Posting/create',
    GET_POSTS: '/api/Posting/_getPosts',
    DELETE: '/api/Posting/delete',
    EDIT_TITLE: '/api/Posting/editTitle',
    EDIT_PLACE: '/api/Posting/editPlace',
    EDIT_DATES: '/api/Posting/editDates',
    EDIT_DESCRIPTION: '/api/Posting/editDescription',
  },
  USER_AUTH: {
    REGISTER: '/api/UserAuthentication/register',
    AUTHENTICATE: '/api/UserAuthentication/authenticate',
  },
  // Add other API endpoints here as needed
  // FRIENDING: { ... },
  // WISHLIST: { ... },
}
