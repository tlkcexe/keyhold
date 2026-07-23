import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-57px)] flex-col items-center justify-center px-4 text-center animate-fade-up">
      <p className="eyebrow">$ curl {typeof window !== 'undefined' ? window.location.pathname : '/unknown'}</p>
      <h1 className="mt-4 font-mono text-5xl font-bold text-ink-950 dark:text-white">404</h1>
      <p className="mt-2 text-ink-500 dark:text-ink-400">
        That route isn&apos;t on the map. Check the URL, or head back.
      </p>
      <Link to="/" className="btn-secondary mt-6 w-auto px-5">
        Back to safety
      </Link>
    </div>
  );
}
