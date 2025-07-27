import React, { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { useFinanceData } from '../hooks/useFinanceData';
import { useAuth } from '../hooks/useAuth';
import { IncomeCategory } from '../types/income'

const IncomeManager: React.FC = () => {
    const {user} = useAuth();
    const {incomes, addIncome, deleteIncome} = useFinanceData(user?.id);
    const [showForm, setShowForm] = useState(false);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<IncomeCategory>(IncomeCategory.Other);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !description) return;

        addIncome({
            amount: parseFloat(amount),
            description,
            category
        });

        setAmount('');
        setDescription('');
        setCategory(IncomeCategory.Other);
        setShowForm(false);
    };

    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);

    const categoryColors: Record<IncomeCategory, string> = {
        [IncomeCategory.Paycheck]: 'bg-green-100 text-green-700',
        [IncomeCategory.Interest]: 'bg-blue-100 text-blue-700',
        [IncomeCategory.InvestmentReturn]: 'bg-purple-100 text-purple-700',
        [IncomeCategory.Dividend]: 'bg-indigo-100 text-indigo-700',
        [IncomeCategory.Gift]: 'bg-pink-100 text-pink-700',
        [IncomeCategory.Allowance]: 'bg-yellow-100 text-yellow-700',
        [IncomeCategory.Other]: 'bg-gray-100 text-gray-700'
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Income Tracking</h1>
                    <p className="text-gray-600">Record and categorize your income sources</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500">Total Income</p>
                    <p className="text-2xl font-bold text-green-600">
                        ${totalIncome.toLocaleString('en-US', {minimumFractionDigits: 2})}
                    </p>
                </div>
            </div>

            {/* Add Income Button */}
            <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
                <Plus className="w-4 h-4 mr-2"/>
                Add Income
            </button>

            {/* Add Income Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Add New Income</h2>
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Source of income"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value as IncomeCategory)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                >
                                    {Object.values(IncomeCategory).map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    type="submit"
                                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Add Income
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

            {/* Income List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Income History</h2>
                </div>
                <div className="divide-y divide-gray-200">
                    {incomes.length === 0 ? (
                        <div className="p-8 text-center">
                            <p className="text-gray-500">No income recorded yet</p>
                            <p className="text-sm text-gray-400 mt-1">Add your first income entry to get started</p>
                        </div>
                    ) : (
                        incomes.slice().reverse().map((income) => (
                            <div key={income.id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${categoryColors[income.category]}`}>
                        {income.category}
                      </span>
                                            <h3 className="text-sm font-medium text-gray-900">{income.description}</h3>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {new Date(income.createdDate).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-3">
                    <span className="text-lg font-semibold text-green-600">
                      +${income.amount.toFixed(2)}
                    </span>
                                        <button
                                            onClick={() => deleteIncome(income.id)}
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

            {/* Income Summary by Category */}
            {incomes.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Income by Category</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.values(IncomeCategory).map((cat) => {
                            const categoryIncomes = incomes.filter(income => income.category === cat);
                            const categoryTotal = categoryIncomes.reduce((sum, income) => sum + income.amount, 0);

                            if (categoryTotal === 0) return null;

                            return (
                                <div key={cat} className="p-4 border border-gray-200 rounded-lg">
                                    <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${categoryColors[cat]}`}>
                      {cat}
                    </span>
                                        <span className="text-sm font-semibold text-gray-900">
                      ${categoryTotal.toFixed(2)}
                    </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {categoryIncomes.length} entr{categoryIncomes.length === 1 ? 'y' : 'ies'}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default IncomeManager;