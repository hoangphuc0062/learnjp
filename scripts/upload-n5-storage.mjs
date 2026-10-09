/** Upload once after applying the storage migration. Run with SUPABASE_SERVICE_ROLE_KEY locally. */
import { createClient } from '@supabase/supabase-js';
import { readdir, readFile } from 'node:fs/promises';
import { join, relative, extname } from 'node:path';

try { process.loadEnvFile('.env'); } catch { /* env may be injected by the shell */ }
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY locally to upload.');
const storage = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } }).storage;
const { data: bucket, error: bucketError } = await storage.getBucket('public');
if (bucketError || !bucket?.public) throw new Error('Run the bucket migration first (public bucket missing or not public).');
const root = join(process.cwd(), 'assets/n5');
async function* walk(dir) {
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const file = join(dir, item.name);
    if (item.isDirectory()) yield* walk(file);
    else if (item.isFile()) yield file;
  }
}
let count = 0;
for await (const file of walk(root)) {
  const key = `n5/${relative(root, file).replaceAll('\\', '/')}`;
  const type = extname(file) === '.m4a' ? 'audio/mp4' : 'image/png';
  const { error } = await storage.from('public').upload(key, await readFile(file), { contentType: type, upsert: true });
  if (error) throw new Error(`Upload failed at ${key}: ${error.message}`);
  count++;
}
console.log(`Uploaded ${count} course assets to public bucket.`);
