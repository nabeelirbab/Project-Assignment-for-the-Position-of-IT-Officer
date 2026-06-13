import type { Metadata } from 'next';
import './globals.css';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { PageTransition } from '@/components/ui/PageTransition';
import { ThemeProvider } from '@/components/ui/ThemeProvider';

export const metadata: Metadata = {
  title: 'TaxWise AI | Tax Software Product Recommender',
  description:
    'AI-assisted tax software product recommendation website for a fictional tax software company.',
};

const themeScript = `(function(){try{var t=localStorage.getItem('taxwise-theme');var d=t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ThemeProvider>
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          <Header />
          <main id="main-content" className="mx-auto min-h-screen max-w-6xl px-4 py-8">
            <div className="tax-surface p-4 md:p-6">
            <PageTransition>{children}</PageTransition>
            </div>
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
