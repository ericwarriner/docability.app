
import { Route, Routes, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { NotFound } from './routes/NotFound';
import { Homepage } from './routes/Homepage';
import { Privacy } from './routes/Privacy';
import { Terms } from './routes/Terms';
import { CookiePolicy } from './components/CookiePolicy';
import { ChatUI } from './routes/ChatUI';
import { logEvent } from 'firebase/analytics';
import { analytics } from './firebase';
import { FAQ } from './routes/FAQ';

export function App() {
  const location = useLocation();

  // Define a function to check if the current route should hide header and footer
  const shouldHideHeaderFooter = () => {
    logEvent(analytics, 'usercount', { name: 1});
    const { pathname } = location;
    if (pathname.startsWith('/ChatUI/')) {
      return true;
    } else {
      return false;
    }

  };

  return (
    <div className="flex flex-col h-screen">
      {!shouldHideHeaderFooter() && <Header />}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/ChatUI/:fileurl/:sessionId/" element={<ChatUI />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="terms" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      {!shouldHideHeaderFooter() && (
        <div>
          <CookiePolicy />
          <Footer />
        </div>
      )}
    </div>
  );
}