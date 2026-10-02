import React, { useState, useEffect } from 'react';
import { Bike } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  FileCheck,
  CheckCircle2,
  XCircle,
  MapPin,
  ShieldCheck,
  DollarSign,
  AlertCircle,
  Eye,
  MessageSquare,
  Sparkles,
  UserCheck,
  X
} from 'lucide-react';

export const AdminOwnerApprovals: React.FC = () => {
  const { showToast } = useAuth();
  const [submissions, setSubmissions] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);
  const [inspectingBike, setInspectingBike] = useState<Bike | null>(null);

  // Request Changes Modal
  const [showChangesModal, setShowChangesModal] = useState(false);
  const [changesBikeId, setChangesBikeId] = useState('');
  const [changesNotes, setChangesNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Reject Modal
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectBikeId, setRejectBikeId] = useState('');
  const [rejectReason, setRejectReason] = useState('');

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const data = await api.getOwnerSubmissions();
      setSubmissions(data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load owner submissions', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      setActionLoading(true);
      await api.approveOwnerBike(id);
      showToast('Bike approved & published to campus marketplace!', 'success');
      fetchSubmissions();
      setInspectingBike(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to approve bike', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const openRejectModal = (id: string) => {
    setRejectBikeId(id);
    setRejectReason('');
    setShowRejectModal(true);
  };

  const handleConfirmReject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      await api.rejectOwnerBike(rejectBikeId, rejectReason);
      showToast('Listing rejected and feedback logged', 'info');
      setShowRejectModal(false);
      fetchSubmissions();
      setInspectingBike(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to reject bike', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const openChangesModal = (id: string) => {
    setChangesBikeId(id);
    setChangesNotes('');
    setShowChangesModal(true);
  };

  const handleConfirmRequestChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!changesNotes.trim()) {
      showToast('Please provide feedback notes for the student host', 'error');
      return;
    }
    try {
      setActionLoading(true);
      await api.requestOwnerChanges(changesBikeId, changesNotes);
      showToast('Changes requested. Student will see updates required.', 'success');
      setShowChangesModal(false);
      fetchSubmissions();
      setInspectingBike(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to request changes', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-display font-bold text-2xl text-neutral-100">
            Student Bike Host Submissions
          </h2>
          <p className="text-xs text-neutral-400">
            Audit submitted ICFAI student listings. Approved bikes immediately sync to the live fleet.
          </p>
        </div>
        <button
          onClick={fetchSubmissions}
          className="px-3.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold self-start sm:self-auto"
        >
          Refresh Submissions
        </button>
      </div>

      {submissions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {submissions.map((bike) => (
            <div
              key={bike.id}
              className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">
                      {bike.brand} • {bike.year}
                    </span>
                    <h3 className="font-display font-bold text-xl text-neutral-100 mt-0.5">
                      {bike.model}
                    </h3>
                    <p className="text-xs font-mono text-neutral-400">Reg: {bike.registrationNumber}</p>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                    bike.status === 'CHANGES_REQUESTED'
                      ? 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  }`}>
                    {bike.status === 'CHANGES_REQUESTED' ? 'Changes Pending' : 'Awaiting Clearance'}
                  </span>
                </div>

                {/* Host & Location */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-0.5">
                    <span className="text-neutral-400 text-[10px] block">Student Host</span>
                    <span className="font-semibold text-neutral-200 block">{bike.ownerName || 'Host'}</span>
                    <span className="font-mono text-amber-400 text-[11px] block">
                      ID: {bike.ownerEnrollment || '26FMUCHH01XXXX'}
                    </span>
                    {(bike.academicYear || bike.course) && (
                      <span className="text-neutral-400 text-[10px] block font-mono">
                        {bike.academicYear} • {bike.course}
                      </span>
                    )}
                    <span className="text-neutral-400 text-[10px] block">{bike.ownerPhone}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-0.5">
                    <span className="text-neutral-400 text-[10px] block">Pickup Hub & Pricing</span>
                    <span className="font-semibold text-neutral-200 block">{bike.pickupHub}</span>
                    <span className="font-mono text-emerald-400 font-bold text-[11px] block">
                      ₹{bike.pricePerDay} / day
                    </span>
                    <span className="text-neutral-400 text-[10px] block">
                      ₹{bike.securityDeposit} deposit
                    </span>
                  </div>
                </div>

                {/* Photos */}
                {bike.images && bike.images.length > 0 && (
                  <div className="h-36 rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 relative">
                    <img
                      src={bike.images[0]}
                      alt={bike.model}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <button
                      type="button"
                      onClick={() => setInspectingBike(bike)}
                      className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-white text-[10px] font-semibold flex items-center gap-1 hover:bg-black"
                    >
                      <Eye className="w-3 h-3" />
                      View Full File
                    </button>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => openChangesModal(bike.id)}
                  className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-neutral-300 font-semibold text-xs transition-colors flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                  Request Changes
                </button>
                <button
                  type="button"
                  onClick={() => openRejectModal(bike.id)}
                  className="px-3.5 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 font-semibold text-xs transition-colors"
                >
                  Reject
                </button>
                <button
                  type="button"
                  onClick={() => handleApprove(bike.id)}
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-colors disabled:opacity-50"
                >
                  Approve & Go Live
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-16 rounded-3xl bg-neutral-900/40 border border-neutral-800 text-center space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
          <h3 className="font-display font-bold text-lg text-neutral-200">
            No Pending Owner Submissions
          </h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            All student host listings have been reviewed and published to the active campus fleet.
          </p>
        </div>
      )}

      {/* Inspect Bike Drawer / Modal */}
      {inspectingBike && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div>
                <span className="text-xs font-mono uppercase text-amber-400 font-bold">
                  {inspectingBike.brand} • {inspectingBike.year}
                </span>
                <h3 className="font-display font-bold text-xl text-neutral-100">
                  {inspectingBike.model}
                </h3>
              </div>
              <button
                onClick={() => setInspectingBike(null)}
                className="p-2 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
                <h4 className="font-bold text-amber-400 text-xs">Student Host Profile</h4>
                <p className="text-neutral-200"><strong className="text-neutral-400">Name:</strong> {inspectingBike.ownerName}</p>
                <p className="text-neutral-200"><strong className="text-neutral-400">ICFAI ID:</strong> <span className="font-mono text-amber-400">{inspectingBike.ownerEnrollment}</span></p>
                <p className="text-neutral-200"><strong className="text-neutral-400">Phone:</strong> {inspectingBike.ownerPhone}</p>
                <p className="text-neutral-200"><strong className="text-neutral-400">Email:</strong> {inspectingBike.ownerEmail}</p>
                <p className="text-neutral-200"><strong className="text-neutral-400">Academic Year:</strong> {inspectingBike.academicYear || 'N/A'}</p>
                <p className="text-neutral-200"><strong className="text-neutral-400">Course / Dept:</strong> {inspectingBike.course || 'N/A'}</p>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
                <h4 className="font-bold text-emerald-400 text-xs">Rental & Verification Specs</h4>
                <p className="text-neutral-200"><strong className="text-neutral-400">Registration No:</strong> <span className="font-mono">{inspectingBike.registrationNumber}</span></p>
                <p className="text-neutral-200"><strong className="text-neutral-400">Odometer:</strong> {inspectingBike.odometerKm || '0'} km</p>
                <p className="text-neutral-200"><strong className="text-neutral-400">Daily Rate:</strong> ₹{inspectingBike.pricePerDay}</p>
                <p className="text-neutral-200"><strong className="text-neutral-400">Hourly Rate:</strong> ₹{inspectingBike.pricePerHour || Math.round(inspectingBike.pricePerDay / 8)}</p>
                <p className="text-neutral-200"><strong className="text-neutral-400">Deposit:</strong> ₹{inspectingBike.securityDeposit}</p>
                <p className="text-neutral-200"><strong className="text-neutral-400">Hub:</strong> {inspectingBike.pickupHub}</p>
              </div>
            </div>

            {/* Images Grid */}
            {inspectingBike.images && inspectingBike.images.length > 0 && (
              <div>
                <h4 className="font-bold text-neutral-200 text-xs mb-2">Uploaded Vehicle Images</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {inspectingBike.images.map((img, idx) => (
                    <div key={idx} className="h-28 rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800">
                      <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-neutral-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setInspectingBike(null);
                  openChangesModal(inspectingBike.id);
                }}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold text-xs"
              >
                Request Changes
              </button>
              <button
                type="button"
                onClick={() => {
                  setInspectingBike(null);
                  openRejectModal(inspectingBike.id);
                }}
                className="px-4 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 font-semibold text-xs"
              >
                Reject Listing
              </button>
              <button
                type="button"
                onClick={() => handleApprove(inspectingBike.id)}
                className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs shadow-md shadow-amber-500/20"
              >
                Approve & Publish to Fleet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request Changes Modal */}
      {showChangesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-7 space-y-4 shadow-2xl">
            <h3 className="font-display font-bold text-base text-neutral-100">
              Request Changes from Host
            </h3>
            <p className="text-xs text-neutral-400">
              Specify what the student needs to update (e.g. clearer RC photos, adjusted pricing, or correct campus hub selection).
            </p>

            <form onSubmit={handleConfirmRequestChanges} className="space-y-4">
              <textarea
                required
                rows={4}
                value={changesNotes}
                onChange={(e) => setChangesNotes(e.target.value)}
                placeholder="e.g. Please upload a clear photo of the Registration Certificate (RC) showing valid expiration date."
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 focus:outline-none focus:border-amber-500/60"
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowChangesModal(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs shadow-md shadow-amber-500/20 disabled:opacity-50"
                >
                  {actionLoading ? 'Sending...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-7 space-y-4 shadow-2xl">
            <h3 className="font-display font-bold text-base text-neutral-100">
              Reject Student Listing
            </h3>
            <p className="text-xs text-neutral-400">
              Provide an optional reason for the audit log record.
            </p>

            <form onSubmit={handleConfirmReject} className="space-y-4">
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Vehicle does not meet campus safety standards or invalid registration documents."
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 focus:outline-none focus:border-rose-500/60"
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRejectModal(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/20 disabled:opacity-50"
                >
                  {actionLoading ? 'Rejecting...' : 'Confirm Rejection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

