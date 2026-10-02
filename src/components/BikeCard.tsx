import React from 'react';
import { Bike } from '../types';
import { ShieldCheck, Fuel, Zap, Gauge, MapPin, ArrowRight, CheckCircle2 } from 'lucide-react';

interface BikeCardProps {
  bike: Bike;
  onSelect: (bike: Bike) => void;
  onBookNow: (bike: Bike) => void;
}

export const BikeCard: React.FC<BikeCardProps> = ({ bike, onSelect, onBookNow }) => {
  const isAvailable = bike.availabilityStatus === 'AVAILABLE';

  const statusConfig = {
    AVAILABLE: {
      label: 'Available Now',
      color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      dot: 'bg-emerald-400',
    },
    RESERVED: {
      label: 'Currently Reserved',
      color: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      dot: 'bg-amber-400',
    },
    MAINTENANCE: {
      label: 'Inspection / Tune-up',
      color: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
      dot: 'bg-indigo-400',
    },
    UNAVAILABLE: {
      label: 'Unavailable',
      color: 'bg-neutral-800/80 text-neutral-400 border-neutral-700',
      dot: 'bg-neutral-500',
    },
  }[bike.availabilityStatus] || {
    label: bike.availabilityStatus,
    color: 'bg-neutral-800 text-neutral-400 border-neutral-700',
    dot: 'bg-neutral-500',
  };

  const imageSrc =
    bike.images && bike.images.length > 0 && bike.images[0]
      ? bike.images[0]
      : 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80';

  return (
    <article
      id={`bike-card-${bike.id}`}
      className="group glass-card rounded-2xl overflow-hidden flex flex-col justify-between focus-within:ring-2 focus-within:ring-amber-400/80 transition-all duration-300"
    >
      <div>
        {/* Visual Frame */}
        <div
          onClick={() => onSelect(bike)}
          className="relative h-52 w-full overflow-hidden bg-neutral-950 cursor-pointer select-none"
          tabIndex={0}
          role="button"
          aria-label={`View details for ${bike.brand} ${bike.model}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelect(bike);
            }
          }}
        >
          <img
            src={imageSrc}
            alt={`${bike.brand} ${bike.model}`}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/25 to-transparent pointer-events-none" />

          {/* Availability Status Badge */}
          <div className="absolute top-3 left-3">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border backdrop-blur-md ${statusConfig.color}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot} animate-pulse`} />
              {statusConfig.label}
            </span>
          </div>

          {/* Bike Category Tag */}
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider bg-neutral-950/85 border border-neutral-700/70 text-neutral-300 backdrop-blur-md">
              {bike.bikeType}
            </span>
          </div>

          {/* Host Tag Overlay */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-neutral-300">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-950/85 backdrop-blur-md border border-neutral-800/80 shadow-md">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="font-medium text-[11px] truncate max-w-[170px]">
                Host: {(bike.ownerName || 'ICFAI Peer').split(' ')[0]} ({bike.ownerEnrollment || 'ICFAI'})
              </span>
            </div>
            {bike.specs?.mileage && (
              <span className="px-2 py-1 rounded-lg bg-neutral-950/85 backdrop-blur-md border border-neutral-800/80 text-[10px] font-mono text-neutral-300">
                {bike.specs.mileage}
              </span>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-3.5">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-mono">
                {bike.brand} {bike.year ? `• ${bike.year}` : ''}
              </span>
              {bike.displayRegistrationToPublic && bike.registrationNumber && (
                <span className="text-[10px] font-mono text-neutral-400 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
                  {bike.registrationNumber}
                </span>
              )}
            </div>
            <h3
              onClick={() => onSelect(bike)}
              className="font-display font-bold text-lg text-neutral-100 group-hover:text-amber-300 transition-colors cursor-pointer line-clamp-1 mt-0.5"
            >
              {bike.model}
            </h3>
          </div>

          {/* Key Specifications */}
          <div className="grid grid-cols-3 gap-2 text-[11px] text-neutral-300">
            <div className="p-2 rounded-xl bg-neutral-950/80 border border-neutral-800/70 flex flex-col items-center justify-center text-center">
              <Gauge className="w-3.5 h-3.5 text-neutral-400 mb-1" />
              <span className="font-semibold text-neutral-200">{bike.specs?.cc ? `${bike.specs.cc} cc` : 'EV Engine'}</span>
            </div>
            <div className="p-2 rounded-xl bg-neutral-950/80 border border-neutral-800/70 flex flex-col items-center justify-center text-center">
              {bike.fuelType === 'Electric' ? (
                <Zap className="w-3.5 h-3.5 text-amber-400 mb-1" />
              ) : (
                <Fuel className="w-3.5 h-3.5 text-neutral-400 mb-1" />
              )}
              <span className="font-semibold text-neutral-200">{bike.transmission}</span>
            </div>
            <div className="p-2 rounded-xl bg-neutral-950/80 border border-neutral-800/70 flex flex-col items-center justify-center text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400 mb-1" />
              <span className="font-semibold text-neutral-200">₹{bike.securityDeposit} dep.</span>
            </div>
          </div>

          {/* Pickup Location Hub */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 pt-0.5">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">{bike.pickupHub}</span>
          </div>
        </div>
      </div>

      {/* Pricing & Booking CTA */}
      <div className="p-5 pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-3 bg-neutral-950/50">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="font-display font-extrabold text-xl text-neutral-100">
              ₹{bike.pricePerDay}
            </span>
            <span className="text-xs text-neutral-400">/ 24 hrs</span>
          </div>
          {bike.pricePerHour && (
            <p className="text-[10px] text-amber-400 font-mono">or ₹{bike.pricePerHour}/hr</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            id={`view-details-${bike.id}`}
            onClick={() => onSelect(bike)}
            className="px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-semibold text-neutral-300 transition-colors focus-ring"
          >
            Details
          </button>
          <button
            id={`book-now-${bike.id}`}
            onClick={() => onBookNow(bike)}
            disabled={!isAvailable}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all focus-ring ${
              isAvailable
                ? 'bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-md shadow-amber-500/20 active:scale-95'
                : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
            }`}
          >
            <span>{isAvailable ? 'Book' : 'Locked'}</span>
            {isAvailable && <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </article>
  );
};

