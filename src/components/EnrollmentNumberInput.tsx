import React, { useState, useEffect } from 'react';
import { validateIcfaiEnrollment, ICFAI_ENROLLMENT_PLACEHOLDER } from '../utils/validation';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface EnrollmentNumberInputProps {
  id?: string;
  value: string;
  onChange: (value: string, isValid: boolean) => void;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  showStatusBadge?: boolean;
  showHelpText?: boolean;
  customError?: string;
}

export const EnrollmentNumberInput: React.FC<EnrollmentNumberInputProps> = ({
  id = 'icfai-enrollment-input',
  value,
  onChange,
  label = 'ICFAI Enrollment Number',
  required = true,
  disabled = false,
  className = '',
  showStatusBadge = true,
  showHelpText = true,
  customError,
}) => {
  const [touched, setTouched] = useState(false);
  const [localError, setLocalError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!touched && !value) {
      setLocalError(undefined);
      return;
    }

    if (value.trim()) {
      const res = validateIcfaiEnrollment(value);
      setLocalError(res.valid ? undefined : res.error);
    } else if (required && touched) {
      setLocalError('ICFAI enrollment number is required.');
    } else {
      setLocalError(undefined);
    }
  }, [value, touched, required]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Strip spaces immediately and convert to uppercase
    const rawVal = e.target.value.replace(/\s+/g, '').toUpperCase();
    const res = validateIcfaiEnrollment(rawVal);
    onChange(rawVal, res.valid);
  };

  const handleBlur = () => {
    setTouched(true);
    if (value.trim()) {
      const res = validateIcfaiEnrollment(value);
      setLocalError(res.valid ? undefined : res.error);
    }
  };

  const displayError = customError || (touched ? localError : undefined);
  const isValid = value.trim().length >= 10 && !localError;

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label htmlFor={id} className="block text-xs font-medium text-neutral-300">
            {label} {required && <span className="text-amber-500">*</span>}
          </label>
          <span className="text-[11px] font-mono text-neutral-400">
            {ICFAI_ENROLLMENT_PLACEHOLDER}
          </span>
        </div>
      )}

      <div className="relative">
        <input
          id={id}
          type="text"
          required={required}
          disabled={disabled}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={ICFAI_ENROLLMENT_PLACEHOLDER}
          className={`w-full px-3.5 py-2.5 uppercase font-mono rounded-xl bg-neutral-950 border text-sm text-neutral-100 placeholder-neutral-500 transition-colors focus:outline-none ${
            displayError
              ? 'border-rose-500/80 focus:border-rose-400 focus:ring-1 focus:ring-rose-500/50'
              : isValid
              ? 'border-emerald-600/70 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50'
              : 'border-neutral-800 focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60'
          } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        />

        {showStatusBadge && (
          <div className="absolute right-3 top-2.5 flex items-center gap-1">
            {isValid ? (
              <span className="inline-flex items-center gap-1 text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/80">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Valid ID
              </span>
            ) : (
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-700">
                ICFAI ID
              </span>
            )}
          </div>
        )}
      </div>

      {displayError ? (
        <p className="text-[11px] text-rose-400 flex items-center gap-1 font-medium animate-in fade-in">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{displayError}</span>
        </p>
      ) : showHelpText ? (
        <p className="text-[11px] text-neutral-500">
          Must be at least 10 alphanumeric characters ({ICFAI_ENROLLMENT_PLACEHOLDER}).
        </p>
      ) : null}
    </div>
  );
};
