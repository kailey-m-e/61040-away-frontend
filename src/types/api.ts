// API-specific request/response types used across services
// Keep shapes minimal and compatible with the service implementations

export type ApiResponse<T = unknown> = {
  data?: T
  error?: string
}

// User authentication
export interface RegisterRequest {
  username: string
  password: string
}

export interface RegisterResponse {
  user: string
}

export interface AuthenticateRequest {
  username: string
  password: string
}

// AuthenticateResponse: backend returns an empty object on success; represent as a generic record
export type AuthenticateResponse = Record<string, unknown>

// Posting API
export interface Post {
  _id: string
  creator: string
  title: string
  city: string
  region?: string
  country?: string
  start?: string
  end?: string
  description?: string
}

export interface CreatePostRequest {
  session: string
  title: string
  city: string
  region?: string
  country?: string
  start?: string
  end?: string
  description?: string
}

export interface CreatePostResponse {
  post: string
}

export interface EditPostRequest {
  session: string
  user?: string
  post: string
  title?: string
  city?: string
  region?: string
  country?: string
  start?: string
  end?: string
  description?: string
}

export interface EditPostResponse {
  post?: string
}

export interface DeletePostRequest {
  session: string
  post: string
}

export interface GetPostsRequest {
  session: string
  friend?: string // Optional: if provided, fetches friend's posts instead of own posts
}

export interface GetPostsResponse {
  posts: Post[]
}

// Friending API
export interface FriendActionRequest {
  session: string
  friend: string
}

export interface GetIncomingRequestsRequest {
  session: string
}

export interface GetIncomingRequestsResponse {
  results: string[] // Array of friend usernames
}

export interface GetOutgoingRequestsRequest {
  session: string
}

export interface GetOutgoingRequestsResponse {
  results: string[] // Array of friend usernames
}

export interface GetFriendsRequest {
  session: string
}

export interface GetFriendsResponse {
  results: string[] // Array of friend usernames
}

// Wishlist API
export interface WishlistPlace {
  _id?: string
  user?: string
  city: string
  region: string
  country: string
}

export interface AddPlaceRequest {
  session: string
  city: string
  region: string
  country: string
}

export interface AddPlaceResponse {
  place: WishlistPlace
}

export interface RemovePlaceRequest {
  session: string
  place: string
}

export interface GetPlacesRequest {
  session: string
}

export interface GetPlacesResponse {
  results: WishlistPlace[]
}
