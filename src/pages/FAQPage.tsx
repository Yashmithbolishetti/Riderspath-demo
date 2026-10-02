import React, { useState } from 'react';
import { HelpCircle, ChevronDown, MapPin, Search, ShieldCheck } from 'lucide-react';

export const FAQPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Is Riders Path owned by the university or does it own the bikes?',
      a: 'No, Riders Path does not own the bikes. We are a peer-to-peer student mobility technology platform connecting ICFAI students who own bikes with verified ICFAI students who need rides. It is run exclusively for and by the student community.',
    },
    {
      q: 'Who is eligible to rent a bike on Riders Path?',
      a: 'Any currently enrolled student at ICFAI University Hyderabad (IBS, FST, FOL, etc.) who is 18+ years of age and possesses a valid Government Driving License.',
    },
    {
      q: 'Where do I collect and return the bike on campus?',
      a: 'Pickups and returns take place at designated ICFAI Campus Hubs: IBS Academic Block C Hub, Boys Hostel Zone 1, Girls Hostel Hub B, Sports Complex, and ICFAI Main Gate. The specific hub is displayed on each bike listing.',
    },
    {
      q: 'How does the security deposit work and when is it refunded?',
      a: 'A refundable security deposit (₹600 - ₹2,000 depending on bike class) is held during the booking. Upon returning the vehicle at the campus hub with the agreed fuel level and no new damages, the deposit is refunded immediately.',
    },
    {
      q: 'Are helmets provided with the rental?',
      a: 'Yes! Every bike booking on Riders Path includes at least one ISI-certified helmet provided by the bike owner during key handover. Wearing a helmet is mandatory under Telangana traffic laws and campus rules.',
    },
    {
      q: 'How can I list my own bike and start earning?',
      a: 'Click "List Your Bike" in the navigation bar. Fill in your ICFAI enrollment number, bike specifications (brand, model, registration number), upload photos and select your daily rate. Once verified by our campus team, your listing goes live.',
    },
    {
      q: 'What happens in case of a breakdown or emergency?',
      a: 'Contact the ICFAI Student Support Desk immediately via WhatsApp at +91 98490 21000. All bikes are required to have valid insurance and roadside contacts.',
    },
  ];

  const filteredFaqs = (faqs || []).filter(
    (f) =>
      f &&
      ((f.q || '').toLowerCase().includes(search.toLowerCase()) ||
        (f.a || '').toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-in fade-in duration-300">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs text-amber-400 font-mono">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>ICFAI Campus Knowledge Base</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-neutral-100">
          Frequently Asked Questions
        </h1>
        <p className="text-xs text-neutral-400">
          Everything you need to know about peer-to-peer bike rentals at ICFAI Hyderabad.
        </p>

        {/* Search */}
        <div className="relative max-w-md mx-auto pt-2">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search FAQs (e.g. deposit, license, helmets, hubs)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500/60"
          />
        </div>
      </div>

      {/* Campus Hubs Reference Banner */}
      <div className="p-6 rounded-3xl bg-neutral-900/90 border border-neutral-800 space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase text-amber-400">
          <MapPin className="w-4 h-4" />
          <span>Designated ICFAI Hyderabad Campus Pickup Hubs</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800/80">
            <span className="font-semibold text-neutral-200 block">IBS Academic Block Hub</span>
            <span className="text-[11px] text-neutral-400">Near Parking Zone C</span>
          </div>
          <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800/80">
            <span className="font-semibold text-neutral-200 block">Hostel Zone 1 & 2</span>
            <span className="text-[11px] text-neutral-400">Boys & Girls Quadrangle</span>
          </div>
          <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800/80">
            <span className="font-semibold text-neutral-200 block">Campus Main Gate</span>
            <span className="text-[11px] text-neutral-400">Security Gate 1 Reception</span>
          </div>
        </div>
      </div>

      {/* Accordion list */}
      <div className="space-y-3">
        {filteredFaqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl bg-neutral-900/80 border border-neutral-800 overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-display font-semibold text-sm text-neutral-200 hover:text-amber-400 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform ${
                    isOpen ? 'rotate-180 text-amber-400' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-xs text-neutral-400 leading-relaxed border-t border-neutral-800/50 pt-3 animate-in fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
