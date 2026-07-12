import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isDashboardPage = location.pathname.startsWith('/dashboard') || 
                          location.pathname.startsWith('/missions') || 
                          location.pathname.startsWith('/codelab') || 
                          location.pathname.startsWith('/avatar') ||
                          location.pathname.startsWith('/parent-dashboard');

  // The home page has its own nav and footer from the Landing components
  if (isHomePage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Header />
      <div className={isDashboardPage ? 'flex' : ''}>
        {isDashboardPage && <Sidebar />}
        <main className={isDashboardPage ? 'flex-1 ml-0 lg:ml-64' : 'w-full'}>
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;