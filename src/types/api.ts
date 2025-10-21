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
  creator: string
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
  user: string
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
  user: string
  post: string
}

export interface GetPostsRequest {
  user: string
}

export interface GetPostsResponse {
  posts: Post[]
}

// Friending API
export interface FriendActionRequest {
  user: string
  friend: string
}

export interface GetIncomingRequestsRequest {
  user: string
}

export type GetIncomingRequestsResponse = string[] // Array of user IDs

export interface GetOutgoingRequestsRequest {
  user: string
}

export type GetOutgoingRequestsResponse = string[] // Array of user IDs

export interface GetFriendsRequest {
  user: string
}

export type GetFriendsResponse = string[] // Array of user IDs

// Wishlist API
export interface WishlistPlace {
  _id?: string
  user?: string
  city: string
  region: string
  country: string
}

export interface AddPlaceRequest {
  user: string
  city: string
  region: string
  country: string
}

export interface AddPlaceResponse {
  place: string
}

export interface RemovePlaceRequest {
  user: string
  place: string
}

export interface GetPlacesRequest {
  user: string
}

export interface GetPlacesResponse {
  places: WishlistPlace[]
}
