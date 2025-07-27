import React, {useState} from 'react';
import {Plus, Trash2, X, CheckCircle, AlertCircle, Clock} from 'lucide-react';
import {useFinanceData} from '../hooks/useFinanceData';
import {useAuth} from '../hooks/useAuth';
import {DebtCategory, DebtDirection, DebtStatus} from '../types/debt';

const DebtManager: React.FC = () => {
    const {user} = useAuth();
    const {debts, addDebt, deleteDebt, updateDebtStatus} = useFinanceData(user?.id);
    const [showForm, setShowForm] = useState(false);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<DebtCategory>(DebtCategory.Others);
    const [counterpartyName, setCounterpartyName] = useState('');
    const [counterpartyEmail, setCounterpartyEmail] = useState('');
    const [repaymentDate, setRepaymentDate] = useState('');
    const [direction, setDirection] = useState<DebtDirection>(DebtDirection.OwedByMe);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !description || !counterpartyName || !repaymentDate) return;

        addDebt({
            amount: parseFloat(amount),
            description,
            category,
            counterpartyName,
            counterpartyEmail,
            repaymentDate,
            status: DebtStatus.Active,
            direction
        });

        setAmount('');
        setDescription('');
        setCategory(DebtCategory.Others);
        setCounterpartyName('');
        setCounterpartyEmail('');
        setRepaymentDate('');
        setDirection(DebtDirection.OwedByMe);
        setShowForm(false);
    };

    const activeDebts = debts.filter(debt => debt.status === DebtStatus.Active);
    const totalActiveDebt = activeDebts.reduce((sum, debt) => sum + debt.amount, 0);

    const getStatusIcon = (debt: any) => {
        const repaymentDate = new Date(debt.repaymentDate);
        const now = new Date();
        const isOverdue = debt.status === DebtStatus.Active && repaymentDate < now;

        if (debt.status === DebtStatus.Paid) {
            return <CheckCircle className="w-5 h-5 text-green-600"/>;
        } else if (isOverdue) {
            return <AlertCircle className="w-5 h-5 text-red-600"/>;
        } else {
            return <Clock className="w-5 h-5 text-yellow-600"/>;
        }
    };

    const getStatusColor = (debt: any) => {
        const repaymentDate = new Date(debt.repaymentDate);
        const now = new Date();
        const isOverdue = debt.status === DebtStatus.Active && repaymentDate < now;

        if (debt.status === DebtStatus.Paid) {
            return 'bg-green-50 border-green-200';
        } else if (isOverdue) {
            return 'bg-red-50 border-red-200';
        } else {
            return 'bg-yellow-50 border-yellow-200';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Debt Management</h1>
                    <p className="text-gray-600">Track money you owe and money owed to you</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500">Total Active Debt</p>
                    <p className="text-2xl font-bold text-orange-600">
                        ${totalActiveDebt.toLocaleString('en-US', {minimumFractionDigits: 2})}
                    </p>
                </div>
            </div>

            {/* Add Debt Button */}
            <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
                <Plus className="w-4 h-4 mr-2"/>
                Add Debt
            </button>

            {/* Add Debt Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Add New Debt</h2>
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
                                    Direction
                                </label>
                                <select
                                    value={direction}
                                    onChange={(e) => setDirection(e.target.value as DebtDirection)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                >
                                    <option value={DebtDirection.OwedByMe}>Money I Owe</option>
                                    <option value={DebtDirection.OwedToMe}>Money Owed to Me</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Amount ($)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="What is this debt for?"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {direction === DebtDirection.OwedByMe ? 'Creditor Name' : 'Debtor Name'}
                                </label>
                                <input
                                    type="text"
                                    value={counterpartyName}
                                    onChange={(e) => setCounterpartyName(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder={direction === DebtDirection.OwedByMe ? 'Who do you owe?' : 'Who owes you?'}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email (Optional)
                                </label>
                                <input
                                    type="email"
                                    value={counterpartyEmail}
                                    onChange={(e) => setCounterpartyEmail(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="email@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Repayment Date
                                </label>
                                <input
                                    type="date"
                                    value={repaymentDate}
                                    onChange={(e) => setRepaymentDate(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value as DebtCategory)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                >
                                    {Object.values(DebtCategory).map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    type="submit"
                                    className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors"
                                >
                                    Add Debt
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

            {/* Debts List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Debt Records</h2>
                </div>
                <div className="divide-y divide-gray-200">
                    {debts.length === 0 ? (
                        <div className="p-8 text-center">
                            <p className="text-gray-500">No debts recorded yet</p>
                            <p className="text-sm text-gray-400 mt-1">Add your first debt record to get started</p>
                        </div>
                    ) : (
                        debts.slice().reverse().map((debt) => (
                            <div key={debt.id}
                                 className={`p-6 hover:bg-gray-50 transition-colors border-l-4 ${getStatusColor(debt)}`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            {getStatusIcon(debt)}
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                debt.direction === DebtDirection.OwedByMe
                                                    ? 'bg-red-100 text-red-700'
                                                    : 'bg-blue-100 text-blue-700'
                                            }`}>
                        {debt.direction === DebtDirection.OwedByMe ? 'I Owe' : 'Owed to Me'}
                      </span>
                                            <span
                                                className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                        {debt.category}
                      </span>
                                        </div>
                                        <h3 className="text-sm font-medium text-gray-900">{debt.description}</h3>
                                        <p className="text-sm text-gray-600">
                                            {debt.direction === DebtDirection.OwedByMe ? 'To: ' : 'From: '}{debt.counterpartyName}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Due: {new Date(debt.repaymentDate).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="text-right">
                      <span className={`text-lg font-semibold ${
                          debt.direction === DebtDirection.OwedByMe ? 'text-red-600' : 'text-blue-600'
                      }`}>
                        {debt.direction === DebtDirection.OwedByMe ? '-' : '+'}${debt.amount.toFixed(2)}
                      </span>
                                            {debt.status === DebtStatus.Active && (
                                                <button
                                                    onClick={() => updateDebtStatus(debt.id, DebtStatus.Paid)}
                                                    className="block text-xs text-green-600 hover:text-green-700 mt-1"
                                                >
                                                    Mark as Paid
                                                </button>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => deleteDebt(debt.id)}
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

            {/* Debt Summary */}
            {debts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Money I Owe</h3>
                        <p className="text-2xl font-bold text-red-600">
                            ${debts.filter(d => d.direction === DebtDirection.OwedByMe && d.status === DebtStatus.Active)
                            .reduce((sum, d) => sum + d.amount, 0).toFixed(2)}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Money Owed to Me</h3>
                        <p className="text-2xl font-bold text-blue-600">
                            ${debts.filter(d => d.direction === DebtDirection.OwedToMe && d.status === DebtStatus.Active)
                            .reduce((sum, d) => sum + d.amount, 0).toFixed(2)}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Paid Debts</h3>
                        <p className="text-2xl font-bold text-green-600">
                            ${debts.filter(d => d.status === DebtStatus.Paid)
                            .reduce((sum, d) => sum + d.amount, 0).toFixed(2)}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DebtManager;