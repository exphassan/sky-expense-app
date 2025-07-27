// Enums matching the PRD specifications
export enum Gender {
  Female = 'Female',
  Male = 'Male',
  Unknown = 'Unknown'
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

export enum IncomeCategory {
  Paycheck = 'Paycheck',
  Interest = 'Interest',
  InvestmentReturn = 'InvestmentReturn',
  Dividend = 'Dividend',
  Gift = 'Gift',
  Allowance = 'Allowance',
  Other = 'Other'
}

export enum DebtCategory {
  Personal = 'Personal',
  Food = 'Food',
  Home = 'Home',
  Family = 'Family',
  Transportation = 'Transportation',
  Gifts = 'Gifts',
  Utility = 'Utility',
  Investment = 'Investment',
  Others = 'Others'
}

export enum DebtStatus {
  Active = 'Active',
  Paid = 'Paid',
  Overdue = 'Overdue'
}

export enum DebtDirection {
  OwedByMe = 'OwedByMe',
  OwedToMe = 'OwedToMe'
}

// Entities matching the PRD
export interface Account {
  id: string;
  userId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  createdDate: string;
  updatedDate: string;
}

export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: ExpenseCategory;
  createdDate: string;
  updatedDate: string;
}

export interface Income {
  id: string;
  amount: number;
  description: string;
  category: IncomeCategory;
  createdDate: string;
  updatedDate: string;
}

export interface Debt {
  id: string;
  amount: number;
  description: string;
  category: DebtCategory;
  counterpartyName: string;
  counterpartyEmail?: string;
  repaymentDate: string;
  status: DebtStatus;
  direction: DebtDirection;
  createdDate: string;
  updatedDate: string;
}

export interface Investment {
  id: string;
  amount: number;
  investmentType: string;
  description: string;
  startDate: string;
  expectedReturnDate?: string;
  createdDate: string;
  updatedDate: string;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  billingCycle: 'Monthly' | 'Yearly' | 'Weekly';
  nextPaymentDate: string;
  category: string;
  reminderEnabled: boolean;
  createdDate: string;
  updatedDate: string;
}

export interface User {
  id: string;
  email: string;
  password?: string;
  account?: Account;
}