import { type ReactNode } from 'react';

export function Label({ children }: { children: ReactNode }) {
  return <label className="block text-[11px] uppercase tracking-widest font-bold text-text-secondary mb-2">{children}</label>;
}

export function Textarea({ value, onChange, rows = 4, placeholder }: {
  value: string; onChange: (v: string) => void; rows?: number; placeholder?: string
}) {
  return (
    <textarea
      rows={rows}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full text-sm bg-white border border-warm-grey rounded-xl focus:border-indigo focus:ring-1 focus:ring-indigo/20 outline-none p-3 transition-all resize-none font-sans text-dark leading-relaxed"
    />
  );
}

export function TextInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full text-sm bg-white border border-warm-grey rounded-xl focus:border-indigo focus:ring-1 focus:ring-indigo/20 outline-none px-3 py-2.5 transition-all font-sans text-dark"
    />
  );
}
