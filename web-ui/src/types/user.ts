export enum Gender {
    Female = 'Female',
    Male = 'Male',
    Unknown = 'Unknown'
}

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

export interface User {
    id: string;
    email: string;
    password?: string;
    account?: Account;
}