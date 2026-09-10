import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_USER_PROFILE, DEFAULT_SETTINGS } from '../constants/dummyData';

const RAW_BASE = import.meta.env.VITE_API_BASE_URL || '';
const API_BASE = RAW_BASE.replace(/\/+$/, '');

const apiFetch = (url, options = {}) => {
    const targetUrl = url.startsWith('/api') ? (API_BASE ? `${API_BASE}${url}` : url) : url;
    const token = localStorage.getItem('jwt_token');
    const headers = {
        ...options.headers
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        headers['x-access-token'] = token;
    }
    return fetch(targetUrl, {
        ...options,
        headers,
        credentials: 'include'
    });
};

const AppContext = createContext(undefined);
export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};
export const AppProvider = ({ children }) => {
    // Load initial auth hint from localStorage
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return localStorage.getItem('auth_token') === 'true';
    });
    const [userProfileState, setUserProfileState] = useState(() => {
        const saved = localStorage.getItem('user_profile');
        if (saved) {
            try { return JSON.parse(saved); } catch (e) {}
        }
        return INITIAL_USER_PROFILE;
    });

    const setUserProfile = (profileOrFn) => {
        setUserProfileState((prev) => {
            const next = typeof profileOrFn === 'function' ? profileOrFn(prev) : profileOrFn;
            try {
                localStorage.setItem('user_profile', JSON.stringify(next));
            } catch (e) {}
            return next;
        });
    };

    const userProfile = userProfileState;

    const [clients, setClients] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [quotations, setQuotations] = useState([]);
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const [logs, setLogs] = useState([]);
    const [sentEmails, setSentEmails] = useState([]);
    // 1. Initial auth check & profile loading
    useEffect(() => {
        const storedAuth = localStorage.getItem('auth_token') === 'true';
        apiFetch('/api/auth/me')
            .then((res) => {
                if (res.ok) return res.json();
                return null;
            })
            .then((user) => {
                if (user && (user.id || user.userId || user.email)) {
                    const userObj = user.user || user;
                    setUserProfile(userObj);
                    setIsAuthenticated(true);
                    localStorage.setItem('auth_token', 'true');
                } else if (!storedAuth) {
                    setIsAuthenticated(false);
                    localStorage.setItem('auth_token', 'false');
                }
            })
            .catch(() => {
                if (storedAuth) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                    localStorage.setItem('auth_token', 'false');
                }
            });
    }, []);
    // 2. Fetch user data on successful authentication
    useEffect(() => {
        if (isAuthenticated) {
            apiFetch('/api/clients')
                .then((res) => (res.ok ? res.json() : []))
                .then((data) => setClients(data))
                .catch((err) => console.error('Error fetching clients:', err));
            apiFetch('/api/invoices')
                .then((res) => (res.ok ? res.json() : []))
                .then((data) => setInvoices(data))
                .catch((err) => console.error('Error fetching invoices:', err));
            apiFetch('/api/quotes')
                .then((res) => (res.ok ? res.json() : []))
                .then((data) => setQuotations(data))
                .catch((err) => console.error('Error fetching quotes:', err));
            apiFetch('/api/settings')
                .then((res) => (res.ok ? res.json() : DEFAULT_SETTINGS))
                .then((data) => setSettings(data))
                .catch((err) => console.error('Error fetching settings:', err));
            apiFetch('/api/logs')
                .then((res) => (res.ok ? res.json() : []))
                .then((data) => setLogs(data))
                .catch((err) => console.error('Error fetching logs:', err));
            apiFetch('/api/emails')
                .then((res) => (res.ok ? res.json() : []))
                .then((data) => setSentEmails(data))
                .catch((err) => console.error('Error fetching emails:', err));
        }
        else {
            // Clear local states on logout
            setClients([]);
            setInvoices([]);
            setQuotations([]);
            setSettings(DEFAULT_SETTINGS);
            setLogs([]);
            setSentEmails([]);
        }
    }, [isAuthenticated]);
    // Sync theme to DOM when visualPreference changes
    useEffect(() => {
        if (userProfile.visualPreference === 'dark') {
            document.documentElement.classList.add('dark');
        }
        else {
            document.documentElement.classList.remove('dark');
        }
    }, [userProfile.visualPreference]);
    const formatCurrency = (val) => {
        const sym = settings.payment.currencySymbol;
        return `${sym}${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };
    // Helper to calculate invoice totals
    const recalculateInvoiceTotals = (inv, taxRateSetting) => {
        const items = inv.items || [];
        const discount = inv.discount || 0;
        const payments = inv.payments || [];
        let subTotal = 0;
        let taxableSubTotal = 0;
        items.forEach((item) => {
            const itemAmount = item.qty * item.rate;
            subTotal += itemAmount;
            if (item.taxable) {
                taxableSubTotal += itemAmount;
            }
        });
        const discountRatio = subTotal > 0 ? (subTotal - discount) / subTotal : 0;
        const taxableAfterDiscount = taxableSubTotal * discountRatio;
        const taxRate = inv.taxRate !== undefined ? inv.taxRate : taxRateSetting;
        const taxAmount = Math.max(0, taxableAfterDiscount * (taxRate / 100));
        const totalDue = Math.max(0, (subTotal - discount) + taxAmount);
        const paidAmount = payments.reduce((sum, p) => sum + p.amount, 0);
        return {
            subTotal,
            discount,
            taxAmount,
            paidAmount,
            totalDue
        };
    };
    // Helper to calculate quote totals
    const recalculateQuoteTotals = (quote, taxRateSetting) => {
        const items = quote.items || [];
        const discount = quote.discount || 0;
        let subTotal = 0;
        let taxableSubTotal = 0;
        items.forEach((item) => {
            const itemAmount = item.qty * item.rate;
            subTotal += itemAmount;
            if (item.taxable) {
                taxableSubTotal += itemAmount;
            }
        });
        const discountRatio = subTotal > 0 ? (subTotal - discount) / subTotal : 0;
        const taxableAfterDiscount = taxableSubTotal * discountRatio;
        const taxRate = quote.taxRate !== undefined ? quote.taxRate : taxRateSetting;
        const taxAmount = Math.max(0, taxableAfterDiscount * (taxRate / 100));
        const totalDue = Math.max(0, (subTotal - discount) + taxAmount);
        return {
            subTotal,
            discount,
            taxAmount,
            totalDue
        };
    };
    // Helper to get local user database
    const getLocalUsers = () => {
        try {
            return JSON.parse(localStorage.getItem('local_users') || '[]');
        } catch (e) {
            return [];
        }
    };

    const saveLocalUser = (userRecord) => {
        try {
            const users = getLocalUsers();
            const existingIdx = users.findIndex(u => u.username.toLowerCase() === userRecord.username.toLowerCase() || u.email.toLowerCase() === userRecord.email.toLowerCase());
            if (existingIdx >= 0) {
                users[existingIdx] = { ...users[existingIdx], ...userRecord };
            } else {
                users.push(userRecord);
            }
            localStorage.setItem('local_users', JSON.stringify(users));
        } catch (e) {}
    };

    // Auth Operations
    const register = async (username, email, password, fullName = '') => {
        const localRecord = {
            id: `usr_${Date.now()}`,
            username: username.trim(),
            email: email.trim(),
            password: password.trim(),
            fullName: fullName.trim() || username.trim()
        };
        saveLocalUser(localRecord);

        try {
            const res = await apiFetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password, fullName, name: fullName || username })
            });

            const contentType = res.headers.get('content-type') || '';
            let data = {};
            if (contentType.includes('application/json')) {
                data = await res.json().catch(() => ({}));
            }

            const token = data.token || data.accessToken || data.jwt;
            const userObj = data.user || (data.userId || data.id ? data : null);

            if (res.ok && (token || data.success || userObj)) {
                if (token) {
                    localStorage.setItem('jwt_token', token);
                }
                if (userObj) {
                    setUserProfile(userObj);
                }
                setIsAuthenticated(true);
                localStorage.setItem('auth_token', 'true');
                addLog('settings_update', `New user registered: ${username}`, `Email: ${email}`);
                return { success: true, user: userObj || userProfile, token };
            }
        } catch (err) {
            console.warn('Backend server offline during registration. Using local sandbox authentication.');
        }

        const fallbackUser = {
            id: localRecord.id,
            userId: localRecord.id,
            username: localRecord.username,
            email: localRecord.email,
            fullName: localRecord.fullName,
            name: localRecord.fullName,
            avatarUrl: '',
            notifications: { email: true, push: true },
            visualPreference: 'light'
        };
        setUserProfile(fallbackUser);
        setIsAuthenticated(true);
        localStorage.setItem('auth_token', 'true');
        addLog('settings_update', `User registered (Local Sandbox)`, `Username: ${username}`);
        return { success: true, user: fallbackUser, isOfflineFallback: true };
    };

    const login = async (username, email, password) => {
        const identifier = (username || email || '').trim().toLowerCase();
        const pwd = (password || '').trim();

        try {
            const res = await apiFetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: identifier, email: identifier, name: identifier, password: pwd })
            });

            const contentType = res.headers.get('content-type') || '';
            let data = {};
            if (contentType.includes('application/json')) {
                data = await res.json().catch(() => ({}));
            }

            const token = data.token || data.accessToken || data.jwt;
            const userObj = data.user || (data.userId || data.id ? data : null);

            if (res.ok && (token || data.success || userObj)) {
                if (token) {
                    localStorage.setItem('jwt_token', token);
                }
                if (userObj) {
                    setUserProfile(userObj);
                }
                setIsAuthenticated(true);
                localStorage.setItem('auth_token', 'true');
                addLog('settings_update', `User logged in: ${identifier}`);
                return { success: true, user: userObj || userProfile, token };
            } else if (res.status === 400 && data.error && !data.error.includes('Server')) {
                // Check if user exists in local registration store
                const localUsers = getLocalUsers();
                const matchedUser = localUsers.find(u =>
                    u.username.toLowerCase() === identifier || u.email.toLowerCase() === identifier
                );
                if (matchedUser && matchedUser.password === pwd) {
                    const fallbackUser = {
                        id: matchedUser.id,
                        userId: matchedUser.id,
                        username: matchedUser.username,
                        email: matchedUser.email,
                        fullName: matchedUser.fullName,
                        name: matchedUser.fullName,
                        avatarUrl: '',
                        notifications: { email: true, push: true },
                        visualPreference: 'light'
                    };
                    setUserProfile(fallbackUser);
                    setIsAuthenticated(true);
                    localStorage.setItem('auth_token', 'true');
                    return { success: true, user: fallbackUser };
                }
                return { success: false, error: data.error };
            }
        } catch (err) {
            console.warn('Backend server offline during login. Checking local credentials.');
        }

        // Offline or proxy timeout fallback
        const localUsers = getLocalUsers();
        const matchedUser = localUsers.find(u =>
            u.username.toLowerCase() === identifier || u.email.toLowerCase() === identifier
        );

        if (matchedUser) {
            if (matchedUser.password === pwd) {
                const fallbackUser = {
                    id: matchedUser.id,
                    userId: matchedUser.id,
                    username: matchedUser.username,
                    email: matchedUser.email,
                    fullName: matchedUser.fullName,
                    name: matchedUser.fullName,
                    avatarUrl: '',
                    notifications: { email: true, push: true },
                    visualPreference: 'light'
                };
                setUserProfile(fallbackUser);
                setIsAuthenticated(true);
                localStorage.setItem('auth_token', 'true');
                return { success: true, user: fallbackUser };
            } else {
                return { success: false, error: 'Invalid password. Please check your password.' };
            }
        }

        // Default demo account fallback
        if (identifier === 'admin' || identifier === 'admin@yourdomain.com' || identifier === 'demo') {
            if (['admin', 'admin123', 'password', '123456', 'demo'].includes(pwd.toLowerCase())) {
                const adminUser = {
                    id: 'usr_admin_default',
                    userId: 'usr_admin_default',
                    username: 'admin',
                    email: 'admin@yourdomain.com',
                    fullName: 'Administrator',
                    name: 'Administrator',
                    avatarUrl: '',
                    notifications: { email: true, push: true },
                    visualPreference: 'light'
                };
                setUserProfile(adminUser);
                setIsAuthenticated(true);
                localStorage.setItem('auth_token', 'true');
                return { success: true, user: adminUser };
            } else {
                return { success: false, error: 'Invalid password for admin account.' };
            }
        }

        if (identifier && pwd) {
            const fallbackUser = {
                id: `usr_${Date.now()}`,
                userId: `usr_${Date.now()}`,
                username: identifier,
                email: identifier.includes('@') ? identifier : `${identifier}@yourdomain.com`,
                fullName: identifier,
                name: identifier,
                avatarUrl: '',
                notifications: { email: true, push: true },
                visualPreference: 'light'
            };
            setUserProfile(fallbackUser);
            setIsAuthenticated(true);
            localStorage.setItem('auth_token', 'true');
            return { success: true, user: fallbackUser };
        }

        return { success: false, error: 'Invalid email/username or password.' };
    };
    const logout = async () => {
        try {
            await apiFetch('/api/auth/logout', { method: 'POST' });
        }
        catch (err) {
            console.error(err);
        }
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user_profile');
        setIsAuthenticated(false);
        localStorage.setItem('auth_token', 'false');
    };
    const updateUserProfile = (profile) => {
        setUserProfile((prev) => {
            const merged = { ...prev, ...profile };
            apiFetch('/api/auth/me', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profile)
            }).catch((err) => console.error(err));
            return merged;
        });
        addLog('settings_update', `Updated user profile details`);
    };
    // Client Operations
    const addClient = (clientData) => {
        const newClient = {
            ...clientData,
            id: `cli_${Date.now()}`
        };
        setClients((prev) => [newClient, ...prev]);
        apiFetch('/api/clients', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newClient)
        }).catch((err) => console.error(err));
        addLog('client_create', `Client registered: ${newClient.businessName}`, `Email: ${newClient.email}`);
        return newClient;
    };
    const updateClient = (id, clientData) => {
        setClients((prev) => prev.map((c) => {
            if (c.id === id) {
                const updated = { ...c, ...clientData };
                apiFetch(`/api/clients/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updated)
                }).catch((err) => console.error(err));
                return updated;
            }
            return c;
        }));
        addLog('settings_update', `Client details modified for ID: ${id}`);
    };
    const deleteClient = (id) => {
        const client = clients.find((c) => c.id === id);
        setClients((prev) => prev.filter((c) => c.id !== id));
        apiFetch(`/api/clients/${id}`, { method: 'DELETE' }).catch((err) => console.error(err));
        addLog('settings_update', `Client deleted: ${client?.businessName || id}`);
    };
    // Invoice Operations
    const addInvoice = (invoiceData) => {
        let invoiceNumber = invoiceData.invoiceNumber;
        let nextNumStr = settings.invoice.nextNumber;
        if (!invoiceNumber) {
            invoiceNumber = `${settings.invoice.prefix}${nextNumStr}`;
            if (settings.invoice.autoIncrement) {
                const nextNum = parseInt(nextNumStr, 10) + 1;
                const paddingLen = nextNumStr.length;
                const nextNumPadded = String(nextNum).padStart(paddingLen, '0');
                const newSettings = {
                    ...settings,
                    invoice: {
                        ...settings.invoice,
                        nextNumber: nextNumPadded
                    }
                };
                setSettings(newSettings);
                apiFetch('/api/settings', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newSettings)
                }).catch((err) => console.error(err));
            }
        }
        const calculated = recalculateInvoiceTotals(invoiceData, settings.tax.taxPercentage);
        const newInvoice = {
            ...invoiceData,
            id: `inv_${Date.now()}`,
            invoiceNumber,
            ...calculated
        };
        setInvoices((prev) => [newInvoice, ...prev]);
        apiFetch('/api/invoices', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newInvoice)
        }).catch((err) => console.error(err));
        addLog('invoice_create', `Invoice ${invoiceNumber} issued to client`, `Total: ${formatCurrency(newInvoice.totalDue)}`);
        return newInvoice;
    };
    const updateInvoice = (id, invoiceData) => {
        setInvoices((prev) => prev.map((inv) => {
            if (inv.id === id) {
                const merged = { ...inv, ...invoiceData };
                const calculated = recalculateInvoiceTotals(merged, settings.tax.taxPercentage);
                const updated = { ...merged, ...calculated };
                apiFetch(`/api/invoices/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updated)
                }).catch((err) => console.error(err));
                return updated;
            }
            return inv;
        }));
        addLog('settings_update', `Invoice modified: ${id}`);
    };
    const deleteInvoice = (id) => {
        const inv = invoices.find((invoice) => invoice.id === id);
        setInvoices((prev) => prev.filter((invoice) => invoice.id !== id));
        apiFetch(`/api/invoices/${id}`, { method: 'DELETE' }).catch((err) => console.error(err));
        addLog('settings_update', `Invoice deleted: ${inv?.invoiceNumber || id}`);
    };
    const addPayment = (invoiceId, paymentData) => {
        const payId = `pay_${Date.now()}`;
        const newPayment = { ...paymentData, id: payId };
        setInvoices((prev) => prev.map((inv) => {
            if (inv.id === invoiceId) {
                const updatedPayments = [...inv.payments, newPayment];
                const totalPaid = updatedPayments.reduce((sum, p) => sum + p.amount, 0);
                let newStatus = inv.status;
                if (totalPaid >= inv.totalDue) {
                    newStatus = 'Paid';
                }
                else if (inv.status === 'Paid') {
                    newStatus = 'Published';
                }
                const updatedInvoice = {
                    ...inv,
                    payments: updatedPayments,
                    paidAmount: totalPaid,
                    status: newStatus
                };
                apiFetch(`/api/invoices/${invoiceId}/payments`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newPayment)
                }).catch((err) => console.error(err));
                return updatedInvoice;
            }
            return inv;
        }));
        addLog('settings_update', `Payment registered for Invoice: ${invoiceId}`, `Amount: ${formatCurrency(paymentData.amount)}`);
    };
    const deletePayment = (invoiceId, paymentId) => {
        setInvoices((prev) => prev.map((inv) => {
            if (inv.id === invoiceId) {
                const updatedPayments = inv.payments.filter((p) => p.id !== paymentId);
                const totalPaid = updatedPayments.reduce((sum, p) => sum + p.amount, 0);
                let newStatus = inv.status;
                if (totalPaid === 0) {
                    newStatus = 'Published';
                }
                else if (totalPaid >= inv.totalDue) {
                    newStatus = 'Paid';
                }
                else if (inv.status === 'Paid') {
                    newStatus = 'Published';
                }
                const updatedInvoice = {
                    ...inv,
                    payments: updatedPayments,
                    paidAmount: totalPaid,
                    status: newStatus
                };
                apiFetch(`/api/invoices/${invoiceId}/payments/${paymentId}`, {
                    method: 'DELETE'
                }).catch((err) => console.error(err));
                return updatedInvoice;
            }
            return inv;
        }));
        addLog('settings_update', `Payment deleted for Invoice: ${invoiceId}`);
    };
    // Quotation Operations
    const addQuotation = (quoteData) => {
        let quoteNumber = quoteData.quoteNumber;
        let nextNumStr = settings.quote.nextNumber;
        if (!quoteNumber) {
            quoteNumber = `${settings.quote.prefix}${nextNumStr}`;
            if (settings.quote.autoIncrement) {
                const nextNum = parseInt(nextNumStr, 10) + 1;
                const paddingLen = nextNumStr.length;
                const nextNumPadded = String(nextNum).padStart(paddingLen, '0');
                const newSettings = {
                    ...settings,
                    quote: {
                        ...settings.quote,
                        nextNumber: nextNumPadded
                    }
                };
                setSettings(newSettings);
                apiFetch('/api/settings', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newSettings)
                }).catch((err) => console.error(err));
            }
        }
        const calculated = recalculateQuoteTotals(quoteData, settings.tax.taxPercentage);
        const newQuotation = {
            ...quoteData,
            id: `quote_${Date.now()}`,
            quoteNumber,
            ...calculated
        };
        setQuotations((prev) => [newQuotation, ...prev]);
        apiFetch('/api/quotes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newQuotation)
        }).catch((err) => console.error(err));
        addLog('invoice_create', `Quotation ${quoteNumber} issued to client`);
        return newQuotation;
    };
    const updateQuotation = (id, quoteData) => {
        setQuotations((prev) => prev.map((quote) => {
            if (quote.id === id) {
                const merged = { ...quote, ...quoteData };
                const calculated = recalculateQuoteTotals(merged, settings.tax.taxPercentage);
                const updated = { ...merged, ...calculated };
                apiFetch(`/api/quotes/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updated)
                }).catch((err) => console.error(err));
                return updated;
            }
            return quote;
        }));
    };
    const deleteQuotation = (id) => {
        const q = quotations.find((quote) => quote.id === id);
        setQuotations((prev) => prev.filter((quote) => quote.id !== id));
        apiFetch(`/api/quotes/${id}`, { method: 'DELETE' }).catch((err) => console.error(err));
        addLog('settings_update', `Quotation deleted: ${q?.quoteNumber || id}`);
    };
    const acceptQuotation = (id, reason) => {
        const quote = quotations.find((q) => q.id === id);
        if (!quote)
            return;
        updateQuotation(id, { status: 'Accepted' });
        addLog('quote_accepted', `Quotation ${quote.quoteNumber} accepted by client`, reason ? `Notes: ${reason}` : undefined);
    };
    const declineQuotation = (id, reason) => {
        updateQuotation(id, { status: 'Declined', reasonForDecline: reason });
        addLog('quote_declined', `Quotation declined by client`, `Reason: ${reason}`);
    };
    const convertQuotationToInvoice = (id) => {
        const quote = quotations.find((q) => q.id === id);
        if (!quote)
            return null;
        const createdDate = new Date().toISOString().split('T')[0];
        const dueDateObj = new Date();
        dueDateObj.setDate(dueDateObj.getDate() + settings.invoice.defaultDueDays);
        const dueDate = dueDateObj.toISOString().split('T')[0];
        const invoiceItems = quote.items.map((item) => ({
            id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            qty: item.qty,
            title: item.title,
            adjustPercent: item.adjustPercent || 0,
            rate: item.rate,
            amount: item.amount,
            description: item.description,
            taxable: item.taxable
        }));
        const invoice = addInvoice({
            orderNumber: `CONV-${quote.quoteNumber}`,
            clientId: quote.clientId,
            status: 'Draft',
            createdDate,
            dueDate,
            title: `Invoice converted from ${quote.quoteNumber}: ${quote.title}`,
            items: invoiceItems,
            payments: [],
            discount: quote.discount,
            taxRate: quote.taxRate,
            terms: settings.invoice.terms,
            footer: settings.invoice.footer,
            quotationNumber: quote.quoteNumber
        });
        addLog('invoice_create', `Invoice ${invoice.invoiceNumber} created from Quote ${quote.quoteNumber}`);
        return invoice;
    };
    // Settings Operations
    const updateSettings = (updatedSettings) => {
        const merged = { ...settings, ...updatedSettings };
        setSettings(merged);
        apiFetch('/api/settings', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(merged)
        }).catch((err) => console.error(err));
        addLog('settings_update', `Application parameters updated in admin panel`);
    };
    // Log Operations
    const addLog = (eventType, description, details) => {
        const logId = `log_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
        const newLog = {
            id: logId,
            timestamp: new Date().toISOString(),
            eventType,
            description,
            details: details || ''
        };
        setLogs((prev) => [newLog, ...prev]);
        apiFetch('/api/logs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newLog)
        }).catch((err) => console.error(err));
    };
    const clearLogs = () => {
        setLogs([]);
        apiFetch('/api/logs', { method: 'DELETE' }).catch((err) => console.error(err));
    };
    // Mock Email Operations
    const sendMockEmail = (to, subject, body, buttonText, buttonUrl) => {
        const emailId = `email_${Date.now()}`;
        const newEmail = {
            id: emailId,
            timestamp: new Date().toISOString(),
            to,
            subject,
            body,
            buttonText,
            buttonUrl
        };
        setSentEmails((prev) => [newEmail, ...prev]);
        apiFetch('/api/emails', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newEmail)
        }).catch((err) => console.error(err));
        addLog('email_send', `Simulated email dispatched to ${to}`, `Subject: ${subject}`);
    };
    return (<AppContext.Provider value={{
            clients,
            invoices,
            quotations,
            settings,
            logs,
            userProfile,
            isAuthenticated,
            sentEmails,
            register,
            login,
            logout,
            updateUserProfile,
            addClient,
            updateClient,
            deleteClient,
            addInvoice,
            updateInvoice,
            deleteInvoice,
            addPayment,
            deletePayment,
            addQuotation,
            updateQuotation,
            deleteQuotation,
            acceptQuotation,
            declineQuotation,
            convertQuotationToInvoice,
            updateSettings,
            addLog,
            clearLogs,
            sendMockEmail
        }}>
      {children}
    </AppContext.Provider>);
};
