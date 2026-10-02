import React, { useState, useEffect } from 'react';
import { Booking, CommunicationLog } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Ticket,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  Eye,
  FileText,
  ShieldCheck,
  Search,
  Check,
  XCircle,
  AlertTriangle,
  Laptop,
  Mail,
  MessageSquare,
  Send,
  Key,
  RotateCcw,
  Sparkles,
  ExternalLink,
  History,
  X
} from 'lucide-react';

export const AdminBookings: React.FC = () => {
  const { showToast } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Handover Modal State
  const [handoverBooking, setHandoverBooking] = useState<Booking | null>(null);
  const [handoverOdo, setHandoverOdo] = useState(12000);
  const [handoverFuel, setHandoverFuel] = useState(85);
  const [helmetIssued, setHelmetIssued] = useState(true);
  const [laptopDeposited, setLaptopDeposited] = useState(true);
  const [handoverNotes, setHandoverNotes] = useState('');
  const [coordinatorName, setCoordinatorName] = useState('Admin Hub Coordinator');
  const [handoverLoading, setHandoverLoading] = useState(false);

  // Return Modal State
  const [returnBooking, setReturnBooking] = useState<Booking | null>(null);
  const [returnOdo, setReturnOdo] = useState(12050);
  const [returnFuel, setReturnFuel] = useState(80);
  const [hasDamage, setHasDamage] = useState(false);
  const [damageCost, setDamageCost] = useState(0);
  const [damageNotes, setDamageNotes] = useState('');
  const [hasChallan, setHasChallan] = useState(false);
  const [challanAmount, setChallanAmount] = useState(0);
  const [laptopReturned, setLaptopReturned] = useState(true);
  const [returnNotes, setReturnNotes] = useState('');
  const [returnLoading, setReturnLoading] = useState(false);

  // Communication Modal State
  const [commBooking, setCommBooking] = useState<Booking | null>(null);
  const [commLogs, setCommLogs] = useState<CommunicationLog[]>([]);
  const [commMessage, setCommMessage] = useState('');
  const [commSending, setCommSending] = useState(false);
  const [commTab, setCommTab] = useState<'email' | 'whatsapp'>('whatsapp');
  const [lastActionResult, setLastActionResult] = useState<any>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await api.getBookings();
      setBookings(data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load bookings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: any, notes?: string) => {
    try {
      await api.updateBookingStatus(id, {
        bookingStatus: newStatus,
        adminReviewNotes: notes || `Status updated to ${newStatus} by admin`,
      });
      showToast(`Booking marked as ${newStatus}`, 'success');
      fetchBookings();
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking((prev) => (prev ? { ...prev, bookingStatus: newStatus } : null));
      }
    } catch (err: any) {
      showToast('Failed to update booking status', 'error');
    }
  };

  // Open Handover Modal
  const openHandoverModal = (b: Booking) => {
    setHandoverBooking(b);
    setHandoverOdo(12000);
    setHandoverFuel(85);
    setHelmetIssued(true);
    setLaptopDeposited(true);
    setHandoverNotes('Vehicle verified in good order and handed over at hub.');
    setCoordinatorName('Admin Hub Coordinator');
  };

  const handleConfirmHandover = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handoverBooking) return;
    try {
      setHandoverLoading(true);
      await api.recordPickupInspection(handoverBooking.id, {
        odometerKm: Number(handoverOdo),
        fuelPercent: Number(handoverFuel),
        photos: [],
        notes: handoverNotes,
        helmetIssued,
        laptopPhysicalDepositLogged: laptopDeposited,
        inspectedBy: coordinatorName,
      });

      showToast('Ride handover recorded! Rental is now active.', 'success');
      setHandoverBooking(null);
      fetchBookings();
    } catch (err: any) {
      showToast(err.message || 'Failed to complete handover', 'error');
    } finally {
      setHandoverLoading(false);
    }
  };

  // Open Return Modal
  const openReturnModal = (b: Booking) => {
    setReturnBooking(b);
    const prevOdo = b.pickupConditionRecord?.odometerKm || 12000;
    setReturnOdo(prevOdo + 40);
    setReturnFuel(b.pickupConditionRecord?.fuelPercent || 80);
    setHasDamage(false);
    setDamageCost(0);
    setDamageNotes('');
    setHasChallan(false);
    setChallanAmount(0);
    setLaptopReturned(true);
    setReturnNotes('Vehicle returned safely. Physical laptop returned to student.');
  };

  const handleConfirmReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnBooking) return;
    try {
      setReturnLoading(true);
      await api.recordReturnInspection(returnBooking.id, {
        odometerKm: Number(returnOdo),
        fuelPercent: Number(returnFuel),
        photos: [],
        notes: returnNotes,
        newDamagesIdentified: hasDamage,
        damageNotes: hasDamage ? damageNotes : '',
        damageEstimatedCost: hasDamage ? Number(damageCost) : 0,
        fineOrChallanRecorded: hasChallan,
        challanAmount: hasChallan ? Number(challanAmount) : 0,
        challanDetails: hasChallan ? 'Traffic challan reported during rental duration.' : '',
        laptopReturnedToStudent: laptopReturned,
        inspectedBy: coordinatorName || 'Admin Hub Coordinator',
      });

      showToast('Vehicle return logged & deposit refund settled.', 'success');
      setReturnBooking(null);
      fetchBookings();
    } catch (err: any) {
      showToast(err.message || 'Failed to complete return', 'error');
    } finally {
      setReturnLoading(false);
    }
  };

  // Open Communication Modal
  const openCommModal = async (b: Booking) => {
    setCommBooking(b);
    setCommMessage('');
    setLastActionResult(null);
    try {
      const logs = await api.getBookingCommunications(b.id);
      setCommLogs(logs);
    } catch (err) {
      setCommLogs([]);
    }
  };

  const handleSendEmail = async () => {
    if (!commBooking) return;
    try {
      setCommSending(true);
      const res = await api.sendBookingEmail(commBooking.id, commMessage || undefined);
      setLastActionResult(res);
      if (res.log) {
        setCommLogs((prev) => [res.log, ...prev]);
      }
      showToast(res.configured ? 'Email dispatched to student!' : 'Email log created for administrative record.', res.configured ? 'success' : 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to send email', 'error');
    } finally {
      setCommSending(false);
    }
  };

  const handleSendWhatsApp = async () => {
    if (!commBooking) return;
    try {
      setCommSending(true);
      const res = await api.sendBookingWhatsApp(commBooking.id, commMessage || undefined);
      setLastActionResult(res);
      if (res.log) {
        setCommLogs((prev) => [res.log, ...prev]);
      }
      showToast(res.configured ? 'WhatsApp message dispatched!' : 'WhatsApp link prepared.', res.configured ? 'success' : 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to trigger WhatsApp', 'error');
    } finally {
      setCommSending(false);
    }
  };

  const filteredBookings = (bookings || []).filter((b) => {
    if (!b) return false;
    if (statusFilter !== 'ALL' && b.bookingStatus !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        (b.renterName || '').toLowerCase().includes(q) ||
        (b.renterEnrollment || '').toLowerCase().includes(q) ||
        (b.bikeModel || '').toLowerCase().includes(q) ||
        (b.bikeRegistration && b.bikeRegistration.toLowerCase().includes(q)) ||
        (b.id || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl text-neutral-100">
            Bookings & Ride Operations
          </h2>
          <p className="text-xs text-neutral-400">
            Manage student reservations, physical handovers, return condition logs, and communication audit trails.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student, enrollment, bike..."
              className="pl-9 pr-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-amber-500/60"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-neutral-900 border border-neutral-800">
            {['ALL', 'pending_verification', 'confirmed', 'active_rental', 'completed', 'cancelled', 'rejected'].map(
              (st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold uppercase ${
                    statusFilter === st
                      ? 'bg-amber-500 text-neutral-950 font-bold'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-neutral-950 text-neutral-400 font-mono uppercase text-[10px] border-b border-neutral-800">
              <tr>
                <th className="px-4 py-3.5">Booking / Ride</th>
                <th className="px-4 py-3.5">Student Renter</th>
                <th className="px-4 py-3.5">Schedule & Hub</th>
                <th className="px-4 py-3.5">Total / Deposit</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-neutral-500">
                    No bookings found matching current filter.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-neutral-800/40 transition-colors">
                    <td className="px-4 py-3.5">
                      <div>
                        <span className="font-semibold text-neutral-100 block">
                          {b.bikeBrand} {b.bikeModel}
                        </span>
                        <span className="font-mono text-[11px] text-amber-400">
                          {b.bikeRegistration || 'Campus Fleet'}
                        </span>
                        <span className="text-[10px] text-neutral-500 font-mono block">
                          Ref: #{b.id.slice(0, 8)}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div>
                        <span className="font-medium text-neutral-200 block">{b.renterName}</span>
                        <span className="font-mono text-[11px] text-emerald-400 block font-bold">
                          {b.renterEnrollment}
                        </span>
                        {(b.academicYear || b.course) && (
                          <span className="text-[10px] text-neutral-400 font-mono block">
                            {b.academicYear} • {b.course}
                          </span>
                        )}
                        <span className="text-[10px] text-neutral-400">{b.renterPhone}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="space-y-0.5">
                        <span className="font-medium text-neutral-200 block">{b.pickupHub}</span>
                        <span className="text-[11px] text-neutral-400 block">
                          {new Date(b.pickupDate).toLocaleDateString('en-IN')} to{' '}
                          {new Date(b.returnDate).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div>
                        <span className="font-mono font-bold text-neutral-100 block">
                          ₹{b.totalPrice + b.platformFee}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-mono block">
                          ₹{b.securityDeposit} cash dep.
                        </span>
                        <span className="text-[10px] text-amber-400 font-mono block">
                          + Laptop dep.
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          b.bookingStatus === 'confirmed'
                            ? 'bg-blue-950 text-blue-300 border border-blue-800'
                            : b.bookingStatus === 'active_rental'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : b.bookingStatus === 'completed'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : b.bookingStatus === 'pending_verification'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : 'bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        {b.bookingStatus.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedBooking(b)}
                          className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium transition-colors"
                          title="Inspect Documents & Full Details"
                        >
                          Inspect
                        </button>

                        <button
                          onClick={() => openCommModal(b)}
                          className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
                          title="Communicate (Email/WhatsApp) & Audit Logs"
                        >
                          <MessageSquare className="w-4 h-4 text-amber-400" />
                        </button>

                        {b.bookingStatus === 'pending_verification' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(b.id, 'confirmed')}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs transition-colors"
                              title="Approve Documents & Confirm"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(b.id, 'rejected')}
                              className="px-2.5 py-1.5 rounded-lg bg-rose-950 text-rose-300 border border-rose-800 hover:bg-rose-900 text-xs transition-colors"
                              title="Reject Booking"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {b.bookingStatus === 'confirmed' && (
                          <button
                            onClick={() => openHandoverModal(b)}
                            className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-colors flex items-center gap-1"
                            title="Perform Physical Vehicle Handover"
                          >
                            <Key className="w-3 h-3" />
                            Handover
                          </button>
                        )}

                        {b.bookingStatus === 'active_rental' && (
                          <button
                            onClick={() => openReturnModal(b)}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs transition-colors flex items-center gap-1"
                            title="Inspect Vehicle Return & Settle Deposit"
                          >
                            <RotateCcw className="w-3 h-3" />
                            Return
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Details Inspection Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">
                  Booking & Document Clearance Review
                </span>
                <h3 className="font-display font-bold text-lg text-neutral-100">
                  {selectedBooking.bikeBrand} {selectedBooking.bikeModel}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Student & Schedule details */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                <span className="text-neutral-400 block text-[11px]">Renter Profile</span>
                <span className="font-bold text-neutral-100 block">{selectedBooking.renterName}</span>
                <span className="text-emerald-400 font-mono text-[11px] block font-bold">
                  ICFAI ID: {selectedBooking.renterEnrollment}
                </span>
                {(selectedBooking.academicYear || selectedBooking.course) && (
                  <span className="text-neutral-400 font-mono text-[11px] block">
                    {selectedBooking.academicYear} • {selectedBooking.course}
                  </span>
                )}
                <span className="text-neutral-400 text-[11px] block">{selectedBooking.renterPhone}</span>
                <span className="text-neutral-400 text-[11px] block">{selectedBooking.renterEmail}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                <span className="text-neutral-400 block text-[11px]">Schedule & Hub</span>
                <span className="font-bold text-neutral-100 block">{selectedBooking.pickupHub}</span>
                <span className="text-neutral-300 text-[11px] block">
                  Pickup: {new Date(selectedBooking.pickupDate).toLocaleString('en-IN')}
                </span>
                <span className="text-neutral-300 text-[11px] block">
                  Return: {new Date(selectedBooking.returnDate).toLocaleString('en-IN')}
                </span>
                <span className="text-amber-400 font-mono text-[11px] block">
                  {selectedBooking.durationDays} Days ({selectedBooking.durationHours} Hours)
                </span>
              </div>
            </div>

            {/* Submitted Documents Inspection */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-neutral-200 block">
                Submitted Verification Documents
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedBooking.drivingLicenseDocument ? (
                  <div className="space-y-1">
                    <span className="text-[11px] text-neutral-400">Driving Licence (Front)</span>
                    <div className="h-36 rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800">
                      <img
                        src={selectedBooking.drivingLicenseDocument}
                        alt="Driving License"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="h-36 rounded-xl bg-neutral-950 border border-dashed border-neutral-800 flex items-center justify-center text-xs text-neutral-500">
                    No DL Document
                  </div>
                )}

                {selectedBooking.aadharDocument ? (
                  <div className="space-y-1">
                    <span className="text-[11px] text-neutral-400">Aadhaar Card (Front)</span>
                    <div className="h-36 rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800">
                      <img
                        src={selectedBooking.aadharDocument}
                        alt="Aadhaar"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="h-36 rounded-xl bg-neutral-950 border border-dashed border-neutral-800 flex items-center justify-center text-xs text-neutral-500">
                    No Aadhaar Document
                  </div>
                )}
              </div>
            </div>

            {/* Terms Acceptance Audit Badge */}
            <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-neutral-300 font-medium">Terms & Conditions Agreement</span>
              </div>
              <div className="text-right">
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
                  {selectedBooking.termsVersion || 'v1.2-2026-AUG'} (Accepted)
                </span>
                {selectedBooking.termsAcceptedAt && (
                  <span className="text-[10px] text-neutral-500 block font-mono">
                    {new Date(selectedBooking.termsAcceptedAt).toLocaleString('en-IN')}
                  </span>
                )}
              </div>
            </div>

            {/* Deposit & Financials */}
            <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs flex items-center justify-between">
              <div>
                <span className="text-neutral-400 block text-[11px]">Rental + Fee</span>
                <span className="font-mono font-bold text-neutral-100">
                  ₹{selectedBooking.totalPrice + selectedBooking.platformFee}
                </span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[11px]">Cash Deposit</span>
                <span className="font-mono font-bold text-emerald-400">
                  ₹{selectedBooking.securityDeposit}
                </span>
              </div>
              <div className="text-right">
                <span className="text-neutral-400 block text-[11px]">Physical Security Deposit</span>
                <span className="font-mono font-bold text-amber-400">1 Working Laptop</span>
              </div>
            </div>

            {/* Status Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-800">
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400">Current Status:</span>
                <span className="text-xs font-mono font-bold text-amber-400 uppercase">
                  {selectedBooking.bookingStatus.replace('_', ' ')}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {selectedBooking.bookingStatus === 'pending_verification' && (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(selectedBooking.id, 'rejected')}
                      className="px-3.5 py-2 rounded-xl bg-rose-950 hover:bg-rose-900 text-rose-300 font-semibold text-xs border border-rose-800"
                    >
                      Reject Request
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedBooking.id, 'confirmed')}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs shadow-md shadow-emerald-500/20"
                    >
                      Approve & Confirm
                    </button>
                  </>
                )}

                {selectedBooking.bookingStatus === 'confirmed' && (
                  <button
                    onClick={() => {
                      const b = selectedBooking;
                      setSelectedBooking(null);
                      openHandoverModal(b);
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs"
                  >
                    Open Handover Checklist
                  </button>
                )}

                {selectedBooking.bookingStatus === 'active_rental' && (
                  <button
                    onClick={() => {
                      const b = selectedBooking;
                      setSelectedBooking(null);
                      openReturnModal(b);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs shadow-md shadow-emerald-500/20"
                  >
                    Open Return Checklist
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Handover Modal */}
      {handoverBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-neutral-100">
                    Vehicle Handover & Inspection
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Booking #{handoverBooking.id.slice(0, 8)} • {handoverBooking.bikeBrand} {handoverBooking.bikeModel}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setHandoverBooking(null)}
                className="text-neutral-400 hover:text-neutral-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmHandover} className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
                <p className="text-neutral-300 font-semibold">{handoverBooking.renterName} ({handoverBooking.renterEnrollment})</p>
                <p className="text-neutral-400">Hub: {handoverBooking.pickupHub}</p>
                <p className="text-amber-400 font-mono">Total Cash Deposit: ₹{handoverBooking.securityDeposit} + 1 Laptop</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 mb-1 font-medium">Odometer Start (km)</label>
                  <input
                    type="number"
                    required
                    value={handoverOdo}
                    onChange={(e) => setHandoverOdo(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 focus:outline-none focus:border-amber-500/60 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 mb-1 font-medium">Fuel Level (%)</label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    required
                    value={handoverFuel}
                    onChange={(e) => setHandoverFuel(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 focus:outline-none focus:border-amber-500/60 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-neutral-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={helmetIssued}
                    onChange={(e) => setHelmetIssued(e.target.checked)}
                    className="w-4 h-4 rounded border-neutral-800 text-amber-500"
                  />
                  <span className="text-neutral-200">Complimentary ISI Helmet issued to student</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={laptopDeposited}
                    onChange={(e) => setLaptopDeposited(e.target.checked)}
                    className="w-4 h-4 rounded border-neutral-800 text-amber-500"
                  />
                  <span className="text-neutral-200">Physical Working Laptop received and safely vaulted at hub</span>
                </label>
              </div>

              <div>
                <label className="block text-neutral-300 mb-1 font-medium">Hub Coordinator Name</label>
                <input
                  type="text"
                  value={coordinatorName}
                  onChange={(e) => setCoordinatorName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 focus:outline-none focus:border-amber-500/60"
                />
              </div>

              <div>
                <label className="block text-neutral-300 mb-1 font-medium">Handover Condition Notes</label>
                <textarea
                  rows={2}
                  value={handoverNotes}
                  onChange={(e) => setHandoverNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 focus:outline-none focus:border-amber-500/60"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setHandoverBooking(null)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={handoverLoading}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold shadow-md shadow-amber-500/20 disabled:opacity-50"
                >
                  {handoverLoading ? 'Activating...' : 'Activate Rental & Release Keys'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Return Modal */}
      {returnBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-neutral-100">
                    Vehicle Return & Deposit Settlement
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Booking #{returnBooking.id.slice(0, 8)} • {returnBooking.bikeBrand} {returnBooking.bikeModel}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setReturnBooking(null)}
                className="text-neutral-400 hover:text-neutral-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmReturn} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 mb-1 font-medium">Return Odometer (km)</label>
                  <input
                    type="number"
                    required
                    value={returnOdo}
                    onChange={(e) => setReturnOdo(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 focus:outline-none focus:border-amber-500/60 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 mb-1 font-medium">Fuel Level (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={returnFuel}
                    onChange={(e) => setReturnFuel(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 focus:outline-none focus:border-amber-500/60 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-neutral-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={laptopReturned}
                    onChange={(e) => setLaptopReturned(e.target.checked)}
                    className="w-4 h-4 rounded border-neutral-800 text-emerald-500"
                  />
                  <span className="text-neutral-200">Physical Vaulted Laptop safely handed back to student</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasDamage}
                    onChange={(e) => setHasDamage(e.target.checked)}
                    className="w-4 h-4 rounded border-neutral-800 text-rose-500"
                  />
                  <span className="text-neutral-200">New vehicle damages or scratches identified</span>
                </label>

                {hasDamage && (
                  <div className="pl-6 space-y-2 animate-in fade-in">
                    <div>
                      <label className="block text-neutral-300 mb-1">Estimated Damage Deductible (₹)</label>
                      <input
                        type="number"
                        min="0"
                        max={returnBooking.securityDeposit}
                        value={damageCost}
                        onChange={(e) => setDamageCost(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-rose-800/60 text-xs text-neutral-100"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-300 mb-1">Damage Description</label>
                      <input
                        type="text"
                        value={damageNotes}
                        onChange={(e) => setDamageNotes(e.target.value)}
                        placeholder="e.g. Scratched right rear panel"
                        className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-100"
                      />
                    </div>
                  </div>
                )}

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasChallan}
                    onChange={(e) => setHasChallan(e.target.checked)}
                    className="w-4 h-4 rounded border-neutral-800 text-rose-500"
                  />
                  <span className="text-neutral-200">Traffic Fine / Police Challan recorded</span>
                </label>

                {hasChallan && (
                  <div className="pl-6 space-y-2 animate-in fade-in">
                    <label className="block text-neutral-300 mb-1">Challan Penalty Amount (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={challanAmount}
                      onChange={(e) => setChallanAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-rose-800/60 text-xs text-neutral-100"
                    />
                  </div>
                )}
              </div>

              {/* Settlement Summary */}
              <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="text-neutral-400 block text-[11px]">Original Cash Deposit</span>
                  <span className="font-mono font-bold text-neutral-200">₹{returnBooking.securityDeposit}</span>
                </div>
                <div className="text-right">
                  <span className="text-neutral-400 block text-[11px]">Net Refund Authorized</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">
                    ₹{Math.max(0, returnBooking.securityDeposit - (hasDamage ? damageCost : 0) - (hasChallan ? challanAmount : 0))}
                  </span>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setReturnBooking(null)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={returnLoading}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold shadow-md shadow-emerald-500/20 disabled:opacity-50"
                >
                  {returnLoading ? 'Settling...' : 'Complete Return & Release Deposit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Communication Modal */}
      {commBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-neutral-100">
                    Student Communication & Audit Log
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Booking #{commBooking.id.slice(0, 8)} • {commBooking.renterName} ({commBooking.renterEnrollment})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCommBooking(null)}
                className="text-neutral-400 hover:text-neutral-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Recipient Details */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                <span className="text-neutral-400 text-[10px] block">Renter Email</span>
                <span className="font-mono text-neutral-200">{commBooking.renterEmail}</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                <span className="text-neutral-400 text-[10px] block">Renter Phone</span>
                <span className="font-mono text-neutral-200">{commBooking.renterPhone}</span>
              </div>
            </div>

            {/* Compose Section */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-neutral-200">
                  Compose Custom Message (Optional - Defaults apply if left blank)
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCommTab('whatsapp')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                      commTab === 'whatsapp' ? 'bg-emerald-500 text-neutral-950' : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={() => setCommTab('email')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                      commTab === 'email' ? 'bg-amber-500 text-neutral-950' : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    Email
                  </button>
                </div>
              </div>

              <textarea
                rows={3}
                value={commMessage}
                onChange={(e) => setCommMessage(e.target.value)}
                placeholder="Type custom notification text or leave empty to use standard automated template..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 focus:outline-none focus:border-amber-500/60"
              />

              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] text-neutral-500">
                  {commTab === 'whatsapp' ? 'Generates direct wa.me link & triggers gateway if configured.' : 'Dispatches via SMTP/Resend or creates audit trail.'}
                </span>

                {commTab === 'whatsapp' ? (
                  <button
                    type="button"
                    onClick={handleSendWhatsApp}
                    disabled={commSending}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{commSending ? 'Processing...' : 'Send WhatsApp'}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendEmail}
                    disabled={commSending}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 disabled:opacity-50"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{commSending ? 'Dispatching...' : 'Send Email'}</span>
                  </button>
                )}
              </div>

              {lastActionResult && (
                <div className={`p-3 rounded-xl text-xs space-y-1 ${
                  lastActionResult.configured
                    ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-200'
                    : 'bg-neutral-950 border border-neutral-800 text-neutral-300'
                }`}>
                  <p className="font-semibold">{lastActionResult.message}</p>
                  {lastActionResult.waLink && (
                    <a
                      href={lastActionResult.waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400 underline font-mono text-[11px] flex items-center gap-1 mt-1"
                    >
                      Open WhatsApp Web Directly <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Communication History Audit Log */}
            <div className="space-y-3 pt-3 border-t border-neutral-800">
              <h4 className="text-xs font-semibold text-neutral-200 flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-neutral-400" />
                <span>Recorded Communication Audit Log ({commLogs.length})</span>
              </h4>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {commLogs.length === 0 ? (
                  <p className="text-neutral-500 text-xs py-2 text-center">No communications logged yet for this booking.</p>
                ) : (
                  commLogs.map((log) => (
                    <div key={log.id} className="p-3 rounded-xl bg-neutral-950 border border-neutral-850 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-neutral-200 uppercase text-[10px] flex items-center gap-1">
                          {log.channel === 'whatsapp' ? <MessageSquare className="w-3 h-3 text-emerald-400" /> : <Mail className="w-3 h-3 text-amber-400" />}
                          {log.channel} to {log.recipient}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          log.status === 'sent'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-neutral-800 text-neutral-400'
                        }`}>
                          {log.status}
                        </span>
                      </div>
                      <p className="text-neutral-300 text-[11px] whitespace-pre-wrap">{log.message}</p>
                      <span className="text-[10px] text-neutral-500 font-mono block">
                        {new Date(log.timestamp).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

