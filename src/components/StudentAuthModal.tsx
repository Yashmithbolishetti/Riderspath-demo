import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { EnrollmentNumberInput } from './EnrollmentNumberInput';
import { triggerHaptic } from '../utils/haptics';
import { X, ShieldCheck, UserCheck, Sparkles, ArrowRight } from 'lucide-react';

export const StudentAuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, loginStudent } = useAuth();
  const [fullName, setFullName] = useState('');
  const [enrollment, setEnrollment] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic('medium');

    if (!fullName.trim() || !enrollment.trim()) {
      setError('Please enter your full name and ICFAI enrollment number (Example: 26FMUCHH01XXXX)');
      triggerHaptic('error');
      return;
    }

    const cleanEnrollment = enrollment.trim().toUpperCase();
    if (cleanEnrollment.length < 10) {
      setError('ICFAI enrollment number must be at least 10 characters (Example: 26FMUCHH01XXXX)');
      triggerHaptic('error');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await loginStudent(
        fullName.trim(),
        cleanEnrollment,
        phone.trim() || '+91 98490 00000',
        email.trim() || `${cleanEnrollment.toLowerCase()}@student.icfaiuniversity.in`
      );
      triggerHaptic('success');
      closeAuthModal();
    } catch (err: any) {
      triggerHaptic('error');
      setError(err.message || 'Failed to authenticate student');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="student-auth-modal-card"
        className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden"
      >
        {/* Subtle accent glow */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-neutral-100">ICFAI Student Portal</h3>
              <p className="text-xs text-neutral-400">Riders Path • Hyderabad Campus</p>
            </div>
          </div>
          <button
            id="close-auth-modal-btn"
            onClick={closeAuthModal}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800/50 text-rose-300 text-xs font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Full Legal Name (as on ICFAI ID) <span className="text-amber-500">*</span>
            </label>
            <input
              id="student-fullname-input"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Arjun Varma"
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60 transition-colors"
            />
          </div>

          <EnrollmentNumberInput
            id="student-enrollment-input"
            value={enrollment}
            onChange={(val) => setEnrollment(val)}
            label="ICFAI Enrollment / Roll No."
            required
            showStatusBadge
            showHelpText
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                Phone Number (WhatsApp)
              </label>
              <input
                id="student-phone-input"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98490 12345"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                Student Email (Optional)
              </label>
              <input
                id="student-email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@icfaiuniversity.in"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60 transition-colors"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              id="student-auth-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 active:scale-95"
            >
              {loading ? (
                <span>Verifying Student Access...</span>
              ) : (
                <>
                  <span>Enter Student Marketplace</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
