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
