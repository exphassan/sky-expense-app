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