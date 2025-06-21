import { Expense, SharedExpense, SharedEvent, CreateSharedEventRequest } from '@/types/expense';

// Use environment variable for API URL, fallback to localhost for development
// For Vercel deployment, both frontend and backend are on the same domain
const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:3001/api');

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Personal Expenses
  async getExpenses() {
    return this.request<Expense[]>('/expenses');
  }

  async createExpense(expense: Omit<Expense, 'id'>) {
    return this.request<Expense>('/expenses', {
      method: 'POST',
      body: JSON.stringify(expense),
    });
  }

  async updateExpense(id: string, expense: Partial<Expense>) {
    return this.request<Expense>(`/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(expense),
    });
  }

  async deleteExpense(id: string) {
    return this.request<{ message: string }>(`/expenses/${id}`, {
      method: 'DELETE',
    });
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