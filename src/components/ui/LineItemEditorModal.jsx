import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, GripVertical, PackagePlus } from 'lucide-react';
// ── Helpers ────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 9);
function blankItem() {
    return { id: uid(), qty: '1', title: '', rate: '0.00', description: '' };
}
/** Parse "Qty | Title | Price | Description" lines → LineItem[] */
function parse(raw) {
    const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
    if (!lines.length)
        return [blankItem()];
    return lines.map(line => {
        const parts = line.split('|').map(p => p.trim());
        return {
            id: uid(),
            qty: parts[0] ?? '1',
            title: parts[1] ?? '',
            rate: parts[2] ?? '0.00',
            description: parts[3] ?? '',
        };
    });
}
/** Serialise LineItem[] → pipe-separated textarea text */
function serialise(items) {
    return items
        .filter(it => it.title.trim()) // skip completely blank rows
        .map(it => `${it.qty} | ${it.title} | ${it.rate} | ${it.description}`)
        .join('\n');
}
// ── Component ──────────────────────────────────────────────
export const LineItemEditorModal = ({ isOpen, onClose, value, onSave, }) => {
    const [items, setItems] = useState([blankItem()]);
    // Re-parse whenever modal opens or value changes
    useEffect(() => {
        if (isOpen)
            setItems(parse(value));
    }, [isOpen, value]);
    // ESC key close
    useEffect(() => {
        if (!isOpen)
            return;
        const handler = (e) => { if (e.key === 'Escape')
            onClose(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [isOpen, onClose]);
    const updateItem = (id, field, val) => {
        setItems(prev => prev.map(it => it.id === id ? { ...it, [field]: val } : it));
    };
    const removeItem = (id) => {
        setItems(prev => prev.length === 1 ? [blankItem()] : prev.filter(it => it.id !== id));
    };
    const addItem = () => setItems(prev => [...prev, blankItem()]);
    const handleSave = () => {
        onSave(serialise(items));
        onClose();
    };
    return (<AnimatePresence>
      {isOpen && (<div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm cursor-pointer"/>

          {/* Modal panel */}
          <motion.div initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 16 }} transition={{ duration: 0.2, ease: 'easeOut' }} className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* ── Header ─────────────────────────────── */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-primary/5 to-blue-50/30 dark:from-primary/10 dark:to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <PackagePlus className="h-4.5 w-4.5 text-primary"/>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 font-outfit">
                    Pre-Defined Line Items
                  </h3>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                    Add items below — they will auto-fill when creating invoices &amp; quotes
                  </p>
                </div>
              </div>
              <button type="button" onClick={onClose} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-700 transition-colors cursor-pointer">
                <X className="h-5 w-5"/>
              </button>
            </div>

            {/* ── Column headers ──────────────────────── */}
            <div className="grid grid-cols-[28px_80px_1fr_110px] gap-3 px-6 pt-4 pb-2">
              <div />
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Qty</span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Item Title</span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Rate (₹)</span>
            </div>

            {/* ── Scrollable item list ─────────────────── */}
            <div className="overflow-y-auto flex-1 px-6 pb-4 space-y-3">
              <AnimatePresence initial={false}>
                {items.map((item, idx) => (<motion.div key={item.id} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }} transition={{ duration: 0.18 }} className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                    {/* Item header bar */}
                    <div className="flex items-center justify-between px-3.5 py-2 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600"/>
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                          Item {idx + 1}
                        </span>
                      </div>
                      <button type="button" onClick={() => removeItem(item.id)} className="w-5 h-5 flex items-center justify-center rounded-md bg-red-100 dark:bg-red-950/40 text-red-500 hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors cursor-pointer" title="Remove item">
                        <X className="h-3 w-3"/>
                      </button>
                    </div>

                    {/* Fields grid */}
                    <div className="p-3.5 space-y-3 bg-white dark:bg-slate-900">
                      {/* Row 1: Qty | Title | Rate */}
                      <div className="grid grid-cols-[80px_1fr_110px] gap-3">
                        {/* Qty */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Qty</label>
                          <input type="number" min="0" step="0.01" value={item.qty} onChange={e => updateItem(item.id, 'qty', e.target.value)} className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 text-sm font-mono text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"/>
                        </div>

                        {/* Item Title */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Item Title</label>
                          <input type="text" value={item.title} onChange={e => updateItem(item.id, 'title', e.target.value)} placeholder="e.g. Domain Registration" className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 text-sm text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"/>
                        </div>

                        {/* Rate */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Rate (₹)</label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-slate-400 text-sm pointer-events-none">₹</span>
                            <input type="number" min="0" step="0.01" value={item.rate} onChange={e => updateItem(item.id, 'rate', e.target.value)} className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-6 pr-2.5 py-1.5 text-sm font-mono text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"/>
                          </div>
                        </div>
                      </div>

                      {/* Row 2: Description */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Description <span className="normal-case font-normal text-slate-400">(optional)</span>
                        </label>
                        <textarea value={item.description} onChange={e => updateItem(item.id, 'description', e.target.value)} placeholder="Brief description of the work carried out for this line item (optional)" rows={2} className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all resize-none"/>
                      </div>
                    </div>
                  </motion.div>))}
              </AnimatePresence>

              {/* Add Item button */}
              <button type="button" onClick={addItem} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-400 dark:text-slate-500 hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary transition-all cursor-pointer group">
                <Plus className="h-3.5 w-3.5 transition-transform group-hover:scale-125"/>
                Add Another Item
              </button>
            </div>

            {/* ── Footer ──────────────────────────────── */}
            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 flex items-center justify-between gap-3">
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                <span className="font-bold text-slate-500 dark:text-slate-400">{items.filter(i => i.title.trim()).length}</span> item(s) defined · saved as <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-[10px]">Qty | Title | Rate | Description</code>
              </p>
              <div className="flex items-center gap-2.5">
                <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                  Cancel
                </button>
                <button type="button" onClick={handleSave} className="px-5 py-2 rounded-lg bg-primary text-white text-xs font-bold hover:bg-blue-700 active:scale-95 transition-all shadow-sm shadow-blue-500/20 cursor-pointer">
                  Save Items
                </button>
              </div>
            </div>
          </motion.div>
        </div>)}
    </AnimatePresence>);
};
