import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Settings, Eye, FileEdit, Trash2, Copy, Check, CopyPlus, PenLine } from 'lucide-react';
import type { SavedProposal } from '../types';
import { listProposals, saveProposal, supabase, getPrettyUrl } from '../lib/supabase';

export default function Dashboard() {
  const [proposals, setProposals] = useState<SavedProposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProposals();
  }, []);

  async function fetchProposals() {
    try {
      setLoading(true);
      const data = await listProposals();
      setProposals(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const handleCreate = () => {
    const newId = crypto.randomUUID();
    navigate(`/agensea-admin/edit/${newId}`);
  };

  const handleCopyLink = async (id: string) => {
    // Try pretty URL first, fall back to /v/uuid
    const pretty = await getPrettyUrl(id).catch(() => null);
    const url = pretty
      ? `${window.location.origin}/${pretty.clientSlug}/voorstel/${pretty.proposalSlug}`
      : `${window.location.origin}/v/${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDuplicate = async (proposal: SavedProposal, e: React.MouseEvent) => {
    e.stopPropagation();
    const newId = crypto.randomUUID();
    const duplicatedData = { ...proposal.data, clientName: `${proposal.data.clientName} (kopie)` };
    await saveProposal(newId, duplicatedData);
    navigate(`/agensea-admin/edit/${newId}`);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Zeker weten dat je dit voorstel wilt verwijderen?')) {
      await supabase.from('proposals').delete().eq('id', id);
      setProposals(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F6F3] p-8 md:p-16">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-4">
            <img
              src="/brand/Agensea%20logo.svg"
              alt="Agensea"
              width="400"
              height="400"
              className="h-10 w-auto"
            />
            <div className="pl-4 border-l border-warm-grey">
              <h1 className="text-2xl font-display font-bold text-dark">Proposals</h1>
              <p className="text-sm text-text-secondary font-medium">Beheer alle voorstellen & klantpresentaties</p>
            </div>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-indigo text-white px-6 py-3 rounded-full font-semibold hover:bg-indigo-light transition-colors shadow-lg shadow-indigo/20"
          >
            <Plus className="w-5 h-5" /> Nieuw Voorstel
          </button>
        </header>

        {loading ? (
          <div className="text-center py-20 text-text-secondary animate-pulse">Laden...</div>
        ) : proposals.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-3xl border border-warm-grey">
            <div className="w-16 h-16 bg-indigo/10 rounded-2xl mx-auto mb-6 flex items-center justify-center text-indigo">
              <Settings className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-display font-bold text-dark mb-2">Nog geen voorstellen</h3>
            <p className="text-text-secondary mb-6">Maak je eerste voorstel aan om te beginnen.</p>
            <button onClick={handleCreate} className="text-indigo font-bold hover:opacity-70 transition-opacity">
              + Nieuw Voorstel Starten
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {proposals.map(proposal => (
              <div
                key={proposal.id}
                onClick={() => navigate(`/agensea-admin/edit/${proposal.id}`)}
                className="bg-white rounded-[2rem] p-8 border border-warm-grey hover:border-indigo/50 hover:shadow-xl transition-all cursor-pointer group flex flex-col relative"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-display font-bold text-dark text-xl leading-tight mb-1 line-clamp-1">{proposal.data.clientName || 'Naamloos'}</h3>
                    <p className="text-xs font-bold uppercase tracking-widest text-indigo">{proposal.data.proposalType}</p>
                  </div>
                  {proposal.data.clientLogo && (
                    <img src={proposal.data.clientLogo} alt="Logo" className="w-12 h-12 rounded-lg object-contain p-1" />
                  )}
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Datum</span>
                    <span className="font-medium text-dark">{proposal.data.proposalDate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Status</span>
                    {proposal.signature?.agreed ? (
                      <span className="font-medium flex items-center gap-1.5 bg-green-500/10 text-green-600 px-2 py-0.5 rounded-md text-xs">
                        <PenLine className="w-3.5 h-3.5" /> Ondertekend
                      </span>
                    ) : (
                      <span className="font-medium text-text-secondary bg-warm-grey/50 px-2 py-0.5 rounded-md text-xs">Wacht op akkoord</span>
                    )}
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Views</span>
                    <span className="font-medium text-dark flex items-center gap-1.5 bg-indigo/5 px-2 py-0.5 rounded-md text-indigo">
                      <Eye className="w-4 h-4" /> {proposal.view_count || 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Laatst gewijzigd</span>
                    <span className="font-medium text-dark">{new Date(proposal.updated_at).toLocaleDateString('nl-NL')}</span>
                  </div>
                </div>

                <div className="mt-auto grid grid-cols-4 gap-2 pt-6 border-t border-warm-grey">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleCopyLink(proposal.id); }}
                    className="flex flex-col items-center gap-1.5 text-text-secondary hover:text-indigo transition-colors"
                  >
                    {copiedId === proposal.id ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                    <span className="text-[10px] uppercase tracking-wider font-bold">Link</span>
                  </button>
                  <button
                    onClick={() => navigate(`/agensea-admin/edit/${proposal.id}`)}
                    className="flex flex-col items-center gap-1.5 text-text-secondary hover:text-dark transition-colors"
                  >
                    <FileEdit className="w-5 h-5" />
                    <span className="text-[10px] uppercase tracking-wider font-bold">Bewerk</span>
                  </button>
                  <button
                    onClick={(e) => handleDuplicate(proposal, e)}
                    className="flex flex-col items-center gap-1.5 text-text-secondary hover:text-indigo transition-colors"
                  >
                    <CopyPlus className="w-5 h-5" />
                    <span className="text-[10px] uppercase tracking-wider font-bold">Kopie</span>
                  </button>
                  <button
                    onClick={(e) => handleDelete(proposal.id, e)}
                    className="flex flex-col items-center gap-1.5 text-text-secondary hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                    <span className="text-[10px] uppercase tracking-wider font-bold">Wis</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
