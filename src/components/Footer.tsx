import { logEvent } from 'firebase/analytics';
import React from 'react';
import { analytics } from '../firebase';





export function   Footer() {


  return (
    <footer className="mt-4 py-4 border-t shadow-inner font-Exo">

      <div className="flex items-center justify-center mt-5 space-x-6">
        <Link to="/privacy">Privacy</Link>
        <span>&bull;</span>
        <Link to="/terms">Terms</Link>
        <span>&bull;</span>
        <Link to="/faq">FAQs</Link>
      </div>
      <div className="flex items-center justify-center mt-5 space-x-6 text-gray-600 text-xs font-Exo">Copyright © 2023 AIAssist - All rights reserved.</div>
    </footer>
  );
}

function Heading({ children }: { children: string }) {
  return <h3 className="text-sm font-semibold  tracking-wider uppercase mb-4">{children}</h3>;
}

function Link({ to, children }: { to: string; children: string }) {
  return (
    <a href={to}  rel="noreferrer" className="text-gray-500 hover:text-gray-900">
      {children}
    </a>
  );
}

function LinkNewWindow({ to, children }: { to: string; children: string }) {
  logEvent(analytics, 'external', {
    content_type: to,
    content_id: to
  });
  return (
    <a href={to} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-gray-900">
      {children}
    </a>
  );
}



  type FooterLinkProps = {
    to: string;
    children: React.ReactNode;
  };
  
  function FooterLink({ to, children }: FooterLinkProps) {
    logEvent(analytics, 'external', {
      content_type: to,
      content_id: to
    });
    return (
      <a href={to} className="text-gray-500 hover:text-gray-900">
        {children}
      </a>
    );
  }


