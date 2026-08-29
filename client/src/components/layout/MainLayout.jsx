import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../common/Sidebar';
import Header from '../common/Header';

/**
 * Main App Layout Container
 * Houses Sidebar, Top Header, and Main Content Body
 */
const MainLayout = ({ pageTitle = 'Store Rating Platform' }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="app-container">
      <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <div className="main-content">
        <Header title={pageTitle} onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <main className="content-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
