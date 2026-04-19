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

// implement styling and layout for scroll-to-top — ref:feat/scroll-to-top#2 (1776634618232)
