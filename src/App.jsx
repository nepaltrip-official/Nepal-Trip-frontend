import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Navbar } from './components/site/Navbar';
import { Footer } from './components/site/Footer';
import { AdminLayout } from './components/admin/AdminLayout'; // Adjust path as needed
import './App.css';
import RegisteredUsers from './pages/Admin/RegisteredUsers';
import { SuperAdminLayout } from './components/superadmin/SuperAdminLayout';

// ==========================================
// 1. Lazy Load Public Pages
// ==========================================
const Home = lazy(() => import('./pages/User/Home'));
const About = lazy(() => import('./pages/User/About'));
const Contact = lazy(() => import('./pages/User/Contact'));
const Packages = lazy(() => import('./pages/User/Packages'));
const PackageDetail = lazy(() => import('./pages/User/PackageDetail'));
const Testimonials = lazy(() => import('./pages/User/Testimonials'));
const Gallery = lazy(() => import('./pages/User/Gallery'));
const Discover = lazy(() => import('./pages/User/Discover'));

// ==========================================
// 2. Lazy Load Admin Pages
// ==========================================
const AdminAnalytics = lazy(() => import('./pages/Admin/AdminAnalytics'));
const InquiryDesk = lazy(() => import('./pages/Admin/InquiryDesk'));
const AdminSettings = lazy(() => import('./pages/Admin/AdminSettings'));

// ==========================================
// 3. Lazy Load Super Admin Pages
// ==========================================
const SuperAdminAnalytics = lazy(() => import('./pages/SuperAdmin/SuperAdminAnalytics'));
const SuperAdminInquiries = lazy(() => import('./pages/SuperAdmin/SuperAdminInquiries'));
const SuperAdminUsers = lazy(() => import('./pages/SuperAdmin/SuperAdminUsers'));
const SuperAdminSettings = lazy(() => import('./pages/SuperAdmin/SuperAdminSettings'));

// ==========================================
// 3. Global Scroll To Top
// ==========================================
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
}

// ==========================================
// 4. Fallback Loader
// ==========================================
const PageLoader = () => (
  <div className="fixed inset-0 z-100 flex h-screen w-full flex-col items-center justify-center bg-[#FDFBF7]">
    <div className="flex flex-col items-center justify-center gap-6">

      {/* Skeleton Ring Wrapper */}
      <div className="relative flex items-center justify-center h-32 w-32 md:h-40 md:w-40 rounded-full bg-linear-to-r from-slate-300 via-slate-100 to-slate-300 bg-size-[400%_100%] animate-[shimmer_1.5s_infinite_linear]">

        {/* Inner circle cutout to make it a ring (background matches page bg) */}
        <div className="flex items-center justify-center h-[calc(100%-12px)] w-[calc(100%-12px)] rounded-full bg-[#FDFBF7]">
          {/* Skeleton 'N' */}
          <span className="text-6xl md:text-7xl font-sans font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-slate-300 via-slate-100 to-slate-300 bg-size-[400%_100%] animate-[shimmer_1.5s_infinite_linear]">
            N
          </span>
        </div>
      </div>

      {/* Skeleton Style Subtext */}
      <div>
        <span className="text-sm md:text-base font-sans font-extrabold tracking-[0.3em] uppercase text-transparent bg-clip-text bg-linear-to-r from-slate-300 via-slate-100 to-slate-300 bg-size-[400%_100%] animate-[shimmer_1.5s_infinite_linear]">
          Nepal Trip
        </span>
      </div>

    </div>
  </div>
);

// ==========================================
// 5. Global Public Layout (Using Outlet)
// ==========================================
function PublicLayout() {
  const [settings] = useState({
    brand_name: "Nepal Trip",
    tagline: "CURATED JOURNEYS, UNFORGETTABLE MEMORIES",
    contact_email: "ankitpandey78600@gmail.com",
    contact_phone: "+91 8318538918",
    contact_address: "721/1 Sri Ram Nagar Civil Line 1 Sultanpur"
  });

  return (
    <div className="flex min-h-screen flex-col bg-linear-to-b from-[#FDFBF7] to-[#EAE9E6] text-foreground">
      <Navbar brand={settings.brand_name} />
      <main className="flex-1 animate-in fade-in duration-700">
        <Outlet /> {/* Child routes render here */}
      </main>
      <Footer settings={settings} />
    </div>
  );
}

// ==========================================
// 6. Main App Component
// ==========================================
function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Toaster position="top-center" richColors />

      <Suspense fallback={<PageLoader />}>
        <Routes>

          {/* --- PUBLIC ROUTES --- */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/packages/:slug" element={<PackageDetail />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/discover" element={<Discover />} />
          </Route>

          {/* --- ADMIN ROUTES --- */}
          <Route path="/admin" element={<AdminLayout />}>
            {/* The "index" route maps to exactly "/admin" */}
            <Route index element={<AdminAnalytics />} />
            <Route path="users" element={<RegisteredUsers />} />
            <Route path="inquiries" element={<InquiryDesk />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* --- SUPER ADMIN ROUTES --- */}
          <Route path="/superadmin" element={<SuperAdminLayout />}>
            <Route index element={<SuperAdminAnalytics />} />
            <Route path="inquiries" element={<SuperAdminInquiries />} />
            <Route path="users" element={<SuperAdminUsers />} />
            <Route path="settings" element={<SuperAdminSettings />} />
          </Route>

          {/* --- 404 NOT FOUND --- */}
          <Route path="*" element={
            <div className="flex h-screen w-full flex-col items-center justify-center bg-[#FDFBF7] font-serif text-2xl text-foreground">
              404 - Page Not Found
            </div>
          } />

        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;