interface AlertProps {
  variant: 'error' | 'success';
  message: string;
}

export function Alert({ variant, message }: AlertProps) {
  const styles =
    variant === 'error'
      ? 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-900'
      : 'bg-success-50 dark:bg-success-500/10 text-success-600 dark:text-success-400 border-success-500/20';

  return (
    <div role="alert" className={`animate-fade-up rounded-lg border px-3.5 py-2.5 text-sm ${styles}`}>
      {message}
    </div>
  );
}
