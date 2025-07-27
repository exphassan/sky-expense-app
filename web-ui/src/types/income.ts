export interface Income {
    id: string;
    amount: number;
    description: string;
    category: IncomeCategory;
    createdDate: string;
    updatedDate: string;
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