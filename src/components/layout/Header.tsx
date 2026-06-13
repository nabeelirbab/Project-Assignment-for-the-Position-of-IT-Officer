'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type MouseEvent } from 'react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const links = [
  { href: '/products', label: 'Products' },
  { href: '/compare', label: 'Compare' },
  { href: '/recommend', label: 'Recommend' },
  { href: '/assistant', label: 'Assistant' },
  { href: '/admin/products', label: 'Admin' },
];

function MenuIcon({ open }: { open: boolean }) {
  return (
    <span className="relative flex h-5 w-6 flex-col justify-between" aria-hidden="true">
      <span
        className={`block h-0.5 w-full rounded-full bg-emerald-900 transition-all duration-300 ease-out dark:bg-teal-200 ${
          open ? 'translate-y-[9px] rotate-45' : ''
        }`}
      />
      <span
        className={`block h-0.5 w-full rounded-full bg-emerald-900 transition-all duration-300 ease-out dark:bg-teal-200 ${
          open ? 'scale-x-0 opacity-0' : ''
        }`}
      />
      <span
        className={`block h-0.5 w-full rounded-full bg-emerald-900 transition-all duration-300 ease-out dark:bg-teal-200 ${
          open ? '-translate-y-[9px] -rotate-45' : ''
        }`}
      />
    </span>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const navLinkClass = (href: string) => {
    const active = pathname === href || (href !== '/' && pathname.startsWith(href));
    return active
      ? 'text-emerald-800 underline decoration-emerald-400 decoration-2 underline-offset-4 dark:text-teal-200 dark:decoration-teal-500'
      : 'text-slate-700 hover:text-emerald-800 dark:text-slate-300 dark:hover:text-teal-200';
  };

  function goHome(event: MouseEvent<HTMLAnchorElement>) {
    setMenuOpen(false);
    if (pathname === '/') {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  return (
    <header className="sticky top-0 z-30 border-b border-emerald-100 bg-white/85 shadow-sm shadow-emerald-900/5 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/85">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link
          href="/"
          aria-label="TaxWise AI — go to home page"
          onClick={goHome}
          className="group flex items-center gap-2.5 rounded-xl py-1 pr-2 transition hover:opacity-80"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 text-sm font-bold text-white shadow-sm shadow-emerald-900/20 transition-transform duration-200 group-hover:scale-105 group-active:scale-95 dark:bg-teal-200 dark:text-slate-900">
            TW
          </span>
          <span className="text-lg font-extrabold text-emerald-950 dark:text-teal-100">TaxWise AI</span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${navLinkClass(link.href)}`}
            >
              {link.label}
            </Link>
          ))}
          </nav>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 p-2.5 text-slate-800 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-emerald-900 md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <MenuIcon open={menuOpen} />
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 top-[65px] z-20 bg-emerald-950/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          menuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!menuOpen}
        onClick={() => setMenuOpen(false)}
      />

      <nav
        id="mobile-nav"
        className={`absolute left-0 right-0 top-full z-30 border-b border-emerald-100 bg-white/95 shadow-lg transition-all duration-300 ease-out dark:border-slate-800 dark:bg-slate-950/95 md:hidden ${
          menuOpen
            ? 'visible translate-y-0 opacity-100'
            : 'invisible -translate-y-2 opacity-0 pointer-events-none'
        }`}
        aria-hidden={!menuOpen}
      >
        <ul className="mx-auto max-w-6xl px-4 py-3">
          {links.map((link, index) => (
            <li
              key={link.href}
              className="animate-slide-in-right"
              style={{ animationDelay: menuOpen ? `${index * 50}ms` : '0ms' }}
            >
              <Link
                href={link.href}
                className={`block rounded-xl px-4 py-3 text-base font-medium transition-colors duration-200 ${navLinkClass(link.href)}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
