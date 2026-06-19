import React from 'react';
import Header from './Header';
import Footer from './Footer';
import SkipLink from './SkipLink';
import './Layout.css';

function Layout({ children }) {
  return (
    <div className="layout">
      <SkipLink />
      <Header />
      <main id="main-content" className="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
