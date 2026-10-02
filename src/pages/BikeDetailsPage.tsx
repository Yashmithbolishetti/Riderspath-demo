import React, { useState, useEffect } from 'react';
import { Bike } from '../types';
import { api } from '../services/api';
import {
  ArrowLeft,
  ShieldCheck,
  MapPin,
  Fuel,
  Zap,
  Gauge,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  User,
  Sparkles,
  ArrowRight,
  Info,
} from 'lucide-react';

interface BikeDetailsPageProps {
  bike?: Bike;
  bikeId?: string;
  onBack: () => void;
  onBookNow: (bike: Bike) => void;
}

export const BikeDetailsPage: React.FC<BikeDetailsPageProps> = ({
  bike: initialBike,
  bikeId,
  onBack,
  onBookNow,
}) => {
  const [currentBike, setCurrentBike] = useState<Bike | null>(initialBike || null);
  const [loading, setLoading] = useState<boolean>(!initialBike && !!bikeId);
  const [error, setError] = useState<string>('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (initialBike) {
      setCurrentBike(initialBike);
      setLoading(false);
    } else if (bikeId) {
      setLoading(true);
      api.getBikeById(bikeId)
        .then((data) => {
          setCurrentBike(data);
          setError('');
        })
        .catch((err) => {
          console.error(err);
          setError('Could not load bike details.');
        })
        .finally(() => setLoading(false));
    }
  }, [initialBike, bikeId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-neutral-400">Loading bike information from campus fleet...</p>
      </div>
    );
  }

  if (error || !currentBike) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-300 text-sm">
          {error || 'Bike not found in active campus registry.'}
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-amber-500 text-neutral-950 text-xs font-semibold"
        >
          Return to Fleet
        </button>
      </div>
    );
  }

  const bike = currentBike;
  const isAvailable = bike.availabilityStatus === 'AVAILABLE';

  const images =
    bike.images && bike.images.length > 0
      ? bike.images
      : ['https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          id="back-to-bikes-btn"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-medium text-neutral-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Campus Fleet</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <span>{bike.brand}</span>
          <span>/</span>
          <span className="text-neutral-200 font-medium">{bike.model}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 Cols: Image Gallery & Detailed Specs */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Showcase Image */}
          <div className="relative h-[380px] sm:h-[460px] w-full rounded-3xl overflow-hidden bg-neutral-950 border border-neutral-800 shadow-2xl">
            <img
              src={images[selectedImageIndex]}
              alt={`${bike.brand} ${bike.model}`}
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent pointer-events-none" />

            {/* Status Tag Overlay */}
            <div className="absolute top-4 left-4">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-md ${
                  isAvailable
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isAvailable ? 'bg-emerald-400' : 'bg-amber-400'
                  } animate-pulse`}
                />
                <span>
                  {bike.availabilityStatus === 'AVAILABLE'
                    ? 'Available for Instant Booking'
                    : bike.availabilityStatus === 'RESERVED'
                    ? 'Currently Reserved'
                    : 'Under Maintenance'}
                </span>
              </span>
            </div>

            {/* Model Title Overlay on Image Bottom */}
            <div className="absolute bottom-4 left-4 right-4 text-neutral-100">
              <span className="text-xs uppercase font-mono text-amber-400 font-bold tracking-wider">
                {bike.brand} • {bike.year}
              </span>
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl">
                {bike.model}
              </h1>
            </div>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative h-20 w-28 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImageIndex === idx
                      ? 'border-amber-500 scale-105 shadow-md shadow-amber-500/20'
                      : 'border-neutral-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Vehicle Specifications Grid */}
          <div className="p-6 rounded-3xl bg-neutral-900/80 border border-neutral-800 space-y-4">
            <h3 className="font-display font-bold text-lg text-neutral-100">
              Technical Specifications & Inclusions
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800/80 space-y-1">
                <span className="text-neutral-400 block text-[11px]">Displacement</span>
                <span className="font-semibold text-neutral-200">
                  {bike.specs?.cc ? `${bike.specs.cc} cc` : 'Electric Motor'}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800/80 space-y-1">
                <span className="text-neutral-400 block text-[11px]">Fuel / Energy</span>
                <span className="font-semibold text-neutral-200">{bike.fuelType}</span>
              </div>
              <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800/80 space-y-1">
                <span className="text-neutral-400 block text-[11px]">Transmission</span>
                <span className="font-semibold text-neutral-200">{bike.transmission}</span>
              </div>
              <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800/80 space-y-1">
                <span className="text-neutral-400 block text-[11px]">Fuel Efficiency</span>
                <span className="font-semibold text-neutral-200">{bike.specs?.mileage || '40 km/l'}</span>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800/80 space-y-1">
                <span className="text-neutral-400 block text-[11px]">Top Speed</span>
                <span className="font-semibold text-neutral-200">{bike.specs?.topSpeed || '110 km/h'}</span>
              </div>
              <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800/80 space-y-1">
                <span className="text-neutral-400 block text-[11px]">Tank / Battery</span>
                <span className="font-semibold text-neutral-200">{bike.specs?.fuelCapacity || '12 L'}</span>
              </div>
              <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800/80 space-y-1">
                <span className="text-neutral-400 block text-[11px]">ABS Safety</span>
                <span className="font-semibold text-neutral-200">
                  {bike.specs?.abs ? 'Dual Channel ABS' : 'Standard Disc/Drum'}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800/80 space-y-1">
                <span className="text-neutral-400 block text-[11px]">Helmets Provided</span>
                <span className="font-semibold text-amber-400">
                  {bike.specs?.helmetsIncluded || 1} ISI Helmet(s)
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="p-6 rounded-3xl bg-neutral-900/80 border border-neutral-800 space-y-3">
            <h3 className="font-display font-bold text-lg text-neutral-100">
              Student Owner Notes
            </h3>
            <p className="text-sm text-neutral-300 leading-relaxed whitespace-pre-line">
              {bike.description}
            </p>
          </div>

          {/* Platform Intermediary Disclaimer */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800/80 flex items-start gap-3 text-xs text-neutral-400">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-neutral-300">Notice:</strong> Riders Path is a technology intermediary platform connecting verified ICFAI students. Riders Path does not own this vehicle. All rentals are conducted peer-to-peer under ICFAI student safety guidelines.
            </p>
          </div>
        </div>

        {/* Right 5 Cols: Pricing Breakdown, Owner Card, Campus Pickup & Booking Action */}
        <div className="lg:col-span-5 space-y-6">
          {/* Booking Summary Box */}
          <div className="p-6 rounded-3xl bg-neutral-900 border border-amber-500/30 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="flex items-baseline justify-between border-b border-neutral-800 pb-4">
              <div>
                <span className="text-xs text-neutral-400 block">Daily Student Rate</span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="font-display font-extrabold text-3xl text-neutral-100">
                    ₹{bike.pricePerDay}
                  </span>
                  <span className="text-xs text-neutral-400">/ 24 hours</span>
                </div>
              </div>

              {bike.pricePerHour && (
                <div className="text-right">
                  <span className="text-[11px] text-neutral-400 block">Hourly Option</span>
                  <span className="font-mono text-sm font-semibold text-amber-400">
                    ₹{bike.pricePerHour}/hr
                  </span>
                </div>
              )}
            </div>

            {/* Pricing Transparent Breakdown */}
            <div className="space-y-2.5 text-xs text-neutral-300">
              <div className="flex justify-between">
                <span>Base 24-Hour Rental</span>
                <span className="font-mono">₹{bike.pricePerDay}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Clearance & Safety Fee (8%)</span>
                <span className="font-mono">₹{Math.round(bike.pricePerDay * 0.08)}</span>
              </div>
              <div className="flex justify-between text-amber-400/90 pt-1 border-t border-neutral-800/80">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Refundable Security Deposit</span>
                </span>
                <span className="font-mono font-semibold">₹{bike.securityDeposit}</span>
              </div>
              <p className="text-[10px] text-neutral-400 pt-1">
                * Security deposit is 100% refundable upon vehicle handover inspection at the campus hub.
              </p>
            </div>

            {/* Pickup Hub Details */}
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400 block">
                Designated Pickup Location
              </span>
              <div className="flex items-center gap-2 text-xs text-neutral-200 font-medium">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{bike.pickupHub}</span>
              </div>
              <p className="text-[11px] text-neutral-400 pl-6">
                ICFAI Hyderabad Campus • Handover coordinated directly with verified student owner.
              </p>
            </div>

            {/* Book Now Button */}
            <div className="space-y-3 pt-2">
              <button
                id="book-this-ride-btn"
                onClick={() => onBookNow(bike)}
                disabled={!isAvailable}
                className={`w-full py-4 px-6 rounded-2xl font-display font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xl ${
                  isAvailable
                    ? 'bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-amber-500/25 hover:scale-[1.01]'
                    : 'bg-neutral-800 text-neutral-400 cursor-not-allowed'
                }`}
              >
                <span>{isAvailable ? 'Proceed to Booking & Verification' : 'Bike Currently Unavailable'}</span>
                {isAvailable && <ArrowRight className="w-4 h-4" />}
              </button>

              {!isAvailable && (
                <p className="text-center text-xs text-amber-400/80 flex items-center justify-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>This ride is currently in active rental or maintenance check.</span>
                </p>
              )}
            </div>
          </div>

          {/* Student Owner Trust Card */}
          <div className="p-6 rounded-3xl glass-card space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                Student Host
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold">
                <CheckCircle2 className="w-3 h-3" />
                <span>ICFAI Verified Peer</span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-200 font-display font-bold text-lg">
                {bike.ownerName.charAt(0)}
              </div>
              <div>
                <h4 className="font-display font-bold text-neutral-100 text-base">
                  {bike.ownerName}
                </h4>
                <p className="text-xs font-mono text-neutral-300">
                  Enrollment: <span className="text-amber-400">{bike.ownerEnrollment}</span>
                </p>
                <p className="text-[11px] text-neutral-400">ICFAI University Hyderabad</p>
              </div>
            </div>
          </div>

          {/* Campus Rules & Collateral Checklist */}
          <div className="p-6 rounded-3xl glass-card space-y-3">
            <h4 className="font-display font-bold text-sm text-neutral-200">
              Campus Rental Compliance & Collateral
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>Valid Government Driving License is mandatory.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>Active ICFAI Student ID required for clearance.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Physical Laptop Collateral:</strong> Must present a functioning personal laptop during pickup.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>ISI helmet provided with bike — mandatory riding wear.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>Strict zero triple-riding policy across ICFAI and Shankerpally.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
