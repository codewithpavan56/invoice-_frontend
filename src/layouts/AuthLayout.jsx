import React from 'react';
import { ShieldCheck, Sparkles, Receipt, RefreshCcw } from 'lucide-react';
export const AuthLayout = ({ children }) => {
    return (<div className="min-h-screen flex bg-slate-950 text-slate-100 font-sans">
      {/* Left side: Premium Slide Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative items-center justify-center overflow-hidden border-r border-slate-800">
        
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"/>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/15 rounded-full blur-3xl"/>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20"/>

        <div className="relative max-w-lg px-8 text-center flex flex-col items-center">
          {/* Logo Brand Icon */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white shadow-xl shadow-blue-500/20 mb-8 animate-bounce duration-1000">
            <Receipt className="h-8 w-8"/>
          </div>

          <h2 className="text-3xl font-extrabold font-outfit tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400">
            Invoice Manager
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-md">
            Invoice & Quotation Ledger. Complete client database synchronization, auto-incrementing registers, and high-fidelity HTML printing.
          </p>

          {/* Core Feature Pillars */}
          <div className="grid grid-cols-2 gap-4 w-full text-left">
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 backdrop-blur-xs flex flex-col gap-2">
              <ShieldCheck className="h-5 w-5 text-accent"/>
              <span className="text-xs font-bold text-slate-200">Local Sandbox</span>
              <span className="text-[10px] text-slate-500">100% data client-persisted in localstorage.</span>
            </div>
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 backdrop-blur-xs flex flex-col gap-2">
              <Sparkles className="h-5 w-5 text-emerald-500"/>
              <span className="text-xs font-bold text-slate-200">Quote Conversions</span>
              <span className="text-[10px] text-slate-500">Auto-convert quotes to billable invoices instantly.</span>
            </div>
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 backdrop-blur-xs flex flex-col gap-2">
              <Receipt className="h-5 w-5 text-amber-500"/>
              <span className="text-xs font-bold text-slate-200">Tax Calculations</span>
              <span className="text-[10px] text-slate-500">Comprehensive adjustment and tax math engines.</span>
            </div>
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 backdrop-blur-xs flex flex-col gap-2">
              <RefreshCcw className="h-5 w-5 text-blue-500"/>
              <span className="text-xs font-bold text-slate-200">Audit Trails</span>
              <span className="text-[10px] text-slate-500">Chronological history log for all events.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Auth Form Pane */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-slate-950 relative">
        <div className="absolute top-10 right-10 flex items-center gap-1.5 text-xs text-slate-500">
          <span>Client System: Active</span>
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"/>
        </div>
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>);
};
