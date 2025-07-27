import React, {useState} from 'react';
import {
    Menu,
    X,
    Home,
    CreditCard,
    TrendingUp,
    DollarSign,
    TrendingDown,
    Calendar,
    User,
    LogOut
} from 'lucide-react';
import {useAuth} from '../hooks/useAuth';

interface LayoutProps {
    children: React.ReactNode;
    currentPage: string;
    onPageChange: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({children, currentPage, onPageChange}) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const {user, logout} = useAuth();

    const navigation = [
        {name: 'Dashboard', icon: Home, page: 'dashboard'},
        {name: 'Expenses', icon: CreditCard, page: 'expenses'},
        {name: 'Income', icon: TrendingUp, page: 'income'},
        {name: 'Debts', icon: TrendingDown, page: 'debts'},
        {name: 'Investments', icon: DollarSign, page: 'investments'},
        {name: 'Subscriptions', icon: Calendar, page: 'subscriptions'},
    ];

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-gray-600 bg-opacity-75 lg:hidden z-20"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
                    <h1 className="text-xl font-bold text-blue-600">SkyExpense</h1>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-1 rounded-md hover:bg-gray-100"
                    >
                        <X className="w-5 h-5"/>
                    </button>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2">
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.name}
                                onClick={() => {
                                    onPageChange(item.page);
                                    setSidebarOpen(false);
                                }}
                                className={`
                  w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                  ${currentPage === item.page
                                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                                    : 'text-gray-700 hover:bg-gray-100'
                                }
                `}
                            >
                                <Icon className="w-5 h-5 mr-3"/>
                                {item.name}
                            </button>
                        );
                    })}
                </nav>

                {/* User profile section */}
                <div className="border-t border-gray-200 p-4">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-blue-600"/>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {user?.account?.firstName} {user?.account?.lastName}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <LogOut className="w-4 h-4 mr-2"/>
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top bar */}
                <header className="bg-white shadow-sm border-b border-gray-200 lg:hidden">
                    <div className="flex items-center justify-between h-16 px-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 rounded-md hover:bg-gray-100"
                        >
                            <Menu className="w-5 h-5"/>
                        </button>
                        <h1 className="text-lg font-semibold text-gray-900">SkyExpense</h1>
                        <div className="w-9"/>
                        {/* Spacer for centering */}
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-auto">
                    <div className="p-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;