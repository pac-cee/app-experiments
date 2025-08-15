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
