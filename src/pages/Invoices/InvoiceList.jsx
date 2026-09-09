import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/ui/Toast';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Search, Plus, Download, Edit, Trash2, Eye, Calendar } from 'lucide-react';
export const InvoiceList = () => {
    const { invoices, clients, deleteInvoice, settings } = useApp();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [clientFilter, setClientFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const sym = settings.payment.currencySymbol;
    // Filter handlers
    const filteredInvoices = invoices.filter((inv) => {
        const client = clients.find((c) => c.id === inv.clientId);
        const matchesSearch = inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
            (client?.businessName || '').toLowerCase().includes(search.toLowerCase()) ||
            inv.title.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
        const matchesClient = clientFilter === 'All' || inv.clientId === clientFilter;
        return matchesSearch && matchesStatus && matchesClient;
    });
    // Pagination logic
    const totalItems = filteredInvoices.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentInvoices = filteredInvoices.slice(indexOfFirstItem, indexOfLastItem);
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    const handleDelete = (id, num, e) => {
        e.stopPropagation();
        if (window.confirm(`Are you sure you want to delete invoice ${num}?`)) {
            deleteInvoice(id);
            showToast('success', 'Invoice Deleted', `Invoice ${num} has been deleted.`);
        }
    };
    // Export CSV
    const handleExportCSV = () => {
        if (invoices.length === 0) {
            showToast('warning', 'Export Empty', 'No invoices to export');
            return;
        }
        const headers = ['Invoice Number', 'Order Number', 'Client', 'Status', 'Issued Date', 'Due Date', 'Subtotal', 'Discount', 'Tax', 'Paid', 'Total Due', 'Title'];
        const rows = invoices.map((inv) => {
            const client = clients.find((c) => c.id === inv.clientId);
            return [
                inv.invoiceNumber,
                inv.orderNumber,
                `"${client?.businessName || 'Unknown'}"`,
                inv.status,
                inv.createdDate,
                inv.dueDate,
                inv.subTotal,
                inv.discount,
                inv.taxAmount,
                inv.paidAmount,
                inv.totalDue,
                `"${inv.title.replace(/"/g, '""')}"`
            ];
        });
        const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `invoices_export_${Date.now()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('success', 'Export Complete', 'Downloaded invoices CSV ledger file.');
    };
    return (<div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-outfit tracking-tight">Invoice Registry</h1>
          <p className="text-sm text-slate-500">Track collections, billings, payments, and print copies.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" leftIcon={<Download className="h-4 w-4"/>} onClick={handleExportCSV}>
            Export CSV
          </Button>
          <Button variant="primary" leftIcon={<Plus className="h-4 w-4"/>} onClick={() => navigate('/invoices/create')}>
            Create Invoice
          </Button>
        </div>
      </div>

      {/* Tabs Filter */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        
        {/* Status Filters */}
        <div className="flex flex-wrap gap-1">
          {['All', 'Paid', 'Published', 'Draft', 'Overdue', 'Cancelled'].map((status) => (<button key={status} onClick={() => {
                setStatusFilter(status);
                setCurrentPage(1);
            }} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${statusFilter === status
                ? 'bg-primary text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
              {status}
            </button>))}
        </div>

        {/* Client Selection */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-44">
            <select value={clientFilter} onChange={(e) => {
            setClientFilter(e.target.value);
            setCurrentPage(1);
        }} className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs focus:border-primary focus:outline-hidden text-slate-600 dark:text-slate-300">
              <option value="All">All Clients</option>
              {clients.map((c) => (<option key={c.id} value={c.id}>
                  {c.businessName}
                </option>))}
            </select>
          </div>
          <div className="max-w-xs w-full">
            <Input placeholder="Search invoice number or description..." value={search} onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
        }} leftIcon={<Search className="h-4 w-4 text-slate-400"/>}/>
          </div>
        </div>

      </div>

      {/* Desktop Invoices Table */}
      <div className="hidden md:block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                <th className="px-6 py-3.5">Invoice Number</th>
                <th className="px-6 py-3.5">Title / Subject</th>
                <th className="px-6 py-3.5">Client Profile</th>
                <th className="px-6 py-3.5">Issued Date</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Outstanding</th>
                <th className="px-6 py-3.5 text-right">Total Amount</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {currentInvoices.map((inv) => {
            const client = clients.find((c) => c.id === inv.clientId);
            const totalAmount = (inv.subTotal - inv.discount) + inv.taxAmount;
            return (<tr key={inv.id} onClick={() => navigate(`/invoices/preview/${inv.id}`)} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors cursor-pointer">
                    <td className="px-6 py-4 font-bold text-slate-950 dark:text-slate-100 whitespace-nowrap">
                      {inv.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300 max-w-[200px] truncate">
                      {inv.title}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-slate-200">
                          {client?.businessName || 'Unknown Client'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-400"/>
                        <span>{inv.createdDate}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={inv.status}>{inv.status}</Badge>
                    </td>
                    <td className={`px-6 py-4 text-right font-semibold whitespace-nowrap ${inv.totalDue > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400'}`}>
                      {sym}{inv.totalDue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-right font-black text-slate-950 dark:text-slate-100 font-outfit whitespace-nowrap">
                      {sym}{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <Link to={`/invoices/preview/${inv.id}`} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-primary transition-colors" title="Preview">
                          <Eye className="h-4.5 w-4.5"/>
                        </Link>
                        {inv.status === 'Draft' && (<Link to={`/invoices/edit/${inv.id}`} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors" title="Edit">
                            <Edit className="h-4.5 w-4.5"/>
                          </Link>)}
                        <button onClick={(e) => handleDelete(inv.id, inv.invoiceNumber, e)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-danger transition-colors cursor-pointer" title="Delete">
                          <Trash2 className="h-4.5 w-4.5"/>
                        </button>
                      </div>
                    </td>
                  </tr>);
        })}

              {currentInvoices.length === 0 && (<tr>
                  <td colSpan={8} className="px-6 py-16 text-center text-slate-400 dark:text-slate-500">
                    <Search className="h-10 w-10 text-slate-300 dark:text-slate-700 mx-auto mb-2"/>
                    <p className="text-sm font-semibold">No invoices found matching criteria</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Clear filters or construct a new invoice to add records.
                    </p>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile & Tablet Card Layout */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {currentInvoices.map((inv) => {
          const client = clients.find((c) => c.id === inv.clientId);
          const totalAmount = (inv.subTotal - inv.discount) + inv.taxAmount;
          return (
            <div key={inv.id} onClick={() => navigate(`/invoices/preview/${inv.id}`)} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3 cursor-pointer hover:bg-slate-50/40 dark:hover:bg-slate-800/10 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 font-outfit uppercase tracking-wider">{inv.invoiceNumber}</span>
                  <h3 className="text-sm font-bold text-slate-850 dark:text-slate-200 mt-0.5">{inv.title || 'Untitled Invoice'}</h3>
                </div>
                <Badge status={inv.status}>{inv.status}</Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-slate-500 text-[11px] border-y border-slate-100 dark:border-slate-800/60 py-2.5">
                <div>
                  <span className="block text-slate-400 font-semibold uppercase tracking-wider text-[9px]">Client</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{client?.businessName || 'Unknown'}</span>
                </div>
                <div>
                  <span className="block text-slate-400 font-semibold uppercase tracking-wider text-[9px]">Issued Date</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">{inv.createdDate}</span>
                </div>
                <div className="mt-1">
                  <span className="block text-slate-400 font-semibold uppercase tracking-wider text-[9px]">Outstanding</span>
                  <span className={`font-semibold ${inv.totalDue > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'}`}>{sym}{inv.totalDue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="mt-1">
                  <span className="block text-slate-400 font-semibold uppercase tracking-wider text-[9px]">Total Amount</span>
                  <span className="font-bold text-slate-950 dark:text-slate-100">{sym}{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-1" onClick={(e) => e.stopPropagation()}>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Due: {inv.dueDate}
                </span>
                <div className="flex gap-1.5">
                  <Link to={`/invoices/preview/${inv.id}`} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-primary transition-colors">
                    <Eye className="h-4.5 w-4.5"/>
                  </Link>
                  {inv.status === 'Draft' && (
                    <Link to={`/invoices/edit/${inv.id}`} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                      <Edit className="h-4.5 w-4.5"/>
                    </Link>
                  )}
                  <button onClick={(e) => handleDelete(inv.id, inv.invoiceNumber, e)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-danger transition-colors cursor-pointer">
                    <Trash2 className="h-4.5 w-4.5"/>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {currentInvoices.length === 0 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center text-slate-400 dark:text-slate-500">
            <Search className="h-10 w-10 text-slate-300 mx-auto mb-2"/>
            <p className="text-sm font-semibold">No invoices found matching criteria</p>
          </div>
        )}
      </div>

        {/* Pagination Controls - Bottom Right */}
        {totalItems > itemsPerPage && (
          <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/20">
            <span className="text-slate-500 text-[11px]">
              Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, totalItems)} of {totalItems} invoices
            </span>
            
            <div className="flex items-center gap-1.5">
              <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
                Previous
              </Button>
              
              <div className="flex gap-1 text-[11px] font-bold">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (<button key={p} onClick={() => handlePageChange(p)} className={`w-7 h-7 rounded flex items-center justify-center border cursor-pointer ${currentPage === p
                  ? 'bg-primary border-primary text-white'
                  : 'border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                    {p}
                  </button>))}
              </div>

              <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>
                Next
              </Button>
            </div>
          </div>
        )}

      </div>);
};
