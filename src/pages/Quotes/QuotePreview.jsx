import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/ui/Toast';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Printer, Edit, Check, X, ChevronLeft, ArrowRight, Info, FileText } from 'lucide-react';
export const QuotePreview = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { quotations, clients, settings, acceptQuotation, declineQuotation, convertQuotationToInvoice, isAuthenticated } = useApp();
    const { showToast } = useToast();
    const [declineModalOpen, setDeclineModalOpen] = useState(false);
    const [declineReason, setDeclineReason] = useState('');
    const [successBannerOpen, setSuccessBannerOpen] = useState(false);
    const [declineBannerOpen, setDeclineBannerOpen] = useState(false);
    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('print') === 'true') {
            const timer = setTimeout(() => {
                window.print();
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, []);
    const q = quotations.find((quote) => quote.id === id);
    if (!q) {
        return (<div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Quotation Not Found</h3>
        <p className="text-xs text-slate-500 mt-1">The requested quotation proposal could not be located.</p>
        {isAuthenticated && (<Button variant="outline" className="mt-4" onClick={() => navigate('/quotes')}>
            Back to Catalog
          </Button>)}
      </div>);
    }
    const client = clients.find((c) => c.id === q.clientId);
    const sym = settings.payment.currencySymbol;
    // Format currency
    const formatCurrency = (val) => {
        return `${sym}${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };
    const handlePrint = () => {
        window.print();
    };
    const handleAccept = () => {
        acceptQuotation(q.id);
        showToast('success', 'Quotation Accepted', 'The proposal has been approved.');
        setSuccessBannerOpen(true);
    };
    const handleConvertToInvoice = () => {
        const invoice = convertQuotationToInvoice(q.id);
        if (invoice) {
            showToast('success', 'Converted to Invoice', `Invoice ${invoice.invoiceNumber} created successfully in Draft mode.`);
            navigate(`/invoices/preview/${invoice.id}`);
        }
        else {
            showToast('error', 'Conversion Failed', 'Could not convert this quotation to an invoice.');
        }
    };
    const handleDeclineClick = () => {
        if (settings.quote.declineReasonRequired) {
            setDeclineModalOpen(true);
        }
        else {
            declineQuotation(q.id, 'Decline clicked without reason');
            showToast('warning', 'Quotation Declined', 'Proposal rejected.');
            setDeclineBannerOpen(true);
        }
    };
    const handleDeclineSubmit = (e) => {
        e.preventDefault();
        if (!declineReason.trim()) {
            showToast('error', 'Reason Required', 'Please enter a decline reason.');
            return;
        }
        declineQuotation(q.id, declineReason);
        showToast('warning', 'Quotation Declined', 'Proposal declined.');
        setDeclineModalOpen(false);
        setDeclineBannerOpen(true);
    };
    // Determine if unauthenticated viewer should see the actions panel
    const showActionsPanel = isAuthenticated || (q.status === 'Sent' && settings.quote.acceptQuoteButton);
    return (<div className="space-y-6">
      {/* Breadcrumb Header */}
      {isAuthenticated && (<div className="no-print flex items-center gap-2 text-xs text-slate-500">
          <Link to="/quotes" className="hover:text-primary transition-colors flex items-center gap-1 font-semibold">
            <ChevronLeft className="h-3.5 w-3.5"/> Back to Quotations
          </Link>
        </div>)}

      {/* Accept / Decline Notification Banner */}
      {successBannerOpen && (<div className="no-print p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="h-4.5 w-4.5"/>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Quotation Acceptance Recorded!</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5" dangerouslySetInnerHTML={{ __html: settings.quote.acceptedMessage }}/>
            </div>
          </div>
          {isAuthenticated && (<Button variant="primary" size="sm" onClick={handleConvertToInvoice} rightIcon={<ArrowRight className="h-3.5 w-3.5"/>}>
              Convert to Invoice
            </Button>)}
        </div>)}

      {declineBannerOpen && (<div className="no-print p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 flex items-start gap-3 animate-in fade-in duration-200">
          <div className="w-8 h-8 rounded-lg bg-rose-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
            <X className="h-4.5 w-4.5"/>
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Quotation Declined</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5" dangerouslySetInnerHTML={{ __html: settings.quote.declinedMessage }}/>
          </div>
        </div>)}

      {/* Split Screen layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left pane: Actions panel */}
        {showActionsPanel ? (<div className="no-print lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-5">
              <div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Status Details</span>
                <div className="flex items-center gap-2 mt-1.5">
                  <Badge status={q.status}>{q.status}</Badge>
                  <span className="text-xs text-slate-500">Proposal: {q.quoteNumber}</span>
                </div>
              </div>

              {q.status === 'Sent' && settings.quote.acceptQuoteButton && (<div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-[10px] leading-relaxed text-slate-500 space-y-2">
                  <p className="font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <Info className="h-4 w-4 text-primary shrink-0"/> Important Client Notice:
                  </p>
                  <div dangerouslySetInnerHTML={{ __html: settings.quote.acceptQuoteText }}/>
                </div>)}

              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-2.5">
                <Button onClick={handlePrint} variant="outline" className="w-full justify-center" leftIcon={<Printer className="h-4 w-4"/>}>
                  Print Proposal Quote
                </Button>
                {q.status === 'Sent' && (<>
                    <Button onClick={handleAccept} variant="success" className="w-full justify-center" leftIcon={<Check className="h-4 w-4"/>}>
                      Accept Quote
                    </Button>
                    <Button onClick={handleDeclineClick} variant="danger" className="w-full justify-center" leftIcon={<X className="h-4 w-4"/>}>
                      Decline Quotation
                    </Button>
                  </>)}
                {q.status === 'Accepted' && isAuthenticated && (<Button onClick={handleConvertToInvoice} variant="primary" className="w-full justify-center" leftIcon={<FileText className="h-4 w-4"/>}>
                    Convert to Invoice
                  </Button>)}
                {q.status === 'Draft' && isAuthenticated && (<Button onClick={() => navigate(`/quotes/edit/${q.id}`)} variant="secondary" className="w-full justify-center" leftIcon={<Edit className="h-4 w-4"/>}>
                    Edit Quote Builder
                  </Button>)}
              </div>
            </div>

            {q.reasonForDecline && (<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-2.5">
                <h3 className="text-xs font-bold font-outfit text-rose-500">Decline Feedback</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 bg-rose-50/50 dark:bg-rose-950/10 p-3 rounded-lg border border-rose-100 dark:border-rose-900/30 italic">
                  "{q.reasonForDecline}"
                </p>
              </div>)}
          </div>) : (<div className="no-print lg:col-span-12 flex justify-end max-w-3xl mx-auto w-full mb-2">
            <Button onClick={handlePrint} variant="primary" leftIcon={<Printer className="h-4 w-4"/>}>
              Print Proposal Quote
            </Button>
          </div>)}

        {/* Right pane: Quote document preview */}
        <div className={showActionsPanel ? "lg:col-span-8 w-full" : "lg:col-span-12 w-full"}>
          
          <div className={`relative bg-white text-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl p-8 md:p-12 shadow-md max-w-3xl mx-auto print-container print-only overflow-hidden ${settings.quote.templateId === 'modern' ? 'border-t-8 border-t-emerald-500' : ''}`}>
            
            {/* Inject print preferences and custom CSS */}
            <style dangerouslySetInnerHTML={{ __html: `
              @media print {
                @page {
                  size: ${settings.pdf?.paperSize || 'A4'} ${settings.pdf?.orientation || 'portrait'};
                  margin: ${settings.pdf?.margins === 'compact' ? '10mm' : settings.pdf?.margins === 'wide' ? '30mm' : '20mm'};
                }
                body {
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                }
              }
              ${settings.quote.customCSS || ''}
            ` }}/>

            {/* watermark Accepted/Declined overlay */}
            {q.status === 'Accepted' && (<div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-10">
                <div className="text-[120px] font-black text-emerald-500/10 dark:text-emerald-500/15 tracking-widest uppercase border-[16px] border-emerald-500/10 dark:border-emerald-500/15 px-10 py-2 rounded-3xl transform -rotate-30 leading-none">
                  Accepted
                </div>
              </div>)}
            {q.status === 'Declined' && (<div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-10">
                <div className="text-[120px] font-black text-rose-500/10 dark:text-rose-500/15 tracking-widest uppercase border-[16px] border-rose-500/10 dark:border-rose-500/15 px-10 py-2 rounded-3xl transform -rotate-30 leading-none">
                  Declined
                </div>
              </div>)}

            {/* Letterhead Band */}
            {settings.business.letterheadEnabled && (<div className="-mx-8 md:-mx-12 -mt-8 md:-mt-12 mb-6">
                <div className={`w-full min-h-[80px] flex items-center px-8 md:px-12 py-3 bg-slate-50 ${settings.business.letterheadLogoPosition === 'center' ? 'justify-center' :
                settings.business.letterheadLogoPosition === 'right' ? 'justify-end' : 'justify-start'}`}>
                  {settings.business.letterheadUrl ? (<img src={settings.business.letterheadUrl} alt="Letterhead" className="max-h-16 max-w-full object-contain"/>) : settings.business.logoUrl ? (<img src={settings.business.logoUrl} alt={settings.business.name} className="max-h-14 max-w-[220px] object-contain"/>) : (<div className={`flex items-center gap-3 ${settings.business.letterheadLogoPosition === 'center' ? 'flex-col' : ''}`}>
                      <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                        {(settings.business.name || 'IN').slice(0, 2).toUpperCase()}
                      </div>
                      {settings.business.name && <span className="font-extrabold text-base text-slate-800">{settings.business.name}</span>}
                    </div>)}
                </div>
                {settings.business.letterheadShowAddress !== false && settings.business.address && (<div className="px-8 md:px-12 py-1.5 bg-slate-100 border-t border-slate-200">
                    <p className="text-[10px] text-slate-500 whitespace-pre-line leading-relaxed">{settings.business.address}</p>
                  </div>)}
              </div>)}

            {/* Top Logo and Header */}
            <div className={`flex flex-col sm:flex-row justify-between items-start gap-6 border-b pb-6 ${settings.quote.templateId === 'modern' ? 'border-emerald-100' : 'border-slate-100'}`}>
              <div className="space-y-3">
                {/* Business Logo / Initials */}
                <div className="flex items-center gap-3">
                  {settings.business.logoUrl ? (<img src={settings.business.logoUrl} alt={settings.business.name} className="h-12 max-w-[160px] object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }}/>) : (<div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-extrabold text-xl shadow-sm ${settings.quote.templateId === 'modern'
                ? 'bg-gradient-to-tr from-emerald-500 to-teal-600'
                : settings.quote.templateId === 'classic'
                    ? 'bg-slate-800'
                    : 'bg-gradient-to-tr from-secondary to-slate-700'}`}>
                      {(settings.business.name || 'IN').slice(0, 2).toUpperCase()}
                    </div>)}
                  {!settings.business.logoUrl && settings.business.name && (<div className="text-left leading-none">
                      <span className="font-extrabold text-base tracking-tight font-outfit text-slate-900 block">{settings.business.name}</span>
                      {settings.business.website && (<span className="text-[9px] uppercase tracking-wider font-bold text-slate-400">{settings.business.website}</span>)}
                    </div>)}
                </div>
                {settings.business.website && !settings.business.logoUrl && settings.business.name && (<span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block mt-1">{settings.business.website}</span>)}
              </div>

              <div className="text-right space-y-1">
                <div className={`inline-block px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded ${settings.quote.templateId === 'modern'
            ? 'bg-emerald-500 text-white'
            : settings.quote.templateId === 'classic'
                ? 'bg-white border border-slate-950 text-slate-950 font-serif'
                : 'bg-teal-600 text-white'}`}>
                  {settings.translate.quoteLabel}
                </div>
                <div className="text-xs text-slate-500 pt-2 space-y-1">
                  <p>Quote Number: <span className="font-bold text-slate-900">{q.quoteNumber}</span></p>

                  <p>Quote Date: <span className="font-medium text-slate-900">{q.createdDate}</span></p>
                  <p>Valid Until: <span className="font-medium text-slate-900">{q.validUntilDate}</span></p>
                </div>
              </div>
            </div>

            {/* Addresses Grid */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-8 py-8 border-b ${settings.quote.templateId === 'modern' ? 'border-emerald-100' : 'border-slate-100'}`}>
              <div className="space-y-1.5 text-xs">
                <h4 className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">From:</h4>
                <p className="font-bold text-slate-900">{settings.business.name}</p>
                <p className="text-slate-500 leading-relaxed whitespace-pre-line">{settings.business.address}</p>
                {settings.business.extraInfo && (<div className="text-[10px] text-slate-500 pt-1" dangerouslySetInnerHTML={{ __html: settings.business.extraInfo }}/>)}
              </div>

              <div className="space-y-1.5 text-xs sm:text-right">
                <h4 className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">To:</h4>
                {client ? (<>
                    <p className="font-bold text-slate-900">{client.businessName}</p>
                    <p className="text-slate-500 leading-relaxed whitespace-pre-line sm:text-right">{client.address}</p>
                    <p className="text-slate-400 pt-1">{client.email}</p>
                    {client.gstNo && (<p className="text-[10px] text-slate-500 pt-0.5 font-mono">GST NO: {client.gstNo}</p>)}
                  </>) : (<p className="text-slate-400 italic">No Client Selected</p>)}
              </div>
            </div>

            {/* Items Table */}
            <div className="py-8">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className={`border-b pb-3 uppercase tracking-wider text-[9px] font-bold ${settings.quote.templateId === 'modern'
            ? 'border-emerald-200 text-emerald-600'
            : settings.quote.templateId === 'classic'
                ? 'border-b-2 border-slate-950 text-slate-800 font-serif'
                : 'border-slate-200 text-slate-400'}`}>
                    <th className="pb-3 text-left w-12">Qty</th>
                    <th className="pb-3 text-left">Item Details</th>

                    <th className="pb-3 text-right w-24">Rate</th>
                    <th className="pb-3 text-right w-24">Sub Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {q.items.map((item) => (<tr key={item.id} className="align-top">
                      <td className="py-3.5 text-slate-700 font-bold">{item.qty}</td>
                      <td className="py-3.5 space-y-1">
                        <p className="font-bold text-slate-900">{item.title}</p>
                        {item.description && (<p className="text-[10px] text-slate-400 font-sans leading-relaxed">{item.description}</p>)}
                      </td>

                      <td className="py-3.5 text-right font-medium text-slate-700">{formatCurrency(item.rate)}</td>
                      <td className="py-3.5 text-right font-bold text-slate-900 font-outfit">
                        {formatCurrency(item.qty * item.rate)}
                      </td>
                    </tr>))}
                </tbody>
              </table>
            </div>

            {/* Totals Grid */}
            <div className={`flex justify-end pt-6 border-t ${settings.quote.templateId === 'modern' ? 'border-emerald-100' : 'border-slate-100'}`}>
              <div className="w-80 text-xs text-slate-600 space-y-2">
                <div className="flex justify-between">
                  <span>Sub Total:</span>
                  <span className="font-bold text-slate-900">{formatCurrency(q.subTotal)}</span>
                </div>
                {q.discount > 0 && (<div className="flex justify-between text-rose-600 font-semibold">
                    <span>Discount:</span>
                    <span>-{formatCurrency(q.discount)}</span>
                  </div>)}
                <div className="flex justify-between">
                  <span>GST ({q.taxRate}%):</span>
                  <span className="font-bold text-slate-900">{formatCurrency(q.taxAmount)}</span>
                </div>
                <div className={`flex justify-between text-sm font-black pt-1 ${settings.quote.templateId === 'modern'
            ? 'border-t border-emerald-500'
            : settings.quote.templateId === 'classic'
                ? 'border-t border-slate-950'
                : 'border-t-2 border-double border-slate-200'}`}>
                  <span>Total Due:</span>
                  <span className={`text-base font-black ${settings.quote.templateId === 'modern'
            ? 'text-emerald-600 font-outfit'
            : settings.quote.templateId === 'classic'
                ? 'text-slate-950 font-serif font-bold'
                : 'text-primary font-outfit'}`}>{formatCurrency(q.totalDue)}</span>
                </div>
              </div>
            </div>

            {/* Terms and conditions */}
            {q.terms && (<div className="mt-8 pt-6 border-t border-slate-100 text-[10px] text-slate-400 leading-relaxed">
                <p className="font-extrabold uppercase text-[8px] tracking-wider text-slate-500 mb-1">Proposal Guidelines & Terms:</p>
                <div className="whitespace-pre-line">{q.terms}</div>
              </div>)}

            {/* Footer */}
            {q.footer && (<div className="mt-12 text-center text-[10px] text-slate-400 font-semibold">
                {q.footer}
              </div>)}

          </div>

        </div>

      </div>

      {/* Decline Reason Modal */}
      <Modal isOpen={declineModalOpen} onClose={() => setDeclineModalOpen(false)} title="Reason for Decline" size="md">
        <form onSubmit={handleDeclineSubmit} className="space-y-4">
          <p className="text-xs text-slate-500">
            Please provide a brief reason for declining this proposal. Feedback helps us align future estimates.
          </p>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">Decline Details *</label>
            <textarea required value={declineReason} onChange={(e) => setDeclineReason(e.target.value)} className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-hidden" placeholder="e.g. Budget constraints / technical scope adjustments required." rows={4}/>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t">
            <Button variant="outline" type="button" onClick={() => setDeclineModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" type="submit">
              Submit Decline Log
            </Button>
          </div>
        </form>
      </Modal>
    </div>);
};
