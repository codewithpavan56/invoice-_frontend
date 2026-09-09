import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { ToastProvider } from './components/ui/Toast';
import { DashboardLayout } from './layouts/DashboardLayout';
import { AuthLayout } from './layouts/AuthLayout';
// Pages
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Auth/Login';
import { Register } from './pages/Auth/Register';
import { ForgotPassword } from './pages/Auth/ForgotPassword';
import { ClientList } from './pages/Clients/ClientList';
import { ClientDetail } from './pages/Clients/ClientDetail';
import { InvoiceList } from './pages/Invoices/InvoiceList';
import { InvoiceForm } from './pages/Invoices/InvoiceForm';
import { InvoicePreview } from './pages/Invoices/InvoicePreview';
import { QuoteList } from './pages/Quotes/QuoteList';
import { QuoteForm } from './pages/Quotes/QuoteForm';
import { QuotePreview } from './pages/Quotes/QuotePreview';
import { Settings } from './pages/Settings/Settings';
import { Reports } from './pages/Reports/Reports';
import { Profile } from './pages/Profile/Profile';
import './index.css';
// Route Guard Component
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useApp();
    const location = useLocation();
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace/>;
    }
    return <DashboardLayout>{children}</DashboardLayout>;
};
// Auth Route Wrapper (redirects to dashboard if already logged in)
const AuthRoute = ({ children }) => {
    const { isAuthenticated } = useApp();
    if (isAuthenticated) {
        return <Navigate to="/" replace/>;
    }
    return <AuthLayout>{children}</AuthLayout>;
};
// Conditionally wrapped preview screens for Invoices and Quotes
const InvoicePreviewWrapper = () => {
    const { isAuthenticated } = useApp();
    if (isAuthenticated) {
        return <DashboardLayout><InvoicePreview /></DashboardLayout>;
    }
    return (<div className="min-h-screen bg-slate-950 flex flex-col justify-start">
      <div className="flex-grow p-6 md:p-8">
        <InvoicePreview />
      </div>
    </div>);
};
const QuotePreviewWrapper = () => {
    const { isAuthenticated } = useApp();
    if (isAuthenticated) {
        return <DashboardLayout><QuotePreview /></DashboardLayout>;
    }
    return (<div className="min-h-screen bg-slate-950 flex flex-col justify-start">
      <div className="flex-grow p-6 md:p-8">
        <QuotePreview />
      </div>
    </div>);
};
const App = () => {
    return (<HashRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<AuthRoute><Login /></AuthRoute>}/>
        <Route path="/register" element={<AuthRoute><Register /></AuthRoute>}/>
        <Route path="/forgot-password" element={<AuthRoute><ForgotPassword /></AuthRoute>}/>

        {/* Protected Dashboard Routes */}
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
        
        {/* Invoice Management */}
        <Route path="/invoices" element={<ProtectedRoute><InvoiceList /></ProtectedRoute>}/>
        <Route path="/invoices/create" element={<ProtectedRoute><InvoiceForm /></ProtectedRoute>}/>
        <Route path="/invoices/edit/:id" element={<ProtectedRoute><InvoiceForm /></ProtectedRoute>}/>
        <Route path="/invoices/preview/:id" element={<InvoicePreviewWrapper />}/>

        {/* Quotation Management */}
        <Route path="/quotes" element={<ProtectedRoute><QuoteList /></ProtectedRoute>}/>
        <Route path="/quotes/create" element={<ProtectedRoute><QuoteForm /></ProtectedRoute>}/>
        <Route path="/quotes/edit/:id" element={<ProtectedRoute><QuoteForm /></ProtectedRoute>}/>
        <Route path="/quotes/preview/:id" element={<QuotePreviewWrapper />}/>

        {/* Clients Directory */}
        <Route path="/clients" element={<ProtectedRoute><ClientList /></ProtectedRoute>}/>
        <Route path="/clients/detail/:id" element={<ProtectedRoute><ClientDetail /></ProtectedRoute>}/>

        {/* Analytics & Auditing */}
        <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>}/>

        {/* User Configuration */}
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>}/>
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>}/>

        {/* Fallback Catch */}
        <Route path="*" element={<Navigate to="/" replace/>}/>
      </Routes>
    </HashRouter>);
};
ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode>
    <ToastProvider>
      <AppProvider>
        <App />
      </AppProvider>
    </ToastProvider>
  </React.StrictMode>);
