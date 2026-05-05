import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// Layout
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Auth
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminLogin } from './pages/auth/AdminLogin';

// Core Public Pages
import { Home } from './pages/Home';
import { Discovery } from './pages/Discovery';
import { ArtistDetail } from './pages/ArtistDetail';

// Static Business Pages
import { About } from './pages/static/About';
import { Contact } from './pages/static/Contact';
import { Careers } from './pages/static/Careers';
import { HowItWorks } from './pages/static/HowItWorks';
import { CorporateSolutions } from './pages/static/CorporateSolutions';
import { Testimonials } from './pages/static/Testimonials';
import { FAQ } from './pages/static/FAQ';
import { WhyChooseUs } from './pages/static/WhyChooseUs';
import { WeddingEntertainment } from './pages/static/WeddingEntertainment';
import { CelebrityBooking } from './pages/static/CelebrityBooking';
import { CategoriesLanding } from './pages/static/CategoriesLanding';
import { FeaturedArtistsLanding } from './pages/static/FeaturedArtistsLanding';

// Legal Pages
import { PrivacyPolicy } from './pages/legal/PrivacyPolicy';
import { Terms } from './pages/legal/Terms';
import { RefundPolicy } from './pages/legal/RefundPolicy';
import { BookingPolicy } from './pages/legal/BookingPolicy';
import { KycPolicy } from './pages/legal/KycPolicy';
import { ArtistAgreement } from './pages/legal/ArtistAgreement';
import { CookiePolicy, Disclaimer } from './pages/legal/OtherLegal';

// Dashboard Layouts
import { AdminLayout } from './components/layout/AdminLayout';

// Admin Dashboard
import { AdminOverview } from './pages/dashboard/admin/AdminOverview';
import { ModerationCenter } from './pages/dashboard/admin/ModerationCenter';
import { CommissionDashboard } from './pages/dashboard/admin/CommissionDashboard';
import { ArtistList } from './pages/dashboard/admin/artists/ArtistList';
import { CreateArtist } from './pages/dashboard/admin/artists/CreateArtist';
import { CategoryManagement } from './pages/dashboard/admin/CategoryManagement';
import { StaffManagement } from './pages/dashboard/admin/StaffManagement';
import { HeroBannerList } from './pages/dashboard/admin/banners/HeroBannerList';
import { CreateHeroBanner } from './pages/dashboard/admin/banners/CreateHeroBanner';
import { LeadManagement } from './pages/dashboard/admin/LeadManagement';
import { ClientManagement } from './pages/dashboard/admin/ClientManagement';
import { WhatsAppWidget } from './components/shared/WhatsAppWidget';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Shared public wrapper — DRY helper to avoid repeating Navbar/Footer
const Public = ({ children }: { children: React.ReactNode }) => (
  <>
    <Navbar />
    <main className="flex-grow">{children}</main>
    <Footer />
  </>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Routes>
            {/* ── Core Public Pages ─────────────────────────────────── */}
            <Route
              path="/"
              element={
                <Public>
                  <Home />
                </Public>
              }
            />
            <Route
              path="/artists"
              element={
                <Public>
                  <Discovery />
                </Public>
              }
            />
            <Route
              path="/artists/:id"
              element={
                <Public>
                  <ArtistDetail />
                </Public>
              }
            />

            {/* ── Static Business Pages ─────────────────────────────── */}
            <Route
              path="/about"
              element={
                <Public>
                  <About />
                </Public>
              }
            />
            <Route
              path="/contact"
              element={
                <Public>
                  <Contact />
                </Public>
              }
            />
            <Route
              path="/careers"
              element={
                <Public>
                  <Careers />
                </Public>
              }
            />
            <Route
              path="/how-it-works"
              element={
                <Public>
                  <HowItWorks />
                </Public>
              }
            />
            <Route
              path="/corporate-solutions"
              element={
                <Public>
                  <CorporateSolutions />
                </Public>
              }
            />
            <Route
              path="/testimonials"
              element={
                <Public>
                  <Testimonials />
                </Public>
              }
            />
            <Route
              path="/faq"
              element={
                <Public>
                  <FAQ />
                </Public>
              }
            />
            <Route
              path="/why-choose-us"
              element={
                <Public>
                  <WhyChooseUs />
                </Public>
              }
            />
            <Route
              path="/wedding-entertainment"
              element={
                <Public>
                  <WeddingEntertainment />
                </Public>
              }
            />
            <Route
              path="/celebrity-booking"
              element={
                <Public>
                  <CelebrityBooking />
                </Public>
              }
            />
            <Route
              path="/artist-categories"
              element={
                <Public>
                  <CategoriesLanding />
                </Public>
              }
            />
            <Route
              path="/featured-artists"
              element={
                <Public>
                  <FeaturedArtistsLanding />
                </Public>
              }
            />

            {/* ── Legal & Compliance Pages ──────────────────────────── */}
            <Route
              path="/privacy-policy"
              element={
                <Public>
                  <PrivacyPolicy />
                </Public>
              }
            />
            <Route
              path="/terms"
              element={
                <Public>
                  <Terms />
                </Public>
              }
            />
            <Route
              path="/refund-policy"
              element={
                <Public>
                  <RefundPolicy />
                </Public>
              }
            />
            <Route
              path="/booking-policy"
              element={
                <Public>
                  <BookingPolicy />
                </Public>
              }
            />
            <Route
              path="/cancellation-policy"
              element={
                <Public>
                  <BookingPolicy />
                </Public>
              }
            />
            <Route
              path="/kyc-policy"
              element={
                <Public>
                  <KycPolicy />
                </Public>
              }
            />
            <Route
              path="/artist-agreement"
              element={
                <Public>
                  <ArtistAgreement />
                </Public>
              }
            />
            <Route
              path="/cookie-policy"
              element={
                <Public>
                  <CookiePolicy />
                </Public>
              }
            />
            <Route
              path="/disclaimer"
              element={
                <Public>
                  <Disclaimer />
                </Public>
              }
            />

            {/* ── Auth (No Navbar/Footer) ───────────────────────────── */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* ── Secure Internal Operations ────────────────────────── */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute
                  allowedRoles={['SUPER_ADMIN', 'SUB_ADMIN', 'INTERNAL_OPS', 'FINANCE']}
                >
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminOverview />} />
              <Route path="artists" element={<ArtistList />} />
              <Route path="artists/create" element={<CreateArtist />} />
              <Route path="artists/:id/edit" element={<CreateArtist />} />
              <Route path="moderation" element={<ModerationCenter />} />
              <Route path="categories" element={<CategoryManagement />} />
              <Route path="clients" element={<ClientManagement />} />
              <Route path="leads" element={<LeadManagement />} />
              <Route path="settings" element={<StaffManagement />} />
              <Route path="provisioning" element={<Navigate to="/admin/settings" replace />} />
              <Route path="commissions" element={<CommissionDashboard />} />
              <Route path="hero-banners" element={<HeroBannerList />} />
              <Route path="hero-banners/create" element={<CreateHeroBanner />} />
              <Route path="hero-banners/:id/edit" element={<CreateHeroBanner />} />
            </Route>

            <Route
              path="/unauthorized"
              element={<div className="p-8 text-white">Unauthorized Access</div>}
            />
          </Routes>
          <WhatsAppWidget />
          <Toaster position="top-right" />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
