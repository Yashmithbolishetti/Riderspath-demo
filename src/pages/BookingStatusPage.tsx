import React from 'react';
import { Booking } from '../types';
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  Phone,
  QrCode,
  ArrowRight,
  Download,
  Share2,
  AlertCircle,
  FileText,
  Laptop,
  AlertTriangle,
  Info,
  Clock3,
  User,
} from 'lucide-react';

interface BookingStatusPageProps {
  booking: Booking;
  onGoToDashboard?: () => void;
  onViewDashboard?: () => void;
  onExploreMore?: () => void;
}

export const BookingStatusPage: React.FC<BookingStatusPageProps> = ({
  booking,
  onGoToDashboard,
  onViewDashboard,
  onExploreMore,
}) => {
  const handleDashboard = () => {
    if (typeof onViewDashboard === 'function') onViewDashboard();
    else if (typeof onGoToDashboard === 'function') onGoToDashboard();
  };

  const handleExplore = () => {
    if (typeof onExploreMore === 'function') onExploreMore();
  };
  const pickupFormatted = new Date(booking.pickupDate).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  const returnFormatted = new Date(booking.returnDate).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const isPending = booking.bookingStatus === 'pending_verification';
  const isConfirmed = booking.bookingStatus === 'confirmed';
  const isActive = booking.bookingStatus === 'active_rental';
  const isCompleted = booking.bookingStatus === 'completed';
  const isRejected = booking.bookingStatus === 'rejected';

  // Lifecycle steps
  const lifecycleSteps = [
    { key: 'submitted', label: 'Booking Submitted', done: true },
    { key: 'verified', label: 'Documents Ingested', done: true },
    {
      key: 'approved',
      label: 'Admin Approved',
      done: isConfirmed || isActive || isCompleted,
      active: isPending,
    },
    {
      key: 'confirmed',
      label: 'Booking Confirmed',
      done: isConfirmed || isActive || isCompleted,
    },
    {
      key: 'active',
      label: 'Rental Active',
      done: isActive || isCompleted,
    },
    {
      key: 'completed',
      label: 'Completed & Refunded',
      done: isCompleted,
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in zoom-in-95 duration-300">
      {/* Top Banner based on status */}
      {isPending && (
        <div className="p-6 rounded-3xl bg-amber-950/40 border border-amber-500/30 text-center space-y-3 shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center text-neutral-950 mx-auto font-black shadow-lg shadow-amber-500/20">
            <Clock3 className="w-8 h-8 stroke-[2.5]" />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
              Status: PENDING_VERIFICATION
            </span>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-neutral-100">
              Booking Submitted for Verification
            </h1>
            <p className="text-xs text-neutral-300 max-w-md mx-auto leading-relaxed">
              Your booking request and uploaded documents are in the administrative review queue. Once cleared, your pickup pass will be active for handover at {booking.pickupHub}.
            </p>
          </div>
        </div>
      )}

      {isConfirmed && (
        <div className="p-6 rounded-3xl bg-emerald-950/40 border border-emerald-500/30 text-center space-y-3 shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center text-neutral-950 mx-auto font-black shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
              Status: CONFIRMED • PASS ACTIVE
            </span>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-neutral-100">
              Booking Confirmed
            </h1>
            <p className="text-xs text-neutral-300 max-w-md mx-auto leading-relaxed">
              Your ride clearance is confirmed. Meet the vehicle host at {booking.pickupHub} at the scheduled pickup time.
            </p>
          </div>
        </div>
      )}

      {/* Lifecycle Progress Bar */}
      <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
        <h3 className="text-xs font-mono uppercase text-neutral-400 font-bold">
          Verification & Rental Lifecycle
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-center text-xs">
          {lifecycleSteps.map((s, idx) => (
            <div
              key={s.key}
              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                s.done
                  ? 'bg-neutral-950 border-emerald-500/40 text-emerald-400'
                  : s.active
                  ? 'bg-amber-950/50 border-amber-500/50 text-amber-300 animate-pulse'
                  : 'bg-neutral-950/50 border-neutral-800/60 text-neutral-500'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  s.done
                    ? 'bg-emerald-500 text-neutral-950'
                    : s.active
                    ? 'bg-amber-500 text-neutral-950'
                    : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                {s.done ? '✓' : idx + 1}
              </div>
              <span className="text-[10px] font-medium leading-tight">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Digital Ride Pass Card */}
      <div
        id="digital-ride-pass-card"
        className="rounded-3xl bg-neutral-900 border-2 border-amber-500/40 overflow-hidden shadow-2xl relative"
      >
        {/* Pass Header */}
        <div className="p-6 bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 border-b border-neutral-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-lg text-amber-400 tracking-tight">
                RIDERS PATH
              </span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                ICFAI CAMPUS PASS
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 font-mono">
              Booking Ref: {booking.id}
            </p>
          </div>

          <div className="text-right">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold uppercase ${
                isConfirmed
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{booking.bookingStatus.replace('_', ' ')}</span>
            </span>
          </div>
        </div>

        {/* Pass Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Bike & Renter Hero Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-neutral-800">
            <div>
              <span className="text-xs uppercase font-mono text-neutral-400">Assigned Vehicle</span>
              <h3 className="font-display font-bold text-xl text-neutral-100 mt-1">
                {booking.bikeBrand} {booking.bikeModel}
              </h3>
              <p className="text-xs font-mono text-amber-400 mt-0.5">
                Reg: {booking.bikeRegistration || 'Campus Fleet'}
              </p>
            </div>

            <div>
              <span className="text-xs uppercase font-mono text-neutral-400">Student Renter</span>
              <h3 className="font-display font-bold text-xl text-neutral-100 mt-1">
                {booking.renterName}
              </h3>
              <p className="text-xs font-mono text-emerald-400 mt-0.5">
                ICFAI Enrollment: {booking.renterEnrollment}
              </p>
            </div>
          </div>

          {/* Schedule & Pickup Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
              <span className="text-neutral-400 block text-[11px] flex items-center gap-1">
                <Calendar className="w-3 h-3 text-amber-400" />
                <span>Pickup Time</span>
              </span>
              <span className="font-semibold text-neutral-200 block">{pickupFormatted}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
              <span className="text-neutral-400 block text-[11px] flex items-center gap-1">
                <Calendar className="w-3 h-3 text-amber-400" />
                <span>Return Time</span>
              </span>
              <span className="font-semibold text-neutral-200 block">{returnFormatted}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
              <span className="text-neutral-400 block text-[11px] flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-400" />
                <span>Campus Hub</span>
              </span>
              <span className="font-semibold text-neutral-200 block truncate">{booking.pickupHub}</span>
            </div>
          </div>

          {/* Financial Breakdown Badge */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-neutral-400 text-[11px]">Rental Rate</span>
              <span className="font-display font-bold text-neutral-200">₹{booking.totalPrice}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-400 text-[11px]">Platform Safety Fee (8%)</span>
              <span className="font-display font-bold text-neutral-200">₹{booking.platformFee}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-400 text-[11px]">Refundable Cash Deposit</span>
              <span className="font-display font-bold text-emerald-400">
                ₹{booking.securityDeposit} (Refunded post-inspection)
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-neutral-800 text-amber-400">
              <span className="font-semibold">Security Deposit Requirement</span>
              <span className="font-mono font-bold">1 Working Laptop (Required at Handover)</span>
            </div>
          </div>

          {/* QR Code Pass Box */}
          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center text-amber-400">
                <QrCode className="w-7 h-7" />
              </div>
              <div className="text-xs">
                <span className="font-semibold text-neutral-200 block">
                  Campus Handover Validation Pass
                </span>
                <span className="font-mono text-[11px] text-amber-400">
                  {booking.qrCodePass || `RP-PASS-${booking.id.slice(0, 8)}`}
                </span>
              </div>
            </div>

            <div className="text-right text-xs">
              <span className="text-[11px] text-neutral-400 block">Renter Contact</span>
              <span className="font-mono text-neutral-200 font-semibold">{booking.renterPhone}</span>
            </div>
          </div>

          {/* Mandatory Physical Checklist for Pickup */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2 text-xs">
            <strong className="text-neutral-200 block text-xs flex items-center gap-1.5">
              <Info className="w-4 h-4 text-amber-400" />
              <span>Mandatory Physical Items Required for Key Handover:</span>
            </strong>
            <ul className="space-y-1 text-neutral-400 text-[11px]">
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Original Government Driving Licence (Two-Wheeler)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Original ICFAI University Student ID Card</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-amber-400 font-bold">✓</span>
                <span>Functioning Laptop for Physical Security Deposit</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Total amount payable: ₹{booking.totalPrice + booking.platformFee + booking.securityDeposit}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Handover Checklist Footer */}
        <div className="p-5 bg-neutral-950 border-t border-neutral-800 text-[11px] text-neutral-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>✓ ISI Helmet provided with vehicle</span>
          <span>✓ Fuel level matched on return</span>
          <span>✓ Odometer reading noted before departure</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          onClick={handleDashboard}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20"
        >
          <span>View in Student Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={handleExplore}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 font-semibold text-xs transition-colors"
        >
          <span>Explore More Campus Bikes</span>
        </button>
      </div>
    </div>
  );
};
