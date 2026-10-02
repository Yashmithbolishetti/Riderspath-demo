import React from 'react';
import {
  Compass,
  Key,
  ShieldCheck,
  Zap,
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Laptop,
} from 'lucide-react';

interface HowItWorksPageProps {
  onNavigate: (view: string) => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900 border border-amber-500/30 text-xs text-amber-400 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span>ICFAI Campus Mobility Protocol</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-neutral-100">
          How Riders Path Works
        </h1>
        <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
          A step-by-step breakdown of how ICFAI students rent bikes and how student owners safely earn from idle rides.
        </p>
      </div>

      {/* Renter Guide */}
      <div className="space-y-8">
        <div className="border-b border-neutral-800 pb-4">
          <span className="text-xs font-mono uppercase text-amber-400 font-bold">Guide for Student Renters</span>
          <h2 className="font-display font-bold text-2xl text-neutral-100 mt-1">
            Renting a Bike on Campus
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl glass-card space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-neutral-950 flex items-center justify-center font-display font-bold text-sm">
                1
              </div>
              <h3 className="font-display font-bold text-neutral-100 text-base">
                Discover Verified Bikes
              </h3>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Explore the real-time campus fleet filtered by model, price, transmission, or pickup hub (IBS block, Boys hostels, Girls hostels, Main gate).
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-card space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-neutral-950 flex items-center justify-center font-display font-bold text-sm">
                2
              </div>
              <h3 className="font-display font-bold text-neutral-100 text-base">
                Student Verification & Terms
              </h3>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Upload your valid Government Driving License and ICFAI student ID card. Accept the transparent student rental terms & conditions.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-card space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-neutral-950 flex items-center justify-center font-display font-bold text-sm">
                3
              </div>
              <h3 className="font-display font-bold text-neutral-100 text-base">
                Laptop Collateral & Handover
              </h3>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Meet your student peer host at the campus hub. Provide your physical laptop collateral & ID, inspect the odometer, collect keys and the ISI helmet.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-card space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-neutral-950 flex items-center justify-center font-display font-bold text-sm">
                4
              </div>
              <h3 className="font-display font-bold text-neutral-100 text-base">
                Campus Return & Deposit Refund
              </h3>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Return the bike on time at the designated campus hub. After quick inspection with your student host, your laptop collateral and deposit are returned immediately.
            </p>
          </div>
        </div>
      </div>

      {/* Owner Guide */}
      <div className="space-y-8">
        <div className="border-b border-neutral-800 pb-4">
          <span className="text-xs font-mono uppercase text-amber-400 font-bold">Guide for Student Owners</span>
          <h2 className="font-display font-bold text-2xl text-neutral-100 mt-1">
            Listing Your Bike as a Host
          </h2>
        </div>

        <div className="p-8 rounded-3xl glass-panel-elevated space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-neutral-300">
            <div className="space-y-2">
              <span className="font-display font-bold text-amber-400 text-sm block">1. You Set The Rules</span>
              <p className="text-neutral-400 leading-relaxed">
                Choose your daily price, preferred campus pickup location, and specific days you want to make your bike available.
              </p>
            </div>
            <div className="space-y-2">
              <span className="font-display font-bold text-amber-400 text-sm block">2. Verified ICFAI Peers</span>
              <p className="text-neutral-400 leading-relaxed">
                Only verified ICFAI students with active enrollment numbers and verified driving licenses can request your ride.
              </p>
            </div>
            <div className="space-y-2">
              <span className="font-display font-bold text-amber-400 text-sm block">3. Collateral & Deposit</span>
              <p className="text-neutral-400 leading-relaxed">
                Protected by physical laptop collateral held during rental and upfront security deposit managed through the platform.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-display font-bold text-neutral-100 text-sm">Have a bike parked on campus?</h4>
              <p className="text-xs text-neutral-400">List it in under 3 minutes and start earning this week.</p>
            </div>
            <button
              onClick={() => onNavigate('onboard')}
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20 active:scale-98"
            >
              <span>List Your Bike Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

