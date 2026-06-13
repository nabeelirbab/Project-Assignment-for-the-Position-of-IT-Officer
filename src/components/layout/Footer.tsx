import Link from 'next/link';
import { AnimateIn } from '@/components/ui/AnimateIn';

export function Footer() {
  return (
    <AnimateIn>
      <footer className="mt-16 border-t border-emerald-100 bg-white/70 backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
        <div className="mx-auto max-w-6xl px-4 py-8 text-center text-sm text-muted">
          <Link
            href="/"
            className="inline-block font-medium text-emerald-800 transition hover:text-emerald-950 dark:text-teal-200 dark:hover:text-teal-100"
          >
            TaxWise AI
          </Link>
          <p className="mt-2">
            General product guidance only. Not tax, legal, or financial advice.
          </p>
          <p className="mt-1">Please consult a qualified tax professional for tax advice.</p>
        </div>
      </footer>
    </AnimateIn>
  );
}
