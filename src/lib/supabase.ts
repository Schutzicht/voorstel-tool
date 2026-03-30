import { createClient } from '@supabase/supabase-js';
import type { ProposalData, SavedProposal } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function saveProposal(id: string, data: ProposalData) {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase not configured. Proposal not saved remotely.');
    return null;
  }

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
  if (!supabaseUrl || !supabaseAnonKey) return null;

  const { data, error } = await supabase
    .from('proposals')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching proposal:', error);
    throw error;
  }

  return data as SavedProposal;
}

export async function listProposals() {
  if (!supabaseUrl || !supabaseAnonKey) return [];

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

export async function incrementViewCount(id: string) {
  if (!supabaseUrl || !supabaseAnonKey) return;

  // Since we are using an anon key without complex RPC functions for this simple setup,
  // we first fetch the current count, then update it. Not perfect for high concurrency, 
  // but fine for proposal views.
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
