import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Compass,
  Bike,
  PlusCircle,
  HelpCircle,
  FileText,
  User,
  Shield,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Sparkles,
  Ticket,
} from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, params?: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const { studentUser, isStudentLoggedIn, logoutStudent, openAuthModal, isAdminLoggedIn } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (view: string, params?: any) => {
    onNavigate(view, params);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-neutral-950/90 backdrop-blur-xl border-b border-neutral-800/80 shadow-2xl shadow-black/40 py-2.5'
          : 'bg-neutral-950/60 backdrop-blur-md border-b border-neutral-900/60 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Startup Brand Identity */}
          <div
            id="brand-logo-btn"
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 cursor-pointer group select-none focus-ring rounded-xl p-1"
            tabIndex={0}
            role="button"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handleNav('home');
            }}
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 p-[1px] shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/35 transition-all">
              <div className="w-full h-full rounded-[11px] bg-neutral-950 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-neutral-950 transition-colors">
                <Compass className="w-5 h-5 stroke-[2.4]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-lg sm:text-xl tracking-tight text-neutral-100 group-hover:text-amber-400 transition-colors">
                  RIDERS PATH
                </span>
                <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/25 text-amber-400 font-bold tracking-wider">
                  CAMPUS
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 font-medium tracking-wide">
                ICFAI Hyderabad Mobility
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-neutral-900/50 p-1.5 rounded-2xl border border-neutral-800/60 backdrop-blur-md">
            <button
              id="nav-bikes-btn"
              onClick={() => handleNav('bikes')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all focus-ring ${
                currentView === 'bikes'
                  ? 'bg-neutral-800 text-amber-400 border border-neutral-700 shadow-sm'
                  : 'text-neutral-300 hover:text-neutral-100 hover:bg-neutral-800/60'
              }`}
            >
              Explore Fleet
            </button>
            <button
              id="nav-how-it-works-btn"
              onClick={() => handleNav('how-it-works')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all focus-ring ${
                currentView === 'how-it-works'
                  ? 'bg-neutral-800 text-amber-400 border border-neutral-700 shadow-sm'
                  : 'text-neutral-300 hover:text-neutral-100 hover:bg-neutral-800/60'
              }`}
            >
              How It Works
            </button>
            <button
              id="nav-onboard-btn"
              onClick={() => handleNav('onboard')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all focus-ring ${
                currentView === 'onboard'
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-amber-400/90 hover:text-amber-300 hover:bg-amber-500/10'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>List Your Bike</span>
            </button>
            <button
              id="nav-faq-btn"
              onClick={() => handleNav('faq')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all focus-ring ${
                currentView === 'faq'
                  ? 'bg-neutral-800 text-amber-400 border border-neutral-700 shadow-sm'
                  : 'text-neutral-300 hover:text-neutral-100 hover:bg-neutral-800/60'
              }`}
            >
              Hubs & FAQ
            </button>
            <button
              id="nav-contact-btn"
              onClick={() => handleNav('contact')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all focus-ring ${
                currentView === 'contact'
                  ? 'bg-neutral-800 text-amber-400 border border-neutral-700 shadow-sm'
                  : 'text-neutral-300 hover:text-neutral-100 hover:bg-neutral-800/60'
              }`}
            >
              Support Desk
            </button>
          </nav>

          {/* Right Action Hub: User & Admin */}
          <div className="hidden md:flex items-center gap-2.5">
            {isStudentLoggedIn && studentUser ? (
              <div className="flex items-center gap-1.5">
                <button
                  id="nav-dashboard-btn"
                  onClick={() => handleNav('student-dashboard')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition-all focus-ring ${
                    currentView === 'student-dashboard' || currentView === 'dashboard'
                      ? 'bg-neutral-800 border-amber-500/40 text-neutral-100'
                      : 'bg-neutral-900/80 hover:bg-neutral-800 border-neutral-800 text-neutral-200'
                  }`}
                >
                  <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold">
                    {studentUser.fullName.charAt(0)}
                  </div>
                  <div className="text-left leading-none">
                    <span className="font-semibold text-xs text-neutral-100 block">
                      {studentUser.fullName.split(' ')[0]}
                    </span>
                    <span className="font-mono text-[9px] text-amber-400">
                      {studentUser.icfaiEnrollmentNumber}
                    </span>
                  </div>
                </button>
                <button
                  id="student-logout-btn"
                  onClick={logoutStudent}
                  title="Sign Out"
                  className="p-2 rounded-xl bg-neutral-900/80 hover:bg-rose-950/30 text-neutral-400 hover:text-rose-400 border border-neutral-800 hover:border-rose-900/50 transition-colors focus-ring"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="open-student-login-btn"
                onClick={openAuthModal}
                className="px-3.5 py-1.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800 hover:border-amber-500/40 text-neutral-200 text-xs font-semibold flex items-center gap-2 transition-all focus-ring shadow-sm"
              >
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>Student Login</span>
              </button>
            )}

            {/* Admin Switch */}
            <button
              id="nav-admin-link-btn"
              onClick={() => handleNav('admin')}
              className={`p-2 rounded-xl border text-xs font-mono transition-all flex items-center gap-1.5 focus-ring ${
                currentView.startsWith('admin')
                  ? 'bg-amber-500 text-neutral-950 border-amber-500 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-neutral-900/80 hover:bg-neutral-800 border-neutral-800 text-neutral-400 hover:text-neutral-200'
              }`}
              title="Admin Operations Console"
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden xl:inline text-[11px]">
                {isAdminLoggedIn ? 'Operations' : 'Staff'}
              </span>
            </button>
          </div>

          {/* Mobile Menu Trigger Button */}
          <div className="flex md:hidden items-center gap-2">
            {isStudentLoggedIn && studentUser && (
              <button
                onClick={() => handleNav('student-dashboard')}
                className="px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-[11px] font-mono text-amber-400"
              >
                {studentUser.icfaiEnrollmentNumber}
              </button>
            )}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-neutral-100 focus-ring"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-neutral-950/95 backdrop-blur-2xl border-b border-neutral-800/80 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-200">
          <button
            onClick={() => handleNav('bikes')}
            className="w-full text-left px-4 py-3 rounded-xl bg-neutral-900/60 text-neutral-200 text-sm font-medium flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Bike className="w-4 h-4 text-amber-400" />
              <span>Explore Fleet</span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-500" />
          </button>
          <button
            onClick={() => handleNav('onboard')}
            className="w-full text-left px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <PlusCircle className="w-4 h-4" />
              <span>List Your Bike (Earn Money)</span>
            </div>
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleNav('how-it-works')}
            className="w-full text-left px-4 py-3 rounded-xl bg-neutral-900/60 text-neutral-200 text-sm font-medium flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Compass className="w-4 h-4 text-neutral-400" />
              <span>How It Works</span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-500" />
          </button>
          <button
            onClick={() => handleNav('faq')}
            className="w-full text-left px-4 py-3 rounded-xl bg-neutral-900/60 text-neutral-200 text-sm font-medium flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-4 h-4 text-neutral-400" />
              <span>Campus FAQs & Hubs</span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-500" />
          </button>
          <button
            onClick={() => handleNav('terms')}
            className="w-full text-left px-4 py-3 rounded-xl bg-neutral-900/60 text-neutral-200 text-sm font-medium flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 text-neutral-400" />
              <span>Terms & Safety Rules</span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-500" />
          </button>
          <button
            onClick={() => handleNav('contact')}
            className="w-full text-left px-4 py-3 rounded-xl bg-neutral-900/60 text-neutral-200 text-sm font-medium flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-neutral-400" />
              <span>Campus Support Desk</span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-500" />
          </button>

          <div className="pt-3 border-t border-neutral-900 flex flex-col gap-2">
            {isStudentLoggedIn && studentUser ? (
              <>
                <button
                  onClick={() => handleNav('student-dashboard')}
                  className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 text-neutral-200 text-xs font-semibold flex items-center justify-between"
                >
                  <span className="font-mono text-amber-400">
                    Dashboard ({studentUser.icfaiEnrollmentNumber})
                  </span>
                  <Ticket className="w-4 h-4 text-amber-400" />
                </button>
                <button
                  onClick={logoutStudent}
                  className="w-full py-2.5 px-4 rounded-xl bg-rose-950/40 text-rose-300 text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out Student</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openAuthModal();
                }}
                className="w-full py-3 px-4 rounded-xl bg-amber-500 text-neutral-950 font-bold text-xs text-center shadow-lg shadow-amber-500/20"
              >
                ICFAI Student Login / Register
              </button>
            )}

            <button
              onClick={() => handleNav('admin')}
              className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 text-xs font-mono text-center"
            >
              Operations & Admin Console
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

