import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { hourlyToDaily, dailyToHourly, PRICING_HELPER_TEXT } from '../utils/pricing';
import { triggerHaptic } from '../utils/haptics';
import { EnrollmentNumberInput } from '../components/EnrollmentNumberInput';
import {
  PlusCircle,
  ShieldCheck,
  Upload,
  CheckCircle2,
  DollarSign,
  MapPin,
  Sparkles,
  ArrowRight,
  Info,
  Calendar,
  AlertCircle,
  Clock,
} from 'lucide-react';

interface OwnerOnboardingPageProps {
  onSuccess: () => void;
  onNavigate: (view: string) => void;
}

export const OwnerOnboardingPage: React.FC<OwnerOnboardingPageProps> = ({
  onSuccess,
  onNavigate,
}) => {
  const { studentUser, showToast } = useAuth();

  // Earnings Calculator
  const [calcPrice, setCalcPrice] = useState(550);
  const [calcDays, setCalcDays] = useState(14);
  const estimatedEarnings = Math.round(calcPrice * calcDays * 0.92); // 92% to student owner

  // Form State
  const [ownerName, setOwnerName] = useState(studentUser?.fullName || '');
  const [ownerEnrollment, setOwnerEnrollment] = useState(
    studentUser?.icfaiEnrollmentNumber || ''
  );
  const [ownerPhone, setOwnerPhone] = useState(studentUser?.phone || '');
  const [ownerEmail, setOwnerEmail] = useState(studentUser?.email || '');

  // Bike Details
  const [brand, setBrand] = useState('Royal Enfield');
  const [model, setModel] = useState('');
  const [year, setYear] = useState(2023);
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [bikeType, setBikeType] = useState('Cruiser');
  const [fuelType, setFuelType] = useState('Petrol');
  const [transmission, setTransmission] = useState('Manual');
  const [cc, setCc] = useState<number>(350);
  const [mileage, setMileage] = useState('35 km/l');
  const [pickupHub, setPickupHub] = useState('IBS Academic Block Hub');

  // Pricing State
  const [pricePerDay, setPricePerDay] = useState<number>(550);
  const [pricePerHour, setPricePerHour] = useState<number>(23);
  const [securityDeposit, setSecurityDeposit] = useState<number>(1000);
  const [description, setDescription] = useState('');
  const [helmetsIncluded, setHelmetsIncluded] = useState<number>(1);

  // Photos
  const [images, setImages] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Bidirectional Pricing Handlers
  const handleDailyPriceChange = (valStr: string) => {
    const val = Number(valStr);
    if (isNaN(val)) {
      setPricePerDay(0);
      setPricePerHour(0);
      return;
    }
    setPricePerDay(val);
    setPricePerHour(dailyToHourly(val));
  };

  const handleHourlyPriceChange = (valStr: string) => {
    const val = Number(valStr);
    if (isNaN(val)) {
      setPricePerHour(0);
      setPricePerDay(0);
      return;
    }
    setPricePerHour(val);
    setPricePerDay(hourlyToDaily(val));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            setImages((prev) => [...prev, reader.result as string]);
            triggerHaptic('light');
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const removeImage = (index: number) => {
    triggerHaptic('warning');
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic('medium');

    if (!ownerName.trim()) {
      setError('Please provide your full name.');
      triggerHaptic('error');
      return;
    }

    if (!ownerEnrollment.trim() || ownerEnrollment.trim().length < 10) {
      setError('Please provide a valid ICFAI enrollment number (Example: 26FMUCHH01XXXX).');
      triggerHaptic('error');
      return;
    }

    if (!model.trim()) {
      setError('Please provide your bike model (e.g., Hunter 350, MT-15, Activa 6G).');
      triggerHaptic('error');
      return;
    }

    if (!registrationNumber.trim()) {
      setError('Please provide your vehicle registration number (e.g., TS 08 FG 4821).');
      triggerHaptic('error');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const res = await api.submitOwnerOnboarding({
        fullName: ownerName.trim(),
        ownerName: ownerName.trim(),
        icfaiEnrollmentNumber: ownerEnrollment.trim().toUpperCase(),
        ownerEnrollment: ownerEnrollment.trim().toUpperCase(),
        phone: ownerPhone.trim() || '+91 98490 00000',
        ownerPhone: ownerPhone.trim() || '+91 98490 00000',
        email: ownerEmail.trim() || `${ownerEnrollment.trim().toLowerCase()}@student.icfaiuniversity.in`,
        ownerEmail: ownerEmail.trim() || `${ownerEnrollment.trim().toLowerCase()}@student.icfaiuniversity.in`,
        brand,
        model: model.trim(),
        year: Number(year) || 2023,
        registrationNumber: registrationNumber.trim().toUpperCase(),
        bikeType,
        fuelType,
        transmission,
        pickupHub,
        pricePerDay: Number(pricePerDay) || 550,
        pricePerHour: Number(pricePerHour) || dailyToHourly(Number(pricePerDay) || 550),
        securityDeposit: Number(securityDeposit) || 1000,
        description: description.trim() || `Well maintained student ride parked at ${pickupHub}. Clean engine and smooth brakes.`,
        images: images.length > 0 ? images : undefined,
        specs: {
          cc: Number(cc) || 150,
          mileage,
          helmetsIncluded: Number(helmetsIncluded) || 1,
        },
      });

      triggerHaptic('success');
      setSubmittedSuccess(true);
      showToast(res.message || 'Bike submitted successfully! Pending admin approval.', 'success');
      onSuccess();
    } catch (err: any) {
      triggerHaptic('error');
      setError(err.message || 'Failed to submit bike listing');
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6 animate-in zoom-in-95">
        <div className="w-16 h-16 rounded-2xl bg-amber-500 flex items-center justify-center text-neutral-950 mx-auto font-black shadow-lg shadow-amber-500/20">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase text-amber-400 font-bold">
            Listing Pending Admin Approval
          </span>
          <h1 className="font-display font-extrabold text-3xl text-neutral-100">
            Bike Submitted Successfully
          </h1>
          <p className="text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
            Thank you, {ownerName}. Your {brand} {model} ({registrationNumber}) is now pending admin approval. The ICFAI campus team will verify your vehicle and student details before activating it in the fleet catalog.
          </p>
        </div>

        <div className="pt-4 flex items-center justify-center gap-3">
          <button
            onClick={() => onNavigate('bikes')}
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-colors shadow-md shadow-amber-500/20"
          >
            Browse Campus Fleet
          </button>
          <button
            onClick={() => {
              setSubmittedSuccess(false);
              setModel('');
              setRegistrationNumber('');
              setImages([]);
            }}
            className="px-6 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 font-semibold text-xs transition-colors"
          >
            List Another Bike
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 animate-in fade-in duration-300">
      {/* Page Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900 border border-amber-500/30 text-xs font-semibold text-amber-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Student Owner Collective • ICFAI Hyderabad</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-neutral-100">
          Earn from your bike while you study.
        </h1>
        <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
          Riders Path does not own bikes. We empower ICFAI students to safely rent their parked vehicles to verified campus peers with zero brokerage and total deposit security.
        </p>
      </div>

      {/* Interactive Monthly Earnings Calculator */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
                Student Host Calculator
              </span>
              <h2 className="font-display font-bold text-2xl text-neutral-100 mt-1">
                Estimate Your Monthly Income
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Adjust your daily rental rate and number of days your bike is available on campus.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-medium text-neutral-300 mb-1.5">
                  <span>Daily Rate:</span>
                  <span className="text-amber-400 font-mono font-bold">₹{calcPrice} / day</span>
                </div>
                <input
                  type="range"
                  min="350"
                  max="1200"
                  step="25"
                  value={calcPrice}
                  onChange={(e) => setCalcPrice(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-neutral-300 mb-1.5">
                  <span>Days Rented Per Month:</span>
                  <span className="text-amber-400 font-mono font-bold">{calcDays} Days</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="28"
                  step="1"
                  value={calcDays}
                  onChange={(e) => setCalcDays(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 rounded-2xl bg-neutral-950 border border-neutral-800 text-center space-y-3">
            <span className="text-xs text-neutral-400 uppercase tracking-wider font-mono">
              Estimated Net Payout
            </span>
            <div className="font-display font-extrabold text-4xl text-amber-400">
              ₹{estimatedEarnings.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-neutral-400 leading-normal">
              Direct student-to-student handover. Security deposit held by platform to protect against fuel/damages.
            </p>
          </div>
        </div>
      </div>

      {/* Bike Listing Form */}
      <div className="p-6 sm:p-10 rounded-3xl bg-neutral-900/90 border border-neutral-800 space-y-8">
        <div className="border-b border-neutral-800 pb-4">
          <h2 className="font-display font-bold text-2xl text-neutral-100">
            List Your Bike on Campus
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Provide your vehicle specifics. All listings are verified by ICFAI student coordinators.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800/60 text-rose-200 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Owner Identity */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-base text-amber-400">
              1. Student Owner Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Your Full Name <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="e.g. Arjun Varma"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-neutral-100 focus:outline-none focus:border-amber-500/60"
                />
              </div>

              <div>
                <EnrollmentNumberInput
                  id="owner-enrollment-field"
                  value={ownerEnrollment}
                  onChange={(val) => setOwnerEnrollment(val)}
                  label="ICFAI Enrollment No."
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  WhatsApp Contact <span className="text-amber-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={ownerPhone}
                  onChange={(e) => setOwnerPhone(e.target.value)}
                  placeholder="+91 98490 12345"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-neutral-100 focus:outline-none focus:border-amber-500/60"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Campus Pickup Hub <span className="text-amber-500">*</span>
                </label>
                <select
                  value={pickupHub}
                  onChange={(e) => setPickupHub(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-neutral-200 focus:outline-none focus:border-amber-500/60"
                >
                  <option value="IBS Academic Block Hub">IBS Academic Block Hub</option>
                  <option value="Boys Hostel Zone 1">Boys Hostel Zone 1</option>
                  <option value="Girls Hostel Hub B">Girls Hostel Hub B</option>
                  <option value="ICFAI Campus Main Gate">ICFAI Campus Main Gate</option>
                  <option value="Sports Arena Hub">Sports Arena Hub</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Bike Specifications */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-base text-amber-400">
              2. Vehicle Specifications
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Brand <span className="text-amber-500">*</span>
                </label>
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-neutral-200 focus:outline-none focus:border-amber-500/60"
                >
                  <option value="Royal Enfield">Royal Enfield</option>
                  <option value="Yamaha">Yamaha</option>
                  <option value="KTM">KTM</option>
                  <option value="Honda">Honda</option>
                  <option value="TVS">TVS</option>
                  <option value="Bajaj">Bajaj</option>
                  <option value="Ather">Ather</option>
                  <option value="Ola">Ola</option>
                  <option value="Hero">Hero</option>
                  <option value="Suzuki">Suzuki</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Model <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. Hunter 350, MT-15, Activa 6G"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-neutral-100 focus:outline-none focus:border-amber-500/60"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Year of Manufacture <span className="text-amber-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="2016"
                  max="2026"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-neutral-100 focus:outline-none focus:border-amber-500/60"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Registration Number <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value.toUpperCase())}
                  placeholder="e.g. TS 07 EK 9210"
                  className="w-full px-3.5 py-2.5 font-mono uppercase rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-neutral-100 focus:outline-none focus:border-amber-500/60"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Category
                </label>
                <select
                  value={bikeType}
                  onChange={(e) => setBikeType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-neutral-200 focus:outline-none focus:border-amber-500/60"
                >
                  <option value="Cruiser">Cruiser</option>
                  <option value="Street">Street Fighter</option>
                  <option value="Sport">Sport</option>
                  <option value="Electric">Electric EV</option>
                  <option value="Scooter">Scooter / Moped</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Fuel Type
                </label>
                <select
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-neutral-200 focus:outline-none focus:border-amber-500/60"
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Electric">Electric</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Transmission
                </label>
                <select
                  value={transmission}
                  onChange={(e) => setTransmission(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-neutral-200 focus:outline-none focus:border-amber-500/60"
                >
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Engine CC
                </label>
                <input
                  type="number"
                  value={cc}
                  onChange={(e) => setCc(Number(e.target.value))}
                  placeholder="e.g. 150, 350"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-neutral-100 focus:outline-none focus:border-amber-500/60"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Pricing & Deposit (With Bidirectional Sync) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-base text-amber-400">
                3. Pricing & Security Deposit
              </h3>
              <span className="text-[10px] font-mono text-amber-400">1 Day = 24 Hours Sync</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Daily Rental Rate (₹) <span className="text-amber-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="200"
                  max="2000"
                  value={pricePerDay || ''}
                  onChange={(e) => handleDailyPriceChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-neutral-100 font-mono focus:outline-none focus:border-amber-500/60"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Hourly Rate (₹)
                </label>
                <input
                  type="number"
                  min="10"
                  max="300"
                  value={pricePerHour || ''}
                  onChange={(e) => handleHourlyPriceChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-neutral-100 font-mono focus:outline-none focus:border-amber-500/60"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Refundable Security Deposit (₹) <span className="text-amber-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="500"
                  max="5000"
                  value={securityDeposit}
                  onChange={(e) => setSecurityDeposit(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-neutral-100 font-mono focus:outline-none focus:border-amber-500/60"
                />
              </div>
            </div>
            <p className="text-[11px] text-neutral-400">
              {PRICING_HELPER_TEXT}
            </p>
          </div>

          {/* Section 4: Vehicle Photos Upload */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-base text-amber-400">
              4. Bike Photos
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative h-28 rounded-xl overflow-hidden border border-neutral-800 group">
                  <img src={img} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}

              <label className="border-2 border-dashed border-neutral-800 hover:border-amber-500/50 rounded-xl h-28 flex flex-col items-center justify-center cursor-pointer transition-colors text-center p-2 bg-neutral-950">
                <Upload className="w-5 h-5 text-neutral-400 mb-1" />
                <span className="text-xs text-neutral-300 font-medium">Add Photos</span>
                <span className="text-[10px] text-neutral-400">Front, side, cluster</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-neutral-400 max-w-sm">
              By listing, you agree to keep the bike fueled & in good running condition for fellow ICFAI students.
            </p>
            <button
              id="submit-owner-listing-btn"
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xl shadow-amber-500/20 disabled:opacity-50 active:scale-95"
            >
              {submitting ? (
                <span>Submitting for Verification...</span>
              ) : (
                <>
                  <span>Submit Bike for Listing</span>
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
