import React, {useState} from 'react';
import {Plus, Trash2, X} from 'lucide-react';
import {useFinanceData} from '../hooks/useFinanceData';
import {useAuth} from '../hooks/useAuth';
import {ExpenseCategory} from '../types';

const ExpenseManager: React.FC = () => {
    const {user} = useAuth();
    const {expenses, addExpense, deleteExpense} = useFinanceData(user?.id);
    const [showForm, setShowForm] = useState(false);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<ExpenseCategory>(ExpenseCategory.Others);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !description) return;

        addExpense({
            amount: parseFloat(amount),
            description,
            category
        });

        setAmount('');
        setDescription('');
        setCategory(ExpenseCategory.Others);
        setShowForm(false);
    };

    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    const categoryColors: Record<ExpenseCategory, string> = {
        [ExpenseCategory.Personal]: 'bg-blue-100 text-blue-700',
        [ExpenseCategory.Food]: 'bg-green-100 text-green-700',
        [ExpenseCategory.Home]: 'bg-yellow-100 text-yellow-700',
        [ExpenseCategory.Family]: 'bg-pink-100 text-pink-700',
        [ExpenseCategory.Transportation]: 'bg-purple-100 text-purple-700',
        [ExpenseCategory.Gifts]: 'bg-red-100 text-red-700',
        [ExpenseCategory.Utility]: 'bg-orange-100 text-orange-700',
        [ExpenseCategory.Investment]: 'bg-indigo-100 text-indigo-700',
        [ExpenseCategory.Savings]: 'bg-teal-100 text-teal-700',
        [ExpenseCategory.DebtRepayment]: 'bg-gray-100 text-gray-700',
        [ExpenseCategory.Others]: 'bg-slate-100 text-slate-700'
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Expense Tracking</h1>
                    <p className="text-gray-600">Monitor and categorize your expenses</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500">Total Expenses</p>
                    <p className="text-2xl font-bold text-red-600">
                        ${totalExpenses.toLocaleString('en-US', {minimumFractionDigits: 2})}
                    </p>
                </div>
            </div>

            {/* Add Expense Button */}
            <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
                <Plus className="w-4 h-4 mr-2"/>
                Add Expense
            </button>

            {/* Add Expense Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Add New Expense</h2>
                            <button
                                onClick={() => setShowForm(false)}
                                className="p-1 hover:bg-gray-100 rounded"
                            >
                                <X className="w-5 h-5"/>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Amount ($)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="0.00"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <input
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="What did you spend on?"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    {Object.values(ExpenseCategory).map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Add Expense
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Expenses List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Expenses</h2>
                </div>
                <div className="divide-y divide-gray-200">
                    {expenses.length === 0 ? (
                        <div className="p-8 text-center">
                            <p className="text-gray-500">No expenses recorded yet</p>
                            <p className="text-sm text-gray-400 mt-1">Add your first expense to get started</p>
                        </div>
                    ) : (
                        expenses.slice().reverse().map((expense) => (
                            <div key={expense.id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3">
                      <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${categoryColors[expense.category]}`}>
                        {expense.category}
                      </span>
                                            <h3 className="text-sm font-medium text-gray-900">{expense.description}</h3>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {new Date(expense.createdDate).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-3">
                    <span className="text-lg font-semibold text-red-600">
                      -${expense.amount.toFixed(2)}
                    </span>
                                        <button
                                            onClick={() => deleteExpense(expense.id)}
                                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4"/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExpenseManager;