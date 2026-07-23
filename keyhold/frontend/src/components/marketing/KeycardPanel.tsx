const LIFECYCLE_STEPS = [
  { label: 'issued', detail: 'access token · 15m ttl' },
  { label: 'verified', detail: 'signature checked, stateless' },
  { label: 'rotated', detail: 'refresh token replaced' },
];

/**
 * The project's signature visual: an animated session "keycard" that
 * dramatizes the access/refresh token lifecycle this project implements.
 * Pure CSS/SVG — no external assets.
 */
export function KeycardPanel() {
  return (
    <div className="relative w-full max-w-sm select-none">
      {/* ambient glow behind the card */}
      <div
        aria-hidden
        className="absolute -inset-6 -z-10 rounded-[2rem] bg-brand-400/20 blur-3xl dark:bg-brand-400/10"
      />

      <div className="relative overflow-hidden rounded-2xl border border-ink-800 bg-ink-900 p-5 shadow-2xl shadow-black/30 animate-scale-in">
        {/* scanning sweep */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-1/3 animate-scan bg-gradient-to-b from-brand-400/0 via-brand-400/10 to-brand-400/0"
        />

        {/* header row: chip + LED */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="grid h-8 w-10 grid-cols-3 gap-[2px] rounded-md bg-gradient-to-br from-brand-300 to-brand-500 p-1">
              {Array.from({ length: 9 }).map((_, i) => (
                <span key={i} className="rounded-[1px] bg-ink-900/40" />
              ))}
            </div>
            <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-400">
              session
              <br />
              keycard
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-success-400 animate-led-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-success-400">
              live
            </span>
          </div>
        </div>

        {/* user line */}
        <div className="mt-6 font-mono text-sm text-ink-100">ada@keyhold.dev</div>
        <div className="mt-1 font-mono text-[11px] tracking-widest text-ink-500">
          •••• •••• •••• 4f21
        </div>

        {/* lifecycle ticker */}
        <div className="mt-5 space-y-2 border-t border-ink-800 pt-4">
          {LIFECYCLE_STEPS.map((step, i) => (
            <div
              key={step.label}
              className="flex items-baseline justify-between animate-cycle-highlight"
              style={{ animationDelay: `${i * 2}s` }}
            >
              <span className="font-mono text-xs uppercase tracking-wide text-brand-400">
                {step.label}
              </span>
              <span className="font-mono text-[11px] text-ink-500">{step.detail}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
