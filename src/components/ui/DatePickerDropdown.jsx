import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays, X } from 'lucide-react';
const MONTHS_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
// Fixed leap year so February always has 29 days available
const GRID_YEAR = 2024;
function daysInMonth(month) {
    return new Date(GRID_YEAR, month, 0).getDate(); // month is 1-based
}
function firstWeekday(month) {
    return new Date(GRID_YEAR, month - 1, 1).getDay(); // 0=Sun
}
function parseValue(value) {
    if (!value)
        return null;
    const parts = value.split('-');
    if (parts.length !== 2)
        return null;
    return { month: parseInt(parts[0], 10), day: parseInt(parts[1], 10) };
}
function formatDisplay(value) {
    const parsed = parseValue(value);
    if (!parsed)
        return '';
    return `${MONTHS_SHORT[parsed.month - 1]} ${parsed.day}`;
}
const DatePickerDropdown = ({ label, value, onChange, placeholder = 'Select date', helperText, }) => {
    const today = new Date();
    const parsed = parseValue(value);
    const [open, setOpen] = useState(false);
    const [viewMonth, setViewMonth] = useState(parsed?.month ?? today.getMonth() + 1);
    const ref = useRef(null);
    // Sync view month when value changes externally
    useEffect(() => {
        if (parsed)
            setViewMonth(parsed.month);
    }, [value]);
    // Close on outside click
    useEffect(() => {
        if (!open)
            return;
        const onDown = (e) => {
            if (ref.current && !ref.current.contains(e.target))
                setOpen(false);
        };
        document.addEventListener('mousedown', onDown);
        return () => document.removeEventListener('mousedown', onDown);
    }, [open]);
    const openCalendar = () => {
        setViewMonth(parsed?.month ?? today.getMonth() + 1);
        setOpen(true);
    };
    const prevMonth = () => setViewMonth(m => (m === 1 ? 12 : m - 1));
    const nextMonth = () => setViewMonth(m => (m === 12 ? 1 : m + 1));
    const handleDayClick = (day) => {
        const mm = String(viewMonth).padStart(2, '0');
        const dd = String(day).padStart(2, '0');
        onChange(`${mm}-${dd}`);
        setOpen(false);
    };
    const handleClear = (e) => {
        e.stopPropagation();
        onChange('');
    };
    // Build calendar grid
    const blanks = firstWeekday(viewMonth);
    const total = daysInMonth(viewMonth);
    const cells = [
        ...Array(blanks).fill(null),
        ...Array.from({ length: total }, (_, i) => i + 1),
    ];
    while (cells.length % 7 !== 0)
        cells.push(null);
    const hasValue = Boolean(value);
    const displayText = hasValue ? formatDisplay(value) : placeholder;
    return (<div ref={ref} className="relative w-full">
      {/* Label */}
      {label && (<label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          {label}
        </label>)}

      {/* ── Trigger button ─────────────────────────────── */}
      <button type="button" id={`datepicker-trigger-${Math.random().toString(36).slice(2, 7)}`} onClick={openCalendar} className={`
          group w-full flex items-center justify-between gap-2 px-3.5 py-2.5
          rounded-xl border text-sm transition-all duration-200 cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-primary/30
          ${open
            ? 'border-primary ring-2 ring-primary/20 bg-white dark:bg-slate-900'
            : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-primary/60'}
        `}>
        {/* Left: icon + text */}
        <span className="flex items-center gap-2.5 min-w-0">
          <CalendarDays className={`h-4 w-4 flex-shrink-0 transition-colors ${hasValue ? 'text-primary' : 'text-slate-400'}`}/>
          <span className={`font-medium truncate ${hasValue ? 'text-slate-800 dark:text-slate-100' : 'text-slate-400 dark:text-slate-500 italic'}`}>
            {displayText}
          </span>
        </span>

        {/* Right: clear × or chevron */}
        <span className="flex items-center gap-1 flex-shrink-0">
          {hasValue && (<span role="button" tabIndex={0} onClick={handleClear} onKeyDown={e => e.key === 'Enter' && handleClear(e)} className="p-0.5 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer" title="Clear date">
              <X className="h-3 w-3"/>
            </span>)}
          <span className={`text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </span>
      </button>

      {/* Helper text */}
      {helperText && (<p className="mt-1.5 text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed">
          {helperText}
        </p>)}

      {/* ── Calendar dropdown ──────────────────────────── */}
      {open && (<div className="absolute z-[60] top-full mt-2 left-0 w-[300px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl shadow-slate-900/10 overflow-hidden">

          {/* Header — month navigation */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary to-blue-600 text-white">
            <button type="button" onClick={prevMonth} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors cursor-pointer">
              <ChevronLeft className="h-4 w-4"/>
            </button>

            <div className="text-center select-none">
              <p className="font-bold text-sm font-outfit leading-tight">{MONTHS_FULL[viewMonth - 1]}</p>
              <p className="text-[10px] text-blue-100 mt-0.5">Click a day to select</p>
            </div>

            <button type="button" onClick={nextMonth} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors cursor-pointer">
              <ChevronRight className="h-4 w-4"/>
            </button>
          </div>

          {/* Month quick-jump strip */}
          <div className="grid grid-cols-6 gap-1 px-3 pt-3 pb-2">
            {MONTHS_SHORT.map((m, idx) => (<button type="button" key={m} onClick={() => setViewMonth(idx + 1)} className={`
                  py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer
                  ${viewMonth === idx + 1
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-primary'}
                `}>
                {m}
              </button>))}
          </div>

          <div className="mx-3 border-t border-slate-100 dark:border-slate-800"/>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 px-3 pt-2">
            {WEEK_DAYS.map(d => (<div key={d} className="text-center text-[9px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-600 py-1">
                {d.slice(0, 2)}
              </div>))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-y-0.5 gap-x-0 px-3 pb-3">
            {cells.map((day, i) => {
                if (day === null)
                    return <div key={`e-${i}`}/>;
                const isSelected = parsed?.month === viewMonth && parsed?.day === day;
                return (<button key={day} type="button" onClick={() => handleDayClick(day)} className={`
                    h-8 w-full flex items-center justify-center rounded-lg
                    text-xs font-semibold transition-all duration-100 cursor-pointer
                    ${isSelected
                        ? 'bg-primary text-white shadow-md shadow-blue-500/30 scale-110'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-primary hover:scale-105'}
                  `}>
                  {day}
                </button>);
            })}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-100 dark:border-slate-800 px-4 py-2.5 flex items-center justify-between bg-slate-50/80 dark:bg-slate-950/40">
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {hasValue
                ? <>Selected: <span className="font-bold text-slate-800 dark:text-slate-200">{formatDisplay(value)}</span></>
                : <span className="italic text-slate-400">No date selected</span>}
            </p>
            <div className="flex items-center gap-3">
              {hasValue && (<button type="button" onClick={handleClear} className="text-[11px] text-red-500 font-semibold hover:underline cursor-pointer">
                  Clear
                </button>)}
              <button type="button" onClick={() => setOpen(false)} className="text-[11px] text-primary font-bold hover:underline cursor-pointer">
                Close
              </button>
            </div>
          </div>

        </div>)}
    </div>);
};
export { DatePickerDropdown };
