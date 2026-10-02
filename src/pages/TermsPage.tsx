import React, { useState, useEffect } from 'react';
import {
  Shield,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Scale,
  Search,
  Laptop,
  Clock,
  Car,
  FileCheck,
  UserCheck,
  AlertCircle,
  HelpCircle,
  Download,
  Printer,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { api } from '../services/api';
import { AdminConfig } from '../types';

export const TermsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [config, setConfig] = useState<AdminConfig | null>(null);
  const [activeSection, setActiveSection] = useState<string>('all');

  useEffect(() => {
    api.getConfig().then(setConfig).catch(console.error);
  }, []);

  const termsVersion = config?.termsVersion || 'v1.2-2026-AUG';
  const cancellationHours = config?.cancellationPolicy?.freeCancellationHours ?? 4;
  const cancellationFee = config?.cancellationPolicy?.cancellationFeePercent ?? 15;
  const lateGracePeriod = config?.lateReturnPolicy?.gracePeriodMinutes ?? 30;
  const hourlyLateFee = config?.lateReturnPolicy?.hourlyLateFee ?? 100;
  const speedLimit = config?.speedLimitKmph ?? 60;
  const laptopRequired = config?.laptopDepositRequired ?? true;

  const sections = [
    {
      id: 'core-intermediary',
      title: '1. Core Rental & Intermediary Model',
      icon: Shield,
      content: [
        'Riders Path operates solely as a peer-to-peer campus technology platform and intermediary connecting verified, eligible ICFAI University (IFHE) Hyderabad students who own two-wheelers with eligible ICFAI students seeking short-term rentals.',
        'Riders Path does not own, lease, or operate the vehicles listed on the platform. Vehicles are registered to and owned by student peers.',
        'Bike owners remain solely responsible for the accuracy of listing details, specifications, mechanical condition, and roadworthiness of their vehicles.',
        'Every renter entering into a booking contract does so with the registered bike owner, facilitated and coordinated by the Riders Path platform framework.',
        'Riders Path is an intermediary coordinating technology, identity validation workflows, and hub handovers; it is not a commercial transport operator or insurer.',
      ],
    },
    {
      id: 'eligibility-docs',
      title: '2. Student Eligibility & Verification Standards',
      icon: UserCheck,
      content: [
        'Every renter must satisfy platform eligibility: must be at least 18 years of age and an actively enrolled student at ICFAI University Hyderabad with a verified enrollment number.',
        'A valid, unexpired Government-issued Driving Licence (Permanent or valid class learner licence) is strictly mandatory for any vehicle reservation.',
        'Aadhaar document verification and active ICFAI student ID card verification are mandatory prior to ride clearance.',
        'The physical ICFAI student identity card and original driving licence must be presented to the campus hub coordinator or owner at the time of vehicle pickup.',
        'Providing falsified identity data, tampered documents, or using another individual\'s student credentials is a material violation resulting in immediate platform deactivation and administrative reporting.',
      ],
    },
    {
      id: 'security-deposit-laptop',
      title: '3. Security Deposit & Laptop Handover Procedure',
      icon: Laptop,
      content: [
        laptopRequired
          ? 'In accordance with ICFAI peer-to-peer trust protocol, a working student laptop is deposited in secure hub storage or with the vehicle custodian during the active rental period as a physical collateral guarantee.'
          : 'Security deposits are managed via authorized platform escrow and released upon verification.',
        'A monetary security deposit (standard ₹600 - ₹2,000 based on engine cc) is held during the booking.',
        'The physical laptop and monetary deposit will be returned in full promptly upon on-time return of the vehicle and satisfactory completion of the post-ride return inspection.',
        'The renter is strictly responsible for the vehicle, its components, keys, and accessories from the moment of handover until the formal return inspection is recorded.',
      ],
    },
    {
      id: 'traffic-fines-challans',
      title: '4. Traffic Fines, Challans & Statutory Violations',
      icon: AlertTriangle,
      content: [
        'Any traffic penalties, e-challans issued by Telangana State Police / Cyberabad Traffic Police, speeding infractions, parking fines, or statutory violations incurred during the rental period are the sole legal and financial responsibility of the renter.',
        'Riders Path and the vehicle owner are not responsible for moving violations or traffic fines caused by the renter\'s operation of the vehicle.',
        `Safe campus speed threshold is monitored at ${speedLimit} km/h on internal campus perimeters and surrounding arterial roads.`,
        'If a renter fails or refuses to settle a legitimate e-challan or traffic fine incurred during their rental window, Riders Path and/or the bike owner may pursue appropriate lawful remedies, including adjusting the amount from the security deposit and reporting the violation with timestamped booking records to university administration or statutory authorities where legally permitted.',
      ],
    },
    {
      id: 'damage-inspections',
      title: '5. Pre/Post Ride Inspections & Damage Resolution',
      icon: Car,
      content: [
        'The renter must return the vehicle in the exact condition in which it was received, subject only to reasonable normal wear and tear.',
        'The platform enforces an auditable inspection protocol:',
        '• Pickup Condition Record: Hub coordinator/owner documents initial odometer reading, fuel percentage, helmet issuance, and pre-rental vehicle photographs.',
        '• Return Condition Record: Post-ride inspection verifies odometer, fuel level, component integrity, and photographic evidence of any new scratch or impact.',
        'In the event of accidental damage, puncture, mechanical distress from misuse, or bodywork scratches occurring during the rental period, the repair assessment is recorded transparently.',
        'Legitimate repair costs will be deducted from the security deposit based on authorized service center estimates. If repair costs exceed the deposit, the renter remains responsible for settling genuine repair amounts according to applicable law and platform guidelines.',
      ],
    },
    {
      id: 'prohibited-uses',
      title: '6. Strict Use Restrictions & Prohibited Conduct',
      icon: Lock,
      content: [
        'Sub-renting, subletting, or handing over vehicle custody to any third party or non-verified friend is strictly forbidden.',
        'Allowing any individual without an approved driving licence to operate the vehicle is prohibited.',
        'Triple riding (carrying more than one pillion) is strictly prohibited under Motor Vehicles Act regulations.',
        'Riding under the influence of alcohol, narcotics, prescription sedatives, or intoxicants is strictly prohibited with zero tolerance.',
        'Engaging in street racing, stunt riding, off-road stunts, intentional over-revving, or aggressive mechanical abuse is strictly barred.',
        'Unauthorized modifications, dismantling of parts, or tampering with speedometers/electrical systems is prohibited.',
        'Using the vehicle for any unlawful or commercial cargo transport purposes is strictly banned.',
      ],
    },
    {
      id: 'cancellation-late-return',
      title: '7. Bookings, Cancellations & Late Return Policies',
      icon: Clock,
      content: [
        `Free Cancellation: Renters can cancel without fee up to ${cancellationHours} hours prior to scheduled pickup.`,
        `Late Cancellation: Cancellations made within ${cancellationHours} hours of pickup incur a ${cancellationFee}% administration fee to compensate owner preparation.`,
        'No-Show Policy: Failure to collect the vehicle within 60 minutes of the booked pickup time without prior notice allows the owner to release the vehicle, and the booking may be marked cancelled.',
        `Late Return Grace Period: A grace period of ${lateGracePeriod} minutes is provided for traffic contingencies.`,
        `Late Return Surcharge: Returns exceeding the grace period are charged at ₹${hourlyLateFee}/hour to protect subsequent student reservations.`,
        'Extension Requests: Must be submitted through the student dashboard before scheduled return time, subject to vehicle availability and approval.',
      ],
    },
    {
      id: 'owner-responsibilities',
      title: '8. Bike Owner Responsibilities & Standards',
      icon: FileCheck,
      content: [
        'The bike owner represents that they have full legal authority, valid RC (Registration Certificate), active third-party or comprehensive insurance, and valid PUC (Pollution Certificate) for the vehicle.',
        'The owner must disclose all known vehicle characteristics, quirks, or existing cosmetic marks truthfully prior to listing approval.',
        'The owner must maintain the vehicle in safe, roadworthy condition (proper tyre tread, functional brakes, headlights, indicators, and mirrors).',
        'The vehicle must be delivered clean and with at least 15% fuel reserve at the designated campus hub at the agreed time.',
        'All listings are reviewed and vetted by Riders Path administrators before becoming publicly bookable.',
      ],
    },
    {
      id: 'platform-limitations',
      title: '9. Platform Responsibilities & Operational Scope',
      icon: Scale,
      content: [
        'Riders Path provides software matching, booking scheduling, automated identity OCR verification workflows, and hub handover record-keeping.',
        'Riders Path does not guarantee absolute mechanical reliability of third-party vehicles, nor does it operate as an insurer against road accidents or third-party liabilities.',
        'While rigorous document checking tools (including AI Optical Verification) are utilized, the platform does not assume civil liability for deliberate fraudulent forgery committed by users beyond reasonable due diligence.',
        'Users are advised to exercise personal caution, wear protective gear at all times, and adhere strictly to Telangana traffic safety regulations.',
      ],
    },
    {
      id: 'privacy-data-protection',
      title: '10. Privacy, Personal Data & Document Safeguards',
      icon: Shield,
      content: [
        'Data Collected: Full name, ICFAI enrollment ID, mobile number, campus email, Aadhaar document, Driving Licence scan, and booking timestamps.',
        'Data Minimization: Riders Path collects only information essential for verifying student identity and campus accountability.',
        'Restricted Access: Sensitive identity documents (Aadhaar & DL images) are never exposed publicly, and are securely masked in administrative listings. Document access is restricted strictly to authorized verification personnel for safety audit purposes.',
        'Data Retention: Booking audit records and acceptance timestamps are securely retained for the duration required to ensure safety dispute resolution and campus compliance.',
      ],
    },
    {
      id: 'admin-controls-amendments',
      title: '11. Administrative Oversight & Policy Updates',
      icon: FileText,
      content: [
        'Riders Path administrators maintain real-time authority to adjust campus operational parameters, security deposit values, safety fees, hub locations, and verification criteria.',
        'All administrative interventions (listing approvals, status updates, fee reconciliations) are permanently logged in the immutable administrative action log.',
        'Any updates to these Terms & Conditions will be published with a revised version code. Continued usage of the service following policy updates constitutes acknowledgment of revised terms.',
      ],
    },
  ];

  const filteredSections = sections.filter((s) => {
    if (activeSection !== 'all' && s.id !== activeSection) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchesTitle = s.title.toLowerCase().includes(q);
    const matchesContent = s.content.some((c) => c.toLowerCase().includes(q));
    return matchesTitle || matchesContent;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs text-amber-400 font-mono">
          <Scale className="w-3.5 h-3.5" />
          <span>ICFAI University Hyderabad • Student Rental Code</span>
          <span className="px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 text-[10px] font-bold">
            {termsVersion}
          </span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-neutral-100 tracking-tight">
          Terms & Conditions
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
          Comprehensive operational rules, safety protocols, and mutual responsibilities governing peer-to-peer student mobility at ICFAI Foundation for Higher Education (IFHE), Hyderabad.
        </p>
      </div>

      {/* Prominent Legal Disclaimer Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-neutral-200 text-xs space-y-2 shadow-lg">
        <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Informational Notice & Legal Disclaimer</span>
        </div>
        <p className="text-neutral-300 leading-relaxed text-[11px] sm:text-xs">
          This document outlines the operational rules, marketplace standards, and peer-to-peer agreement for students participating in the Riders Path bike-sharing network at ICFAI Hyderabad. <strong>This document is provided for operational guidance and does not constitute formal legal counsel.</strong> Riders Path acts as a student technology facilitator and coordinator; all participants agree to adhere to applicable Motor Vehicles Act regulations and university conduct codes.
        </p>
      </div>

      {/* Search & Quick Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-neutral-900 border border-neutral-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search rules (e.g. 'challan', 'laptop', 'cancellation', 'helmet', 'deposit')..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500/60"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-xs text-neutral-400 hover:text-neutral-200"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => window.print()}
            className="px-3 py-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Rules</span>
          </button>
        </div>
      </div>

      {/* Table of Contents Pill Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-neutral-800/80">
        <button
          onClick={() => setActiveSection('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            activeSection === 'all'
              ? 'bg-amber-500 text-neutral-950'
              : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
          }`}
        >
          All 11 Sections
        </button>
        {sections.map((sec) => (
          <button
            key={sec.id}
            onClick={() => setActiveSection(sec.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeSection === sec.id
                ? 'bg-amber-500 text-neutral-950'
                : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
            }`}
          >
            {sec.title.split('.')[1]?.trim() || sec.title}
          </button>
        ))}
      </div>

      {/* Sections List */}
      <div className="space-y-6">
        {filteredSections.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-neutral-900 border border-neutral-800 space-y-2">
            <HelpCircle className="w-8 h-8 text-neutral-500 mx-auto" />
            <h3 className="font-semibold text-neutral-200 text-sm">No matching terms found</h3>
            <p className="text-xs text-neutral-400">
              Try searching with a different keyword like "deposit", "laptop", "licence", or "refund".
            </p>
          </div>
        ) : (
          filteredSections.map((section) => {
            const Icon = section.icon;
            return (
              <div
                key={section.id}
                id={section.id}
                className="p-6 sm:p-7 rounded-3xl bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700/80 transition-all space-y-4 shadow-xl"
              >
                <div className="flex items-center gap-3 border-b border-neutral-800 pb-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h2 className="font-display font-bold text-base sm:text-lg text-neutral-100">
                    {section.title}
                  </h2>
                </div>

                <div className="space-y-2.5 text-xs text-neutral-300 leading-relaxed pl-1 sm:pl-2">
                  {section.content.map((paragraph, idx) => (
                    <p
                      key={idx}
                      className={
                        paragraph.startsWith('•')
                          ? 'pl-4 font-mono text-[11px] text-amber-300/90'
                          : 'text-neutral-300'
                      }
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Auditable Acceptance Summary Box */}
      <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-neutral-100">
              Mandatory Acceptance & Digital Audit Logging
            </h3>
            <p className="text-[11px] text-neutral-400">
              Every booking explicitly logs User ID, Booking ID, Terms Version ({termsVersion}), and Acceptance Timestamp.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
            <span className="text-[10px] uppercase font-mono text-neutral-400 block">Terms Version</span>
            <span className="font-bold text-amber-400 font-mono">{termsVersion}</span>
          </div>
          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
            <span className="text-[10px] uppercase font-mono text-neutral-400 block">Campus Hub Deposit</span>
            <span className="font-bold text-neutral-200">
              {laptopRequired ? 'Physical Laptop + Deposit' : 'Standard Deposit Escrow'}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
            <span className="text-[10px] uppercase font-mono text-neutral-400 block">Cancellation Window</span>
            <span className="font-bold text-emerald-400 font-mono">
              Up to {cancellationHours}h prior to pickup
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

