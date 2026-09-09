import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { ClientForm } from './ClientForm';
import { Search, Plus, Download, Eye, Edit, Trash2 } from 'lucide-react';
export const ClientList = () => {
    const { clients, invoices, deleteClient, settings } = useApp();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const sym = settings.payment.currencySymbol;
    // Filter clients based on search query
    const filteredClients = clients.filter((c) => c.businessName.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.username.toLowerCase().includes(search.toLowerCase()));
    const handleEdit = (client, e) => {
        e.stopPropagation();
        setEditingClient(client);
        setIsFormOpen(true);
    };
    const handleDelete = (id, name, e) => {
        e.stopPropagation();
        if (window.confirm(`Are you sure you want to delete client "${name}"? This will delete their profile.`)) {
            deleteClient(id);
            showToast('success', 'Client Deleted', `${name} has been removed.`);
        }
    };
    const handleFormClose = () => {
        setIsFormOpen(false);
        setEditingClient(null);
    };
    // Export to CSV
    const handleExportCSV = () => {
        if (clients.length === 0) {
            showToast('warning', 'Export Empty', 'No clients to export');
            return;
        }
        const headers = ['Client ID', 'Business Name', 'Username', 'Email', 'Address', 'GST NO'];
        const rows = clients.map((c) => [
            c.id,
            `"${c.businessName.replace(/"/g, '""')}"`,
            c.username,
            c.email,
            `"${c.address.replace(/"/g, '""')}"`,
            `"${(c.gstNo || '').replace(/"/g, '""')}"`
        ]);
        const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `clients_export_${Date.now()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('success', 'Export Complete', 'Downloaded clients CSV file.');
    };
    return (<div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-outfit tracking-tight">Clients Directory</h1>
          <p className="text-sm text-slate-500">Manage client relationships, billing details, and accounts history.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" leftIcon={<Download className="h-4 w-4"/>} onClick={handleExportCSV}>
            Export CSV
          </Button>
          <Button variant="primary" leftIcon={<Plus className="h-4 w-4"/>} onClick={() => setIsFormOpen(true)}>
            Add New Client
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="max-w-md w-full">
          <Input placeholder="Search by company name, username, or email..." value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<Search className="h-4 w-4 text-slate-400"/>}/>
        </div>
        <div className="text-xs text-slate-400 font-medium">
          Showing {filteredClients.length} of {clients.length} accounts
        </div>
      </div>

      {/* Client List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredClients.map((client) => {
            const clientInvoices = invoices.filter((i) => i.clientId === client.id);
            const totalInvoiced = clientInvoices.reduce((sum, inv) => sum + (inv.subTotal - inv.discount + inv.taxAmount), 0);
            const totalPaid = clientInvoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
            const totalDue = Math.max(0, totalInvoiced - totalPaid);
            return (<div key={client.id} onClick={() => navigate(`/clients/detail/${client.id}`)} className="group cursor-pointer rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between gap-5 relative overflow-hidden">
              {/* Top Details */}
              <div className="space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors font-outfit truncate">
                    {client.businessName}
                  </h3>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => handleEdit(client, e)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-primary cursor-pointer" title="Edit">
                      <Edit className="h-3.5 w-3.5"/>
                    </button>
                    <button onClick={(e) => handleDelete(client.id, client.businessName, e)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-danger cursor-pointer" title="Delete">
                      <Trash2 className="h-3.5 w-3.5"/>
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-500 truncate">{client.email}</p>
                {client.gstNo && (
                  <p className="text-[11px] text-slate-400 truncate font-mono">GST: {client.gstNo}</p>
                )}
              </div>

              {/* Stats Breakdown */}
              <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 grid grid-cols-3 gap-2 text-center">
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Invoices</span>
                  <span className="block text-xs font-bold mt-0.5">{clientInvoices.length}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Billed</span>
                  <span className="block text-xs font-bold mt-0.5">{sym}{totalInvoiced.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Balance</span>
                  <span className={`block text-xs font-bold mt-0.5 ${totalDue > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500'}`}>
                    {sym}{totalDue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>

              {/* View Detail Indicator */}
              <div className="absolute right-0 bottom-0 p-3 flex items-center justify-center text-primary group-hover:translate-x-0 translate-x-4 opacity-0 group-hover:opacity-100 transition-all duration-200">
                <Eye className="h-4 w-4"/>
              </div>
            </div>);
        })}

        {filteredClients.length === 0 && (<div className="col-span-full py-16 flex flex-col items-center justify-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 text-slate-400 text-center">
            <Search className="h-10 w-10 text-slate-300 dark:text-slate-700 mb-2"/>
            <p className="text-sm font-semibold">No clients matching search found</p>
            <p className="text-xs text-slate-500">Try modifying your query or add a new client.</p>
          </div>)}
      </div>

      {/* Form Drawer (Modal Modal) */}
      <Modal isOpen={isFormOpen} onClose={handleFormClose} title={editingClient ? 'Edit Client Details' : 'Add New Client'} size="md">
        <ClientForm client={editingClient} onClose={handleFormClose}/>
      </Modal>
    </div>);
};
