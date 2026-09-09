import React, { forwardRef, useId } from 'react';
export const Input = forwardRef(({ label, error, helperText, leftIcon, rightIcon, className = '', id, type = 'text', ...props }, ref) => {
    const defaultId = useId();
    const inputId = id || defaultId;
    return (<div className="w-full flex flex-col gap-1.5">
      {label && (<label htmlFor={inputId} className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </label>)}
      
      <div className="relative rounded-lg shadow-xs">
        {leftIcon && (<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            {leftIcon}
          </div>)}
        
        <input ref={ref} id={inputId} type={type} className={`
            block w-full rounded-lg border text-sm transition-all focus:outline-hidden
            bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100
            ${leftIcon ? 'pl-9' : 'pl-3.5'}
            ${rightIcon ? 'pr-9' : 'pr-3.5'}
            py-2
            ${error
            ? 'border-danger focus:border-danger focus:ring-1 focus:ring-danger'
            : 'border-slate-300 dark:border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary'}
            ${className}
          `} {...props}/>

        {rightIcon && (<div className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 dark:text-slate-500">
            {rightIcon}
          </div>)}
      </div>

      {error ? (<span className="text-xs font-medium text-danger">{error}</span>) : helperText ? (<span className="text-xs text-slate-500 dark:text-slate-400">{helperText}</span>) : null}
    </div>);
});
Input.displayName = 'Input';
