import React, {useState} from 'react';
import {Plus, Trash2, X, TrendingUp} from 'lucide-react';
import {useFinanceData} from '../hooks/useFinanceData';
import {useAuth} from '../hooks/useAuth';

const InvestmentManager: React.FC = () => {
    const {user} = useAuth();
    const {investments, addInvestment, deleteInvestment} = useFinanceData(user?.id);
    const [showForm, setShowForm] = useState(false);
    const [amount, setAmount] = useState('');
    const [investmentType, setInvestmentType] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [expectedReturnDate, setExpectedReturnDate] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !investmentType || !description || !startDate) return;

        addInvestment({
            amount: parseFloat(amount),
            investmentType,
            description,
            startDate,
            expectedReturnDate
        });

        setAmount('');
        setInvestmentType('');
        setDescription('');
        setStartDate('');
        setExpectedReturnDate('');
        setShowForm(false);
    };

    const totalInvestments = investments.reduce((sum, investment) => sum + investment.amount, 0);

    const investmentTypes = [
        'Stocks',
        'Bonds',
        'Mutual Funds',
        'ETFs',
        'Real Estate',
        'Cryptocurrency',
        'Savings Account',
        'Certificate of Deposit',
        'Index Funds',
        'Commodities',
        'Other'
    ];

    const getInvestmentTypeColor = (type: string) => {
        const colors: Record<string, string> = {
            'Stocks': 'bg-blue-100 text-blue-700',
            'Bonds': 'bg-green-100 text-green-700',
            'Mutual Funds': 'bg-purple-100 text-purple-700',
            'ETFs': 'bg-indigo-100 text-indigo-700',
            'Real Estate': 'bg-yellow-100 text-yellow-700',
            'Cryptocurrency': 'bg-orange-100 text-orange-700',
            'Savings Account': 'bg-teal-100 text-teal-700',
            'Certificate of Deposit': 'bg-pink-100 text-pink-700',
            'Index Funds': 'bg-cyan-100 text-cyan-700',
            'Commodities': 'bg-red-100 text-red-700',
            'Other': 'bg-gray-100 text-gray-700'
        };
        return colors[type] || 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Investment Portfolio</h1>
                    <p className="text-gray-600">Track your investments and monitor performance</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500">Total Invested</p>
                    <p className="text-2xl font-bold text-blue-600">
                        ${totalInvestments.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                </div>
            </div>

            {/* Add Investment Button */}
            <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
                <Plus className="w-4 h-4 mr-2"/>
                Add Investment
            </button>

            {/* Add Investment Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Add New Investment</h2>
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
                                    Investment Amount ($)
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
                                    Investment Type
                                </label>
                                <select
                                    value={investmentType}
                                    onChange={(e) => setInvestmentType(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">Select investment type</option>
                                    {investmentTypes.map((type) => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
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
                                    placeholder="Investment details (e.g., company name, fund name)"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Expected Return Date (Optional)
                                </label>
                                <input
                                    type="date"
                                    value={expectedReturnDate}
                                    onChange={(e) => setExpectedReturnDate(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Add Investment
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

            {/* Investments List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Investment Portfolio</h2>
                </div>
                <div className="divide-y divide-gray-200">
                    {investments.length === 0 ? (
                        <div className="p-8 text-center">
                            <p className="text-gray-500">No investments recorded yet</p>
                            <p className="text-sm text-gray-400 mt-1">Add your first investment to get started</p>
                        </div>
                    ) : (
                        investments.slice().reverse().map((investment) => (
                            <div key={investment.id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <TrendingUp className="w-5 h-5 text-blue-600"/>
                                            <span
                                                className={`px-2 py-1 text-xs font-medium rounded-full ${getInvestmentTypeColor(investment.investmentType)}`}>
                        {investment.investmentType}
                      </span>
                                        </div>
                                        <h3 className="text-sm font-medium text-gray-900">{investment.description}</h3>
                                        <div className="mt-1 space-y-1">
                                            <p className="text-sm text-gray-500">
                                                Started: {new Date(investment.startDate).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                            </p>
                                            {investment.expectedReturnDate && (
                                                <p className="text-sm text-gray-500">
                                                    Expected
                                                    Return: {new Date(investment.expectedReturnDate).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                    <span className="text-lg font-semibold text-blue-600">
                      ${investment.amount.toFixed(2)}
                    </span>
                                        <button
                                            onClick={() => deleteInvestment(investment.id)}
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

            {/* Investment Summary by Type */}
            {investments.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Breakdown</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {investmentTypes.map((type) => {
                            const typeInvestments = investments.filter(inv => inv.investmentType === type);
                            const typeTotal = typeInvestments.reduce((sum, inv) => sum + inv.amount, 0);
                            const percentage = totalInvestments > 0 ? (typeTotal / totalInvestments * 100).toFixed(1) : 0;

                            if (typeTotal === 0) return null;

                            return (
                                <div key={type} className="p-4 border border-gray-200 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getInvestmentTypeColor(type)}`}>
                      {type}
                    </span>
                                        <span className="text-sm font-semibold text-gray-900">
                      {percentage}%
                    </span>
                                    </div>
                                    <p className="text-lg font-bold text-blue-600">
                                        ${typeTotal.toFixed(2)}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {typeInvestments.length} investment{typeInvestments.length === 1 ? '' : 's'}
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

export default InvestmentManager;