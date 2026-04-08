import { useRef, useState } from 'react';
import { Upload, Trash2, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import type { ProposalData } from '../../types';
import { PROPOSAL_TYPES } from '../../types';
import { uploadLogo, deleteLogo } from '../../lib/storage';
import { Label, TextInput } from './FormHelpers';

interface Props {
  data: ProposalData;
  proposalId?: string;
  upd: <K extends keyof ProposalData>(key: K, value: ProposalData[K]) => void;
}

export function CoverForm({ data, proposalId, upd }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (proposalId) {
      setUploading(true);
      try {
        const url = await uploadLogo(proposalId, file);
        upd('clientLogo', url);
      } finally {
        setUploading(false);
      }
    } else {
      // No proposal ID yet — use base64 fallback
      const reader = new FileReader();
      reader.onload = (ev) => upd('clientLogo', ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleLogoDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    upd('clientLogo', '');
    upd('logoScale', 48);
    if (proposalId) {
      deleteLogo(proposalId).catch(console.error);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <Label>Bedrijfsnaam klant *</Label>
        <TextInput value={data.clientName} onChange={v => upd('clientName', v)} placeholder="De Next Play" />
      </div>
      <div>
        <Label>Type voorstel</Label>
        <div className="grid gap-2">
          {PROPOSAL_TYPES.map(t => (
            <button
              key={t}
              onClick={() => upd('proposalType', t)}
              className={clsx(
                'text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all',
                data.proposalType === t
                  ? 'border-indigo bg-indigo/5 text-indigo ring-1 ring-indigo/30'
                  : 'border-warm-grey bg-white text-dark hover:border-indigo'
              )}
            >{t}</button>
          ))}
        </div>
      </div>
      <div>
        <Label>Logo klant (upload afbeelding)</Label>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
        <div className="relative">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full border-2 border-dashed border-warm-grey rounded-xl py-6 flex flex-col items-center gap-2 text-text-secondary hover:border-indigo hover:text-indigo transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <><Loader2 className="w-6 h-6 animate-spin" /><span className="text-sm font-medium">Uploaden...</span></>
            ) : data.clientLogo ? (
              <img src={data.clientLogo} alt="logo" style={{ height: `${data.logoScale ?? 48}px` }} className="object-contain" />
            ) : (
              <><Upload className="w-6 h-6" /><span className="text-sm font-medium">Klik om logo te uploaden</span></>
            )}
          </button>
          {data.clientLogo && (
            <button
              onClick={handleLogoDelete}
              className="absolute top-2 right-2 w-8 h-8 bg-white border border-warm-grey rounded-lg flex items-center justify-center text-text-secondary hover:text-red-500 hover:border-red-300 transition-colors shadow-sm"
              title="Logo verwijderen"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
        {data.clientLogo && (
          <div className="mt-3">
            <Label>Logo grootte</Label>
            <div className="flex items-center gap-3">
              <span className="text-xs text-text-secondary">Klein</span>
              <input
                type="range"
                min={24}
                max={120}
                value={data.logoScale ?? 48}
                onChange={e => upd('logoScale', Number(e.target.value))}
                className="flex-1 accent-indigo"
              />
              <span className="text-xs text-text-secondary">Groot</span>
            </div>
          </div>
        )}
      </div>
      <div>
        <Label>Datum voorstel</Label>
        <TextInput value={data.proposalDate} onChange={v => upd('proposalDate', v)} placeholder="30-3-2025" />
      </div>
    </div>
  );
}
