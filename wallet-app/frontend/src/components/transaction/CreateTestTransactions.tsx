import React from 'react';
import { Button } from '@mui/material';
import { transactionsAPI } from '../../services/transactionsAPI';
import { Category, Account, TransactionFormData } from '../../types';

interface CreateTestTransactionsProps {
  categories: Category[];
  accounts: Account[];
  onSuccess?: () => void;
}

const CreateTestTransactions: React.FC<CreateTestTransactionsProps> = ({
  categories,
  accounts,
  onSuccess
}) => {
  const handleCreateTestTransactions = async () => {
    try {
      if (!accounts.length) {
        throw new Error('Please create at least one account first');
      }

      const defaultAccount = accounts[0];
      const findCategory = (name: string) => 
        categories.find(c => c.name.toLowerCase() === name.toLowerCase())?._id;

      const testTransactions: TransactionFormData[] = [
        {
          description: 'Monthly Salary',
          amount: '5000',
          type: 'income',
          category: findCategory('Salary') || '',
          account: defaultAccount._id,
          date: new Date().toISOString().split('T')[0],
        },
        {
          description: 'Stock Dividend',
          amount: '500',
          type: 'income',
          category: findCategory('Investment') || '',
          account: defaultAccount._id,
          date: new Date().toISOString().split('T')[0],
        },
        {
          description: 'Grocery Shopping',
          amount: '150',
          type: 'expense',
          category: findCategory('Food & Dining') || '',
          account: defaultAccount._id,
          date: new Date().toISOString().split('T')[0],
        },
        {
          description: 'Gas Fill-up',
          amount: '60',
          type: 'expense',
          category: findCategory('Transportation') || '',
          account: defaultAccount._id,
          date: new Date().toISOString().split('T')[0],
        },
        {
          description: 'Monthly Rent',
          amount: '1200',
          type: 'expense',
          category: findCategory('Housing') || '',
          account: defaultAccount._id,
          date: new Date().toISOString().split('T')[0],
        },
        {
          description: 'Movie Night',
          amount: '30',
          type: 'expense',
          category: findCategory('Entertainment') || '',
          account: defaultAccount._id,
          date: new Date().toISOString().split('T')[0],
        },
        {
