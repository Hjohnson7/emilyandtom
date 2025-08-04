// ScrollToTop.tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop({ children }) {
  const { pathname } = useLocation();

  useEffect(() => {
    // instantly jump to top on route change
    window.scrollTo(0, 0);
  }, [pathname]);

  return <>{children}</>;
}