import React, {useState} from 'react';
import {useAuth} from './hooks/useAuth';
import AuthPage from './components/AuthPage.tsx';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ExpenseManager from './components/ExpenseManager';
import IncomeManager from './components/IncomeManager';
import DebtManager from './components/DebtManager';
import InvestmentManager from './components/InvestmentManager';
import SubscriptionManager from './components/SubscriptionManager';

function App() {
    const {user, loading} = useAuth();
    const [currentPage, setCurrentPage] = useState('dashboard');

    // Demo user setup
    React.useEffect(() => {
        const users = JSON.parse(localStorage.getItem('xpensify_users') || '[]');
        if (users.length === 0) {
            const demoUser = {
                id: 'demo-user-id',
                email: 'demo@xpensify.com',
                password: 'demo123',
                account: {
                    id: 'demo-account-id',
                    userId: 'demo-user-id',
                    firstName: 'Demo',
                    middleName: '',
                    lastName: 'User',
                    dateOfBirth: '1990-01-01',
                    gender: 'Unknown',
                    createdDate: new Date().toISOString(),
                    updatedDate: new Date().toISOString()
                }
            };
            localStorage.setItem('xpensify_users', JSON.stringify([demoUser]));
        }
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <AuthPage/>;
    }

    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return <Dashboard/>;
            case 'expenses':
                return <ExpenseManager/>;
            case 'income':
                return <IncomeManager/>;
            case 'debts':
                return <DebtManager/>;
            case 'investments':
                return <InvestmentManager/>;
            case 'subscriptions':
                return <SubscriptionManager/>;
            default:
                return <Dashboard/>;
        }
    };

    return (
        <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
            {renderPage()}
        </Layout>
    );
}

export default App;