import { FormEvent, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { resetPasswordRequest } from '../auth.service';
import { FormField } from '../../../components/ui/FormField';
import { Alert } from '../../../components/ui/Alert';
import { getErrorMessage } from '../../../utils/getErrorMessage';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await resetPasswordRequest(token, password);
      navigate('/login', { replace: true, state: { resetSuccess: true } });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="flex min-h-[calc(100vh-57px)] items-center justify-center px-4">
        <div className="card w-full max-w-sm p-8 text-center animate-fade-up">
          <Alert variant="error" message="Missing or invalid reset link." />
          <Link to="/forgot-password" className="mt-4 inline-block text-sm text-brand-600 hover:underline">
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-57px)] items-center justify-center px-4">
      <div className="card w-full max-w-sm p-8 animate-fade-up">
        <h1 className="text-xl font-semibold">Set a new password</h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && <Alert variant="error" message={error} />}

          <FormField
            id="password"
            label="New password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? 'Resetting…' : 'Reset password'}
          </button>
        </form>
      </div>
    </div>
  );
}
