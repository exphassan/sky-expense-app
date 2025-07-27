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