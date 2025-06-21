export interface Expense {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  paymentMode: string;
  splitInfo?: {
    totalPeople: number;
    amountPerPerson: number;
  };
}

export interface SharedExpense {
  id: string;
  eventId: string;
  description: string;
  amount: number;
  paidBy: string;
  splitBetween: string[];
  date: string;
  category: string;
  paymentMode: string;
  createdBy: string;
  createdAt: string;
}

export interface SharedEvent {
  id: string;
  name: string;
  description?: string;
  shareCode: string;
  isActive: boolean;
  expenseCount?: number;
  totalAmount?: number;
  expenses?: SharedExpense[];
  createdAt: string;
}

export interface CreateSharedEventRequest {
  name: string;
  description?: string;
}

export interface Settlement {
  from: string;
  to: string;
  amount: number;
}
