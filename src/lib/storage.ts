import { supabase } from './supabase';

/**
 * Upload a logo file to Supabase Storage and return the public URL.
 * Falls back to base64 data URL if Storage is not available.
 */
export async function uploadLogo(proposalId: string, file: File): Promise<string> {
  const ext = file.name.split('.').pop() || 'png';
  const path = `logos/${proposalId}.${ext}`;

  const { error } = await supabase.storage
    .from('proposal-assets')
    .upload(path, file, { upsert: true, contentType: file.type });

  if (error) {
    console.warn('Storage upload failed, falling back to base64:', error.message);
    return fileToBase64(file);
  }

  const { data } = supabase.storage.from('proposal-assets').getPublicUrl(path);
  // Append cache-bust to force fresh load after re-upload
  return `${data.publicUrl}?t=${Date.now()}`;
}

/**
 * Delete a logo from Supabase Storage.
 */
export async function deleteLogo(proposalId: string): Promise<void> {
  // Try common extensions — storage won't error if file doesn't exist
  const extensions = ['png', 'jpg', 'jpeg', 'svg', 'webp'];
  const paths = extensions.map(ext => `logos/${proposalId}.${ext}`);
  await supabase.storage.from('proposal-assets').remove(paths);
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (ev) => resolve(ev.target?.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
