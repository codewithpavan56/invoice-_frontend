import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Download, Search, TrendingUp, Calendar, ShoppingBag } from 'lucide-react';
export const Reports = () => {
    const { invoices, clients, settings } = useApp();
    const { showToast } = useToast();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [search, setSearch] = useState('');
    const sym = settings.payment.currencySymbol;
    // Filter invoices based on date range and search query
    const filteredInvoices = invoices.filter((inv) => {
        const client = clients.find((c) => c.id === inv.clientId);
        const matchesSearch = inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
            (client?.businessName || '').toLowerCase().includes(search.toLowerCase());
        const invDate = new Date(inv.createdDate);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
        const matchesStart = !start || invDate >= start;
        const matchesEnd = !end || invDate <= end;
        return matchesSearch && matchesStart && matchesEnd && inv.status !== 'Cancelled';
    });
    // Calculate metrics
    const totalBilled = filteredInvoices.reduce((sum, inv) => sum + (inv.subTotal - inv.discount + inv.taxAmount), 0);
    const totalCollected = filteredInvoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
    const outstanding = Math.max(0, totalBilled - totalCollected);
    // Format currency helper
    const formatCurrency = (val) => {
        return `${sym}${val.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
    };
    const handleExportCSV = () => {
        if (filteredInvoices.length === 0) {
            showToast('warning', 'Export Empty', 'No records match search criteria.');
            return;
        }
        const headers = ['Invoice No', 'Client', 'Date', 'Amount Billed', 'Collected', 'Balance Due'];
        const rows = filteredInvoices.map((inv) => {
            const client = clients.find((c) => c.id === inv.clientId);
            return [
                inv.invoiceNumber,
                `"${client?.businessName || 'Unknown'}"`,
                inv.createdDate,
                (inv.subTotal - inv.discount + inv.taxAmount).toFixed(2),
                inv.paidAmount.toFixed(2),
                inv.totalDue.toFixed(2)
            ];
        });
        const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `financial_report_${Date.now()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('success', 'Report Exported', 'Financial breakdown saved to CSV.');
    };
    return (<div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold font-outfit tracking-tight">Financial Reports</h1>
        <p className="text-sm text-slate-500">View revenue summaries, collections breakdowns, and export transaction audit files.</p>
      </div>

      {/* Date Filter & Search Pane */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-end gap-4">
        <div className="flex-grow">
          <Input label="Search Client / Invoice" placeholder="Search by company name or invoice ID..." value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<Search className="h-4 w-4 text-slate-400"/>}/>
        </div>
        <div className="w-full md:w-44">
          <Input label="Start Date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}/>
        </div>
        <div className="w-full md:w-44">
          <Input label="End Date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}/>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" onClick={() => { setStartDate(''); setEndDate(''); setSearch(''); }} className="w-full md:w-auto">
            Reset
          </Button>
          <Button variant="primary" onClick={handleExportCSV} leftIcon={<Download className="h-4 w-4"/>} className="w-full md:w-auto">
            Export Report
          </Button>
        </div>
      </div>

      {/* Metrics breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Gross Billed</span>
            <h3 className="text-xl font-bold font-outfit mt-1">{formatCurrency(totalBilled)}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-primary dark:text-blue-400 flex items-center justify-center">
            <ShoppingBag className="h-5 w-5"/>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Gross Collected</span>
            <h3 className="text-xl font-bold font-outfit mt-1 text-emerald-600 dark:text-emerald-400">{formatCurrency(totalCollected)}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <TrendingUp className="h-5 w-5"/>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Outstanding Settle</span>
            <h3 className="text-xl font-bold font-outfit mt-1 text-rose-600 dark:text-rose-400">{formatCurrency(outstanding)}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <Calendar className="h-5 w-5"/>
          </div>
        </div>
      </div>

      {/* Breakdowns table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold font-outfit">Revenue Breakdowns</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                <th className="px-6 py-3.5">Invoice No</th>
                <th className="px-6 py-3.5">Client Partner</th>
                <th className="px-6 py-3.5">Created Date</th>
                <th className="px-6 py-3.5 text-right font-semibold">Subtotal Billed</th>
                <th className="px-6 py-3.5 text-right font-semibold">Discount</th>
                <th className="px-6 py-3.5 text-right font-semibold">Tax Charged</th>
                <th className="px-6 py-3.5 text-right font-semibold">Paid Amount</th>
                <th className="px-6 py-3.5 text-right font-semibold">Outstanding Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredInvoices.map((inv) => {
            const client = clients.find((c) => c.id === inv.clientId);
            const grossBill = inv.subTotal - inv.discount + inv.taxAmount;
            return (<tr key={inv.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="px-6 py-3.5 font-bold text-slate-950 dark:text-slate-100">{inv.invoiceNumber}</td>
                    <td className="px-6 py-3.5 font-bold">{client?.businessName || 'Unknown'}</td>
                    <td className="px-6 py-3.5">{inv.createdDate}</td>
                    <td className="px-6 py-3.5 text-right">{formatCurrency(inv.subTotal)}</td>
                    <td className="px-6 py-3.5 text-right text-rose-600 font-semibold">{inv.discount > 0 ? `-${formatCurrency(inv.discount)}` : '—'}</td>
                    <td className="px-6 py-3.5 text-right">{formatCurrency(inv.taxAmount)}</td>
                    <td className="px-6 py-3.5 text-right text-emerald-600 font-semibold">{formatCurrency(inv.paidAmount)}</td>
                    <td className="px-6 py-3.5 text-right font-black text-slate-900 dark:text-white font-outfit">{formatCurrency(inv.totalDue)}</td>
                  </tr>);
        })}
              {filteredInvoices.length === 0 && (<tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500">
                    No transactions match the search filters.
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>);
};
