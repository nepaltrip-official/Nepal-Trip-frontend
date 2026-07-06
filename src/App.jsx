import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Navbar } from './components/site/Navbar';
import { Footer } from './components/site/Footer';
import './App.css';

// ==========================================
// 1. Lazy Load Public Pages
// ==========================================
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Packages = lazy(() => import('./pages/Packages'));
const PackageDetail = lazy(() => import('./pages/PackageDetail'));
const Testimonials = lazy(() => import('./pages/Testimonials'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Discover = lazy(() => import('./pages/Discover'));

// ==========================================
// 2. Global Scroll To Top
// ==========================================
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
}

// ==========================================
// 3. Fallback Loader
// ==========================================
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-[#FDFBF7]">
    <div className="font-serif text-xl text-muted-foreground animate-pulse">Loading...</div>
  </div>
);

// ==========================================
// 4. Global Public Layout
// ==========================================
function PublicLayout({ children }) {
  const [settings] = useState({
    brand_name: "Nepal Trip",
    tagline: "CURATED JOURNEYS, UNFORGETTABLE MEMORIES",
    contact_email: "ankitpandey78600@gmail.com",
    contact_phone: "+91 8318538918",
    contact_address: "721/1 Sri Ram Nagar Civil Line 1 Sultanpur"
  });

  return (
    // Fixed background: Warm Ivory to Mountain Mist gradient
    <div className="flex min-h-screen flex-col bg-linear-to-b from-[#FDFBF7] to-[#EAE9E6] text-foreground">
      <Navbar brand={settings.brand_name} />

      <main className="flex-1 animate-in fade-in duration-700">
        {children}
      </main>

      <Footer settings={settings} />
    </div>
  );
}

// ==========================================
// 5. Main App Component
// ==========================================
function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Toaster position="top-center" richColors />

      <PublicLayout>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/packages/:slug" element={<PackageDetail />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/discover" element={<Discover />} />

            <Route path="*" element={
              <div className="flex h-full flex-col items-center justify-center py-32 font-serif text-2xl">
                404 - Page Not Found
              </div>
            } />
          </Routes>
        </Suspense>
      </PublicLayout>
    </BrowserRouter>
  );
}

export default App;