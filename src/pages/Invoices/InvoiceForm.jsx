import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { ClientForm } from '../Clients/ClientForm';
import { Plus, Trash2, ShieldCheck, ChevronLeft, Info } from 'lucide-react';
export const InvoiceForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { invoices, clients, addInvoice, updateInvoice, settings } = useApp();
    const { showToast } = useToast();
    const isEdit = !!id;
    const sym = settings.payment.currencySymbol;
    // Modals state
    const [isClientModalOpen, setIsClientModalOpen] = useState(false);
    // Parse predefined line items
    const parsedPredefinedItems = settings.general.predefinedLineItems
        .split('\n')
        .filter((line) => line.trim().length > 0)
        .map((line) => {
        const parts = line.split('|').map((p) => p.trim());
        return {
            qty: parseInt(parts[0], 10) || 1,
            title: parts[1] || '',
            rate: parseFloat(parts[2]) || 0,
            description: parts[3] || ''
        };
    });
    // Invoice main fields state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [clientId, setClientId] = useState('');
    const [status, setStatus] = useState('Draft');
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [orderNumber, setOrderNumber] = useState('');
    const [createdDate, setCreatedDate] = useState(new Date().toISOString().split('T')[0]);
    const [dueDate, setDueDate] = useState('');
    const [hsnCode, setHsnCode] = useState('');
    const [quotationNumber, setQuotationNumber] = useState('');
    // Line items state
    const [items, setItems] = useState([
        {
            id: `item_init_${Date.now()}`,
            qty: 1,
            title: '',
            adjustPercent: 0,
            rate: 0,
            amount: 0,
            description: '',
            taxable: true,
            hsnCode: ''
        }
    ]);
    // Discount & Tax rates state
    const [discount, setDiscount] = useState(0);
    const [taxRate, setTaxRate] = useState(settings.tax.taxPercentage);
    const [taxInclusive, setTaxInclusive] = useState(settings.tax.taxInclusive);
    // Payments list state
    const [payments, setPayments] = useState([]);
    // Load invoice if in edit mode
    useEffect(() => {
        if (isEdit) {
            const inv = invoices.find((i) => i.id === id);
            if (inv) {
                setTitle(inv.title);
                setClientId(inv.clientId);
                setStatus(inv.status);
                setInvoiceNumber(inv.invoiceNumber);
                setOrderNumber(inv.orderNumber);
                setCreatedDate(inv.createdDate);
                setDueDate(inv.dueDate);
                setItems(inv.items);
                setDiscount(inv.discount);
                setTaxRate(inv.taxRate);
                setPayments(inv.payments);
                setHsnCode(inv.hsnCode || '');
                setQuotationNumber(inv.quotationNumber || '');
            }
        }
        else {
            // Set default due date
            const d = new Date();
            d.setDate(d.getDate() + settings.invoice.defaultDueDays);
            setDueDate(d.toISOString().split('T')[0]);
            // Auto preview next invoice number
            setInvoiceNumber(`${settings.invoice.prefix}${settings.invoice.nextNumber}`);
        }
    }, [id, isEdit, invoices, settings]);
    // Adjust due date if created date shifts
    const handleCreatedDateChange = (val) => {
        setCreatedDate(val);
        const d = new Date(val);
        d.setDate(d.getDate() + settings.invoice.defaultDueDays);
        setDueDate(d.toISOString().split('T')[0]);
    };
    // Line items helper handlers
    const handleAddItem = () => {
        setItems((prev) => [
            ...prev,
            {
                id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
                qty: 1,
                title: '',
                adjustPercent: 0,
                rate: 0,
                amount: 0,
                description: '',
                taxable: true,
                hsnCode: ''
            }
        ]);
    };
    const handleRemoveItem = (itemId) => {
        if (items.length > 1) {
            setItems((prev) => prev.filter((i) => i.id !== itemId));
        }
        else {
            showToast('warning', 'Limit Reached', 'An invoice requires at least one line item.');
        }
    };
    const handleUpdateItemField = (itemId, field, value) => {
        setItems((prev) => prev.map((item) => {
            if (item.id === itemId) {
                const updated = { ...item, [field]: value };
                // Calculate item amount: qty * rate * (1 + adjust / 100)
                const qty = field === 'qty' ? Number(value) : updated.qty;
                const rate = field === 'rate' ? Number(value) : updated.rate;
                const adjust = field === 'adjustPercent' ? Number(value) : updated.adjustPercent;
                updated.amount = qty * rate * (1 + adjust / 100);
                return updated;
            }
            return item;
        }));
    };
    // Populate predefined line item values into a specific item
    const handleSelectPredefined = (itemId, indexStr) => {
        if (indexStr === '')
            return;
        const idx = parseInt(indexStr, 10);
        const selectedItem = parsedPredefinedItems[idx];
        if (selectedItem) {
            setItems((prev) => prev.map((item) => {
                if (item.id === itemId) {
                    return {
                        ...item,
                        qty: selectedItem.qty,
                        title: selectedItem.title,
                        rate: selectedItem.rate,
                        description: selectedItem.description,
                        amount: selectedItem.qty * selectedItem.rate
                    };
                }
                return item;
            }));
        }
    };
    // Payments handlers
    const handleAddPayment = () => {
        setPayments((prev) => [
            ...prev,
            {
                id: `pay_${Date.now()}`,
                date: new Date().toISOString().split('T')[0],
                amount: 0,
                paymentMethod: 'Generic',
                paymentId: '',
                status: 'Completed',
                memo: ''
            }
        ]);
    };
    const handleRemovePayment = (payId) => {
        setPayments((prev) => prev.filter((p) => p.id !== payId));
    };
    const handleUpdatePaymentField = (payId, field, value) => {
        setPayments((prev) => prev.map((p) => {
            if (p.id === payId) {
                return { ...p, [field]: value };
            }
            return p;
        }));
    };
    // Totals calculations logic
    let subTotal = 0;
    let taxableSubTotal = 0;
    items.forEach((item) => {
        const itemAmt = item.qty * item.rate * (1 + item.adjustPercent / 100);
        subTotal += itemAmt;
        if (item.taxable) {
            taxableSubTotal += itemAmt;
        }
    });
    const discountRatio = subTotal > 0 ? (subTotal - discount) / subTotal : 0;
    const taxableAfterDiscount = taxableSubTotal * discountRatio;
    // Tax Math
    const taxAmount = Math.max(0, taxableAfterDiscount * (taxRate / 100));
    const totalAmount = Math.max(0, (subTotal - discount) + taxAmount);
    const paidAmount = payments
        .filter((p) => p.status === 'Completed')
        .reduce((sum, p) => sum + Number(p.amount), 0);
    const totalDue = Math.max(0, totalAmount - paidAmount);
    // Form submit handler
    const handleSaveInvoice = (e) => {
        e.preventDefault();
        if (!clientId) {
            showToast('error', 'Validation Error', 'Please select a client profile.');
            return;
        }
        if (items.some((i) => !i.title || i.rate <= 0)) {
            showToast('error', 'Validation Error', 'Line items must have a title and rate greater than zero.');
            return;
        }
        const payload = {
            title: title || 'Service Ledger Bill',
            clientId,
            status,
            invoiceNumber: isEdit ? invoiceNumber : undefined,
            orderNumber: orderNumber || `ORD-${Date.now().toString().slice(-5)}`,
            createdDate,
            dueDate,
            items,
            payments,
            discount,
            taxRate,
            terms: settings.invoice.terms,
            footer: settings.invoice.footer,
            hsnCode,
            quotationNumber
        };
        setIsClientModalOpen(false);
        if (isEdit) {
            updateInvoice(id, payload);
            showToast('success', 'Invoice Saved', `Invoice ${invoiceNumber} updated successfully.`);
            navigate('/invoices');
        }
        else {
            const generated = addInvoice(payload);
            showToast('success', 'Invoice Created', `Invoice ${generated.invoiceNumber} recorded successfully.`);
            navigate('/invoices');
        }
    };
    return (<div className="space-y-6">
      {/* Breadcrumb Header */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/invoices" className="hover:text-primary transition-colors flex items-center gap-1 font-semibold">
          <ChevronLeft className="h-3.5 w-3.5"/> Back to Invoices
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-outfit tracking-tight">
            {isEdit ? `Edit Invoice (${invoiceNumber})` : 'Construct New Invoice'}
          </h1>
          <p className="text-sm text-slate-500">Fill in line items, adjustments, taxes, and set payment states.</p>
        </div>
      </div>

      <form onSubmit={handleSaveInvoice} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left main forms pane */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Description */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <Input label="Invoice Title / Subject" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Hosting Plan Renewal for 1 Year"/>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Description (Optional)</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm focus:border-primary focus:outline-hidden" placeholder="Enter scope of services, internal notes, project code details..." rows={3}/>
            </div>
          </div>

          {/* Line Items Manager */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-5">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold font-outfit">Line Items</h3>
              <Button type="button" size="sm" variant="outline" onClick={handleAddItem} leftIcon={<Plus className="h-3.5 w-3.5"/>}>
                Add Another Item
              </Button>
            </div>

            <div className="space-y-5">
              {items.map((item, index) => (<div key={item.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 relative space-y-3">
                  
                  {/* Remove Button */}
                  <button type="button" onClick={() => handleRemoveItem(item.id)} className="absolute top-3 right-3 p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-400 hover:text-danger transition-colors cursor-pointer">
                    <Trash2 className="h-4 w-4"/>
                  </button>

                  {/* Predefined Line Item Loader */}
                  <div className="flex items-center gap-3 pr-8">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase shrink-0">Predefined Template:</label>
                    <select onChange={(e) => handleSelectPredefined(item.id, e.target.value)} defaultValue="" className="block max-w-xs w-full rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-0.5 text-xs focus:border-primary focus:outline-hidden">
                      <option value="">-- Choose Item --</option>
                      {parsedPredefinedItems.map((pi, idx) => (<option key={idx} value={idx}>{pi.title} (₹{pi.rate})</option>))}
                    </select>
                  </div>

                  {/* Main Item Form Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
                    <div className="md:col-span-2">
                      <Input label="Qty" type="number" min="1" value={item.qty} onChange={(e) => handleUpdateItemField(item.id, 'qty', parseInt(e.target.value, 10) || 1)}/>
                    </div>
                    <div className="md:col-span-3">
                      <Input label="Item Title" value={item.title} onChange={(e) => handleUpdateItemField(item.id, 'title', e.target.value)} placeholder="e.g. .com Domain Registration"/>
                    </div>
                    <div className="md:col-span-2">
                      <Input label="HSN Code" value={item.hsnCode || ''} onChange={(e) => handleUpdateItemField(item.id, 'hsnCode', e.target.value)} placeholder="e.g. 9983"/>
                    </div>
                    <div className="md:col-span-2">
                      <Input label="Rate" type="number" value={item.rate || ''} onChange={(e) => handleUpdateItemField(item.id, 'rate', parseFloat(e.target.value) || 0)} placeholder="0.00"/>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">Amount</label>
                      <div className="h-9 flex items-center font-bold font-outfit text-slate-900 dark:text-slate-200 truncate">
                        {sym}{item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                    <div className="md:col-span-1 flex items-center justify-center">
                      <label className="flex flex-col items-center gap-1 cursor-pointer">
                        <span className="text-[10px] font-bold text-slate-400">Taxable</span>
                        <input type="checkbox" checked={item.taxable} onChange={(e) => handleUpdateItemField(item.id, 'taxable', e.target.checked)} className="rounded text-primary focus:ring-primary"/>
                      </label>
                    </div>
                  </div>

                  <Input label="Description" value={item.description} onChange={(e) => handleUpdateItemField(item.id, 'description', e.target.value)} placeholder="Brief description of the work carried out for this line item (optional)"/>
                </div>))}
            </div>

            {/* Calculations Breakdown */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-5 flex justify-end">
              <div className="w-80 space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Sub Total:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{sym}{subTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                
                <div className="flex justify-between items-center gap-2">
                  <span>Discount:</span>
                  <div className="flex items-center gap-1.5 w-24">
                    <input type="number" value={discount || ''} onChange={(e) => setDiscount(Math.max(0, parseFloat(e.target.value) || 0))} className="w-full text-right font-bold rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-0.5 focus:border-primary focus:outline-hidden" placeholder="0.00"/>
                  </div>
                </div>

                <div className="flex justify-between">
                  <span>GST ({taxRate}%):</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{sym}{taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>

                <div className="flex justify-between">
                  <span>Paid:</span>
                  <span className="font-bold text-rose-500">-{sym}{paidAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-2.5 flex justify-between text-sm font-extrabold text-slate-900 dark:text-white">
                  <span>Total Due:</span>
                  <span className="font-black font-outfit text-primary">{sym}{totalDue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Payments Tracker Section */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold font-outfit">Payments Received</h3>
              <Button type="button" size="sm" variant="outline" onClick={handleAddPayment} leftIcon={<Plus className="h-3.5 w-3.5"/>}>
                Add Payment
              </Button>
            </div>

            <div className="space-y-3.5">
              {payments.map((pay) => (<div key={pay.id} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                  <Input label="Date" type="date" value={pay.date} onChange={(e) => handleUpdatePaymentField(pay.id, 'date', e.target.value)}/>
                  <Input label="Amount (₹)" type="number" value={pay.amount || ''} onChange={(e) => handleUpdatePaymentField(pay.id, 'amount', parseFloat(e.target.value) || 0)}/>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Method</label>
                    <select value={pay.paymentMethod} onChange={(e) => handleUpdatePaymentField(pay.id, 'paymentMethod', e.target.value)} className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs focus:border-primary focus:outline-hidden">
                      <option value="Generic">UPI / Razorpay Link</option>
                      <option value="Direct To Organization Current A/C">Bank Account Transfer</option>
                      <option value="Razorpay">Razorpay Card/Netbanking</option>
                    </select>
                  </div>
                  <Input label="Transaction ID / Ref" value={pay.paymentId} onChange={(e) => handleUpdatePaymentField(pay.id, 'paymentId', e.target.value)} placeholder="e.g. TXN-123"/>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-col gap-1 w-full">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Status</label>
                      <select value={pay.status} onChange={(e) => handleUpdatePaymentField(pay.id, 'status', e.target.value)} className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs focus:border-primary focus:outline-hidden text-emerald-600 font-bold">
                        <option value="Completed">Completed</option>
                        <option value="Pending">Pending</option>
                        <option value="Failed">Failed</option>
                      </select>
                    </div>
                    <button type="button" onClick={() => handleRemovePayment(pay.id)} className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded-lg cursor-pointer">
                      <Trash2 className="h-4 w-4"/>
                    </button>
                  </div>
                </div>))}
              {payments.length === 0 && (<div className="text-center py-6 text-slate-400 text-xs flex items-center justify-center gap-1.5">
                  <Info className="h-4.5 w-4.5 text-slate-300"/> Outstanding amount: {sym}{totalDue.toFixed(2)} - Add a payment once settled.
                </div>)}
            </div>
          </div>

        </div>

        {/* Right Parameters panel sidebar */}
        <div className="space-y-6">
          
          {/* Actions & Core settings */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold font-outfit border-b border-slate-100 dark:border-slate-800 pb-2">Publish Settings</h3>
            
            <div className="space-y-3">
              <Button type="submit" className="w-full flex items-center justify-center gap-1.5" leftIcon={<ShieldCheck className="h-4 w-4"/>}>
                {isEdit ? 'Save Invoice Changes' : 'Publish & Save Invoice'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/invoices')} className="w-full">
                Discard Changes
              </Button>
            </div>
          </div>

          {/* Invoice Details parameters */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold font-outfit border-b border-slate-100 dark:border-slate-800 pb-2">Invoice Details</h3>
            
            {/* Client selector */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Client Profile *</label>
                <button type="button" onClick={() => setIsClientModalOpen(true)} className="text-xs text-primary hover:underline font-bold flex items-center gap-0.5 cursor-pointer">
                  <Plus className="h-3.5 w-3.5"/> Add New Client
                </button>
              </div>
              <select value={clientId} onChange={(e) => setClientId(e.target.value)} className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-primary focus:outline-hidden">
                <option value="">-- Choose Client Profile --</option>
                {clients.map((c) => (<option key={c.id} value={c.id}>
                    {c.businessName}
                  </option>))}
              </select>
            </div>

            {/* Status Selector */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-primary focus:outline-hidden">
                <option value="Draft">Draft</option>
                <option value="Published">Published (Issued)</option>
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Invoice Numbers */}
            <Input label="Invoice Number" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} placeholder="e.g. AKEYI-0126" disabled={isEdit} helperText={isEdit ? 'Invoice number cannot be renamed once created.' : 'Auto-increments according to settings.'}/>

            <Input label="Order Number" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} placeholder="e.g. ORD-2025-001"/>

            <Input label="Quotation Number" value={quotationNumber} onChange={(e) => setQuotationNumber(e.target.value)} placeholder="e.g. AKEYQ-52"/>

            <Input label="HSN Code" value={hsnCode} onChange={(e) => setHsnCode(e.target.value)} placeholder="e.g. 998311"/>



            {/* Dates */}
            <Input label="Created Date" type="date" value={createdDate} onChange={(e) => handleCreatedDateChange(e.target.value)}/>

            <Input label="Due Date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}/>
          </div>

          {/* Custom Tax overrides */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold font-outfit border-b border-slate-100 dark:border-slate-800 pb-2">Tax Settings</h3>
            
            <Input label="Tax Rate Percentage (%)" type="number" value={taxRate} onChange={(e) => setTaxRate(Math.max(0, parseFloat(e.target.value) || 0))}/>
          </div>

        </div>

      </form>

      {/* Quick Add Client Modal */}
      <Modal isOpen={isClientModalOpen} onClose={() => setIsClientModalOpen(false)} title="Add New Client" size="md">
        <ClientForm onClose={() => setIsClientModalOpen(false)}/>
      </Modal>
    </div>);
};
