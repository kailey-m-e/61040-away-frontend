import { defineStore } from 'pinia'
import { FriendingService } from '@/services/friendingService'
import { useAuthStore } from './auth'

interface FriendingState {
  incomingRequests: string[] // Array of user IDs
  friends: string[]
  outgoingRequests: string[]
  loading: boolean
  error: string | null
}

export const useFriendingStore = defineStore('friending', {
  state: (): FriendingState => ({
    incomingRequests: [],
    friends: [],
    outgoingRequests: [],
    loading: false,
    error: null
  }),

  getters: {
    getIncomingRequests: (state) => state.incomingRequests,
    getFriends: (state) => state.friends,
    getOutgoingRequests: (state) => state.outgoingRequests,
    isLoading: (state) => state.loading,
    hasError: (state) => state.error !== null
  },

  actions: {
    async fetchIncomingRequests() {
      const auth = useAuthStore()
      const sessionId = auth.sessionId

      if (!sessionId) {
        throw new Error('Not authenticated')
      }

      this.loading = true
      this.error = null

      try {
        console.log('Fetching incoming requests with session:', sessionId)
        const result = await FriendingService.getIncomingRequests(sessionId)
        console.log('Incoming requests result:', result)

        if (result.error) {
          // If user doesn't exist in Friending yet, initialize with empty array
          if (result.error.includes('null') || result.error.includes('not found')) {
            console.warn('User not initialized in Friending yet, using empty incoming requests')
            this.incomingRequests = []
            return
          }
          throw new Error(result.error)
        }

        if (result.data && 'results' in result.data) {
          console.log('Setting incoming requests:', result.data.results)
          this.incomingRequests = result.data.results
        } else {
          console.log('Result data is not in expected format:', result.data)
          this.incomingRequests = []
        }
        console.log('Final incoming requests state:', this.incomingRequests)
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch incoming requests'
        console.error('Error fetching incoming requests:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchOutgoingRequests() {
      const auth = useAuthStore()
      const sessionId = auth.sessionId

      if (!sessionId) {
        throw new Error('Not authenticated')
      }

      this.loading = true
      this.error = null

      try {
        console.log('Store: Fetching outgoing requests...')
        const result = await FriendingService.getOutgoingRequests(sessionId)
        console.log('Store: Outgoing requests result:', result)

        if (result.error) {
          // If user doesn't exist in Friending yet, initialize with empty array
          if (result.error.includes('null') || result.error.includes('not found')) {
            console.warn('User not initialized in Friending yet, using empty outgoing requests')
            this.outgoingRequests = []
            return
          }
          throw new Error(result.error)
        }

        if (result.data && 'results' in result.data) {
          console.log('Store: Setting outgoingRequests to:', result.data.results)
          this.outgoingRequests = result.data.results
          console.log('Store: outgoingRequests is now:', this.outgoingRequests)
        } else {
          console.log('Store: Result data not in expected format, setting to empty array')
          this.outgoingRequests = []
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch outgoing requests'
        console.error('Error fetching outgoing requests:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchFriends() {
      const auth = useAuthStore()
      const sessionId = auth.sessionId

      if (!sessionId) {
        throw new Error('Not authenticated')
      }

      this.loading = true
      this.error = null

      try {
        const result = await FriendingService.getFriends(sessionId)

        if (result.error) {
          // If user doesn't exist in Friending yet, initialize with empty array
          if (result.error.includes('null') || result.error.includes('not found')) {
            console.warn('User not initialized in Friending yet, using empty friends list')
            this.friends = []
            return
          }
          throw new Error(result.error)
        }

        if (result.data && 'results' in result.data) {
          this.friends = result.data.results
        } else {
          this.friends = []
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch friends'
        console.error('Error fetching friends:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchAllFriendData() {
      const auth = useAuthStore()
      if (!auth.user) {
        throw new Error('Not authenticated')
      }

      // Fetch all friend-related data in parallel
      await Promise.all([
        this.fetchIncomingRequests(),
        this.fetchOutgoingRequests(),
        this.fetchFriends()
      ])
    },

    async sendFriendRequest(friendUsername: string) {
      const auth = useAuthStore()
      const sessionId = auth.sessionId

      if (!sessionId) {
        throw new Error('Not authenticated')
      }

      // Validation: friend does not equal user
      if (auth.user?.username === friendUsername) {
        throw new Error('You cannot send a friend request to yourself')
      }

      // Validation: friend is not already in user's friends
      if (this.friends.includes(friendUsername)) {
        throw new Error(`You are already friends with ${friendUsername}`)
      }

      // Validation: friend is not already in user's outgoingRequests
      if (this.outgoingRequests.includes(friendUsername)) {
        throw new Error(`You have already sent a friend request to ${friendUsername}`)
      }

      // Validation: user is not already in friend's outgoingRequests (incoming request exists)
      if (this.incomingRequests.includes(friendUsername)) {
        throw new Error(`${friendUsername} has already sent you a friend request. Please accept it instead.`)
      }

      this.loading = true
      this.error = null

      try {
        console.log('Store: Sending friend request to:', friendUsername)
        const result = await FriendingService.requestFriend({
          session: sessionId,
          friend: friendUsername
        })
        console.log('Store: Friend request result:', result)

        if (result.error) {
          throw new Error(result.error)
        }

        // Reset loading before fetching to avoid duplicate request check
        this.loading = false

        console.log('Store: Friend request successful, refreshing outgoing requests...')
        // Refresh outgoing requests to get updated list from backend
        try {
          await this.fetchOutgoingRequests()
          console.log('Store: Finished refreshing outgoing requests')
        } catch (err) {
          console.warn('Could not fetch outgoing requests (endpoint may not be available):', err)
          // Don't throw - allow the friend request to complete successfully
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to send friend request'
        console.error('Error sending friend request:', error)
        this.loading = false
        throw error
      }
    },

    async cancelFriendRequest(friendUsername: string) {
      const auth = useAuthStore()
      const sessionId = auth.sessionId

      if (!sessionId) {
        throw new Error('Not authenticated')
      }

      // Validation: friend exists in user's set of outgoingRequests
      if (!this.outgoingRequests.includes(friendUsername)) {
        throw new Error(`You have not sent a friend request to ${friendUsername}`)
      }

      this.loading = true
      this.error = null

      try {
        const result = await FriendingService.unrequestFriend({
          session: sessionId,
          friend: friendUsername
        })

        if (result.error) {
          throw new Error(result.error)
        }

        // Reset loading before fetching
        this.loading = false

        // Refresh outgoing requests to get updated list from backend
        try {
          await this.fetchOutgoingRequests()
        } catch (err) {
          console.warn('Could not fetch outgoing requests (endpoint may not be available):', err)
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to cancel friend request'
        console.error('Error canceling friend request:', error)
        this.loading = false
        throw error
      }
    },

    async acceptFriendRequest(friendUsername: string) {
      const auth = useAuthStore()
      const sessionId = auth.sessionId

      if (!sessionId) {
        throw new Error('Not authenticated')
      }

      // Validation: user exists in friend's set of outgoingRequests (i.e., incoming request exists)
      if (!this.incomingRequests.includes(friendUsername)) {
        throw new Error(`${friendUsername} has not sent you a friend request`)
      }

      this.loading = true
      this.error = null

      try {
        const result = await FriendingService.acceptFriend({
          session: sessionId,
          friend: friendUsername
        })

        if (result.error) {
          throw new Error(result.error)
        }

        // Reset loading before fetching
        this.loading = false

        // Refresh all data to ensure both users see the updated friends list
        try {
          await Promise.all([
            this.fetchIncomingRequests(),
            this.fetchFriends()
          ])
        } catch (err) {
          console.warn('Could not fetch updated data (endpoints may not be available):', err)
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to accept friend request'
        console.error('Error accepting friend request:', error)
        this.loading = false
        throw error
      }
    },    async rejectFriendRequest(friendUsername: string) {
      const auth = useAuthStore()
      const sessionId = auth.sessionId

      if (!sessionId) {
        throw new Error('Not authenticated')
      }

      // Validation: user exists in friend's set of outgoingRequests (i.e., incoming request exists)
      if (!this.incomingRequests.includes(friendUsername)) {
        throw new Error(`${friendUsername} has not sent you a friend request`)
      }

      this.loading = true
      this.error = null

      try {
        const result = await FriendingService.rejectFriend({
          session: sessionId,
          friend: friendUsername
        })

        if (result.error) {
          throw new Error(result.error)
        }

        // Reset loading before fetching
        this.loading = false

        // Refresh incoming requests to get updated list from backend
        try {
          await this.fetchIncomingRequests()
        } catch (err) {
          console.warn('Could not fetch incoming requests (endpoint may not be available):', err)
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to reject friend request'
        console.error('Error rejecting friend request:', error)
        this.loading = false
        throw error
      }
    },

    async removeFriend(friendUsername: string) {
      const auth = useAuthStore()
      const sessionId = auth.sessionId

      if (!sessionId) {
        throw new Error('Not authenticated')
      }

      // Validation: friend exists in user's set of friends
      if (!this.friends.includes(friendUsername)) {
        throw new Error(`${friendUsername} is not your friend`)
      }

      this.loading = true
      this.error = null

      try {
        const result = await FriendingService.endFriendship({
          session: sessionId,
          friend: friendUsername
        })

        if (result.error) {
          throw new Error(result.error)
        }

        // Reset loading before fetching
        this.loading = false

        // Refresh friends list to get updated list from backend
        try {
          await this.fetchFriends()
        } catch (err) {
          console.warn('Could not fetch friends (endpoint may not be available):', err)
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to remove friend'
        console.error('Error removing friend:', error)
        this.loading = false
        throw error
      }
    },

    clearState() {
      this.incomingRequests = []
      this.friends = []
      this.outgoingRequests = []
      this.loading = false
      this.error = null
    }
  }
})
