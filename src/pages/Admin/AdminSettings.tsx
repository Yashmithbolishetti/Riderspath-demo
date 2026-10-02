import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { AdminConfig, PickupLocation } from '../../types';
import { Settings, Lock, ShieldCheck, MapPin, Save, Plus, Edit2, Trash2, CheckCircle2, AlertCircle, Clock, Phone } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { showToast } = useAuth();
  const [config, setConfig] = useState<AdminConfig | null>(null);
  const [pickupLocations, setPickupLocations] = useState<PickupLocation[]>([]);
  const [loading, setLoading] = useState(true);

  // Password change state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState('');

  // Config fields
  const [platformFee, setPlatformFee] = useState(8);
  const [defaultDeposit, setDefaultDeposit] = useState(1000);

  // Policy & Terms fields
  const [termsVersion, setTermsVersion] = useState('v1.2-2026-AUG');
  const [freeCancellationHours, setFreeCancellationHours] = useState(6);
  const [cancellationFeePercent, setCancellationFeePercent] = useState(30);
  const [gracePeriodMinutes, setGracePeriodMinutes] = useState(30);
  const [hourlyLateFee, setHourlyLateFee] = useState(50);
  const [trafficFineHandlingFee, setTrafficFineHandlingFee] = useState(100);

  // Pickup Location Modal State
  const [showLocModal, setShowLocModal] = useState(false);
  const [editingLoc, setEditingLoc] = useState<PickupLocation | null>(null);
  const [locName, setLocName] = useState('');
  const [locCode, setLocCode] = useState('');
  const [locLandmark, setLocLandmark] = useState('');
  const [locHours, setLocHours] = useState('07:00 AM - 10:30 PM (Daily)');
  const [locPhone, setLocPhone] = useState('+91 91210 98765');
  const [locActive, setLocActive] = useState(true);
  const [locSaving, setLocSaving] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [configData, locsData] = await Promise.all([
        api.getConfig(),
        api.adminGetPickupLocations().catch(() => [])
      ]);

      setConfig(configData);
      setPickupLocations(locsData);
      setPlatformFee(configData.platformFeePercent || 8);
      setDefaultDeposit(configData.defaultSecurityDeposit || 1000);
      if (configData.termsVersion) setTermsVersion(configData.termsVersion);
      if (configData.cancellationPolicy) {
        setFreeCancellationHours(configData.cancellationPolicy.freeCancellationHours || 6);
        setCancellationFeePercent(configData.cancellationPolicy.cancellationFeePercent || 30);
      }
      if (configData.lateReturnPolicy) {
        setGracePeriodMinutes(configData.lateReturnPolicy.gracePeriodMinutes || 30);
        setHourlyLateFee(configData.lateReturnPolicy.hourlyLateFee || 50);
      }
      if (configData.trafficFineHandlingFee) {
        setTrafficFineHandlingFee(configData.trafficFineHandlingFee);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPwError('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setPwError('Password must be at least 6 characters long');
      return;
    }

    try {
      setPwLoading(true);
      setPwError('');
      await api.adminChangePassword(oldPassword, newPassword);
      showToast('Admin password updated securely!', 'success');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPwError(err.message || 'Failed to update password');
    } finally {
      setPwLoading(false);
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await api.updateConfig({
        platformFeePercent: Number(platformFee),
        defaultSecurityDeposit: Number(defaultDeposit),
        termsVersion: termsVersion.trim() || 'v1.2-2026-AUG',
        cancellationPolicy: {
          freeCancellationHours: Number(freeCancellationHours),
          cancellationFeePercent: Number(cancellationFeePercent),
          refundProcessingDays: 2,
        },
        lateReturnPolicy: {
          gracePeriodMinutes: Number(gracePeriodMinutes),
          hourlyLateFee: Number(hourlyLateFee),
          maxLatePenaltyPerDay: 600,
        },
        trafficFineHandlingFee: Number(trafficFineHandlingFee),
      });

      setConfig(updated);
      showToast('Campus policies & fee structure saved!', 'success');
    } catch (err: any) {
      showToast('Failed to save config', 'error');
    }
  };

  const openAddLocModal = () => {
    setEditingLoc(null);
    setLocName('');
    setLocCode('');
    setLocLandmark('');
    setLocHours('07:00 AM - 10:30 PM (Daily)');
    setLocPhone('+91 91210 98765');
    setLocActive(true);
    setShowLocModal(true);
  };

  const openEditLocModal = (loc: PickupLocation) => {
    setEditingLoc(loc);
    setLocName(loc.name);
    setLocCode(loc.hubCode);
    setLocLandmark(loc.landmark || '');
    setLocHours(loc.operatingHours || '07:00 AM - 10:30 PM (Daily)');
    setLocPhone(loc.contactPhone || '+91 91210 98765');
    setLocActive(loc.isActive);
    setShowLocModal(true);
  };

  const handleSaveLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!locName.trim()) {
      showToast('Hub name is required', 'error');
      return;
    }

    try {
      setLocSaving(true);
      if (editingLoc) {
        const updated = await api.adminUpdatePickupLocation(editingLoc.id, {
          name: locName.trim(),
          hubCode: (locCode || locName.slice(0, 4)).toUpperCase().replace(/[^A-Z0-9]/g, ''),
          landmark: locLandmark.trim(),
          operatingHours: locHours.trim(),
          contactPhone: locPhone.trim(),
          isActive: locActive
        });
        setPickupLocations((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
        showToast('Pickup location updated successfully', 'success');
      } else {
        const created = await api.adminCreatePickupLocation({
          name: locName.trim(),
          hubCode: (locCode || locName.slice(0, 4)).toUpperCase().replace(/[^A-Z0-9]/g, ''),
          landmark: locLandmark.trim(),
          operatingHours: locHours.trim(),
          contactPhone: locPhone.trim(),
          isActive: locActive,
          displayOrder: pickupLocations.length + 1
        });
        setPickupLocations((prev) => [...prev, created]);
        showToast('New campus pickup hub added', 'success');
      }
      setShowLocModal(false);
    } catch (err: any) {
      showToast(err.message || 'Failed to save location', 'error');
    } finally {
      setLocSaving(false);
    }
  };

  const handleDeleteLocation = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove the pickup hub "${name}"?`)) return;
    try {
      await api.adminDeletePickupLocation(id);
      setPickupLocations((prev) => prev.filter((l) => l.id !== id));
      showToast('Pickup location removed', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete location', 'error');
    }
  };

  const handleToggleLocActive = async (loc: PickupLocation) => {
    try {
      const updated = await api.adminUpdatePickupLocation(loc.id, { isActive: !loc.isActive });
      setPickupLocations((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
      showToast(`Hub marked as ${updated.isActive ? 'Active' : 'Inactive'}`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to toggle status', 'error');
    }
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in pb-12">
      <div>
        <h2 className="font-display font-bold text-2xl text-neutral-100">
          Campus Operations & Security Settings
        </h2>
        <p className="text-xs text-neutral-400">
          Single Source of Truth: All modifications dynamically apply across public bike browsing, booking hubs, and student listings.
        </p>
      </div>

      {/* Dynamic Campus Pickup Hubs */}
      <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-neutral-100">
                Dynamic Campus Pickup Hubs
              </h3>
              <p className="text-xs text-neutral-400">
                Managed from database. Reflected in public bike checkout and owner onboarding immediately.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={openAddLocModal}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Pickup Hub</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pickupLocations.map((loc) => (
            <div
              key={loc.id}
              className={`p-4 rounded-2xl border transition-all ${
                loc.isActive
                  ? 'bg-neutral-950/80 border-neutral-800 hover:border-neutral-700'
                  : 'bg-neutral-950/40 border-neutral-850 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-neutral-800 text-amber-400">
                      {loc.hubCode}
                    </span>
                    <h4 className="font-bold text-neutral-100 text-xs">{loc.name}</h4>
                  </div>
                  {loc.landmark && (
                    <p className="text-[11px] text-neutral-400 mt-1">Landmark: {loc.landmark}</p>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleToggleLocActive(loc)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                      loc.isActive
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                    }`}
                  >
                    {loc.isActive ? 'Active' : 'Disabled'}
                  </button>
                  <button
                    onClick={() => openEditLocModal(loc)}
                    className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                    title="Edit Location"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteLocation(loc.id, loc.name)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                    title="Delete Location"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-neutral-850 flex flex-wrap items-center justify-between text-[10px] text-neutral-400 gap-2">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-neutral-500" />
                  {loc.operatingHours || '07:00 AM - 10:30 PM'}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-neutral-500" />
                  {loc.contactPhone || 'Hub Desk'}
                </span>
              </div>
            </div>
          ))}

          {pickupLocations.length === 0 && (
            <div className="col-span-full p-8 text-center rounded-2xl bg-neutral-950 border border-neutral-800 text-neutral-500 text-xs">
              No pickup locations found. Click &quot;Add Pickup Hub&quot; above to initialize.
            </div>
          )}
        </div>
      </div>

      {/* Password Management */}
      <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-5">
        <div className="flex items-center gap-3 border-b border-neutral-800 pb-4">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-neutral-100">
              Update Administrator Access Key
            </h3>
            <p className="text-xs text-neutral-400">
              Passwords are salted and cryptographically hashed on the secure backend.
            </p>
          </div>
        </div>

        {pwError && (
          <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/60 text-rose-200 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{pwError}</span>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Current Password
            </label>
            <input
              type="password"
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 focus:outline-none focus:border-amber-500/60 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">New Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 focus:outline-none focus:border-amber-500/60 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 focus:outline-none focus:border-amber-500/60 font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={pwLoading}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-amber-500/20 disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{pwLoading ? 'Updating Hash...' : 'Update Password'}</span>
          </button>
        </form>
      </div>

      {/* Platform & Policy Config */}
      <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-5">
        <div className="flex items-center gap-3 border-b border-neutral-800 pb-4">
          <div className="w-9 h-9 rounded-xl bg-neutral-800 flex items-center justify-center text-neutral-200">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-neutral-100">
              Campus Marketplace Configuration & Policies
            </h3>
            <p className="text-xs text-neutral-400">
              Control marketplace fees, deposit defaults, and cancellation/late return rules.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveConfig} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Platform Safety Fee (%)
              </label>
              <input
                type="number"
                min="0"
                max="25"
                value={platformFee}
                onChange={(e) => setPlatformFee(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 focus:outline-none focus:border-amber-500/60"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Default Security Deposit (₹)
              </label>
              <input
                type="number"
                min="500"
                max="5000"
                value={defaultDeposit}
                onChange={(e) => setDefaultDeposit(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 focus:outline-none focus:border-amber-500/60"
              />
            </div>
          </div>

          {/* Terms & Policies Controls */}
          <div className="pt-4 border-t border-neutral-800 space-y-4">
            <h4 className="font-semibold text-neutral-200 text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Terms & Conditions and Operational Policies</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-medium text-neutral-300 mb-1">
                  Active Terms Version
                </label>
                <input
                  type="text"
                  value={termsVersion}
                  onChange={(e) => setTermsVersion(e.target.value)}
                  placeholder="v1.2-2026-AUG"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 focus:outline-none focus:border-amber-500/60 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-300 mb-1">
                  Free Cancellation Window (Hours)
                </label>
                <input
                  type="number"
                  min="1"
                  max="48"
                  value={freeCancellationHours}
                  onChange={(e) => setFreeCancellationHours(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 focus:outline-none focus:border-amber-500/60"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-300 mb-1">
                  Late Cancellation Fee (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={cancellationFeePercent}
                  onChange={(e) => setCancellationFeePercent(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 focus:outline-none focus:border-amber-500/60"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-medium text-neutral-300 mb-1">
                  Late Return Grace Period (Minutes)
                </label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={gracePeriodMinutes}
                  onChange={(e) => setGracePeriodMinutes(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 focus:outline-none focus:border-amber-500/60"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-300 mb-1">
                  Hourly Late Return Fee (₹/hr)
                </label>
                <input
                  type="number"
                  min="0"
                  max="500"
                  value={hourlyLateFee}
                  onChange={(e) => setHourlyLateFee(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 focus:outline-none focus:border-amber-500/60"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-300 mb-1">
                  Late Challan Handling Fee (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  max="1000"
                  value={trafficFineHandlingFee}
                  onChange={(e) => setTrafficFineHandlingFee(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 focus:outline-none focus:border-amber-500/60"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-neutral-100 hover:bg-white text-neutral-950 font-bold text-xs flex items-center gap-2 transition-all shadow"
          >
            <Save className="w-4 h-4" />
            <span>Save Policies & Marketplace Settings</span>
          </button>
        </form>
      </div>

      {/* Pickup Location Add/Edit Modal */}
      {showLocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <h3 className="font-display font-bold text-base text-neutral-100">
                {editingLoc ? 'Edit Pickup Hub' : 'Add Campus Pickup Hub'}
              </h3>
              <button
                type="button"
                onClick={() => setShowLocModal(false)}
                className="text-neutral-400 hover:text-neutral-200 text-xs font-semibold"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSaveLocation} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Hub Display Name *
                </label>
                <input
                  type="text"
                  required
                  value={locName}
                  onChange={(e) => setLocName(e.target.value)}
                  placeholder="e.g. IBS Academic Block C Hub"
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 focus:outline-none focus:border-amber-500/60"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Hub Code (3-5 chars)
                  </label>
                  <input
                    type="text"
                    value={locCode}
                    onChange={(e) => setLocCode(e.target.value.toUpperCase())}
                    placeholder="e.g. IBSC"
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 focus:outline-none focus:border-amber-500/60 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    value={locPhone}
                    onChange={(e) => setLocPhone(e.target.value)}
                    placeholder="+91 91210 98765"
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 focus:outline-none focus:border-amber-500/60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Landmark & Location Details
                </label>
                <input
                  type="text"
                  value={locLandmark}
                  onChange={(e) => setLocLandmark(e.target.value)}
                  placeholder="e.g. Near Cafeteria Plaza & Parking Bay 4"
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 focus:outline-none focus:border-amber-500/60"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Operating Hours
                </label>
                <input
                  type="text"
                  value={locHours}
                  onChange={(e) => setLocHours(e.target.value)}
                  placeholder="07:00 AM - 10:30 PM (Daily)"
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 focus:outline-none focus:border-amber-500/60"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="locActiveCheck"
                  checked={locActive}
                  onChange={(e) => setLocActive(e.target.checked)}
                  className="w-4 h-4 rounded border-neutral-800 text-amber-500 focus:ring-amber-500/40"
                />
                <label htmlFor="locActiveCheck" className="text-xs text-neutral-300 select-none">
                  Hub is active for public bookings and owner listings
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowLocModal(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={locSaving}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20 disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{locSaving ? 'Saving...' : 'Save Hub'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

