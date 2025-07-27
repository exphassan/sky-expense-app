
export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: ExpenseCategory;
  createdDate: string;
  updatedDate: string;
}

export enum ExpenseCategory {
  Personal = 'Personal',
  Food = 'Food',
  Home = 'Home',
  Family = 'Family',
  Transportation = 'Transportation',
  Gifts = 'Gifts',
  Utility = 'Utility',
  Investment = 'Investment',
  Savings = 'Savings',
  DebtRepayment = 'DebtRepayment',
  Others = 'Others'
}

