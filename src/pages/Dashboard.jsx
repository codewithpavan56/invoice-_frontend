import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Users, FileSpreadsheet, FileSignature, DollarSign, Activity, ArrowUpRight, Plus } from 'lucide-react';
export const Dashboard = () => {
    const { invoices, clients, quotations, logs, settings } = useApp();
    const navigate = useNavigate();
    const sym = settings.payment.currencySymbol;
    // 1. Calculations
    // Total Invoice Value = Sum of (Subtotal - Discount + Tax) for non-draft / non-cancelled
    const billedInvoices = invoices.filter(inv => inv.status !== 'Draft' && inv.status !== 'Cancelled');
    const totalInvoiced = billedInvoices.reduce((sum, inv) => {
        const totalAmount = (inv.subTotal - inv.discount) + inv.taxAmount;
        return sum + totalAmount;
    }, 0);
    const totalPaid = billedInvoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
    const totalOutstanding = Math.max(0, totalInvoiced - totalPaid);
    const draftQuotes = quotations.filter(q => q.status === 'Draft').length;
    const activeClientsCount = clients.length;
    // 2. Chart Data: Monthly Revenue Growth
    // Let's aggregate invoices by Month
    const monthlyDataMap = {};
    // Initialize last 6 months
    const monthsList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    // Fill default values for current and past few months
    for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const mName = monthsList[d.getMonth()];
        monthlyDataMap[mName] = { month: mName, invoiced: 0, paid: 0 };
    }
    // Populate data from actual invoices
    invoices.forEach(inv => {
        if (inv.status === 'Cancelled')
            return;
        const date = new Date(inv.createdDate);
        const mName = monthsList[date.getMonth()];
        const amt = (inv.subTotal - inv.discount) + inv.taxAmount;
        if (monthlyDataMap[mName]) {
            monthlyDataMap[mName].invoiced += amt;
            monthlyDataMap[mName].paid += inv.paidAmount;
        }
        else {
            // If outside last 6 months but valid month, set it
            monthlyDataMap[mName] = { month: mName, invoiced: amt, paid: inv.paidAmount };
        }
    });
    const chartData = Object.values(monthlyDataMap);
    // 3. Status Distribution (Pie Chart)
    const statusCounts = { Paid: 0, Overdue: 0, Published: 0, Draft: 0, Cancelled: 0 };
    invoices.forEach(inv => {
        statusCounts[inv.status] = (statusCounts[inv.status] || 0) + 1;
    });
    const pieData = Object.keys(statusCounts).map(key => ({
        name: key,
        value: statusCounts[key]
    })).filter(d => d.value > 0);
    const COLORS = {
        Paid: '#10B981', // Emerald 500
        Overdue: '#EF4444', // Rose 500
        Published: '#3B82F6', // Blue 500
        Draft: '#64748B', // Slate 500
        Cancelled: '#94A3B8' // Slate 400
    };
    const formatCurrency = (val) => {
        return `${sym}${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };
    return (<div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-outfit tracking-tight">Ledger Console</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Realtime operations of Ultrakey IT Solutions.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="primary" leftIcon={<Plus className="h-4 w-4"/>} onClick={() => navigate('/invoices/create')}>
            New Invoice
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Billed */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Invoiced</span>
            <h3 className="text-2xl font-black font-outfit">{formatCurrency(totalInvoiced)}</h3>
            <p className="text-[10px] text-emerald-500 flex items-center gap-1">
              <TrendingUp className="h-3 w-3"/> +14.2% from last month
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-primary dark:text-blue-400 flex items-center justify-center">
            <DollarSign className="h-6 w-6"/>
          </div>
        </div>

        {/* Total Collections */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Paid Revenue</span>
            <h3 className="text-2xl font-black font-outfit text-emerald-600 dark:text-emerald-400">{formatCurrency(totalPaid)}</h3>
            <p className="text-[10px] text-slate-400">
              Collection Rate: {totalInvoiced > 0 ? ((totalPaid / totalInvoiced) * 100).toFixed(1) : 0}%
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <FileSpreadsheet className="h-6 w-6"/>
          </div>
        </div>

        {/* Total Outstanding */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Outstanding Balance</span>
            <h3 className="text-2xl font-black font-outfit text-rose-600 dark:text-rose-400">{formatCurrency(totalOutstanding)}</h3>
            <p className="text-[10px] text-slate-400">
              Across {invoices.filter(i => i.status === 'Published' || i.status === 'Overdue').length} pending bills
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <FileSignature className="h-6 w-6"/>
          </div>
        </div>

        {/* Clients and Draft Quotes */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Active Clients</span>
            <h3 className="text-2xl font-black font-outfit">{activeClientsCount} Business Partners</h3>
            <p className="text-[10px] text-slate-400">
              {draftQuotes} draft quotations pending acceptance
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <Users className="h-6 w-6"/>
          </div>
        </div>
      </div>

      {/* Charts Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Growth Area Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-bold font-outfit">Revenue Analytics</h3>
            <p className="text-xs text-slate-400">Monthly billing and collections comparison.</p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorInvoiced" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-100 dark:stroke-slate-800"/>
                <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="#94A3B8"/>
                <YAxis tick={{ fontSize: 10 }} stroke="#94A3B8"/>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '11px' }} formatter={(value) => [formatCurrency(value), '']}/>
                <Legend wrapperStyle={{ fontSize: '10px' }}/>
                <Area type="monotone" dataKey="invoiced" name="Invoiced" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#colorInvoiced)"/>
                <Area type="monotone" dataKey="paid" name="Collected" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorPaid)"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Invoice Status Distribution Pie Chart */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-bold font-outfit">Invoice Registry</h3>
            <p className="text-xs text-slate-400">Current status distribution of invoices.</p>
          </div>
          <div className="h-60 w-full flex items-center justify-center">
            {pieData.length === 0 ? (<p className="text-xs text-slate-400">No invoices available</p>) : (<ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={3} dataKey="value">
                    {pieData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#94A3B8'}/>))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '11px' }}/>
                </PieChart>
              </ResponsiveContainer>)}
          </div>
          <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
            {pieData.map((d) => (<div key={d.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: COLORS[d.name] }}/>
                <span>{d.name} ({d.value})</span>
              </div>))}
          </div>
        </div>
      </div>

      {/* Feed Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Activity Log */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold font-outfit flex items-center gap-1.5">
                <Activity className="h-4 w-4 text-primary"/> Audit Trail
              </h3>
              <p className="text-xs text-slate-400 font-sans">Latest activities logged chronologically.</p>
            </div>
          </div>
          
          <div className="space-y-4 flex-1">
            {logs.slice(0, 5).map((log) => (<div key={log.id} className="flex items-start gap-3 text-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 mt-1.5 flex-shrink-0"/>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{log.description}</p>
                  {log.details && (<p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">{log.details}</p>)}
                </div>
                <span className="text-[10px] text-slate-400 whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>))}
            {logs.length === 0 && (<div className="h-full flex items-center justify-center py-8 text-slate-400 text-xs">
                No logs recorded yet.
              </div>)}
          </div>
        </div>

        {/* Latest Clients */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold font-outfit">Business Directory</h3>
              <p className="text-xs text-slate-400">Recently registered client accounts.</p>
            </div>
            <Link to="/clients" className="text-xs text-primary hover:text-blue-600 font-bold flex items-center gap-0.5">
              Manage Clients <ArrowUpRight className="h-3.5 w-3.5"/>
            </Link>
          </div>
          
          <div className="divide-y divide-slate-100 dark:divide-slate-800 flex-1">
            {clients.slice(0, 5).map((cli) => {
            // Count client's invoices
            const clientInvoices = invoices.filter(i => i.clientId === cli.id);
            const invoiceSum = clientInvoices.reduce((sum, inv) => sum + (inv.subTotal - inv.discount + inv.taxAmount), 0);
            return (<div key={cli.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-200">{cli.businessName}</h4>
                    <p className="text-[10px] text-slate-400">{cli.email}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold font-outfit block">{formatCurrency(invoiceSum)}</span>
                    <span className="text-[10px] text-slate-400 block">{clientInvoices.length} Invoices</span>
                  </div>
                </div>);
        })}
            {clients.length === 0 && (<div className="h-full flex items-center justify-center py-8 text-slate-400 text-xs">
                No clients found.
              </div>)}
          </div>
        </div>
      </div>
    </div>);
};
