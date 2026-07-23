import { ReactNode } from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';

interface RevealProps {
  children: ReactNode;
  delay?: number; // seconds
  className?: string;
}

/** Fades + slides content up the first time it scrolls into view. */
export function Reveal({ children, delay = 0, className = '' }: RevealProps) {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <div ref={ref} className={`reveal ${className}`} style={{ animationDelay: `${delay}s` }}>
      {children}
    </div>
  );
}
