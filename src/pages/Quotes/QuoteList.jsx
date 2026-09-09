import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/ui/Toast';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Search, Plus, Download, Edit, Trash2, Eye, Calendar } from 'lucide-react';
export const QuoteList = () => {
    const { quotations, clients, deleteQuotation, settings } = useApp();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [clientFilter, setClientFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const sym = settings.payment.currencySymbol;
    // Filter quotations
    const filteredQuotes = quotations.filter((q) => {
        const client = clients.find((c) => c.id === q.clientId);
        const matchesSearch = q.quoteNumber.toLowerCase().includes(search.toLowerCase()) ||
            (client?.businessName || '').toLowerCase().includes(search.toLowerCase()) ||
            q.title.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'All' || q.status === statusFilter;
        const matchesClient = clientFilter === 'All' || q.clientId === clientFilter;
        return matchesSearch && matchesStatus && matchesClient;
    });
    // Pagination logic
    const totalItems = filteredQuotes.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentQuotes = filteredQuotes.slice(indexOfFirstItem, indexOfLastItem);
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    const handleDelete = (id, num, e) => {
        e.stopPropagation();
        if (window.confirm(`Are you sure you want to delete quote ${num}?`)) {
            deleteQuotation(id);
            showToast('success', 'Quotation Deleted', `Quote ${num} deleted.`);
        }
    };
    // CSV download
    const handleExportCSV = () => {
        if (quotations.length === 0) {
            showToast('warning', 'Export Empty', 'No quotes to export');
            return;
        }
        const headers = ['Quote Number', 'Client', 'Status', 'Issued Date', 'Valid Until', 'Subtotal', 'Discount', 'Tax', 'Total Due', 'Title'];
        const rows = quotations.map((q) => {
            const client = clients.find((c) => c.id === q.clientId);
            return [
                q.quoteNumber,
                `"${client?.businessName || 'Unknown'}"`,
                q.status,
                q.createdDate,
                q.validUntilDate,
                q.subTotal,
                q.discount,
                q.taxAmount,
                q.totalDue,
                `"${q.title.replace(/"/g, '""')}"`
            ];
        });
        const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `quotations_export_${Date.now()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('success', 'Export Complete', 'Downloaded quotes CSV ledger.');
    };
    return (<div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-outfit tracking-tight">Quotations Directory</h1>
          <p className="text-sm text-slate-500">Track sent quotes, draft proposals, and customer acceptances.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" leftIcon={<Download className="h-4 w-4"/>} onClick={handleExportCSV}>
            Export CSV
          </Button>
          <Button variant="primary" leftIcon={<Plus className="h-4 w-4"/>} onClick={() => navigate('/quotes/create')}>
            Create Quotation
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        
        {/* Status Filters */}
        <div className="flex flex-wrap gap-1">
          {['All', 'Sent', 'Draft', 'Accepted', 'Declined', 'Expired'].map((status) => (<button key={status} onClick={() => {
                setStatusFilter(status);
                setCurrentPage(1);
            }} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${statusFilter === status
                ? 'bg-primary text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
              {status}
            </button>))}
        </div>

        {/* Search & Client selector */}
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
            <Input placeholder="Search quote number or description..." value={search} onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
        }} leftIcon={<Search className="h-4 w-4 text-slate-400"/>}/>
          </div>
        </div>

      </div>

      {/* Desktop Quotes Table */}
      <div className="hidden md:block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                <th className="px-6 py-3.5">Quotation Number</th>
                <th className="px-6 py-3.5">Title / Subject</th>
                <th className="px-6 py-3.5">Client Profile</th>
                <th className="px-6 py-3.5">Issued Date</th>
                <th className="px-6 py-3.5">Valid Until</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Total Proposal</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {currentQuotes.map((q) => {
            const client = clients.find((c) => c.id === q.clientId);
            return (<tr key={q.id} onClick={() => navigate(`/quotes/preview/${q.id}`)} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors cursor-pointer">
                    <td className="px-6 py-4 font-bold text-slate-950 dark:text-slate-100 whitespace-nowrap">
                      {q.quoteNumber}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300 max-w-[200px] truncate">
                      {q.title}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-200">
                      {client?.businessName || 'Unknown Client'}
                    </td>
                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-400"/>
                        <span>{q.createdDate}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                      <span>{q.validUntilDate}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={q.status}>{q.status}</Badge>
                    </td>
                    <td className="px-6 py-4 text-right font-black text-slate-950 dark:text-slate-100 font-outfit whitespace-nowrap">
                      {sym}{q.totalDue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <Link to={`/quotes/preview/${q.id}`} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-primary transition-colors" title="Preview">
                          <Eye className="h-4.5 w-4.5"/>
                        </Link>
                        {q.status === 'Draft' && (<Link to={`/quotes/edit/${q.id}`} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors" title="Edit">
                            <Edit className="h-4.5 w-4.5"/>
                          </Link>)}
                        <button onClick={(e) => handleDelete(q.id, q.quoteNumber, e)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-danger transition-colors cursor-pointer" title="Delete">
                          <Trash2 className="h-4.5 w-4.5"/>
                        </button>
                      </div>
                    </td>
                  </tr>);
        })}
              {currentQuotes.length === 0 && (<tr>
                  <td colSpan={8} className="px-6 py-16 text-center text-slate-400 dark:text-slate-500">
                    <Search className="h-10 w-10 text-slate-300 dark:text-slate-700 mx-auto mb-2"/>
                    <p className="text-sm font-semibold">No quotations issued yet</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Construct a new proposal quote to begin.
                    </p>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile & Tablet Card Layout */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {currentQuotes.map((q) => {
          const client = clients.find((c) => c.id === q.clientId);
          return (
            <div key={q.id} onClick={() => navigate(`/quotes/preview/${q.id}`)} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3 cursor-pointer hover:bg-slate-50/40 dark:hover:bg-slate-800/10 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 font-outfit uppercase tracking-wider">{q.quoteNumber}</span>
                  <h3 className="text-sm font-bold text-slate-850 dark:text-slate-200 mt-0.5">{q.title || 'Untitled Quotation'}</h3>
                </div>
                <Badge status={q.status}>{q.status}</Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-slate-500 text-[11px] border-y border-slate-100 dark:border-slate-800/60 py-2.5">
                <div>
                  <span className="block text-slate-400 font-semibold uppercase tracking-wider text-[9px]">Client</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{client?.businessName || 'Unknown'}</span>
                </div>
                <div>
                  <span className="block text-slate-400 font-semibold uppercase tracking-wider text-[9px]">Issued Date</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">{q.createdDate}</span>
                </div>
                <div className="mt-1 col-span-2">
                  <span className="block text-slate-400 font-semibold uppercase tracking-wider text-[9px]">Total Proposal</span>
                  <span className="font-bold text-slate-950 dark:text-slate-100 text-sm">{sym}{q.totalDue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-1" onClick={(e) => e.stopPropagation()}>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Valid: {q.validUntilDate}
                </span>
                <div className="flex gap-1.5">
                  <Link to={`/quotes/preview/${q.id}`} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-primary transition-colors">
                    <Eye className="h-4.5 w-4.5"/>
                  </Link>
                  {q.status === 'Draft' && (
                    <Link to={`/quotes/edit/${q.id}`} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                      <Edit className="h-4.5 w-4.5"/>
                    </Link>
                  )}
                  <button onClick={(e) => handleDelete(q.id, q.quoteNumber, e)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-danger transition-colors cursor-pointer">
                    <Trash2 className="h-4.5 w-4.5"/>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {currentQuotes.length === 0 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center text-slate-400 dark:text-slate-500">
            <Search className="h-10 w-10 text-slate-300 mx-auto mb-2"/>
            <p className="text-sm font-semibold">No quotations issued yet</p>
          </div>
        )}
      </div>

      {/* Pagination - Bottom Right */}
      {totalItems > itemsPerPage && (
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/20">
          <span className="text-slate-500 text-[11px]">
            Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, totalItems)} of {totalItems} records
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
