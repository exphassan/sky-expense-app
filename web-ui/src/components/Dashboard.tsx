import React from 'react';
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    CreditCard,
    Calendar,
    AlertCircle
} from 'lucide-react';
import {useFinanceData} from '../hooks/useFinanceData';
import {useAuth} from '../hooks/useAuth';

const Dashboard: React.FC = () => {
    const {user} = useAuth();
    const {expenses, incomes, debts, investments, subscriptions} = useFinanceData(user?.id);

    // Calculate totals
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    const totalDebts = debts.filter(debt => debt.status === 'Active').reduce((sum, debt) => sum + debt.amount, 0);
    const totalInvestments = investments.reduce((sum, investment) => sum + investment.amount, 0);
    const monthlySubscriptions = subscriptions.reduce((sum, sub) =>
        sum + (sub.billingCycle === 'Monthly' ? sub.amount : sub.amount / 12), 0
    );

    // Upcoming subscription payments (next 7 days)
    const upcomingPayments = subscriptions.filter(sub => {
        const nextPayment = new Date(sub.nextPaymentDate);
        const now = new Date();
        const diffTime = nextPayment.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= 7;
    });

    const overdueDeyits = debts.filter(debt => {
        const repaymentDate = new Date(debt.repaymentDate);
        const now = new Date();
        return debt.status === 'Active' && repaymentDate < now;
    });

    const stats = [
        {
            title: 'Total Income',
            value: `$${totalIncome.toLocaleString('en-US', {minimumFractionDigits: 2})}`,
            icon: TrendingUp,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            change: '+12.5%',
            changeColor: 'text-green-600'
        },
        {
            title: 'Total Expenses',
            value: `$${totalExpenses.toLocaleString('en-US', {minimumFractionDigits: 2})}`,
            icon: CreditCard,
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            change: '-3.2%',
            changeColor: 'text-green-600'
        },
        {
            title: 'Active Debts',
            value: `$${totalDebts.toLocaleString('en-US', {minimumFractionDigits: 2})}`,
            icon: TrendingDown,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
            change: overdueDeyits.length > 0 ? `${overdueDeyits.length} overdue` : 'On track',
            changeColor: overdueDeyits.length > 0 ? 'text-red-600' : 'text-green-600'
        },
        {
            title: 'Investments',
            value: `$${totalInvestments.toLocaleString('en-US', {minimumFractionDigits: 2})}`,
            icon: DollarSign,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            change: '+8.7%',
            changeColor: 'text-green-600'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600">Welcome back, {user?.account?.firstName}!</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500">Net Worth</p>
                    <p className="text-2xl font-bold text-gray-900">
                        ${(totalIncome - totalExpenses + totalInvestments - totalDebts).toLocaleString('en-US', {minimumFractionDigits: 2})}
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index}
                             className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                                    <Icon className={`w-6 h-6 ${stat.color}`}/>
                                </div>
                                <span className={`text-sm font-medium ${stat.changeColor}`}>
                  {stat.change}
                </span>
                            </div>
                            <div className="mt-4">
                                <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Alerts and Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Alerts */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Alerts & Reminders</h2>
                    <div className="space-y-4">
                        {overdueDeyits.length > 0 && (
                            <div className="flex items-start space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5"/>
                                <div>
                                    <p className="text-sm font-medium text-red-900">Overdue Debts</p>
                                    <p className="text-sm text-red-700">
                                        You have {overdueDeyits.length} overdue
                                        debt{overdueDeyits.length > 1 ? 's' : ''} totaling
                                        ${overdueDeyits.reduce((sum, debt) => sum + debt.amount, 0).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        )}

                        {upcomingPayments.length > 0 && (
                            <div
                                className="flex items-start space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <Calendar className="w-5 h-5 text-yellow-600 mt-0.5"/>
                                <div>
                                    <p className="text-sm font-medium text-yellow-900">Upcoming Payments</p>
                                    <p className="text-sm text-yellow-700">
                                        {upcomingPayments.length} subscription
                                        payment{upcomingPayments.length > 1 ? 's' : ''} due in the next 7 days
                                    </p>
                                </div>
                            </div>
                        )}

                        {overdueDeyits.length === 0 && upcomingPayments.length === 0 && (
                            <p className="text-sm text-gray-500 text-center py-4">No alerts at this time</p>
                        )}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
                    <div className="space-y-4">
                        {/* Recent expenses */}
                        {expenses.slice(-3).reverse().map((expense) => (
                            <div key={expense.id} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                        <CreditCard className="w-4 h-4 text-red-600"/>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{expense.description}</p>
                                        <p className="text-xs text-gray-500">{expense.category}</p>
                                    </div>
                                </div>
                                <span className="text-sm font-medium text-red-600">-${expense.amount.toFixed(2)}</span>
                            </div>
                        ))}

                        {/* Recent income */}
                        {incomes.slice(-2).reverse().map((income) => (
                            <div key={income.id} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                        <TrendingUp className="w-4 h-4 text-green-600"/>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{income.description}</p>
                                        <p className="text-xs text-gray-500">{income.category}</p>
                                    </div>
                                </div>
                                <span className="text-sm font-medium text-green-600">+${income.amount.toFixed(2)}</span>
                            </div>
                        ))}

                        {expenses.length === 0 && incomes.length === 0 && (
                            <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Monthly Subscription Cost */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Subscriptions</h2>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-3xl font-bold text-gray-900">${monthlySubscriptions.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">Total monthly subscription cost</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Active subscriptions</p>
                        <p className="text-xl font-semibold text-gray-900">{subscriptions.length}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;