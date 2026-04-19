import React from 'react';
import Header from './Header';
import Footer from './Footer';
import './Layout.css';

function Layout({ children }) {
  return (
    <div className="layout">
      <Header />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default Layout;

// add responsive design adjustments for toast-stacking — ref:fix/toast-stacking#7 (1776635100300)
