import React from 'react';
export const Button = ({ children, variant = 'primary', size = 'md', isLoading = false, leftIcon, rightIcon, className = '', disabled, ...props }) => {
    const baseStyle = "relative inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:pointer-events-none cursor-pointer";
    const variants = {
        primary: "bg-primary text-white hover:bg-blue-700 shadow-md hover:shadow-lg focus:ring-blue-500",
        secondary: "bg-secondary text-white hover:bg-slate-800 shadow-sm focus:ring-slate-500 dark:bg-slate-800 dark:hover:bg-slate-700",
        accent: "bg-accent text-white hover:bg-teal-600 shadow-md focus:ring-teal-500",
        danger: "bg-danger text-white hover:bg-red-600 shadow-md focus:ring-red-500",
        success: "bg-success text-white hover:bg-green-600 shadow-md focus:ring-green-500",
        outline: "border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:bg-slate-900 dark:hover:bg-slate-800",
        ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100"
    };
    const sizes = {
        sm: "px-3 py-1.5 text-xs font-semibold gap-1.5",
        md: "px-4.5 py-2 text-sm font-medium gap-2",
        lg: "px-6 py-3 text-base font-medium gap-2.5"
    };
    return (<button className={`${baseStyle} ${variants[variant]} ${sizes[size]} active:scale-98 hover:scale-102 duration-150 ${className}`} disabled={disabled || isLoading} {...props}>
      {isLoading && (<svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
        </svg>)}
      {!isLoading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>);
};
