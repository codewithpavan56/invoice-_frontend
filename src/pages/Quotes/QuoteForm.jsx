import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { ClientForm } from '../Clients/ClientForm';
import { Plus, Trash2, ShieldCheck, ChevronLeft } from 'lucide-react';
export const QuoteForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { quotations, clients, addQuotation, updateQuotation, settings } = useApp();
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
    // Quotation main fields state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [clientId, setClientId] = useState('');
    const [status, setStatus] = useState('Draft');
    const [quoteNumber, setQuoteNumber] = useState('');
    const [createdDate, setCreatedDate] = useState(new Date().toISOString().split('T')[0]);
    const [validUntilDate, setValidUntilDate] = useState('');
    const [allowComments, setAllowComments] = useState(true);
    // Line items state
    const [items, setItems] = useState([
        {
            id: `qitem_init_${Date.now()}`,
            qty: 1,
            title: '',
            rate: 0,
            amount: 0,
            description: '',
            taxable: true
        }
    ]);
    // Discount & Tax rates state
    const [discount, setDiscount] = useState(0);
    const [taxRate, setTaxRate] = useState(settings.tax.taxPercentage);
    // Load quote if in edit mode
    useEffect(() => {
        if (isEdit) {
            const q = quotations.find((quote) => quote.id === id);
            if (q) {
                setTitle(q.title);
                setClientId(q.clientId);
                setStatus(q.status);
                setQuoteNumber(q.quoteNumber);
                setCreatedDate(q.createdDate);
                setValidUntilDate(q.validUntilDate);
                setItems(q.items);
                setDiscount(q.discount);
                setTaxRate(q.taxRate);
                setAllowComments(q.allowComments);
            }
        }
        else {
            // Set default valid until date
            const d = new Date();
            d.setDate(d.getDate() + settings.quote.defaultValidityDays);
            setValidUntilDate(d.toISOString().split('T')[0]);
            // Auto preview next quote number
            setQuoteNumber(`${settings.quote.prefix}${settings.quote.nextNumber}`);
        }
    }, [id, isEdit, quotations, settings]);
    // Adjust validity date if created date shifts
    const handleCreatedDateChange = (val) => {
        setCreatedDate(val);
        const d = new Date(val);
        d.setDate(d.getDate() + settings.quote.defaultValidityDays);
        setValidUntilDate(d.toISOString().split('T')[0]);
    };
    // Line items helper handlers
    const handleAddItem = () => {
        setItems((prev) => [
            ...prev,
            {
                id: `qitem_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
                qty: 1,
                title: '',
                rate: 0,
                amount: 0,
                description: '',
                taxable: true
            }
        ]);
    };
    const handleRemoveItem = (itemId) => {
        if (items.length > 1) {
            setItems((prev) => prev.filter((i) => i.id !== itemId));
        }
        else {
            showToast('warning', 'Limit Reached', 'A quotation requires at least one line item.');
        }
    };
    const handleUpdateItemField = (itemId, field, value) => {
        setItems((prev) => prev.map((item) => {
            if (item.id === itemId) {
                const updated = { ...item, [field]: value };
                const qty = field === 'qty' ? Number(value) : updated.qty;
                const rate = field === 'rate' ? Number(value) : updated.rate;
                updated.amount = qty * rate;
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
    // Totals calculations logic
    let subTotal = 0;
    let taxableSubTotal = 0;
    items.forEach((item) => {
        const itemAmt = item.qty * item.rate;
        subTotal += itemAmt;
        if (item.taxable) {
            taxableSubTotal += itemAmt;
        }
    });
    const discountRatio = subTotal > 0 ? (subTotal - discount) / subTotal : 0;
    const taxableAfterDiscount = taxableSubTotal * discountRatio;
    const taxAmount = Math.max(0, taxableAfterDiscount * (taxRate / 100));
    const totalDue = Math.max(0, (subTotal - discount) + taxAmount);
    // Form submit handler
    const handleSaveQuote = (e) => {
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
            title: title || 'Proposal Quotation Bid',
            clientId,
            status,
            quoteNumber: isEdit ? quoteNumber : undefined,
            createdDate,
            validUntilDate,
            items,
            discount,
            taxRate,
            terms: settings.quote.terms,
            footer: settings.quote.footer,
            allowComments
        };
        if (isEdit) {
            updateQuotation(id, payload);
            showToast('success', 'Quotation Saved', `Quote ${quoteNumber} updated successfully.`);
            navigate('/quotes');
        }
        else {
            const generated = addQuotation(payload);
            showToast('success', 'Quotation Created', `Quote ${generated.quoteNumber} recorded successfully.`);
            navigate('/quotes');
        }
    };
    return (<div className="space-y-6">
      {/* Breadcrumb Header */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/quotes" className="hover:text-primary transition-colors flex items-center gap-1 font-semibold">
          <ChevronLeft className="h-3.5 w-3.5"/> Back to Quotations
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-outfit tracking-tight">
            {isEdit ? `Edit Quotation (${quoteNumber})` : 'Construct New Proposal'}
          </h1>
          <p className="text-sm text-slate-500">Fill in proposal itemizations, adjustments, tax configurations, and set validity.</p>
        </div>
      </div>

      <form onSubmit={handleSaveQuote} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left main forms pane */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Description */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <Input label="Quotation Subject / Bid Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Creative design charges for Meraki Brochure"/>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Description / Bid Scope</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm focus:border-primary focus:outline-hidden" placeholder="Detail proposal guidelines, terms of service, technical specs..." rows={3}/>
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
                    <div className="md:col-span-1">
                      <Input label="Qty" type="number" min="1" value={item.qty} onChange={(e) => handleUpdateItemField(item.id, 'qty', parseInt(e.target.value, 10) || 1)}/>
                    </div>

                    <div className="md:col-span-5">
                      <Input label="Item Title" value={item.title} onChange={(e) => handleUpdateItemField(item.id, 'title', e.target.value)} placeholder="e.g. .com Domain Registration"/>
                    </div>
                    <div className="md:col-span-2">
                      <Input label="Rate" type="number" value={item.rate || ''} onChange={(e) => handleUpdateItemField(item.id, 'rate', parseFloat(e.target.value) || 0)} placeholder="0.00"/>
                    </div>
                    <div className="md:col-span-1">
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

                <div className="border-t border-slate-100 dark:border-slate-800 pt-2.5 flex justify-between text-sm font-extrabold text-slate-900 dark:text-white">
                  <span>Total Due:</span>
                  <span className="font-black font-outfit text-primary">{sym}{totalDue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Discussion checkboxes Page 9 */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold font-outfit border-b border-slate-100 dark:border-slate-800 pb-2">Discussion Settings</h3>
            <div className="space-y-2 text-xs font-semibold">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={allowComments} onChange={(e) => setAllowComments(e.target.checked)} className="rounded text-primary focus:ring-primary"/>
                Allow Client Feedback Comments
              </label>
              <label className="flex items-center gap-2.5 text-slate-400 cursor-not-allowed">
                <input type="checkbox" disabled defaultChecked className="rounded text-slate-400 cursor-not-allowed"/>
                Allow trackbacks and pingbacks on quote dashboard
              </label>
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
                {isEdit ? 'Save Quotation Changes' : 'Publish & Save Quote'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/quotes')} className="w-full">
                Discard Changes
              </Button>
            </div>
          </div>

          {/* Quotation Details parameters */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold font-outfit border-b border-slate-100 dark:border-slate-800 pb-2">Proposal Details</h3>
            
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
                <option value="Sent">Sent (Published)</option>
                <option value="Accepted">Accepted</option>
                <option value="Declined">Declined</option>
                <option value="Expired">Expired</option>
              </select>
            </div>

            {/* Quotation Numbers */}
            <Input label="Quotation Number" value={quoteNumber} onChange={(e) => setQuoteNumber(e.target.value)} placeholder="e.g. AKEYQ-52" disabled={isEdit} helperText={isEdit ? 'Quote number cannot be renamed.' : 'Auto-increments according to settings.'}/>



            {/* Dates */}
            <Input label="Created Date" type="date" value={createdDate} onChange={(e) => handleCreatedDateChange(e.target.value)}/>

            <Input label="Valid Until" type="date" value={validUntilDate} onChange={(e) => setValidUntilDate(e.target.value)}/>
          </div>

          {/* Tax rates */}
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
