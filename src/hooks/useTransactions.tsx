import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { api } from "../services/api";

export type TransactionType = 'deposit' | 'withdraw';

interface Transaction {
    id: number;
    title: string;
    amount: number;
    type: TransactionType;
    category: string;
    createdAt: string;
}

export type TransactionInput = Omit<Transaction, 'id' | 'createdAt'>;

interface TransactionsProviderData {
    transactions: Transaction[];
    createTransaction: (transaction: TransactionInput) => Promise<void>;
}

interface TransactionsProviderProps {
    children: ReactNode;
}

export const TransactionsContext = createContext<TransactionsProviderData>(
    {} as TransactionsProviderData
);

export function TransactionsProvider({ children }: TransactionsProviderProps) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    async function createTransaction(transactionInput: TransactionInput) {
        const response = await api.post('transactions', transactionInput);
        const { transaction } = response.data;

        setTransactions([
            ...transactions,
            transaction,
        ]);
    }

    useEffect(() => {
        api.get('transactions').then(response => {
            setTransactions(response.data.transactions);
        });
    }, []);

    return (
        <TransactionsContext.Provider value={{ transactions, createTransaction }}>
            {children}
        </TransactionsContext.Provider>
    )
}

export function useTransactions() {
    return useContext(TransactionsContext);
}