import React from 'react';

const Badge = ({ variant = 'default', children, className = '' }) => {
  const styles = {
    // Appointment / Statuses
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
    Confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Completed: 'bg-blue-50 text-blue-700 border-blue-200',
    Cancelled: 'bg-rose-50 text-rose-700 border-rose-200',

    // Payment statuses
    Paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Partially Paid': 'bg-indigo-50 text-indigo-700 border-indigo-200',

    // User Roles
    admin: 'bg-purple-50 text-purple-700 border-purple-200',
    doctor: 'bg-brand-sky/10 text-brand-blue border-teal-200',
    staff: 'bg-blue-50 text-blue-700 border-blue-200',
    patient: 'bg-emerald-50 text-emerald-700 border-emerald-200',

    // Fallbacks
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    info: 'bg-sky-50 text-sky-700 border-sky-200',
    default: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const badgeClass = styles[variant] || styles.default;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeClass} ${className}`}
    >
      <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-current opacity-70"></span>
      {children}
    </span>
  );
};

export default Badge;

