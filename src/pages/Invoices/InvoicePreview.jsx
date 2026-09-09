import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/ui/Toast';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Printer, Mail, Edit, DollarSign, ChevronLeft, Send } from 'lucide-react';
export const InvoicePreview = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { invoices, clients, settings, addPayment, sendMockEmail, isAuthenticated } = useApp();
    const { showToast } = useToast();
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [emailModalOpen, setEmailModalOpen] = useState(false);
    // Payment states
    const [payAmount, setPayAmount] = useState(0);
    const [payMethod, setPayMethod] = useState('Generic');
    const [payId, setPayId] = useState('');
    const [payMemo, setPayMemo] = useState('');
    // Email template state
    const [emailSubject, setEmailSubject] = useState('');
    const [emailBody, setEmailBody] = useState('');
    const [recipientEmail, setRecipientEmail] = useState('');
    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('print') === 'true') {
            const timer = setTimeout(() => {
                window.print();
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, []);
    const inv = invoices.find((i) => i.id === id);
    if (!inv) {
        return (<div className="py-16 text-center">
        <h2 className="text-xl font-bold">Invoice Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">The requested invoice could not be located.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/invoices')}>
          Back to Directory
        </Button>
      </div>);
    }
    const client = clients.find((c) => c.id === inv.clientId);
    const sym = settings.payment.currencySymbol;
    // Format amount
    const formatCurrency = (val) => {
        return `${sym}${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };
    // Open payment recorder
    const handleOpenPayment = () => {
        setPayAmount(inv.totalDue);
        setPaymentModalOpen(true);
    };
    const handleSavePayment = (e) => {
        e.preventDefault();
        if (payAmount <= 0) {
            showToast('error', 'Invalid Amount', 'Payment must be greater than zero.');
            return;
        }
        addPayment(inv.id, {
            date: new Date().toISOString().split('T')[0],
            amount: payAmount,
            paymentMethod: payMethod,
            paymentId: payId || `PAY-${Date.now().toString().slice(-6)}`,
            status: 'Completed',
            memo: payMemo
        });
        showToast('success', 'Payment Recorded', `Amount of ${sym}${payAmount} logged successfully.`);
        setPaymentModalOpen(false);
    };
    // Open Email notification dialog
    const handleOpenEmail = () => {
        if (!client) {
            showToast('error', 'No Client', 'This invoice has no valid client account linked.');
            return;
        }
        const template = settings.emailSettings.templates.find((t) => t.type === 'invoice_notification');
        const clientFirstName = client.businessName.split(' ')[0];
        const invoiceLink = `${window.location.origin}/invoices/preview/${inv.id}`;
        let subject = template ? template.subject : 'New Invoice %number% issued';
        let content = template
            ? template.content
            : `Hi %client_first_name%,\n\nYou have a new invoice available (%number%) which can be viewed at %link%.\n\nOutstanding: %total_due%.\n\nThanks!`;
        // Replace wildcards
        subject = subject.replace(/%number%/g, inv.invoiceNumber);
        content = content
            .replace(/%client_first_name%/g, clientFirstName)
            .replace(/%number%/g, inv.invoiceNumber)
            .replace(/%link%/g, invoiceLink)
            .replace(/%due_date%/g, inv.dueDate)
            .replace(/%total_due%/g, formatCurrency(inv.totalDue))
            .replace(/%total%/g, formatCurrency((inv.subTotal - inv.discount) + inv.taxAmount));
        setEmailSubject(subject);
        setEmailBody(content);
        setRecipientEmail(client.email || '');
        setEmailModalOpen(true);
    };
    const handleSendEmail = () => {
        if (!recipientEmail) {
            showToast('error', 'Recipient Required', 'Please enter a recipient email address.');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(recipientEmail)) {
            showToast('error', 'Invalid Email', 'Please enter a valid email address.');
            return;
        }
        // Log in system outbox
        sendMockEmail(recipientEmail, emailSubject, emailBody, 'View Invoice Online', `/invoices/preview/${inv.id}`);
        // Open default mail client (mailto: redirection)
        const mailtoUrl = `mailto:${encodeURIComponent(recipientEmail)}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        window.location.href = mailtoUrl;
        showToast('success', 'Email Notice Initiated', `Opening mail client to send notice to ${recipientEmail}`);
        setEmailModalOpen(false);
    };
    const handlePrint = () => {
        window.print();
    };
    return (<div className="space-y-6">
      {/* Breadcrumb Header */}
      {isAuthenticated && (<div className="no-print flex items-center gap-2 text-xs text-slate-500">
          <Link to="/invoices" className="hover:text-primary transition-colors flex items-center gap-1 font-semibold">
            <ChevronLeft className="h-3.5 w-3.5"/> Back to Invoices
          </Link>
        </div>)}

      {/* Main Grid split screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Actions pane */}
        {isAuthenticated ? (<div className="no-print lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-5">
              <div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Status Details</span>
                <div className="flex items-center gap-2 mt-1.5">
                  <Badge status={inv.status}>{inv.status}</Badge>
                  <span className="text-xs text-slate-500">Invoice: {inv.invoiceNumber}</span>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-2.5">
                <Button onClick={handlePrint} variant="outline" className="w-full justify-center" leftIcon={<Printer className="h-4 w-4"/>}>
                  Print / Download PDF
                </Button>
                <Button onClick={handleOpenEmail} variant="outline" className="w-full justify-center text-primary hover:text-blue-700" leftIcon={<Mail className="h-4 w-4"/>}>
                  Send Email Notice
                </Button>
                {inv.status !== 'Paid' && inv.status !== 'Cancelled' && (<Button onClick={handleOpenPayment} variant="primary" className="w-full justify-center" leftIcon={<DollarSign className="h-4 w-4"/>}>
                    Record Payment
                  </Button>)}
                {inv.status === 'Draft' && (<Button onClick={() => navigate(`/invoices/edit/${inv.id}`)} variant="secondary" className="w-full justify-center" leftIcon={<Edit className="h-4 w-4"/>}>
                    Edit Invoice Builder
                  </Button>)}
              </div>
            </div>

            {/* Payments summary list inside dashboard layout */}
            {inv.payments.length > 0 && (<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3.5">
                <h3 className="text-xs font-bold font-outfit border-b border-slate-100 dark:border-slate-800 pb-2">Completed Payments</h3>
                <div className="space-y-2.5">
                  {inv.payments.map((p) => (<div key={p.id} className="flex items-center justify-between text-xs p-2.5 rounded bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200">{formatCurrency(p.amount)}</p>
                        <p className="text-[10px] text-slate-400 truncate max-w-[150px]">{p.paymentMethod}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold">{p.date}</span>
                    </div>))}
                </div>
              </div>)}
          </div>) : (<div className="no-print lg:col-span-12 flex justify-end max-w-3xl mx-auto w-full mb-2">
            <Button onClick={handlePrint} variant="primary" leftIcon={<Printer className="h-4 w-4"/>}>
              Print / Download PDF
            </Button>
          </div>)}

        {/* Right Side: Pixel Perfect Invoice Preview */}
        <div className={isAuthenticated ? "lg:col-span-8 w-full" : "lg:col-span-12 w-full"}>
          
          <div className={`relative bg-white text-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl p-8 md:p-12 shadow-md max-w-3xl mx-auto print-container print-only overflow-hidden ${settings.invoice.templateId === 'modern' ? 'border-t-8 border-t-emerald-500' : ''}`}>
            
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
              ${settings.invoice.customCSS || ''}
            ` }}/>

            {/* Watermark Diagonal "Paid" */}
            {inv.status === 'Paid' && (<div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-10">
                <div className="text-[150px] font-black text-rose-500/10 dark:text-rose-500/15 tracking-widest uppercase border-[16px] border-rose-500/10 dark:border-rose-500/15 px-10 py-2 rounded-3xl transform -rotate-30 leading-none">
                  Paid
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
                      {settings.business.name && (<span className="font-extrabold text-base text-slate-800">{settings.business.name}</span>)}
                    </div>)}
                </div>
                {settings.business.letterheadShowAddress !== false && settings.business.address && (<div className="px-8 md:px-12 py-1.5 bg-slate-100 border-t border-slate-200">
                    <p className="text-[10px] text-slate-500 whitespace-pre-line leading-relaxed">{settings.business.address}</p>
                  </div>)}
              </div>)}

            {/* Top Logo and Header */}
            <div className={`flex flex-col sm:flex-row justify-between items-start gap-6 border-b pb-6 ${settings.invoice.templateId === 'modern' ? 'border-emerald-100' : 'border-slate-100'}`}>
              <div className="space-y-3">
                {/* Business Logo / Initials */}
                <div className="flex items-center gap-3">
                  {settings.business.logoUrl ? (<img src={settings.business.logoUrl} alt={settings.business.name} className="h-12 max-w-[160px] object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }}/>) : (<div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-extrabold text-xl shadow-sm ${settings.invoice.templateId === 'modern'
                ? 'bg-gradient-to-tr from-emerald-500 to-teal-600'
                : settings.invoice.templateId === 'classic'
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
                <div className={`inline-block px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded ${settings.invoice.templateId === 'modern'
            ? 'bg-emerald-500 text-white'
            : settings.invoice.templateId === 'classic'
                ? 'bg-white border border-slate-950 text-slate-950 font-serif'
                : 'bg-slate-900 text-white dark:bg-slate-800'}`}>
                  {settings.translate.invoiceLabel}
                </div>
                <div className="text-xs text-slate-500 pt-2 space-y-1">
                  <p>Invoice Number: <span className="font-bold text-slate-900">{inv.invoiceNumber}</span></p>
                  {inv.quotationNumber && <p>Quotation Number: <span className="font-medium text-slate-900">{inv.quotationNumber}</span></p>}
                  <p>Invoice Date: <span className="font-medium text-slate-900">{inv.createdDate}</span></p>
                  <p>Due Date: <span className="font-medium text-slate-900">{inv.dueDate}</span></p>
                </div>
              </div>
            </div>

            {/* Billing Addresses Grid */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-8 py-8 border-b ${settings.invoice.templateId === 'modern' ? 'border-emerald-100' : 'border-slate-100'}`}>
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

            {/* Line Items Table */}
            <div className="py-8">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className={`border-b pb-3 uppercase tracking-wider text-[9px] font-bold ${settings.invoice.templateId === 'modern'
            ? 'border-emerald-200 text-emerald-600'
            : settings.invoice.templateId === 'classic'
                ? 'border-b-2 border-slate-950 text-slate-800 font-serif'
                : 'border-slate-200 text-slate-400'}`}>
                    <th className="pb-3 text-left w-16">{settings.translate.qtyLabel}</th>
                    <th className="pb-3 text-left">{settings.translate.serviceLabel}</th>
                    <th className="pb-3 text-right w-28">{settings.translate.rateLabel}</th>
                    <th className="pb-3 text-right w-28">Sub Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inv.items.map((item) => (<tr key={item.id} className="align-top">
                      <td className="py-3.5 text-slate-700 font-bold">{item.qty}</td>
                      <td className="py-3.5 space-y-1">
                        <p className="font-bold text-slate-900 flex items-center gap-2">
                          {item.title}
                          {item.hsnCode && <span className="text-[10px] font-normal text-slate-400 font-sans">(HSN: {item.hsnCode})</span>}
                        </p>
                        {item.description && (<p className="text-[10px] text-slate-400 font-sans leading-relaxed">{item.description}</p>)}
                      </td>
                      <td className="py-3.5 text-right font-medium text-slate-700">{formatCurrency(item.rate)}</td>
                      <td className="py-3.5 text-right font-bold text-slate-900">{formatCurrency(item.qty * item.rate)}</td>
                    </tr>))}
                </tbody>
              </table>
            </div>

            {/* Breakdown Totals and Payment gateway box */}
            <div className={`grid grid-cols-1 sm:grid-cols-12 gap-6 pt-6 border-t ${settings.invoice.templateId === 'modern' ? 'border-emerald-100' : 'border-slate-100'}`}>
              
              {/* Payment details options */}
              <div className="sm:col-span-7 bg-slate-50 p-4.5 rounded-xl border border-slate-200/60 text-[10px] leading-relaxed text-slate-600 space-y-2">
                <p className="font-extrabold text-slate-800 uppercase tracking-wider text-[9px] mb-1">Payment Instructions:</p>
                <div dangerouslySetInnerHTML={{ __html: settings.payment.genericPaymentLink ? `<a href="${settings.payment.genericPaymentLink}" target="_blank" class="text-primary hover:underline font-bold">1. Click here for Online Payment through Razorpay</a>` : '1. Pay via UPI' }}/>
                <p className="font-medium text-slate-700">Option 2: Direct to Bank Account Details:</p>
                <pre className="font-mono text-[9px] bg-white p-2 rounded border border-slate-200 whitespace-pre-wrap leading-tight text-slate-500">
                  {settings.payment.bankDetails}
                </pre>
              </div>

              {/* Math totals columns */}
              <div className="sm:col-span-5 text-xs text-slate-600 space-y-2">
                <div className="flex justify-between">
                  <span>Sub Total:</span>
                  <span className="font-bold text-slate-900">{formatCurrency(inv.subTotal)}</span>
                </div>
                {inv.discount > 0 && (<div className="flex justify-between text-rose-600 font-semibold">
                    <span>Discount:</span>
                    <span>-{formatCurrency(inv.discount)}</span>
                  </div>)}
                <div className="flex justify-between">
                  <span>GST ({inv.taxRate}%):</span>
                  <span className="font-bold text-slate-900">{formatCurrency(inv.taxAmount)}</span>
                </div>
                <div className="flex justify-between text-rose-500 font-semibold border-b border-slate-100 pb-1.5">
                  <span>Paid:</span>
                  <span>-{formatCurrency(inv.paidAmount)}</span>
                </div>
                <div className={`flex justify-between text-sm font-black pt-1 ${settings.invoice.templateId === 'modern'
            ? 'border-t border-emerald-500'
            : settings.invoice.templateId === 'classic'
                ? 'border-t border-slate-950'
                : 'border-t-2 border-double border-slate-200'}`}>
                  <span>Total Due:</span>
                  <span className={`text-base font-black ${settings.invoice.templateId === 'modern'
            ? 'text-emerald-600 font-outfit'
            : settings.invoice.templateId === 'classic'
                ? 'text-slate-950 font-serif font-bold'
                : 'text-primary font-outfit'}`}>{formatCurrency(inv.totalDue)}</span>
                </div>
              </div>

            </div>

            {/* Terms and conditions */}
            {inv.terms && (<div className="mt-8 pt-6 border-t border-slate-100 text-[10px] text-slate-400 leading-relaxed">
                <p className="font-extrabold uppercase text-[8px] tracking-wider text-slate-500 mb-1">Terms & Conditions:</p>
                <div className="whitespace-pre-line" dangerouslySetInnerHTML={{ __html: inv.terms }}/>
              </div>)}

            {/* Footer */}
            {inv.footer && (<div className="mt-12 text-center text-[10px] text-slate-400 font-semibold">
                {inv.footer}
              </div>)}

          </div>

        </div>

      </div>

      {/* Record Payment Modal */}
      <Modal isOpen={paymentModalOpen} onClose={() => setPaymentModalOpen(false)} title="Record Incoming Payment" size="md">
        <form onSubmit={handleSavePayment} className="space-y-4">
          <Input label="Payment Date" type="date" defaultValue={new Date().toISOString().split('T')[0]} disabled/>
          <Input label={`Payment Amount (${sym})`} type="number" step="0.01" value={payAmount} onChange={(e) => setPayAmount(Math.max(0, parseFloat(e.target.value) || 0))}/>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-700">Payment Gateway</label>
            <select value={payMethod} onChange={(e) => setPayMethod(e.target.value)} className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-hidden">
              <option value="Generic">UPI / Razorpay Link</option>
              <option value="Direct To Organization Current A/C">Bank Account Transfer</option>
              <option value="Razorpay">Razorpay Card/Netbanking</option>
            </select>
          </div>
          <Input label="Reference ID (e.g. Bank UTIN)" value={payId} onChange={(e) => setPayId(e.target.value)} placeholder="e.g. HDFCR592038190"/>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">Audit Memo Notes</label>
            <textarea value={payMemo} onChange={(e) => setPayMemo(e.target.value)} className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-hidden" placeholder="e.g. Part payment settled online." rows={2}/>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t">
            <Button variant="outline" type="button" onClick={() => setPaymentModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Log Payment Receipt
            </Button>
          </div>
        </form>
      </Modal>

      {/* Email Notification Dispatcher Drawer (Modal Modal) */}
      <Modal isOpen={emailModalOpen} onClose={() => setEmailModalOpen(false)} title="Render Email Notice Template" size="lg">
        <div className="space-y-4">
          <div className="bg-slate-50 dark:bg-slate-900 border p-3 rounded-lg text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            <p className="text-[10px] text-slate-400">This email notification will trigger a simulated delivery logged inside your SMTP Outbox Tray (top right Bell icon).</p>
          </div>
          
          <Input label="Recipient Email Address" type="email" value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} placeholder="e.g. client@example.com"/>
          
          <Input label="Email Subject Line" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)}/>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email HTML Content Body</label>
            <textarea value={emailBody} onChange={(e) => setEmailBody(e.target.value)} className="block w-full font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm focus:border-primary focus:outline-hidden" rows={8}/>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" type="button" onClick={() => setEmailModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSendEmail} rightIcon={<Send className="h-4 w-4"/>}>
              Dispatch Simulated Email
            </Button>
          </div>
        </div>
      </Modal>
    </div>);
};
