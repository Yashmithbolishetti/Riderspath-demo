import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useAuth();

  if (!toast) return null;

  const bgClasses = {
    success: 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200',
    error: 'bg-rose-950/90 border-rose-500/40 text-rose-200',
    info: 'bg-neutral-900/90 border-amber-500/40 text-neutral-200',
  }[toast.type];

  const Icon = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
  }[toast.type];

  return (
    <div
      id="toast-notification"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl transition-all animate-in fade-in slide-in-from-bottom-5 max-w-md text-sm"
    >
      <div className={`${bgClasses} flex items-center gap-3 px-3 py-2 rounded-lg`}>
        <Icon className="w-5 h-5 shrink-0" />
        <p className="font-medium">{toast.message}</p>
      </div>
    </div>
  );
};

export const ToastContainer = Toast;

