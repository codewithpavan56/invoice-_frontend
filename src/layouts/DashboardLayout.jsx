import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/ui/Toast';
import { LayoutDashboard, FileSpreadsheet, FileSignature, Users, BarChart3, Settings as SettingsIcon, ChevronLeft, ChevronRight, Bell, Sun, Moon, LogOut, Mail, Plus, User, Menu } from 'lucide-react';
export const DashboardLayout = ({ children }) => {
    const { userProfile, updateUserProfile, logout, sentEmails, clients, settings } = useApp();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    // Sync dark mode class
    useEffect(() => {
        if (userProfile.visualPreference === 'dark') {
            document.documentElement.classList.add('dark');
        }
        else {
            document.documentElement.classList.remove('dark');
        }
    }, [userProfile.visualPreference]);
    const toggleTheme = () => {
        const newPref = userProfile.visualPreference === 'dark' ? 'light' : 'dark';
        // Apply immediately to DOM (synchronous) so there's no delay
        if (newPref === 'dark') {
            document.documentElement.classList.add('dark');
        }
        else {
            document.documentElement.classList.remove('dark');
        }
        updateUserProfile({ visualPreference: newPref });
        showToast('info', 'Theme changed', `Switched to ${newPref} mode`);
    };
    const navItems = [
        { label: 'Dashboard', path: '/', icon: <LayoutDashboard className="h-5 w-5"/> },
        { label: 'Invoices', path: '/invoices', icon: <FileSpreadsheet className="h-5 w-5"/> },
        { label: 'Quotations', path: '/quotes', icon: <FileSignature className="h-5 w-5"/> },
        { label: 'Clients', path: '/clients', icon: <Users className="h-5 w-5"/> },
        { label: 'Reports', path: '/reports', icon: <BarChart3 className="h-5 w-5"/> },
        { label: 'Settings', path: '/settings', icon: <SettingsIcon className="h-5 w-5"/> }
    ];
    // Get active page name for breadcrumb
    const currentNavItem = navItems.find(item => {
        if (item.path === '/')
            return location.pathname === '/';
        return location.pathname.startsWith(item.path);
    });
    const pageTitle = currentNavItem ? currentNavItem.label : 'Page';
    const handleLogout = () => {
        logout();
        showToast('success', 'Logged out successfully');
        navigate('/login');
    };
    return (<div className="min-h-screen flex bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
      
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-45 md:hidden" onClick={() => setMobileMenuOpen(false)}/>
      )}

      {/* Sidebar */}
      <aside className={`no-print flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 z-50
        fixed inset-y-0 left-0 md:relative md:translate-x-0
        ${mobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'} 
        ${sidebarCollapsed ? 'md:w-16 w-64' : 'md:w-64 w-64'}`}>
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
          {!sidebarCollapsed && (<Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-black text-lg shadow-md shadow-blue-500/20">
                {settings.business.name ? settings.business.name.slice(0, 2).toUpperCase() : 'IN'}
              </div>
              <span className="font-bold text-sm tracking-tight font-outfit truncate max-w-[170px]">
                {settings.business.name || 'Invoice Manager'}
              </span>
            </Link>)}
          {sidebarCollapsed && (<div className="w-8 h-8 mx-auto rounded-lg bg-primary flex items-center justify-center text-white font-black text-lg shadow-md shadow-blue-500/20">
              {settings.business.name ? settings.business.name.slice(0, 2).toUpperCase() : 'IN'}
            </div>)}
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors hidden md:block cursor-pointer">
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4"/> : <ChevronLeft className="h-4 w-4"/>}
          </button>
          {/* Close button on mobile side panel */}
          <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors md:hidden cursor-pointer">
            <ChevronLeft className="h-5 w-5"/>
          </button>
        </div>

        {/* Sidebar Quick Action */}
        {!sidebarCollapsed && (<div className="p-3">
            <button onClick={() => {
              setMobileMenuOpen(false);
              navigate('/invoices/create');
            }} className="w-full py-2 px-4 rounded-lg bg-primary hover:bg-blue-600 text-white font-medium text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/10 cursor-pointer">
              <Plus className="h-4 w-4"/> Create Invoice
            </button>
          </div>)}

        {/* Navigation Links */}
        <nav className="flex-1 px-2.5 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path);
            return (<Link key={item.label} to={item.path} onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                    ? 'bg-blue-50/70 text-primary dark:bg-blue-950/20 dark:text-blue-400'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                {item.icon}
                {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
              </Link>);
        })}
        </nav>

        {/* Sidebar Footer / Theme / User Profile */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
          {/* Theme Toggler */}
          <button onClick={() => {
            setMobileMenuOpen(false);
            toggleTheme();
          }} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
            {userProfile.visualPreference === 'dark' ? (<>
                <Sun className="h-5 w-5 text-amber-500"/>
                {!sidebarCollapsed && <span>Light Mode</span>}
              </>) : (<>
                <Moon className="h-5 w-5 text-indigo-500"/>
                {!sidebarCollapsed && <span>Dark Mode</span>}
              </>)}
          </button>

          {/* Logout */}
          <button onClick={() => {
            setMobileMenuOpen(false);
            handleLogout();
          }} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
            <LogOut className="h-5 w-5"/>
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Workspace Panel */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        
        {/* Navbar */}
        <header className="no-print h-16 flex items-center justify-between px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 gap-4">
          {/* Left: Hamburger & Breadcrumbs */}
          <div className="flex items-center gap-3">
            {/* Toggle button on mobile */}
            <button onClick={() => setMobileMenuOpen(true)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors md:hidden cursor-pointer" title="Open navigation drawer">
              <Menu className="h-5 w-5"/>
            </button>
            <span className="text-slate-400 dark:text-slate-500 text-sm hidden sm:inline">{settings.business.name || 'Dashboard'}</span>
            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">/</span>
            <span className="text-slate-800 dark:text-slate-100 font-semibold text-sm font-outfit">
              {pageTitle}
            </span>
          </div>

          {/* Right: Notifications, Mail Logs, Profile */}
          <div className="flex items-center gap-3 relative">
            
            {/* Simulated Email Box Trigger */}
            <button onClick={() => setNotificationOpen(!notificationOpen)} className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer" title="Mail Notifications Inbox">
              <Bell className="h-5 w-5"/>
              {sentEmails.length > 0 && (<span className="absolute top-1 right-1.5 h-2 w-2 rounded-full bg-rose-500"/>)}
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                {userProfile.avatarUrl ? (<img src={userProfile.avatarUrl} alt={userProfile.fullName} className="h-8 w-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"/>) : (<div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold border border-slate-200 dark:border-slate-700">
                    {(userProfile.fullName || userProfile.username || 'A').slice(0, 2).toUpperCase()}
                  </div>)}
                <div className="hidden md:block text-left">
                  <p className="text-xs font-semibold leading-tight">{userProfile.fullName || userProfile.username}</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-none">{userProfile.email || 'Administrator'}</p>
                </div>
              </button>

              {userMenuOpen && (<>
                  <div className="fixed inset-0 z-45" onClick={() => setUserMenuOpen(false)}/>
                  <div className="absolute right-0 mt-2 w-52 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">{userProfile.fullName}</p>
                      <p className="text-[10px] text-slate-500 truncate">{userProfile.email}</p>
                    </div>
                    <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800">
                      <User className="h-4 w-4"/> Edit Profile
                    </Link>
                    <Link to="/settings" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800">
                      <SettingsIcon className="h-4 w-4"/> App Settings
                    </Link>
                    <div className="border-t border-slate-100 dark:border-slate-800 mt-1"/>
                    <button onClick={() => {
                setUserMenuOpen(false);
                handleLogout();
            }} className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-left cursor-pointer">
                      <LogOut className="h-4 w-4"/> Logout
                    </button>
                  </div>
                </>)}
            </div>
          </div>
        </header>

        {/* Content Pane */}
        <main className="flex-grow p-6 md:p-8 overflow-y-auto">
          {children}
        </main>

        {/* Footer */}
        <footer className="no-print py-4 px-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-500 flex flex-col md:flex-row justify-between items-center gap-2">
          <span>&copy; {new Date().getFullYear()} {settings.business.name || 'Invoice Manager'}. All rights reserved.</span>
          {settings.business.website && (<div className="flex gap-4">
              <a href={settings.business.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5"/> {settings.business.website}
              </a>
            </div>)}
        </footer>
      </div>

      {/* Simulated Email Notifications Tray / Drawer */}
      {notificationOpen && (<>
          <div className="fixed inset-0 bg-slate-950/25 backdrop-blur-xs z-45" onClick={() => setNotificationOpen(false)}/>
          <div className="fixed right-0 top-0 bottom-0 w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-250">
            <div className="h-16 flex items-center justify-between px-5 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-base flex items-center gap-2 font-outfit">
                <Mail className="h-5 w-5 text-primary"/> SMTP Outbox Feed
              </h3>
              <button onClick={() => setNotificationOpen(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-slate-700 cursor-pointer">
                &times;
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-200/60 dark:border-slate-800">
                <p className="text-[10px] uppercase font-bold text-slate-400 leading-none mb-1">Interactive Sandbox Environment</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  This panel logs simulated email dispatches sent when quotes are accepted or invoices are published.
                </p>
              </div>

              {sentEmails.length === 0 ? (<div className="h-64 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                  <Mail className="h-12 w-12 stroke-[1.5] mb-2 text-slate-300"/>
                  <p className="text-xs font-semibold">No emails sent yet</p>
                  <p className="text-[10px]">Create or accept a quote to trigger emails.</p>
                </div>) : (sentEmails.map((email) => (<div key={email.id} className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 p-4 shadow-sm space-y-2.5">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-semibold text-slate-400 dark:text-slate-500">
                        {new Date(email.timestamp).toLocaleTimeString()}
                      </span>
                      <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded font-medium">
                        DISPATCHED
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        To: <span className="font-medium text-slate-900 dark:text-slate-100">{email.to}</span>
                      </p>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Subject: <span className="font-semibold text-primary">{email.subject}</span>
                      </p>
                    </div>
                    <div className="border-t border-slate-100 dark:border-slate-800 pt-2 text-xs text-slate-600 dark:text-slate-400 whitespace-pre-wrap font-sans bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                      {email.body}
                    </div>
                    {email.buttonText && (<div className="pt-1">
                        <Link to={email.buttonUrl || '#'} onClick={() => setNotificationOpen(false)} className="inline-block w-full text-center py-2 bg-slate-900 hover:bg-black dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-lg text-[11px] font-semibold transition-colors">
                          {email.buttonText}
                        </Link>
                      </div>)}
                  </div>)))}
            </div>
          </div>
        </>)}
    </div>);
};
