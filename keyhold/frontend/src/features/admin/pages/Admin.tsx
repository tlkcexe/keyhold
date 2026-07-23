import { useEffect, useState } from 'react';
import { User } from '../../auth/auth.types';
import { fetchAllUsers } from '../../auth/auth.service';
import { Spinner } from '../../../components/ui/Spinner';
import { Alert } from '../../../components/ui/Alert';
import { getErrorMessage } from '../../../utils/getErrorMessage';

export default function Admin() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllUsers()
      .then(setUsers)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 animate-fade-up">
      <p className="eyebrow">$ select * from users</p>
      <h1 className="mt-2 text-2xl font-semibold text-ink-950 dark:text-white">Admin panel</h1>
      <p className="mt-1 text-ink-500 dark:text-ink-400">
        This route and its API endpoint are restricted to the ADMIN role.
      </p>

      <div className="mt-8 card overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        ) : error ? (
          <div className="p-6">
            <Alert variant="error" message={error} />
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ink-200 dark:border-ink-800 text-ink-500 dark:text-ink-400">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-ink-100 dark:border-ink-800/60 last:border-0 transition-colors hover:bg-ink-50/60 dark:hover:bg-ink-800/30"
                >
                  <td className="px-4 py-3">{u.name}</td>
                  <td className="px-4 py-3 text-ink-500 dark:text-ink-400">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className="badge bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300">
                      {u.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
