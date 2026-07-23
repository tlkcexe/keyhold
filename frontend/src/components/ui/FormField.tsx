import { InputHTMLAttributes, forwardRef } from 'react';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, id, ...rest }, ref) => (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-300">
        {label}
      </label>
      <input ref={ref} id={id} className="input-field" {...rest} />
      {error && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  ),
);

FormField.displayName = 'FormField';
