import React, { useState, useEffect } from 'react';
import { DocumentVerification } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye,
  Sparkles,
  Search,
  FileText,
  Clock,
} from 'lucide-react';

export const AdminVerifications: React.FC = () => {
  const { showToast } = useAuth();
  const [verifications, setVerifications] = useState<DocumentVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVerif, setSelectedVerif] = useState<DocumentVerification | null>(null);

  const fetchVerifs = async () => {
    try {
      setLoading(true);
      const data = await api.getVerifications();
      setVerifications(data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load verifications queue', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifs();
  }, []);

  const handleReview = async (id: string, result: 'verified' | 'rejected') => {
    try {
      await api.reviewVerification(id, result, `Reviewed by administrative staff on ${new Date().toLocaleDateString()}`);
      showToast(`Document ${result === 'verified' ? 'Approved' : 'Rejected'}`, 'success');
      fetchVerifs();
      setSelectedVerif(null);
    } catch (err: any) {
      showToast('Failed to review document', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display font-bold text-2xl text-neutral-100">
              AI Document Verification Queue
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono text-xs flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Gemini 2.5 Vision OCR</span>
            </span>
          </div>
          <p className="text-xs text-neutral-400">
            Review student identity clearances, Driving Licences, and automated optical confidence checks.
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-neutral-950 text-neutral-400 font-mono uppercase text-[10px] border-b border-neutral-800">
              <tr>
                <th className="px-4 py-3.5">Student / Document</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">AI Confidence</th>
                <th className="px-4 py-3.5">Verification State</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80">
              {(verifications || []).length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-neutral-500">
                    No documents currently in verification queue.
                  </td>
                </tr>
              ) : (
                (verifications || []).map((v) => (
                  <tr key={v.id} className="hover:bg-neutral-800/40 transition-colors">
                    <td className="px-4 py-3.5">
                      <div>
                        <span className="font-semibold text-neutral-100 block">
                          {v.extractedData?.fullName || v.userId}
                        </span>
                        <span className="font-mono text-[11px] text-amber-400">
                          {v.extractedData?.idNumber || 'ID-Pending'}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 uppercase font-mono text-[11px] text-neutral-300">
                      {(v.documentType || '').replace('_', ' ')}
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 rounded-full bg-neutral-800 overflow-hidden">
                          <div
                            className="h-full bg-emerald-400 rounded-full"
                            style={{ width: `${v.confidenceScore}%` }}
                          />
                        </div>
                        <span className="font-mono font-bold text-emerald-400">
                          {v.confidenceScore}%
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          v.verificationState === 'VERIFICATION PASSED'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : v.verificationState === 'VERIFICATION FAILED'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}
                      >
                        {v.verificationState || (v.verificationResult === 'verified' ? 'VERIFICATION PASSED' : 'MANUAL REVIEW REQUIRED')}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          v.verificationResult === 'verified'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : v.verificationResult === 'rejected'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}
                      >
                        {v.verificationResult}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedVerif(v)}
                          className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium"
                        >
                          Inspect
                        </button>
                        <button
                          onClick={() => handleReview(v.id, 'verified')}
                          className="p-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300"
                          title="Approve Document"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleReview(v.id, 'rejected')}
                          className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300"
                          title="Reject Document"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Side-by-Side Inspection Modal */}
      {selectedVerif && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">
                  AI Optical Inspection & Manual Review
                </span>
                <h3 className="font-display font-bold text-lg text-neutral-100">
                  {selectedVerif.documentType.replace('_', ' ').toUpperCase()} Clearance
                </h3>
              </div>
              <button
                onClick={() => setSelectedVerif(null)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-200"
              >
                ✕
              </button>
            </div>

            {/* Document Image Preview */}
            {selectedVerif.documentUrl && (
              <div className="h-48 rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800">
                <img
                  src={selectedVerif.documentUrl}
                  alt="Document preview"
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Extracted Name:</span>
                  <span className="font-semibold text-neutral-100">
                    {selectedVerif.extractedData?.fullName || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Licence / ID Number:</span>
                  <span className="font-mono text-amber-400">
                    {selectedVerif.extractedData?.idNumber || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Optical Confidence:</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {selectedVerif.confidenceScore}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Calculated State:</span>
                  <span className="font-mono text-amber-400 font-bold">
                    {selectedVerif.verificationState || 'MANUAL REVIEW REQUIRED'}
                  </span>
                </div>
              </div>

              {/* Reasons */}
              {selectedVerif.extractedData?.reasons && selectedVerif.extractedData.reasons.length > 0 && (
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/80 text-[11px] text-neutral-300 space-y-1">
                  <strong className="text-amber-400 block">AI Optical Observations:</strong>
                  <ul className="list-disc list-inside space-y-0.5">
                    {selectedVerif.extractedData.reasons.map((r: string, idx: number) => (
                      <li key={idx}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
              <button
                onClick={() => handleReview(selectedVerif.id, 'rejected')}
                className="px-4 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-xs font-semibold"
              >
                Reject Document
              </button>
              <button
                onClick={() => handleReview(selectedVerif.id, 'verified')}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold shadow-md shadow-amber-500/20"
              >
                Approve Student Clearance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
