import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { ClientForm } from './ClientForm';
import { Building, Mail, Globe, MapPin, FileSpreadsheet, FileSignature, DollarSign, ChevronLeft, Edit } from 'lucide-react';
export const ClientDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { clients, invoices, quotations, settings } = useApp();
    const [isEditOpen, setIsEditOpen] = useState(false);
    const client = clients.find((c) => c.id === id);
    if (!client) {
        return (<div className="py-16 text-center">
        <h2 className="text-xl font-bold">Client Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">The client profile may have been deleted.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/clients')}>
          Back to Directory
        </Button>
      </div>);
    }
    const sym = settings.payment.currencySymbol;
    // Filter specific client invoices & quotations
    const clientInvoices = invoices.filter((i) => i.clientId === client.id);
    const clientQuotes = quotations.filter((q) => q.clientId === client.id);
    // Math totals
    const totalInvoiced = clientInvoices.reduce((sum, inv) => sum + (inv.subTotal - inv.discount + inv.taxAmount), 0);
    const totalPaid = clientInvoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
    const totalDue = Math.max(0, totalInvoiced - totalPaid);
    const formatCurrency = (val) => {
        return `${sym}${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };
    return (<div className="space-y-6">
      {/* Breadcrumb Header */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/clients" className="hover:text-primary transition-colors flex items-center gap-1 font-semibold">
          <ChevronLeft className="h-3.5 w-3.5"/> Back to Clients
        </Link>
      </div>

      {/* Main Grid: Info card left, stats history right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Client Business Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-primary dark:text-blue-400 flex items-center justify-center">
                <Building className="h-6 w-6"/>
              </div>
              <div>
                <h2 className="text-xl font-bold font-outfit text-slate-950 dark:text-slate-100">
                  {client.businessName}
                </h2>
                <span className="text-xs text-slate-400 dark:text-slate-500">@{client.username}</span>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-5 space-y-4 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-start gap-2.5">
                <Mail className="h-4 w-4 text-slate-400 mt-0.5"/>
                <span className="break-all font-semibold text-slate-900 dark:text-slate-200">{client.email}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-slate-400 mt-0.5"/>
                <span className="whitespace-pre-line">{client.address}</span>
              </div>
              {client.gstNo && (
                <div className="flex items-start gap-2.5">
                  <FileSignature className="h-4 w-4 text-slate-400 mt-0.5"/>
                  <span className="font-semibold text-slate-900 dark:text-slate-200">GST NO: {client.gstNo}</span>
                </div>
              )}
            </div>
          </div>

          <Button variant="outline" leftIcon={<Edit className="h-4 w-4"/>} onClick={() => setIsEditOpen(true)} className="w-full">
            Edit Profile
          </Button>
        </div>

        {/* Client Ledger Summary & Visual KPIs */}
        <div className="lg:col-span-2 space-y-6">
          {/* KPI Dashboard */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Billed</span>
                <h4 className="text-lg font-bold font-outfit mt-1">{formatCurrency(totalInvoiced)}</h4>
              </div>
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/20 text-primary dark:text-blue-400 flex items-center justify-center">
                <DollarSign className="h-4 w-4"/>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Paid Amount</span>
                <h4 className="text-lg font-bold font-outfit mt-1 text-emerald-600 dark:text-emerald-400">{formatCurrency(totalPaid)}</h4>
              </div>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <FileSpreadsheet className="h-4 w-4"/>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Outstanding Balance</span>
                <h4 className="text-lg font-bold font-outfit mt-1 text-rose-600 dark:text-rose-400">{formatCurrency(totalDue)}</h4>
              </div>
              <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <FileSignature className="h-4 w-4"/>
              </div>
            </div>
          </div>

          {/* Ledger Lists Tabs (Invoices & Quotations) */}
          <div className="space-y-6">
            
            {/* Invoices History Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
              <h3 className="text-sm font-bold font-outfit mb-4 flex items-center gap-1.5">
                <FileSpreadsheet className="h-4.5 w-4.5 text-primary"/> Invoice History ({clientInvoices.length})
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                      <th className="py-2.5">Number</th>
                      <th className="py-2.5">Date</th>
                      <th className="py-2.5">Status</th>
                      <th className="py-2.5 text-right">Amount</th>
                      <th className="py-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {clientInvoices.map((inv) => (<tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-3 font-semibold text-slate-900 dark:text-slate-100">{inv.invoiceNumber}</td>
                        <td className="py-3">{inv.createdDate}</td>
                        <td className="py-3">
                          <Badge status={inv.status}>{inv.status}</Badge>
                        </td>
                        <td className="py-3 text-right font-semibold font-outfit">
                          {formatCurrency((inv.subTotal - inv.discount) + inv.taxAmount)}
                        </td>
                        <td className="py-3 text-right">
                          <Link to={`/invoices/preview/${inv.id}`} className="text-xs text-primary hover:underline font-bold">
                            View Invoice
                          </Link>
                        </td>
                      </tr>))}
                    {clientInvoices.length === 0 && (<tr>
                        <td colSpan={5} className="py-6 text-center text-slate-400 dark:text-slate-500">
                          No invoices generated for this client.
                        </td>
                      </tr>)}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quotations History Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
              <h3 className="text-sm font-bold font-outfit mb-4 flex items-center gap-1.5">
                <FileSignature className="h-4.5 w-4.5 text-accent"/> Quotations Ledger ({clientQuotes.length})
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                      <th className="py-2.5">Number</th>
                      <th className="py-2.5">Date</th>
                      <th className="py-2.5">Status</th>
                      <th className="py-2.5 text-right">Amount</th>
                      <th className="py-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {clientQuotes.map((q) => (<tr key={q.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-3 font-semibold text-slate-900 dark:text-slate-100">{q.quoteNumber}</td>
                        <td className="py-3">{q.createdDate}</td>
                        <td className="py-3">
                          <Badge status={q.status}>{q.status}</Badge>
                        </td>
                        <td className="py-3 text-right font-semibold font-outfit">
                          {formatCurrency((q.subTotal - q.discount) + q.taxAmount)}
                        </td>
                        <td className="py-3 text-right">
                          <Link to={`/quotes/preview/${q.id}`} className="text-xs text-primary hover:underline font-bold">
                            View Quote
                          </Link>
                        </td>
                      </tr>))}
                    {clientQuotes.length === 0 && (<tr>
                        <td colSpan={5} className="py-6 text-center text-slate-400 dark:text-slate-500">
                          No quotations issued to this client.
                        </td>
                      </tr>)}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Edit Drawer/Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Modify Client Business Profile" size="md">
        <ClientForm client={client} onClose={() => setIsEditOpen(false)}/>
      </Modal>
    </div>);
};
