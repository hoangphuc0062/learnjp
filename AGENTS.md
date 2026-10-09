<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## LearnJP authentication

## LearnJP media storage

- Lesson media is stored in Supabase Storage `public` bucket under `n5/audio/` and `n5/vocabulary-atlas.png`. The `public/` directory in Next.js is for build-only static assets, not lesson uploads.
- User uploads belong in the **private** bucket under `<auth.uid()>/...` with RLS; generate signed URLs on the server only after authenticating the owner.
- Source media staging is `assets/n5` (not served by Next.js). Apply `supabase/migrations/20261008170000_storage_buckets.sql`, then run `SUPABASE_SERVICE_ROLE_KEY=... node scripts/upload-n5-storage.mjs` on a trusted local machine. Never expose the service role key to the client.
- Before deploying, verify that the migrated audio/image objects are readable by the browser and private objects are inaccessible to other users.

- Authentication uses Supabase SSR (`lib/supabase`) and shared Zod 4 validation (`lib/auth/validation.ts`).
- Server Actions for sign-in, registration, Google OAuth, verification resend, password recovery/reset, and sign-out live in `app/login/actions.ts`.
- Auth pages share `components/auth-form.tsx`; OAuth/email recovery PKCE callback is `app/auth/callback/route.ts`.
- Supabase project requires Email auth, Google provider credentials, a Site URL, and allowed redirect URLs including `http://localhost:3000/auth/callback` and the production origin's `/auth/callback`. Set `NEXT_PUBLIC_SITE_URL` to the trusted deployment origin; do not expose secret service-role keys to the browser.
- Password rules apply when creating/resetting credentials, not to existing-password sign-in. User-facing authentication messages must not disclose whether a recovery email exists.
- Verify functionality with a configured Supabase project and real email/OAuth flows; lint/build alone does not verify remote auth configuration.
