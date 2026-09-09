import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { History, Trash2, Search, Calendar, RefreshCw } from 'lucide-react';
export const Logs = () => {
    const { logs, clearLogs } = useApp();
    const { showToast } = useToast();
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('All');
    // Filter logs
    const filteredLogs = logs.filter((log) => {
        const matchesSearch = log.description.toLowerCase().includes(search.toLowerCase()) ||
            (log.details || '').toLowerCase().includes(search.toLowerCase());
        const matchesType = typeFilter === 'All' ||
            (typeFilter === 'Invoices' && (log.eventType === 'invoice_create' || log.eventType === 'invoice_paid')) ||
            (typeFilter === 'Clients' && log.eventType === 'client_create') ||
            (typeFilter === 'Payments' && log.eventType === 'payment_add') ||
            (typeFilter === 'Emails' && log.eventType === 'email_send') ||
            (typeFilter === 'Settings' && log.eventType === 'settings_update') ||
            (typeFilter === 'Quotes' && (log.eventType === 'quote_create' || log.eventType === 'quote_accepted' || log.eventType === 'quote_declined'));
        return matchesSearch && matchesType;
    });
    const handleClear = () => {
        if (window.confirm('Are you sure you want to clear all audit logs permanently?')) {
            clearLogs();
            showToast('success', 'Audit Trail Cleared', 'Logs removed successfully.');
        }
    };
    const getLogBadge = (type) => {
        switch (type) {
            case 'invoice_create':
            case 'invoice_paid':
                return <Badge variant="primary">Invoice</Badge>;
            case 'client_create':
                return <Badge variant="accent">Client</Badge>;
            case 'payment_add':
                return <Badge variant="success">Payment</Badge>;
            case 'email_send':
                return <Badge variant="info">SMTP Mail</Badge>;
            case 'quote_create':
            case 'quote_accepted':
            case 'quote_declined':
                return <Badge variant="warning">Quote</Badge>;
            default:
                return <Badge variant="secondary">System</Badge>;
        }
    };
    return (<div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-outfit tracking-tight flex items-center gap-2">
            <History className="h-6 w-6 text-primary"/> Audit Trail Ledger
          </h1>
          <p className="text-sm text-slate-500">Chronological history log of all invoice states, client creations, and SMTP outbox transmissions.</p>
        </div>
        {logs.length > 0 && (<Button variant="outline" className="text-rose-600 hover:text-red-700 hover:bg-rose-50 border-rose-200" onClick={handleClear} leftIcon={<Trash2 className="h-4 w-4"/>}>
            Clear History Logs
          </Button>)}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        
        {/* Categories */}
        <div className="flex flex-wrap gap-1">
          {['All', 'Invoices', 'Quotes', 'Clients', 'Payments', 'Emails', 'Settings'].map((type) => (<button key={type} onClick={() => setTypeFilter(type)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${typeFilter === type
                ? 'bg-primary text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
              {type}
            </button>))}
        </div>

        {/* Search */}
        <div className="max-w-xs w-full">
          <Input placeholder="Search log descriptions..." value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<Search className="h-4 w-4 text-slate-400"/>}/>
        </div>

      </div>

      {/* Audit Logs list */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
        {filteredLogs.map((log) => (<div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
            <div className="flex items-start gap-3">
              <div className="mt-1 flex-shrink-0">{getLogBadge(log.eventType)}</div>
              <div>
                <p className="font-bold text-slate-900 dark:text-slate-100">{log.description}</p>
                {log.details && <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-mono">{log.details}</p>}
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500 shrink-0 font-semibold">
              <Calendar className="h-3.5 w-3.5"/>
              <span>{new Date(log.timestamp).toLocaleString()}</span>
            </div>
          </div>))}
        {filteredLogs.length === 0 && (<div className="py-16 text-center text-slate-400 dark:text-slate-500">
            <RefreshCw className="h-10 w-10 text-slate-300 dark:text-slate-700 mx-auto mb-2"/>
            <p className="text-sm font-semibold">No audit logs found matching criteria</p>
          </div>)}
      </div>
    </div>);
};
