// User types
export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  currency: string;
  language: string;
  theme: 'light' | 'dark';
  notifications: {
    email: boolean;
    push: boolean;
    budget: boolean;
  };
}

// Account types
export type AccountType = 'bank' | 'mobile_money' | 'cash' | 'credit_card' | 'savings' | 'investment';

export interface Account {
  _id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  description?: string;
  accountNumber?: string;
  bankName?: string;
  mobileProvider?: string;
  isDefault?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AccountFormData {
  name: string;
  type: AccountType;
  balance: string;
  currency: string;
  description?: string;
  accountNumber?: string;
  bankName?: string;
  mobileProvider?: string;
  isDefault?: boolean;
}

// Category types
export interface Category {
  _id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon?: string;
