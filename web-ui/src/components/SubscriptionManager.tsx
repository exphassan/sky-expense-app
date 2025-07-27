import React, { useState } from 'react';
import { Plus, Trash2, X, Calendar, Bell, BellOff } from 'lucide-react';
import { useFinanceData } from '../hooks/useFinanceData';
import { useAuth } from '../hooks/useAuth';

const SubscriptionManager: React.FC = () => {
  const { user } = useAuth();
  const { subscriptions, addSubscription, deleteSubscription } = useFinanceData(user?.id);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [billingCycle, setBillingCycle] = useState<'Monthly' | 'Yearly' | 'Weekly'>('Monthly');
  const [nextPaymentDate, setNextPaymentDate] = useState('');
  const [category, setCategory] = useState('');
  const [reminderEnabled, setReminderEnabled] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount || !nextPaymentDate || !category) return;

    addSubscription({
      name,
      amount: parseFloat(amount),
      billingCycle,
      nextPaymentDate,
      category,
      reminderEnabled
    });

    setName('');
    setAmount('');
    setBillingCycle('Monthly');
    setNextPaymentDate('');
    setCategory('');
    setReminderEnabled(true);
    setShowForm(false);
  };

  const monthlyTotal = subscriptions.reduce((sum, sub) => {
    switch (sub.billingCycle) {
      case 'Monthly':
        return sum + sub.amount;
      case 'Yearly':
        return sum + (sub.amount / 12);
      case 'Weekly':
        return sum + (sub.amount * 4.33); // Average weeks per month
      default:
        return sum;
    }
  }, 0);

  const yearlyTotal = monthlyTotal * 12;

  const subscriptionCategories = [
    'Streaming',
    'Music',
    'Software',
    'News',
    'Gaming',
    'Fitness',
    'Food Delivery',
    'Cloud Storage',
    'Productivity',
    'Entertainment',
    'Education',
    'Other'
  ];

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Streaming': 'bg-red-100 text-red-700',
      'Music': 'bg-purple-100 text-purple-700',
      'Software': 'bg-blue-100 text-blue-700',
      'News': 'bg-yellow-100 text-yellow-700',
      'Gaming': 'bg-green-100 text-green-700',
      'Fitness': 'bg-orange-100 text-orange-700',
      'Food Delivery': 'bg-pink-100 text-pink-700',
      'Cloud Storage': 'bg-indigo-100 text-indigo-700',
      'Productivity': 'bg-teal-100 text-teal-700',
      'Entertainment': 'bg-cyan-100 text-cyan-700',
      'Education': 'bg-lime-100 text-lime-700',
      'Other': 'bg-gray-100 text-gray-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const getUpcomingPayments = () => {
    return subscriptions.filter(sub => {
      const paymentDate = new Date(sub.nextPaymentDate);
      const now = new Date();
      const diffTime = paymentDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 7;
    });
  };

  const upcomingPayments = getUpcomingPayments();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subscription Management</h1>
          <p className="text-gray-600">Track recurring payments and manage subscriptions</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Monthly Total</p>
          <p className="text-2xl font-bold text-indigo-600">
            ${monthlyTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Active Subscriptions</h3>
          <p className="text-3xl font-bold text-gray-900">{subscriptions.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Monthly Cost</h3>
          <p className="text-3xl font-bold text-indigo-600">${monthlyTotal.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Yearly Cost</h3>
          <p className="text-3xl font-bold text-purple-600">${yearlyTotal.toFixed(2)}</p>
        </div>
      </div>

      {/* Upcoming Payments Alert */}
      {upcomingPayments.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-yellow-600" />
            <h3 className="text-sm font-medium text-yellow-900">Upcoming Payments</h3>
          </div>
          <p className="text-sm text-yellow-700 mt-1">
            You have {upcomingPayments.length} subscription payment{upcomingPayments.length > 1 ? 's' : ''} due in the next 7 days.
          </p>
        </div>
      )}

      {/* Add Subscription Button */}
      <button
        onClick={() => setShowForm(true)}
        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Subscription
      </button>

      {/* Add Subscription Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Add New Subscription</h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Netflix, Spotify, etc."
                  required
                />
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Billing Cycle
                </label>
                <select
                  value={billingCycle}
                  onChange={(e) => setBillingCycle(e.target.value as 'Monthly' | 'Yearly' | 'Weekly')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Next Payment Date
                </label>
                <input
                  type="date"
                  value={nextPaymentDate}
                  onChange={(e) => setNextPaymentDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  <option value="">Select category</option>
                  {subscriptionCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="reminder"
                  checked={reminderEnabled}
                  onChange={(e) => setReminderEnabled(e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="reminder" className="text-sm text-gray-700">
                  Enable payment reminders
                </label>
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Add Subscription
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

      {/* Subscriptions List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Active Subscriptions</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {subscriptions.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No subscriptions recorded yet</p>
              <p className="text-sm text-gray-400 mt-1">Add your first subscription to get started</p>
            </div>
          ) : (
            subscriptions.slice().reverse().map((subscription) => {
              const nextPayment = new Date(subscription.nextPaymentDate);
              const now = new Date();
              const diffTime = nextPayment.getTime() - now.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              
              return (
                <div key={subscription.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{subscription.name}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(subscription.category)}`}>
                          {subscription.category}
                        </span>
                        {subscription.reminderEnabled ? (
                          <Bell className="w-4 h-4 text-green-600" />
                        ) : (
                          <BellOff className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Billed {subscription.billingCycle.toLowerCase()}</span>
                        <span>
                          Next payment: {nextPayment.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                        {diffDays >= 0 && diffDays <= 7 && (
                          <span className="text-yellow-600 font-medium">
                            Due in {diffDays} day{diffDays === 1 ? '' : 's'}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <span className="text-lg font-semibold text-indigo-600">
                          ${subscription.amount.toFixed(2)}
                        </span>
                        <p className="text-xs text-gray-500">
                          {subscription.billingCycle === 'Monthly' 
                            ? `$${(subscription.amount * 12).toFixed(2)}/year`
                            : subscription.billingCycle === 'Yearly'
                            ? `$${(subscription.amount / 12).toFixed(2)}/month`
                            : `$${(subscription.amount * 52).toFixed(2)}/year`
                          }
                        </p>
                      </div>
                      <button
                        onClick={() => deleteSubscription(subscription.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Subscriptions by Category */}
      {subscriptions.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Spending by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subscriptionCategories.map((cat) => {
              const categorySubs = subscriptions.filter(sub => sub.category === cat);
              const categoryMonthlyTotal = categorySubs.reduce((sum, sub) => {
                switch (sub.billingCycle) {
                  case 'Monthly':
                    return sum + sub.amount;
                  case 'Yearly':
                    return sum + (sub.amount / 12);
                  case 'Weekly':
                    return sum + (sub.amount * 4.33);
                  default:
                    return sum;
                }
              }, 0);
              
              if (categoryMonthlyTotal === 0) return null;
              
              return (
                <div key={cat} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(cat)}`}>
                      {cat}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {categorySubs.length} sub{categorySubs.length === 1 ? '' : 's'}
                    </span>
                  </div>
                  <p className="text-lg font-bold text-indigo-600">
                    ${categoryMonthlyTotal.toFixed(2)}/mo
                  </p>
                  <p className="text-sm text-gray-500">
                    ${(categoryMonthlyTotal * 12).toFixed(2)}/year
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

export default SubscriptionManager;