import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Booking, Bike } from '../types';
import { api } from '../services/api';
import {
  User,
  ShieldCheck,
  Ticket,
  Calendar,
  MapPin,
  Bike as BikeIcon,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  QrCode,
} from 'lucide-react';

interface StudentDashboardPageProps {
  onNavigate: (view: string, params?: any) => void;
  onViewBookingPass: (booking: Booking) => void;
}

export const StudentDashboardPage: React.FC<StudentDashboardPageProps> = ({
  onNavigate,
  onViewBookingPass,
}) => {
  const { studentUser, openAuthModal, isStudentLoggedIn } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [listedBikes, setListedBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentUser) {
      setLoading(false);
      return;
    }

    const loadStudentData = async () => {
      try {
        setLoading(true);
        // Load bookings matching this student enrollment
        const allBookings = await api.getBookings(studentUser.id, studentUser.icfaiEnrollmentNumber);
        setBookings(allBookings || []);

        // Load bikes listed by this student
        const allBikes = await api.getBikes();
        const userEnrollment = (studentUser.icfaiEnrollmentNumber || '').trim().toUpperCase();
        const myBikes = (allBikes || []).filter(
          (b) =>
            b &&
            b.ownerEnrollment &&
            b.ownerEnrollment.trim().toUpperCase() === userEnrollment
        );
        setListedBikes(myBikes);
      } catch (err) {
        console.error('Failed to fetch student data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadStudentData();
  }, [studentUser]);

  if (!isStudentLoggedIn || !studentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6 animate-in fade-in">
        <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-800 text-amber-400 flex items-center justify-center mx-auto">
          <User className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <h2 className="font-display font-bold text-2xl text-neutral-100">
            ICFAI Student Sign-In Required
          </h2>
          <p className="text-xs text-neutral-400">
            Sign in with your ICFAI Hyderabad enrollment number to view active ride passes, listed bikes, and rental records.
          </p>
        </div>
        <button
          onClick={openAuthModal}
          className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-colors shadow-lg shadow-amber-500/20"
        >
          Sign In as Student
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Student Profile Card */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel-elevated flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-neutral-950 font-display font-extrabold text-2xl shadow-lg shadow-amber-500/20">
            {studentUser.fullName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-extrabold text-2xl text-neutral-100">
                {studentUser.fullName}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Verified ICFAI Student</span>
              </span>
            </div>
            <p className="text-xs font-mono text-neutral-300 mt-0.5">
              Enrollment: <span className="text-amber-400">{studentUser.icfaiEnrollmentNumber}</span>
            </p>
            <p className="text-[11px] text-neutral-400">
              {studentUser.email} • {studentUser.phone}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('bikes')}
            className="px-4 py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-semibold transition-colors"
          >
            Explore Bikes
          </button>
          <button
            onClick={() => onNavigate('onboard')}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20 active:scale-98"
          >
            <PlusCircle className="w-4 h-4" />
            <span>List A Bike</span>
          </button>
        </div>
      </div>

      {/* Bookings & Passes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-amber-400" />
            <h2 className="font-display font-bold text-xl text-neutral-100">
              My Ride Bookings & Digital Passes
            </h2>
          </div>
          <span className="text-xs font-mono text-neutral-400">
            {bookings.length} Total Bookings
          </span>
        </div>

        {bookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 hover:border-amber-500/30 transition-all space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">
                      {b.bikeBrand}
                    </span>
                    <h3 className="font-display font-bold text-lg text-neutral-100">
                      {b.bikeModel}
                    </h3>
                    <p className="text-xs font-mono text-neutral-400">Reg: {b.bikeRegistration}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {b.bookingStatus.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-neutral-300">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>Pickup: {b.pickupHub}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>
                      {new Date(b.pickupDate).toLocaleDateString('en-IN')} to{' '}
                      {new Date(b.returnDate).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-neutral-800/80 text-xs">
                  <div>
                    <span className="text-neutral-400 block text-[10px]">Rental Amount</span>
                    <span className="font-display font-bold text-sm text-neutral-100">
                      ₹{b.totalPrice}
                    </span>
                  </div>

                  <button
                    onClick={() => onViewBookingPass(b)}
                    className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>View Digital Pass</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 rounded-2xl bg-neutral-900/40 border border-neutral-800 text-center space-y-3">
            <Ticket className="w-8 h-8 text-neutral-500 mx-auto" />
            <h3 className="font-display font-semibold text-neutral-200 text-sm">
              No Active Bookings
            </h3>
            <p className="text-xs text-neutral-400 max-w-xs mx-auto">
              Explore available campus rides and book your first verified peer-to-peer bike.
            </p>
            <button
              onClick={() => onNavigate('bikes')}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-colors"
            >
              Browse Campus Fleet
            </button>
          </div>
        )}
      </div>

      {/* Listed Bikes Section */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <BikeIcon className="w-5 h-5 text-amber-400" />
            <h2 className="font-display font-bold text-xl text-neutral-100">
              My Listed Bikes as Host
            </h2>
          </div>
          <span className="text-xs font-mono text-neutral-400">
            {listedBikes.length} Listed Vehicles
          </span>
        </div>

        {listedBikes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {listedBikes.map((b) => (
              <div
                key={b.id}
                className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">
                      {b.brand}
                    </span>
                    <h3 className="font-display font-bold text-lg text-neutral-100">{b.model}</h3>
                    <p className="text-xs font-mono text-neutral-400">Reg: {b.registrationNumber}</p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      b.approvedByAdmin
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {b.approvedByAdmin ? 'Approved & Live' : 'Under Review'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-neutral-300 pt-2 border-t border-neutral-800/80">
                  <span>Hub: {b.pickupHub}</span>
                  <span className="font-display font-bold text-amber-400">₹{b.pricePerDay}/day</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-neutral-900/40 border border-neutral-800 text-center space-y-2">
            <p className="text-xs text-neutral-400">
              You haven't listed any bikes yet. Earn money whenever your bike is parked on campus.
            </p>
            <button
              onClick={() => onNavigate('onboard')}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
            >
              List your bike now →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
