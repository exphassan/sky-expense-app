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