import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/Toast';
import { StudentAuthModal } from './components/StudentAuthModal';
import { ErrorBoundary } from './components/ErrorBoundary';

// Pages
import { HomePage } from './pages/HomePage';
import { BikesPage } from './pages/BikesPage';
import { BikeDetailsPage } from './pages/BikeDetailsPage';
import { BookingFlowPage } from './pages/BookingFlowPage';
import { BookingStatusPage } from './pages/BookingStatusPage';
import { OwnerOnboardingPage } from './pages/OwnerOnboardingPage';
import { StudentDashboardPage } from './pages/StudentDashboardPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { TermsPage } from './pages/TermsPage';
import { FAQPage } from './pages/FAQPage';
import { ContactPage } from './pages/ContactPage';

// Admin Pages
import { AdminLoginPage } from './pages/Admin/AdminLoginPage';
import { AdminLayout } from './pages/Admin/AdminLayout';
import { AdminDashboard } from './pages/Admin/AdminDashboard';
import { AdminBikes } from './pages/Admin/AdminBikes';
import { AdminBookings } from './pages/Admin/AdminBookings';
import { AdminVerifications } from './pages/Admin/AdminVerifications';
import { AdminOwnerApprovals } from './pages/Admin/AdminOwnerApprovals';
import { AdminUsers } from './pages/Admin/AdminUsers';
import { AdminSettings } from './pages/Admin/AdminSettings';

import { Bike, Booking } from './types';

const getInitialView = (): string => {
  if (typeof window === 'undefined') return 'home';
  const hash = window.location.hash.replace(/^#\/?/, '').trim();
  if (hash) {
    return hash;
  }
  const lastPath = window.location.pathname.split('/').filter(Boolean).pop();
  if (lastPath === 'admin') return 'admin';
  return 'home';
};

const MainApp: React.FC = () => {
  const { isAdminLoggedIn, isStudentLoggedIn, openAuthModal } = useAuth();

  // Navigation state with initial URL hash detection
  const [currentView, setCurrentView] = useState<string>(getInitialView);
  const [selectedBikeId, setSelectedBikeId] = useState<string | null>(null);
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);

  // Admin Sub-Tab
  const [adminTab, setAdminTab] = useState<string>('dashboard');

  // Sync hash routing so back/forward and refresh maintain the exact view
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '').trim();
      if (hash && hash !== currentView) {
        setCurrentView(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentView]);

  // Handle URL hash or back/forward if needed
  const handleNavigate = (view: string, params?: { bikeId?: string; booking?: Booking }) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (params?.bikeId) setSelectedBikeId(params.bikeId);
    if (params?.booking) setActiveBooking(params.booking);
    if (window.location.hash !== `#${view}`) {
      window.location.hash = `#${view}`;
    }
    setCurrentView(view);
  };

  const handleSelectBike = (bikeId: string) => {
    setSelectedBikeId(bikeId);
    handleNavigate('bike-details', { bikeId });
  };

  const handleStartBooking = (bike: Bike) => {
    setSelectedBikeId(bike.id);
    handleNavigate('book', { bikeId: bike.id });
  };

  const handleBookingComplete = (booking: Booking) => {
    setActiveBooking(booking);
    handleNavigate('booking-status', { booking });
  };

  const renderContent = () => {
    // Admin Views
    if (currentView === 'admin') {
      if (!isAdminLoggedIn) {
        return (
          <AdminLoginPage
            onSuccess={() => setCurrentView('admin')}
            onCancel={() => handleNavigate('home')}
          />
        );
      }

      return (
        <AdminLayout
          currentTab={adminTab}
          onSelectTab={(tab) => setAdminTab(tab)}
          onExitAdmin={() => handleNavigate('home')}
        >
          {adminTab === 'dashboard' && <AdminDashboard onNavigateTab={(t) => setAdminTab(t)} />}
          {adminTab === 'bikes' && <AdminBikes />}
          {adminTab === 'bookings' && <AdminBookings />}
          {adminTab === 'verifications' && <AdminVerifications />}
          {adminTab === 'approvals' && <AdminOwnerApprovals />}
          {adminTab === 'users' && <AdminUsers />}
          {adminTab === 'settings' && <AdminSettings />}
        </AdminLayout>
      );
    }

    if (currentView === 'admin-login') {
      return (
        <AdminLoginPage
          onSuccess={() => handleNavigate('admin')}
          onCancel={() => handleNavigate('home')}
        />
      );
    }

    // Public Marketplace Views
    switch (currentView) {
      case 'bikes':
        return <BikesPage onSelectBike={handleSelectBike} />;

      case 'bike-details':
        return selectedBikeId ? (
          <BikeDetailsPage
            bikeId={selectedBikeId}
            onBack={() => handleNavigate('bikes')}
            onBookNow={handleStartBooking}
          />
        ) : (
          <BikesPage onSelectBike={handleSelectBike} />
        );

      case 'book':
        return selectedBikeId ? (
          <BookingFlowPage
            bikeId={selectedBikeId}
            onBack={() => handleNavigate('bike-details', { bikeId: selectedBikeId })}
            onBookingSuccess={handleBookingComplete}
          />
        ) : (
          <BikesPage onSelectBike={handleSelectBike} />
        );

      case 'booking-status':
        return activeBooking ? (
          <BookingStatusPage
            booking={activeBooking}
            onExploreMore={() => handleNavigate('bikes')}
            onViewDashboard={() => handleNavigate('student-dashboard')}
          />
        ) : (
          <BikesPage onSelectBike={handleSelectBike} />
        );

      case 'onboard':
        return (
          <OwnerOnboardingPage
            onSuccess={() => handleNavigate('student-dashboard')}
            onCancel={() => handleNavigate('home')}
          />
        );

      case 'student-dashboard':
        return (
          <StudentDashboardPage
            onNavigate={(v, p) => handleNavigate(v, p)}
            onViewBookingPass={(b) => handleNavigate('booking-status', { booking: b })}
          />
        );

      case 'how-it-works':
        return <HowItWorksPage onNavigate={(v) => handleNavigate(v)} />;

      case 'terms':
        return <TermsPage />;

      case 'faq':
        return <FAQPage />;

      case 'contact':
        return <ContactPage />;

      case 'home':
      default:
        return (
          <HomePage
            onNavigate={(v) => handleNavigate(v)}
            onSelectBike={handleSelectBike}
          />
        );
    }
  };

  const isAdminView = currentView === 'admin' || currentView === 'admin-login';

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100 selection:bg-amber-500 selection:text-neutral-950 font-sans antialiased">
      {!isAdminView && (
        <Navbar currentView={currentView} onNavigate={(v) => handleNavigate(v)} />
      )}

      <main className="flex-1 pb-16">{renderContent()}</main>

      {!isAdminView && <Footer onNavigate={(v) => handleNavigate(v)} />}

      <StudentAuthModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ErrorBoundary>
  );
}
