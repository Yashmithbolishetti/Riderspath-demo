import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Send,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { showToast } = useAuth();
  const [name, setName] = useState('');
  const [enrollment, setEnrollment] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Campus inquiry sent to Riders Path team!', 'success');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-in fade-in duration-300">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs text-amber-400 font-mono">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>ICFAI Campus Support Desk</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-neutral-100">
          Get in Touch With Us
        </h1>
        <p className="text-xs text-neutral-400">
          Have questions about a bike listing, booking clearance, or student verification? Reach our campus team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Info */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl glass-panel-elevated space-y-6">
            <h3 className="font-display font-bold text-lg text-neutral-100">
              Campus Coordinator Desk
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-neutral-200 block">Campus Desk Location</span>
                  <p className="text-neutral-400 text-[11px] mt-0.5">
                    Student Activities Centre (SAC), Near IBS Block, ICFAI University Hyderabad, Donthanapally, Shankarapalli Road.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-neutral-200 block">Student Helpline & WhatsApp</span>
                  <p className="text-neutral-400 text-[11px] mt-0.5 font-mono">+91 98490 21000 / +91 94400 88210</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-neutral-200 block">Email Support</span>
                  <p className="text-neutral-400 text-[11px] mt-0.5 font-mono">support@riderspath.icfai</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-neutral-200 block">Active Operating Hours</span>
                  <p className="text-neutral-400 text-[11px] mt-0.5">7:00 AM - 10:30 PM (All 7 Days)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-400/90 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 shrink-0 text-amber-400" />
            <span>Emergency 24/7 Breakdown Assistance available for active campus rides.</span>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl glass-card space-y-6">
          <h3 className="font-display font-bold text-lg text-neutral-100">
            Send a Message to Campus Desk
          </h3>

          {submitted ? (
            <div className="p-8 rounded-2xl bg-neutral-950 border border-emerald-500/30 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h4 className="font-display font-bold text-neutral-100 text-base">
                Message Received!
              </h4>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                An ICFAI campus coordinator will respond to your WhatsApp/Email within 15 minutes.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Your Name <span className="text-amber-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Arjun Varma"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 focus:outline-none focus:border-amber-500/60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    ICFAI Enrollment No.
                  </label>
                  <input
                    type="text"
                    value={enrollment}
                    onChange={(e) => setEnrollment(e.target.value.toUpperCase())}
                    placeholder="23BCS108"
                    className="w-full px-3.5 py-2.5 font-mono uppercase rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 focus:outline-none focus:border-amber-500/60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Subject / Reason <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Booking assistance, Listing query, Deposit inquiry"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 focus:outline-none focus:border-amber-500/60"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Message Details <span className="text-amber-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your inquiry..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 focus:outline-none focus:border-amber-500/60"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20"
              >
                <Send className="w-4 h-4" />
                <span>Send Campus Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
