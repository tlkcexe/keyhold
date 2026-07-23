import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { changePasswordRequest } from '../../auth/auth.service';
import { FormField } from '../../../components/ui/FormField';
import { Alert } from '../../../components/ui/Alert';
import { getErrorMessage } from '../../../utils/getErrorMessage';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsSubmitting(true);
    try {
      const msg = await changePasswordRequest(currentPassword, newPassword);
      setMessage(msg);
      setCurrentPassword('');
      setNewPassword('');
      // Server revoked the session — send the user back to log in.
      setTimeout(async () => {
        await logout();
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 animate-fade-up">
      <p className="eyebrow">$ whoami</p>
      <h1 className="mt-2 text-2xl font-semibold text-ink-950 dark:text-white">Dashboard</h1>
      <p className="mt-1 text-ink-500 dark:text-ink-400">
        Welcome back, {user?.name.split(' ')[0]}.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <section className="card p-6 transition-shadow hover:shadow-md">
          <h2 className="text-sm font-medium text-ink-500 dark:text-ink-400">
            Account details
          </h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-500 dark:text-ink-400">Name</dt>
              <dd className="font-medium">{user?.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-500 dark:text-ink-400">Email</dt>
              <dd className="font-medium">{user?.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-500 dark:text-ink-400">Role</dt>
              <dd>
                <span className="badge bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300">
                  {user?.role}
                </span>
              </dd>
            </div>
          </dl>
        </section>

        <section className="card p-6 transition-shadow hover:shadow-md">
          <h2 className="text-sm font-medium text-ink-500 dark:text-ink-400">
            Change password
          </h2>
          <form onSubmit={handleChangePassword} className="mt-4 space-y-3">
            {error && <Alert variant="error" message={error} />}
            {message && <Alert variant="success" message={message} />}
            <FormField
              id="currentPassword"
              label="Current password"
              type="password"
              autoComplete="current-password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <FormField
              id="newPassword"
              label="New password"
              type="password"
              autoComplete="new-password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button type="submit" disabled={isSubmitting} className="btn-primary">
              {isSubmitting ? 'Updating…' : 'Update password'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
