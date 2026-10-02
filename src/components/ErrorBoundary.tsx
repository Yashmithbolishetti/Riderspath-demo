import React, { useState, useEffect } from 'react';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';

export const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Captured window error:', event.error);
      setHasError(true);
      setErrorMessage(event.message || 'An unexpected display issue occurred.');
    };
    const handleRejection = (event: PromiseRejectionEvent) => {
      console.warn('Unhandled rejection captured:', event.reason);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  const handleReset = () => {
    setHasError(false);
    setErrorMessage('');
    window.location.hash = '';
    window.location.reload();
  };

  if (hasError) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-6 selection:bg-amber-500 selection:text-neutral-950 font-sans">
        <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
            <AlertCircle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="font-display font-bold text-2xl text-white">Application Notice</h1>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Riders Path encountered a display issue. Your saved bookings, fleet, and settings are preserved.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs font-mono text-amber-300 text-left overflow-x-auto max-h-24">
              {errorMessage}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleReset}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold text-sm transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Reload App
            </button>
            <button
              onClick={() => {
                window.location.hash = '#home';
                window.location.reload();
              }}
              className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium text-sm transition-all cursor-pointer"
            >
              <Home className="w-4 h-4" />
              Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
