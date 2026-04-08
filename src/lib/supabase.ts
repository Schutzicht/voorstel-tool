import { createClient } from '@supabase/supabase-js';
import type { ProposalData, ProposalSignature, SavedProposal } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. ' +
    'The app will run but proposals will not be persisted.'
  );
}

// Only create the client when credentials are available
export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '');

function isConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

export async function saveProposal(id: string, data: ProposalData) {
  if (!isConfigured()) return null;

  const { data: result, error } = await supabase
    .from('proposals')
    .upsert(
      { id, data, updated_at: new Date().toISOString() },
      { onConflict: 'id' }
    )
    .select()
    .single();

  if (error) {
    console.error('Error saving proposal:', error);
    throw error;
  }

  return result as SavedProposal;
}

export async function getProposal(id: string) {
  if (!isConfigured()) return null;

  const { data, error } = await supabase
    .from('proposals')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching proposal:', error);
    throw error;
  }

  return data as SavedProposal | null;
}

export async function listProposals() {
  if (!isConfigured()) return [];

  const { data, error } = await supabase
    .from('proposals')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching proposals:', error);
    throw error;
  }

  return data as SavedProposal[];
}

export async function signProposal(id: string, signature: ProposalSignature) {
  if (!isConfigured()) return null;

  const { data, error } = await supabase
    .from('proposals')
    .update({ signature, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error signing proposal:', error);
    throw error;
  }

  return data as SavedProposal;
}

export async function incrementViewCount(id: string) {
  if (!isConfigured()) return;

  // Attempt atomic increment via RPC first, fall back to fetch+update
  const { error: rpcError } = await supabase.rpc('increment_view_count', { proposal_id: id });

  if (rpcError) {
    // RPC not available — fall back to non-atomic update
    const { data: current } = await supabase
      .from('proposals')
      .select('view_count')
      .eq('id', id)
      .single();

    if (current) {
      await supabase
        .from('proposals')
        .update({ view_count: (current.view_count || 0) + 1 })
        .eq('id', id);
    }
  }
}
