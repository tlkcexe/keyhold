import { Link } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import { KeycardPanel } from '../components/marketing/KeycardPanel';
import { Reveal } from '../components/ui/Reveal';
import {
  IconRotate,
  IconLock,
  IconShield,
  IconGauge,
  IconCookie,
  IconBook,
} from '../components/ui/icons';

const FEATURES = [
  {
    icon: IconRotate,
    title: 'Rotating refresh tokens',
    body: 'Every refresh issues a new token and revokes the old one. A replayed token is treated as theft and kills the whole session family.',
  },
  {
    icon: IconLock,
    title: 'Argon2id hashing',
    body: 'Passwords are hashed with the OWASP-recommended algorithm — tuned for memory cost, not just speed.',
  },
  {
    icon: IconShield,
    title: 'Role-based access',
    body: 'USER and ADMIN roles are enforced on both the API and the routes — try visiting /admin as a regular user.',
  },
  {
    icon: IconGauge,
    title: 'Rate limiting & lockouts',
    body: 'Login and password endpoints are throttled, and accounts lock out temporarily after repeated failed attempts.',
  },
  {
    icon: IconCookie,
    title: 'HttpOnly cookies',
    body: 'The access token lives in memory, never localStorage. The refresh token sits in an HttpOnly cookie no script can read.',
  },
  {
    icon: IconBook,
    title: 'Documented API',
    body: 'Every endpoint is described in an OpenAPI spec, served live through Swagger UI at /api/docs.',
  },
];

const LIFECYCLE = [
  {
    step: 'issue',
    title: 'You log in',
    body: 'The API verifies your credentials and hands back a short-lived access token plus a refresh token in an HttpOnly cookie.',
  },
  {
    step: 'verify',
    title: 'Requests get checked',
    body: 'Every protected request is verified statelessly against the access token — no database round trip required.',
  },
  {
    step: 'rotate',
    title: 'The session renews itself',
    body: 'When the access token expires, the client silently trades the refresh token for a new pair. You never notice.',
  },
];

export default function Landing() {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      {/* ---------- Hero ---------- */}
      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:py-24 lg:grid-cols-2 lg:items-center lg:py-28">
        <div className="animate-fade-up">
          <p className="eyebrow">$ auth-system --status</p>
          <h1 className="mt-4 font-mono text-4xl font-bold leading-[1.1] tracking-tight text-ink-950 dark:text-white sm:text-5xl">
            Auth, done
            <br />
            properly.
          </h1>
          <p className="mt-5 max-w-md text-base text-ink-500 dark:text-ink-400">
            A full-stack reference implementation of session-based auth: rotating refresh tokens,
            role-based access, rate limiting, and cookies that don't leak. Clone it, read it, run
            it.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to={isAuthenticated ? '/dashboard' : '/register'}
              className="btn-primary w-auto px-6"
            >
              {isAuthenticated ? 'Go to dashboard' : 'Create an account'}
            </Link>
            {!isAuthenticated && (
              <Link to="/login" className="btn-secondary">
                Log in
              </Link>
            )}
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <KeycardPanel />
        </div>
      </section>

      {/* ---------- Features ---------- */}
      <section className="border-t border-ink-100 dark:border-ink-800">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <Reveal>
            <p className="eyebrow">$ ls features/</p>
            <h2 className="mt-3 max-w-lg text-2xl font-semibold tracking-tight text-ink-950 dark:text-white sm:text-3xl">
              Not a login form. A security posture.
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, body }, i) => (
              <Reveal key={title} delay={i * 0.06}>
                <div className="card group h-full p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-300 dark:hover:border-brand-500/50 hover:shadow-lg hover:shadow-brand-400/5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-400/10 dark:text-brand-400">
                    <Icon />
                  </div>
                  <h3 className="mt-4 text-sm font-semibold text-ink-900 dark:text-ink-50">
                    {title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-500 dark:text-ink-400">
                    {body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Lifecycle ---------- */}
      <section className="border-t border-ink-100 dark:border-ink-800 bg-ink-50/60 dark:bg-ink-900/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <Reveal>
            <p className="eyebrow">$ trace session.lifecycle</p>
            <h2 className="mt-3 max-w-lg text-2xl font-semibold tracking-tight text-ink-950 dark:text-white sm:text-3xl">
              How a session stays safe
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {LIFECYCLE.map((item, i) => (
              <Reveal key={item.step} delay={i * 0.08}>
                <div className="relative pl-5">
                  <span className="absolute left-0 top-1 h-full border-l-2 border-brand-300/50 dark:border-brand-500/30" />
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">
                    {item.step}
                  </p>
                  <h3 className="mt-2 text-base font-semibold text-ink-900 dark:text-ink-50">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-500 dark:text-ink-400">
                    {item.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="border-t border-ink-100 dark:border-ink-800">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-10 text-center">
          <p className="font-mono text-xs text-ink-400 dark:text-ink-500">
            built to be read, not just run — MIT licensed
          </p>
        </div>
      </footer>
    </div>
  );
}
