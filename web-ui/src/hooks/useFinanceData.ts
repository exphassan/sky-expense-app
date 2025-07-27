import { useState, useEffect } from 'react';
import { Expense, Income, Debt, Investment, Subscription } from '../types';

export const useFinanceData = (userId?: string) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  useEffect(() => {
    if (userId) {
      loadData();
    }
  }, [userId]);

  const loadData = () => {
    setExpenses(JSON.parse(localStorage.getItem(`xpensify_expenses_${userId}`) || '[]'));
    setIncomes(JSON.parse(localStorage.getItem(`xpensify_incomes_${userId}`) || '[]'));
    setDebts(JSON.parse(localStorage.getItem(`xpensify_debts_${userId}`) || '[]'));
    setInvestments(JSON.parse(localStorage.getItem(`xpensify_investments_${userId}`) || '[]'));
    setSubscriptions(JSON.parse(localStorage.getItem(`xpensify_subscriptions_${userId}`) || '[]'));
  };

  const saveExpenses = (newExpenses: Expense[]) => {
    setExpenses(newExpenses);
    localStorage.setItem(`xpensify_expenses_${userId}`, JSON.stringify(newExpenses));
  };

  const saveIncomes = (newIncomes: Income[]) => {
    setIncomes(newIncomes);
    localStorage.setItem(`xpensify_incomes_${userId}`, JSON.stringify(newIncomes));
  };

  const saveDebts = (newDebts: Debt[]) => {
    setDebts(newDebts);
    localStorage.setItem(`xpensify_debts_${userId}`, JSON.stringify(newDebts));
  };

  const saveInvestments = (newInvestments: Investment[]) => {
    setInvestments(newInvestments);
    localStorage.setItem(`xpensify_investments_${userId}`, JSON.stringify(newInvestments));
  };

  const saveSubscriptions = (newSubscriptions: Subscription[]) => {
    setSubscriptions(newSubscriptions);
    localStorage.setItem(`xpensify_subscriptions_${userId}`, JSON.stringify(newSubscriptions));
  };

  const addExpense = (expense: Omit<Expense, 'id' | 'createdDate' | 'updatedDate'>) => {
    const newExpense: Expense = {
      ...expense,
      id: crypto.randomUUID(),
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString()
    };
    saveExpenses([...expenses, newExpense]);
  };

  const addIncome = (income: Omit<Income, 'id' | 'createdDate' | 'updatedDate'>) => {
    const newIncome: Income = {
      ...income,
      id: crypto.randomUUID(),
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString()
    };
    saveIncomes([...incomes, newIncome]);
  };

  const addDebt = (debt: Omit<Debt, 'id' | 'createdDate' | 'updatedDate'>) => {
    const newDebt: Debt = {
      ...debt,
      id: crypto.randomUUID(),
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString()
    };
    saveDebts([...debts, newDebt]);
  };

  const addInvestment = (investment: Omit<Investment, 'id' | 'createdDate' | 'updatedDate'>) => {
    const newInvestment: Investment = {
      ...investment,
      id: crypto.randomUUID(),
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString()
    };
    saveInvestments([...investments, newInvestment]);
  };

  const addSubscription = (subscription: Omit<Subscription, 'id' | 'createdDate' | 'updatedDate'>) => {
    const newSubscription: Subscription = {
      ...subscription,
      id: crypto.randomUUID(),
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString()
    };
    saveSubscriptions([...subscriptions, newSubscription]);
  };

  const updateDebtStatus = (debtId: string, status: 'Active' | 'Paid' | 'Overdue') => {
    const updatedDebts = debts.map(debt => 
      debt.id === debtId 
        ? { ...debt, status: status as any, updatedDate: new Date().toISOString() }
        : debt
    );
    saveDebts(updatedDebts);
  };

  const deleteExpense = (id: string) => {
    saveExpenses(expenses.filter(e => e.id !== id));
  };

  const deleteIncome = (id: string) => {
    saveIncomes(incomes.filter(i => i.id !== id));
  };

  const deleteDebt = (id: string) => {
    saveDebts(debts.filter(d => d.id !== id));
  };

  const deleteInvestment = (id: string) => {
    saveInvestments(investments.filter(i => i.id !== id));
  };

  const deleteSubscription = (id: string) => {
    saveSubscriptions(subscriptions.filter(s => s.id !== id));
  };

  return {
    expenses,
    incomes,
    debts,
    investments,
    subscriptions,
    addExpense,
    addIncome,
    addDebt,
    addInvestment,
    addSubscription,
    updateDebtStatus,
    deleteExpense,
    deleteIncome,
    deleteDebt,
    deleteInvestment,
    deleteSubscription
  };
};