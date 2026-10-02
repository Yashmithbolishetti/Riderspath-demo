import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Users, ShieldCheck, Search, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const { showToast } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await api.getUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      await api.updateUserStatus(userId, newStatus);
      showToast('Student status updated', 'success');
      fetchUsers();
    } catch (err) {
      showToast('Failed to update student status', 'error');
    }
  };

  const filteredUsers = (users || []).filter(
    (u) =>
      u &&
      ((u.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
        (u.icfaiEnrollmentNumber || '').toLowerCase().includes(search.toLowerCase()) ||
        (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
        (u.phone || '').includes(search))
  );

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl text-neutral-100">
            ICFAI Student Directory
          </h2>
          <p className="text-xs text-neutral-400">
            Registered student renters and bike hosts across ICFAI Hyderabad campus.
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search enrollment, name..."
            className="pl-9 pr-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-amber-500/60"
          />
        </div>
      </div>

      <div className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-neutral-950 text-neutral-400 font-mono uppercase text-[10px] border-b border-neutral-800">
              <tr>
                <th className="px-4 py-3.5">Student Name</th>
                <th className="px-4 py-3.5">ICFAI Enrollment ID</th>
                <th className="px-4 py-3.5">Contact</th>
                <th className="px-4 py-3.5">Verification</th>
                <th className="px-4 py-3.5">Joined</th>
                <th className="px-4 py-3.5 text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-neutral-800/40 transition-colors">
                  <td className="px-4 py-3.5">
                    <span className="font-semibold text-neutral-100 block">{u.fullName}</span>
                  </td>

                  <td className="px-4 py-3.5 font-mono text-amber-400 font-bold">
                    {u.icfaiEnrollmentNumber}
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="block text-neutral-200">{u.phone}</span>
                    <span className="text-[11px] text-neutral-400 block">{u.email}</span>
                  </td>

                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        u.verificationStatus === 'verified'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {u.verificationStatus}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 text-neutral-400 font-mono text-[11px]">
                    {new Date(u.createdAt).toLocaleDateString('en-IN')}
                  </td>

                  <td className="px-4 py-3.5 text-right">
                    <select
                      value={u.verificationStatus}
                      onChange={(e) => handleStatusChange(u.id, e.target.value)}
                      className="px-2 py-1 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 focus:outline-none"
                    >
                      <option value="verified">Verified</option>
                      <option value="pending">Pending</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
