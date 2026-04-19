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

// add responsive design adjustments for mobile-drawer-nav — ref:feat/mobile-drawer-nav#7 (1776634646435)
