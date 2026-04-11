import { ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { InstitutionalNav } from './InstitutionalNav';
import { InstitutionalFooter } from './InstitutionalFooter';

interface PageLayoutProps {
  children: ReactNode;
  showFooter?: boolean;
  showNav?: boolean;
  /** Override background. Defaults to #10131a (Lumina Quant nocturnal) */
  bg?: string;
}

export function PageLayout({
  children,
  showFooter = true,
  showNav = true,
  bg = '#10131a',
}: PageLayoutProps) {
  const { pathname } = useLocation();

  // Scroll to top on navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <div
      className="min-h-[100dvh] flex flex-col overflow-x-hidden"
      style={{ backgroundColor: bg }}
    >
      {showNav && <InstitutionalNav />}
      <main
        id="main-content"
        className={`flex-1 w-full ${showNav ? 'pt-20' : ''}`}
        tabIndex={-1}
      >
        {children}
      </main>
      {showFooter && <InstitutionalFooter />}
    </div>
  );
}
