import React, { useState, useEffect, useId } from 'react';
import { Bike } from '../types';
import { BikeCard } from '../components/BikeCard';
import { api } from '../services/api';
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  Zap,
  MapPin,
  Clock,
  Key,
  Users,
  CheckCircle2,
  Lock,
  ChevronRight,
  Sparkles,
  Award,
  AlertCircle,
  Sliders,
  DollarSign,
  Fuel,
  Laptop,
  Check,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (view: string, params?: any) => void;
  bikes?: Bike[];
  onSelectBike: (bike: Bike | string) => void;
  onBookBike?: (bike: Bike) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  bikes: initialBikes,
  onSelectBike,
  onBookBike,
}) => {
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedHubFilter, setSelectedHubFilter] = useState('ALL');
  const [bikesList, setBikesList] = useState<Bike[]>(initialBikes || []);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [ownerDaysPerWeek, setOwnerDaysPerWeek] = useState(4);
  const [ownerAvgPrice, setOwnerAvgPrice] = useState(550);

  useEffect(() => {
    if (initialBikes && initialBikes.length > 0) {
      setBikesList(initialBikes);
    } else {
      api.getBikes()
        .then((data) => setBikesList(data || []))
        .catch((err) => console.error('Failed to load bikes for home page:', err));
    }
  }, [initialBikes]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;
    setMousePos({ x, y });
  };

  const handleSelect = (bike: Bike) => {
    if (typeof onSelectBike === 'function') {
      onSelectBike(bike.id || (bike as any));
    }
  };

  const handleBook = (bike: Bike) => {
    if (typeof onBookBike === 'function') {
      onBookBike(bike);
    } else {
      onNavigate('book', { bikeId: bike.id });
    }
  };

  // Filter available featured bikes safely
  const availableBikes = (bikesList || []).filter(
    (b) => b && b.availabilityStatus === 'AVAILABLE' && b.active && b.approvedByAdmin
  );

  const displayedBikes = availableBikes
    .filter((b) => selectedType === 'ALL' || b.bikeType === selectedType)
    .filter((b) => selectedHubFilter === 'ALL' || b.pickupHub.toLowerCase().includes(selectedHubFilter.toLowerCase()))
    .slice(0, 6);

  const campusHubs = [
    { name: 'IBS Academic Block A', desc: 'Main Campus Quad • 4 min walk', count: 5, active: true },
    { name: 'ICFAI Boys Hostel 1 & 2', desc: 'Hostel Parking Hub • 1 min walk', count: 4, active: true },
    { name: 'ICFAI Girls Hostel Hub', desc: 'Secure Gate 2 Area • 2 min walk', count: 3, active: true },
    { name: 'Main Campus Gate (Shankerpally Rd)', desc: 'Direct Highway Access', count: 3, active: true },
    { name: 'Sports Complex & Canteen', desc: 'North Ground Quad', count: 2, active: true },
  ];

  const estimatedMonthlyEarnings = ownerDaysPerWeek * 4 * ownerAvgPrice;

  return (
    <div className="space-y-24">
      {/* 1. CINEMATIC HERO SECTION */}
      <section
        onMouseMove={handleMouseMove}
        className="relative min-h-[90vh] flex items-center justify-center pt-10 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
      >
        {/* Layered Cinematic Backdrop with Parallax */}
        <div
          className="absolute inset-0 z-0 transition-transform duration-700 ease-out pointer-events-none"
          style={{
            transform: `scale(1.05) translate3d(${mousePos.x * 12}px, ${mousePos.y * 12}px, 0)`,
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=2200&q=85"
            alt="Motorcycle at twilight on highway"
            className="w-full h-full object-cover object-center filter brightness-[0.22] contrast-[1.12]"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Ambient Overlays */}
        <div className="absolute inset-0 bg-radial-fade z-0 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/70 via-neutral-950/75 to-neutral-950 z-0 pointer-events-none" />
        <div className="absolute inset-0 bg-grid-pattern opacity-40 z-0 pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          {/* Startup Mobility Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-neutral-900/90 border border-amber-500/30 text-xs font-semibold text-amber-400 backdrop-blur-xl shadow-xl shadow-amber-500/10">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="tracking-wide">ICFAI HYDERABAD CAMPUS MOBILITY NETWORK</span>
          </div>

          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight text-neutral-100 uppercase leading-[1.05]">
              Your Campus. <br className="hidden sm:inline" />
              Your Ride. <span className="text-amber-400">Your Path.</span>
            </h1>
            <p className="text-base sm:text-xl text-neutral-300 max-w-2xl mx-auto font-normal leading-relaxed">
              The verified peer-to-peer student mobility marketplace for ICFAI Hyderabad. Rent well-maintained bikes from verified classmates in 2 minutes or monetize your parked bike securely.
            </p>
          </div>

          {/* Quick-Action Bar / Hub Finder */}
          <div className="max-w-3xl mx-auto p-2 sm:p-3 rounded-2xl bg-neutral-900/90 border border-neutral-800/90 backdrop-blur-2xl shadow-2xl space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-left">
              {/* Hub Selector */}
              <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800/80">
                <label className="text-[10px] font-mono uppercase text-amber-400 font-bold block mb-1">
                  Campus Pickup Hub
                </label>
                <div className="flex items-center gap-2 text-xs text-neutral-200">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <select
                    value={selectedHubFilter}
                    onChange={(e) => setSelectedHubFilter(e.target.value)}
                    className="bg-transparent text-neutral-200 text-xs focus:outline-none w-full cursor-pointer"
                  >
                    <option value="ALL" className="bg-neutral-900">All Campus Hubs (6)</option>
                    <option value="IBS" className="bg-neutral-900">IBS Academic Block</option>
                    <option value="Hostel" className="bg-neutral-900">Hostel Parking Hubs</option>
                    <option value="Gate" className="bg-neutral-900">Main Campus Gate</option>
                  </select>
                </div>
              </div>

              {/* Bike Type Selector */}
              <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800/80">
                <label className="text-[10px] font-mono uppercase text-amber-400 font-bold block mb-1">
                  Vehicle Category
                </label>
                <div className="flex items-center gap-2 text-xs text-neutral-200">
                  <Fuel className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="bg-transparent text-neutral-200 text-xs focus:outline-none w-full cursor-pointer"
                  >
                    <option value="ALL" className="bg-neutral-900">All Types (EV & Petrol)</option>
                    <option value="Cruiser" className="bg-neutral-900">Cruiser (Royal Enfield)</option>
                    <option value="Street" className="bg-neutral-900">Street / Naked (Yamaha, KTM)</option>
                    <option value="Sport" className="bg-neutral-900">Sport (R15, Apache)</option>
                    <option value="Electric" className="bg-neutral-900">Electric EV (Ather, Ola)</option>
                    <option value="Scooter" className="bg-neutral-900">Scooter (Activa, Jupiter)</option>
                  </select>
                </div>
              </div>

              {/* Action Trigger */}
              <div className="flex items-center">
                <button
                  id="hero-explore-bikes-btn"
                  onClick={() => onNavigate('bikes')}
                  className="w-full h-full min-h-[48px] px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/25 active:scale-98"
                >
                  <span>Explore Fleet ({availableBikes.length})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Real Campus Mobility Metrics */}
          <div className="pt-6 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-left">
            <div className="p-4 rounded-2xl glass-panel">
              <span className="text-[11px] text-neutral-400 font-medium block">Verified Fleet</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="font-display font-black text-2xl text-amber-400">
                  {availableBikes.length} Bikes
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">Live</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl glass-panel">
              <span className="text-[11px] text-neutral-400 font-medium block">Student Daily Rate</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="font-display font-black text-2xl text-neutral-100">₹399</span>
                <span className="text-[10px] text-neutral-400">/ 24 hrs</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl glass-panel">
              <span className="text-[11px] text-neutral-400 font-medium block">Campus Pickups</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="font-display font-black text-2xl text-neutral-100">6 Hubs</span>
                <span className="text-[10px] text-neutral-400">IBS & Hostels</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl glass-panel">
              <span className="text-[11px] text-neutral-400 font-medium block">ICFAI Clearance</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="font-display font-black text-2xl text-emerald-400">100%</span>
                <span className="text-[10px] text-neutral-400">Enrolled Peers</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED CAMPUS FLEET */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-800/80 pb-6">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold block mb-1">
              CAMPUS FLEET INVENTORY
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-neutral-100">
              Verified Rides Available Right Now
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Handpicked student motorcycles and scooters parked across ICFAI Hyderabad campus hubs.
            </p>
          </div>

          {/* Quick Filter Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {['ALL', 'Cruiser', 'Street', 'Sport', 'Electric', 'Scooter'].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all focus-ring ${
                  selectedType === t
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/20'
                    : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
                }`}
              >
                {t === 'ALL' ? 'All Types' : t}
              </button>
            ))}
          </div>
        </div>

        {/* Bike Grid */}
        {displayedBikes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedBikes.map((bike) => (
              <BikeCard
                key={bike.id}
                bike={bike}
                onSelect={handleSelect}
                onBookNow={handleBook}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-2xl bg-neutral-900/40 border border-neutral-800 text-neutral-400 space-y-3">
            <p className="text-sm">No bikes match the current filter selection.</p>
            <button
              onClick={() => {
                setSelectedType('ALL');
                setSelectedHubFilter('ALL');
              }}
              className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-200 text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        )}

        <div className="text-center pt-4">
          <button
            onClick={() => onNavigate('bikes')}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 font-semibold text-xs transition-all hover:border-amber-500/40 focus-ring shadow-lg"
          >
            <span>View Complete Campus Fleet ({bikesList.length} Vehicles)</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </section>

      {/* 3. CAMPUS PICKUP HUBS MAP & STATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold">
            CAMPUS COORDINATION
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-neutral-100">
            6 Designated Campus Pickup Hubs
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400">
            Zero travel outside Shankerpally. Collect keys and ISI helmets right from student hosts at secure campus parking areas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {campusHubs.map((hub, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl glass-card space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xs">
                  0{idx + 1}
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Active Station
                </span>
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-neutral-100">
                  {hub.name}
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">{hub.desc}</p>
              </div>
              <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-300">
                <span className="text-neutral-400">Average Handover Time:</span>
                <span className="font-mono text-amber-400 font-semibold">12 minutes</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. WORKFLOW (STUDENT RENTAL LIFECYCLE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold">
            FRICTIONLESS EXPERIENCE
          </span>
          <h2 className="font-display font-bold text-3xl text-neutral-100">
            How Riders Path Works
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400">
            Connecting student owners and student renters on ICFAI Hyderabad campus with complete trust, speed, and safety compliance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl glass-card space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-display font-bold text-lg">
              01
            </div>
            <h3 className="font-display font-bold text-lg text-neutral-100">
              Browse & Reserve
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Explore live bikes parked at campus hubs (IBS, Hostels, Main Gate). Check honest daily and hourly rates with zero hidden surge.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-card space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-display font-bold text-lg">
              02
            </div>
            <h3 className="font-display font-bold text-lg text-neutral-100">
              ICFAI Student Clearance
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Upload your Government Driving License and ICFAI student ID card. Automated verification approves your ride pass in minutes.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-card space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-display font-bold text-lg">
              03
            </div>
            <h3 className="font-display font-bold text-lg text-neutral-100">
              Campus Handover
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Meet the student host at the designated campus hub. Provide your physical laptop collateral & ID, collect the keys & ISI helmet.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-card space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-display font-bold text-lg">
              04
            </div>
            <h3 className="font-display font-bold text-neutral-100 text-lg">
              Ride & Instant Return
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Enjoy complete mobility across Hyderabad. Return the bike to the campus hub and retrieve your collateral & deposit immediately.
            </p>
          </div>
        </div>
      </section>

      {/* 5. OWNER EARNINGS SIMULATOR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl glass-panel-elevated relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left 7 Cols: Context */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                STUDENT OWNER COLLECTIVE
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-neutral-100 leading-tight">
                Turn your parked bike into <br className="hidden sm:inline" />
                <span className="text-amber-400">passive income</span> every semester.
              </h2>
              <p className="text-sm text-neutral-300 leading-relaxed">
                If your bike sits idle in hostel parking during lectures or weekend study sessions, list it on Riders Path. You control exact calendar availability, rental rates, and key handovers on campus.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-neutral-300">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Physical Laptop Collateral:</strong> Renters must present a functioning laptop as security.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Campus Only Handovers:</strong> No off-campus travel or unsafe meetings.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Direct Host Payouts:</strong> Retain 92% of your rental earnings directly.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>100% Student Verified:</strong> Never deal with anonymous commercial strangers.</span>
                </div>
              </div>
            </div>

            {/* Right 5 Cols: Interactive Earnings Calculator */}
            <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-neutral-950/90 border border-neutral-800 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <span className="font-display font-bold text-sm text-neutral-100">
                    Host Revenue Calculator
                  </span>
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/30">
                  ESTIMATED
                </span>
              </div>

              {/* Slider 1: Days per week */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-400">Days Available Per Week:</span>
                  <span className="font-mono text-amber-400 font-bold">{ownerDaysPerWeek} days/week</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={7}
                  value={ownerDaysPerWeek}
                  onChange={(e) => setOwnerDaysPerWeek(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Slider 2: Daily Rate */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-400">Your Daily Rental Rate:</span>
                  <span className="font-mono text-amber-400 font-bold">₹{ownerAvgPrice} / 24 hrs</span>
                </div>
                <input
                  type="range"
                  min={350}
                  max={1200}
                  step={50}
                  value={ownerAvgPrice}
                  onChange={(e) => setOwnerAvgPrice(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Revenue Result */}
              <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-center space-y-1">
                <span className="text-[11px] text-neutral-400 block">Projected Monthly Earnings</span>
                <div className="font-display font-extrabold text-3xl sm:text-4xl text-amber-400">
                  ₹{estimatedMonthlyEarnings.toLocaleString('en-IN')}
                </div>
                <span className="text-[10px] text-neutral-400 block">
                  Based on ~{(ownerDaysPerWeek * 4)} active rental days per month
                </span>
              </div>

              <button
                id="home-onboard-cta-btn"
                onClick={() => onNavigate('onboard')}
                className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs text-center flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 active:scale-98"
              >
                <span>List My Bike on Campus</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SAFETY & COMPLIANCE FRAMEWORK */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>CAMPUS SECURITY & COMPLIANCE</span>
          </span>
          <h2 className="font-display font-bold text-3xl text-neutral-100">
            Trust & Safety Framework
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400">
            Every booking is backed by multi-point identity verification and strict ICFAI campus rules.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl glass-card space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-display font-semibold text-neutral-100 text-base">
              Dual Identity Verification
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Every renter must submit a valid Government Driving License and active ICFAI student ID card. Automated vision verifies name, validity, and photo match.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-card space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Laptop className="w-5 h-5" />
            </div>
            <h3 className="font-display font-semibold text-neutral-100 text-base">
              Physical Laptop Collateral
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Renters provide a working personal laptop during pickup as physical collateral, protecting student hosts from non-returns or negligence.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-card space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-display font-semibold text-neutral-100 text-base">
              Zero Tolerance Code of Conduct
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Strict peer accountability. Zero triple-riding policy, mandatory ISI helmet usage, and standard traffic compliance enforced on campus.
            </p>
          </div>
        </div>
      </section>

      {/* 7. FINAL CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-950 border border-amber-500/30 text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-neutral-950 mx-auto font-black shadow-lg shadow-amber-500/20">
            <Compass className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div className="space-y-2 max-w-2xl mx-auto">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-neutral-100">
              Ready for your next campus ride?
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400">
              Book a verified bike in under 2 minutes with your ICFAI student credentials.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('bikes')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 active:scale-98"
            >
              <span>Explore Fleet ({availableBikes.length} Bikes)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('onboard')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 font-semibold text-xs transition-colors"
            >
              <span>List Your Bike as Owner</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
