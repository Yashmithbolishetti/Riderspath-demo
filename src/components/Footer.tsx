import React from 'react';
import { Compass, Shield, MapPin, Phone, Mail, FileCheck, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string, params?: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-neutral-950 border-t border-neutral-900 text-neutral-400 text-sm mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Purpose */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-neutral-950 font-black">
                <Compass className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="font-display font-black text-xl text-neutral-100 tracking-tight">
                RIDERS PATH
              </span>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed max-w-sm">
              Your ride. Your campus. Your path. A verified peer-to-peer student bike rental marketplace exclusively connecting ICFAI Hyderabad students with trusted, affordable rides.
            </p>
            <div className="p-3.5 rounded-xl bg-neutral-900/80 border border-neutral-800 text-xs text-neutral-400 space-y-1">
              <p className="font-semibold text-neutral-300 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Platform Intermediary Notice</span>
              </p>
              <p className="text-[11px] leading-normal text-neutral-400">
                Riders Path acts as a technology intermediary platform connecting ICFAI student bike owners with verified student renters. Riders Path does not own the vehicles listed on this platform.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-neutral-200 text-sm mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('bikes')}
                  className="hover:text-amber-400 transition-colors"
                >
                  All Available Bikes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('how-it-works')}
                  className="hover:text-amber-400 transition-colors"
                >
                  How Rental Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('onboard')}
                  className="hover:text-amber-400 text-amber-400/90 font-medium transition-colors"
                >
                  List Your Bike & Earn
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('faq')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Campus Pickup Hubs
                </button>
              </li>
            </ul>
          </div>

          {/* Guidelines & Safety */}
          <div>
            <h4 className="font-display font-semibold text-neutral-200 text-sm mb-4">
              Safety & Rules
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('terms')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('terms')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Security Deposit Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('terms')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Fuel & Damage Rules
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('faq')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Document Verification
                </button>
              </li>
            </ul>
          </div>

          {/* Campus Desk */}
          <div>
            <h4 className="font-display font-semibold text-neutral-200 text-sm mb-4">
              ICFAI Campus Hub
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2 text-neutral-400">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>ICFAI University (IFHE), Shankerpally Road, Donthanapally, Hyderabad, 501203</span>
              </li>
              <li className="flex items-center gap-2 text-neutral-400">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Campus Student Desk: +91 98490 21000</span>
              </li>
              <li className="flex items-center gap-2 text-neutral-400">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>support@riderspath.icfai</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 mt-10 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <p>© 2026 Riders Path. Built exclusively for ICFAI Hyderabad students.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Campus Verified Peer-to-Peer</span>
            </span>
            <button
              onClick={() => onNavigate('admin')}
              className="text-neutral-400 hover:text-neutral-400 font-mono text-[11px]"
            >
              Operations Login
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
