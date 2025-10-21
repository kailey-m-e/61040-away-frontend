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
      if (!auth.user) {
        throw new Error('Not authenticated')
      }

      this.loading = true
      this.error = null

      try {
        console.log('Fetching incoming requests for user:', auth.user.username)
        const result = await FriendingService.getIncomingRequests({ user: auth.user.username })
        console.log('Incoming requests result:', result)

        if (result.error) {
          throw new Error(result.error)
        }

        if (Array.isArray(result.data)) {
          console.log('Setting incoming requests:', result.data)
          this.incomingRequests = result.data
        } else {
          console.log('Result data is not an array:', result.data)
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
      if (!auth.user) {
        throw new Error('Not authenticated')
      }

      this.loading = true
      this.error = null

      try {
        const result = await FriendingService.getOutgoingRequests({ user: auth.user.username })

        if (result.error) {
          throw new Error(result.error)
        }

        if (Array.isArray(result.data)) {
          // Backend now returns array of user IDs directly
          this.outgoingRequests = result.data
        } else {
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
      if (!auth.user) {
        throw new Error('Not authenticated')
      }

      this.loading = true
      this.error = null

      try {
        const result = await FriendingService.getFriends({ user: auth.user.username })

        if (result.error) {
          throw new Error(result.error)
        }

        if (Array.isArray(result.data)) {
          // Backend now returns array of user IDs directly
          this.friends = result.data
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

    async fetchUserFriendData() {
      const auth = useAuthStore()
      if (!auth.user) {
        throw new Error('Not authenticated')
      }

      this.loading = true
      this.error = null

      try {
        // Fetch incoming requests which returns user documents
        const result = await FriendingService.getIncomingRequests({ user: auth.user.username })

        if (result.error) {
          throw new Error(result.error)
        }

        if (Array.isArray(result.data)) {
          // Set incoming requests (users who sent requests to current user)
          this.incomingRequests = result.data

          // We need to fetch the current user's own data separately
          // For now, we'll need to make additional API calls or get this data another way
          // The backend doesn't provide a direct way to get current user's friends/outgoing
          console.log('Need to implement fetching user own friends and outgoing requests')
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch friend data'
        console.error('Error fetching friend data:', error)
      } finally {
        this.loading = false
      }
    },
    async sendFriendRequest(friendUsername: string) {
      const auth = useAuthStore()
      if (!auth.user) {
        throw new Error('Not authenticated')
      }

      // Validation: friend does not equal user
      if (auth.user.username === friendUsername) {
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
        const result = await FriendingService.requestFriend({
          user: auth.user.username,
          friend: friendUsername
        })

        if (result.error) {
          throw new Error(result.error)
        }

        // Refresh outgoing requests to get updated list from backend
        // Temporarily catch errors if endpoint not available
        try {
          await this.fetchOutgoingRequests()
        } catch (err) {
          console.warn('Could not fetch outgoing requests (endpoint may not be available):', err)
          // Don't throw - allow the friend request to complete successfully
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to send friend request'
        console.error('Error sending friend request:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async cancelFriendRequest(friendUsername: string) {
      const auth = useAuthStore()
      if (!auth.user) {
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
          user: auth.user.username,
          friend: friendUsername
        })

        if (result.error) {
          throw new Error(result.error)
        }

        // Refresh outgoing requests to get updated list from backend
        try {
          await this.fetchOutgoingRequests()
        } catch (err) {
          console.warn('Could not fetch outgoing requests (endpoint may not be available):', err)
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to cancel friend request'
        console.error('Error canceling friend request:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async acceptFriendRequest(friendUsername: string) {
      const auth = useAuthStore()
      if (!auth.user) {
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
          user: auth.user.username,
          friend: friendUsername
        })

        if (result.error) {
          throw new Error(result.error)
        }

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
        throw error
      } finally {
        this.loading = false
      }
    },    async rejectFriendRequest(friendUsername: string) {
      const auth = useAuthStore()
      if (!auth.user) {
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
          user: auth.user.username,
          friend: friendUsername
        })

        if (result.error) {
          throw new Error(result.error)
        }

        // Refresh incoming requests to get updated list from backend
        try {
          await this.fetchIncomingRequests()
        } catch (err) {
          console.warn('Could not fetch incoming requests (endpoint may not be available):', err)
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to reject friend request'
        console.error('Error rejecting friend request:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async removeFriend(friendUsername: string) {
      const auth = useAuthStore()
      if (!auth.user) {
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
          user: auth.user.username,
          friend: friendUsername
        })

        if (result.error) {
          throw new Error(result.error)
        }

        // Refresh friends list to get updated list from backend
        try {
          await this.fetchFriends()
        } catch (err) {
          console.warn('Could not fetch friends (endpoint may not be available):', err)
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to remove friend'
        console.error('Error removing friend:', error)
        throw error
      } finally {
        this.loading = false
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
