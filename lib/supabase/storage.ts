const PUBLIC_ASSET_PREFIX = '/n5/';

/** The browser can load course media without a signed URL. */
export function publicCourseAsset(path: string) {
  if (!path.startsWith(PUBLIC_ASSET_PREFIX) || path.includes('..')) throw new Error('Invalid course media path');
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return '';
  const storagePath = path.substring(1).split('/').map(encodeURIComponent).join('/');
  return `${url.replace(/\/$/, '')}/storage/v1/object/public/public/${storagePath}`;
}

/** For private files, request signed URLs on the server after checking authentication. */
export function userPrivatePath(userId: string, filename: string) {
  if (!/^[0-9a-f-]{36}$/i.test(userId) || !/^[\w.-]+$/.test(filename) || filename === '..') throw new Error('Invalid private media path');
  return `${userId}/${filename}`;
}
