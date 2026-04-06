import { clsx } from 'clsx';

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}

export function FormField({ label, error, required, children, hint }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export const inputCls = clsx(
  'w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900',
  'placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-transparent',
  'disabled:bg-slate-50 disabled:text-slate-400',
);

export const selectCls = clsx(inputCls, 'bg-white cursor-pointer');
