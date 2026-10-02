import React, { useState, useEffect } from 'react';
import { DashboardMetrics, AdminAction } from '../../types';
import { api } from '../../services/api';
import {
  Bike,
  Ticket,
  Users,
  DollarSign,
  ShieldCheck,
  FileCheck,
  TrendingUp,
  AlertTriangle,
  Clock,
  ArrowRight,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateTab }) => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [actions, setActions] = useState<AdminAction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [m, a] = await Promise.all([api.getMetrics(), api.getAdminActions()]);
        setMetrics(m);
        setActions(a);
      } catch (err) {
        console.error('Failed to load metrics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-12 text-center text-xs font-mono text-neutral-400">
        Loading real-time campus metrics...
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Real Live Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400 font-medium">Campus Bike Fleet</span>
            <Bike className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-extrabold text-3xl text-neutral-100">
              {metrics?.totalBikes || 0}
            </span>
            <span className="text-xs text-emerald-400 font-mono">
              ({metrics?.availableBikes || 0} Available)
            </span>
          </div>
          <p className="text-[11px] text-neutral-500">
            {metrics?.reservedBikes || 0} currently on ride
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400 font-medium">Total Bookings</span>
            <Ticket className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-extrabold text-3xl text-neutral-100">
              {metrics?.totalBookings || 0}
            </span>
            <span className="text-xs text-amber-400 font-mono">
              ({metrics?.activeBookings || 0} Active)
            </span>
          </div>
          <p className="text-[11px] text-neutral-500">Across ICFAI campus hubs</p>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400 font-medium">Gross Rental Volume</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-extrabold text-3xl text-amber-400">
              ₹{(metrics?.totalRevenue || 0).toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-[11px] text-neutral-500">Peer-to-peer student payouts</p>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400 font-medium">Verified Students</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-extrabold text-3xl text-neutral-100">
              {metrics?.totalUsers || 0}
            </span>
            <span className="text-xs text-emerald-400 font-mono">ICFAI Enrolled</span>
          </div>
          <p className="text-[11px] text-neutral-500">100% ID verified community</p>
        </div>
      </div>

      {/* Action shortcuts & Pending approvals banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <h3 className="font-display font-bold text-lg text-neutral-100">
              Operations Audit Trail
            </h3>
            <span className="text-xs font-mono text-neutral-400">Live Server Log</span>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {actions.length > 0 ? (
              actions.slice(0, 8).map((a) => (
                <div
                  key={a.id}
                  className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/80 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-semibold text-neutral-200 block">{a.action}</span>
                    <span className="text-[11px] text-neutral-400 font-mono">
                      Target: {a.targetType} #{a.targetId.slice(0, 8)}
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    {new Date(a.timestamp).toLocaleTimeString('en-IN')}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-neutral-400 text-center py-6">No recent audit actions.</p>
            )}
          </div>
        </div>

        {/* Quick Operations Controls */}
        <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4">
          <h3 className="font-display font-bold text-lg text-neutral-100">
            Quick Operations
          </h3>

          <div className="space-y-2.5 text-xs">
            <button
              onClick={() => onNavigateTab('bikes')}
              className="w-full p-3.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 font-medium flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Bike className="w-4 h-4 text-amber-400" />
                <span>Manage Fleet & Add New Bike</span>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-500" />
            </button>

            <button
              onClick={() => onNavigateTab('bookings')}
              className="w-full p-3.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 font-medium flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Ticket className="w-4 h-4 text-emerald-400" />
                <span>Active Bookings & Return Logs</span>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-500" />
            </button>

            <button
              onClick={() => onNavigateTab('verifications')}
              className="w-full p-3.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 font-medium flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <span>AI Document Queue ({metrics?.pendingVerifications || 0})</span>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-500" />
            </button>

            <button
              onClick={() => onNavigateTab('approvals')}
              className="w-full p-3.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 font-medium flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <FileCheck className="w-4 h-4 text-amber-400" />
                <span>Owner Submissions ({metrics?.pendingOwnerApprovals || 0})</span>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
