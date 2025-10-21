import { API_CONFIG, API_ENDPOINTS } from '@/config/api'

// User Authentication API Types
export interface User {
  id: string
  username: string
  hashedPassword: string
  salt: string
}

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

export type AuthenticateResponse = Record<string, never>

// User Authentication API Service
class AuthApi {
  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    try {
      const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.USER_AUTH.REGISTER}`;
      console.log('Attempting to register user at:', url);

      // Test server connection first
      try {
        const testResponse = await fetch(API_CONFIG.BASE_URL, {
          method: 'HEAD',
          mode: 'no-cors'
        });
        console.log('Server connection test:', testResponse.status);
      } catch (e) {
        console.error('Server connection test failed:', e);
        throw new Error(`Cannot connect to server at ${API_CONFIG.BASE_URL}. Please ensure the backend server is running.`);
      }

      // Log full request details
      const requestConfig = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': window.location.origin,
        },
        mode: 'cors' as RequestMode,
        body: JSON.stringify(userData),
      };

      console.log('Full request configuration:', {
        url,
        config: { ...requestConfig, body: '[REDACTED]' },
        origin: window.location.origin
      });

      const response = await fetch(url, requestConfig);

      console.log('Response status:', response.status);
      console.log('Response headers:', [...response.headers.entries()]);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Registration failed:', {
          status: response.status,
          statusText: response.statusText,
          headers: [...response.headers.entries()],
          errorText
        });

        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorData.error || `Registration failed: ${response.statusText}`;
        } catch {
          errorMessage = errorText || `Registration failed: ${response.statusText}`;
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Registration successful:', data);
      return data;
    } catch (error) {
      console.error('Registration request failed:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to connect to the registration service');
    }
  }

  async authenticate(credentials: AuthenticateRequest): Promise<AuthenticateResponse> {
    try {
      const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.USER_AUTH.AUTHENTICATE}`;
      console.log('Attempting to authenticate user at:', url);
      console.log('Request payload:', { ...credentials, password: '[REDACTED]' });

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('Authentication failed:', {
          status: response.status,
          statusText: response.statusText,
          errorData
        });
        throw new Error(errorData.message || `Authentication failed: ${response.statusText}`);
      }

      // Handle empty response for authenticate endpoint
      if (response.status === 200 && response.headers.get('content-length') === '0') {
        return {};
      }

      return await response.json();
    } catch (error) {
      console.error('Authentication request failed:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to connect to the authentication service');
    }
  }
}

export const authApi = new AuthApi()
