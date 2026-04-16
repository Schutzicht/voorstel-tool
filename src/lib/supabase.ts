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

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '');

function isConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

// Agensea org id — same constant as the hub uses.
const AGENSEA_ORG_ID = '2745e3e4-61b8-4c57-a405-ddb3d3063af8';

function slugify(input: string | null | undefined): string | null {
  if (!input) return null;
  const out = input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return out || null;
}

/**
 * Look up or auto-create a client row by name. Returns client id + slug.
 */
async function resolveClient(
  clientName: string | null | undefined,
): Promise<{ id: string; slug: string } | null> {
  if (!clientName?.trim()) return null;
  const trimmed = clientName.trim();
  const slug = slugify(trimmed);
  if (!slug) return null;

  const { data: existing } = await supabase
    .from('clients')
    .select('id, slug')
    .or(`slug.eq.${slug},name.ilike.${trimmed}`)
    .limit(1);
  if (existing && existing.length > 0) return existing[0];

  // Auto-provision
  const { data: created } = await supabase
    .from('clients')
    .insert({ org_id: AGENSEA_ORG_ID, name: trimmed, slug })
    .select('id, slug')
    .single();
  return created ?? null;
}

/**
 * Generate a unique proposal slug within a client.
 */
async function ensureUniqueSlug(
  clientId: string | null,
  baseName: string | null | undefined,
  fallback: string,
): Promise<string> {
  const base = slugify(baseName ?? '') || fallback;
  if (!clientId) return base;

  const { data: existing } = await supabase
    .from('proposals')
    .select('slug')
    .eq('client_id', clientId);
  const taken = new Set<string>(
    (existing ?? []).map((r: { slug: string | null }) => r.slug).filter((s): s is string => !!s),
  );
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}

// ── CRUD ────────────────────────────────────────────────────

export async function saveProposal(id: string, data: ProposalData) {
  if (!isConfigured()) return null;

  // Auto-resolve client + slug so pretty share URLs work.
  const client = await resolveClient(data.clientName);
  const proposalName = data.clientName
    ? `${slugify(data.proposalType) || 'voorstel'}`
    : `voorstel-${Date.now().toString(36)}`;

  // Check if this proposal already exists (update vs insert)
  const { data: prev } = await supabase
    .from('proposals')
    .select('slug, client_id')
    .eq('id', id)
    .maybeSingle();

  // Keep existing slug if proposal was already saved (avoids breaking shared links)
  const slug =
    prev?.slug ??
    (await ensureUniqueSlug(client?.id ?? null, proposalName, `voorstel-${id.slice(0, 8)}`));

  const row: Record<string, unknown> = {
    id,
    data,
    updated_at: new Date().toISOString(),
    slug,
  };
  if (client) {
    row.client_id = client.id;
    row.client_name = data.clientName?.trim() ?? null;
    row.org_id = AGENSEA_ORG_ID;
  }

  const { data: result, error } = await supabase
    .from('proposals')
    .upsert(row, { onConflict: 'id' })
    .select()
    .single();

  if (error) {
    console.error('Error saving proposal:', error);
    throw error;
  }

  // Best-effort: ensure voorstel module access is on for this client
  if (client) {
    await supabase
      .from('client_module_access')
      .upsert(
        { client_id: client.id, module_key: 'voorstel', enabled: true },
        { onConflict: 'client_id,module_key' },
      )
      .then(() => {});
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
    console.error('Error listing proposals:', error);
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

export async function unsignProposal(id: string) {
  if (!isConfigured()) return null;

  const { data, error } = await supabase
    .from('proposals')
    .update({ signature: null, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error unsigning proposal:', error);
    throw error;
  }

  return data as SavedProposal;
}

export async function incrementViewCount(id: string) {
  if (!isConfigured()) return;

  const { error: rpcError } = await supabase.rpc('increment_view_count', { proposal_id: id });

  if (rpcError) {
    const { data } = await supabase
      .from('proposals')
      .select('view_count')
      .eq('id', id)
      .maybeSingle();
    if (data) {
      await supabase
        .from('proposals')
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq('id', id);
    }
  }
}

/**
 * Get pretty URL parts for a proposal. Returns null if the proposal
 * doesn't have a client + slug set yet.
 */
export async function getPrettyUrl(
  proposalId: string,
): Promise<{ clientSlug: string; proposalSlug: string } | null> {
  const { data } = await supabase
    .from('proposals')
    .select('slug, client_id, clients!inner(slug)')
    .eq('id', proposalId)
    .maybeSingle();
  if (!data?.slug || !(data as any).clients?.slug) return null;
  return {
    clientSlug: (data as any).clients.slug,
    proposalSlug: data.slug,
  };
}
