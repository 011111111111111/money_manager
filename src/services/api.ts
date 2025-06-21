import { SharedExpense, SharedEvent, CreateSharedEventRequest } from '@/types/expense';

// Determine API URL based on environment
const isProduction = import.meta.env.PROD || window.location.hostname !== 'localhost';
const API_BASE_URL = isProduction ? '/api' : 'http://localhost:3001/api';

console.log('API Base URL:', API_BASE_URL);
console.log('Environment:', import.meta.env.MODE);
console.log('Is Production:', isProduction);

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    userId?: string | null
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      console.log('Making request to:', url);
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      if (userId) {
        headers['X-User-ID'] = userId;
      }
      
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('API Error:', error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Shared Events - Simple link-based system
  async getSharedEvents() {
    return this.request<SharedEvent[]>('/shared-events');
  }

  async createSharedEvent(event: CreateSharedEventRequest) {
    return this.request<SharedEvent>('/shared-events', {
      method: 'POST',
      body: JSON.stringify(event),
    });
  }

  async getSharedEventByCode(shareCode: string) {
    return this.request<SharedEvent & { expenses: SharedExpense[] }>(`/shared-events/${shareCode}`);
  }

  async getSharedEventExpenses(shareCode: string) {
    return this.request<SharedExpense[]>(`/shared-events/${shareCode}/expenses`);
  }

  async addSharedEventExpense(shareCode: string, expense: Omit<SharedExpense, 'id' | 'eventId' | 'createdAt'>) {
    return this.request<SharedExpense>(`/shared-events/${shareCode}/expenses`, {
      method: 'POST',
      body: JSON.stringify(expense),
    });
  }

  // Health check
  async healthCheck() {
    return this.request<{ status: string; message: string }>('/health');
  }
}

export const apiService = new ApiService(); 