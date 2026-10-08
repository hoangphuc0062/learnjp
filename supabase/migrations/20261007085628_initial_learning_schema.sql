create table public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  level text not null check (level in ('FOUNDATION', 'N5', 'N4', 'N3', 'N2', 'N1')),
  order_index integer not null default 0 check (order_index >= 0),
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.units (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  slug text not null,
  title text not null,
  description text,
  symbol text not null default '学',
  order_index integer not null default 0 check (order_index >= 0),
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (course_id, slug)
);

create index units_course_order_idx
  on public.units (course_id, order_index);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid not null references public.units(id) on delete cascade,
  slug text not null unique,
  title text not null,
  japanese_title text not null default '',
  description text,
  level text not null check (level in ('FOUNDATION', 'N5', 'N4', 'N3', 'N2', 'N1')),
  lesson_type text not null default 'mixed'
    check (lesson_type in ('kana', 'vocabulary', 'grammar', 'reading', 'listening', 'mixed')),
  estimated_minutes integer not null default 10 check (estimated_minutes between 1 and 180),
  item_count integer not null default 0 check (item_count >= 0),
  order_index integer not null default 0 check (order_index >= 0),
  content jsonb not null default '{}'::jsonb,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index lessons_unit_order_idx
  on public.lessons (unit_id, order_index);

create index lessons_published_idx
  on public.lessons (is_published)
  where is_published = true;

create table public.vocabulary (
  id uuid primary key default gen_random_uuid(),
  expression text not null,
  reading text not null,
  meaning text not null,
  level text not null check (level in ('FOUNDATION', 'N5', 'N4', 'N3', 'N2', 'N1')),
  part_of_speech text,
  example text,
  example_meaning text,
  audio_path text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index vocabulary_level_published_idx
  on public.vocabulary (level, is_published);

create table public.lesson_vocabulary (
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  vocabulary_id uuid not null references public.vocabulary(id) on delete cascade,
  order_index integer not null default 0 check (order_index >= 0),
  primary key (lesson_id, vocabulary_id)
);

create index lesson_vocabulary_order_idx
  on public.lesson_vocabulary (lesson_id, order_index);

create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  target_level text not null default 'N5'
    check (target_level in ('FOUNDATION', 'N5', 'N4', 'N3', 'N2', 'N1')),
  daily_goal_minutes integer not null default 25
    check (daily_goal_minutes between 5 and 240),
  timezone text not null default 'Asia/Ho_Chi_Minh',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.lesson_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  progress_percent integer not null default 0 check (progress_percent between 0 and 100),
  started_at timestamptz,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create index lesson_progress_user_updated_idx
  on public.lesson_progress (user_id, updated_at desc);

create table public.review_state (
  user_id uuid not null references auth.users(id) on delete cascade,
  vocabulary_id uuid not null references public.vocabulary(id) on delete cascade,
  last_rating text check (last_rating in ('again', 'hard', 'good')),
  interval_days integer not null default 0 check (interval_days >= 0),
  repetitions integer not null default 0 check (repetitions >= 0),
  due_at timestamptz not null default now(),
  last_reviewed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, vocabulary_id)
);

create index review_state_due_idx
  on public.review_state (user_id, due_at);

create table public.review_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  vocabulary_id uuid not null references public.vocabulary(id) on delete cascade,
  rating text not null check (rating in ('again', 'hard', 'good')),
  reviewed_at timestamptz not null default now()
);

create index review_attempts_user_reviewed_idx
  on public.review_attempts (user_id, reviewed_at desc);

alter table public.courses enable row level security;
alter table public.units enable row level security;
alter table public.lessons enable row level security;
alter table public.vocabulary enable row level security;
alter table public.lesson_vocabulary enable row level security;
alter table public.profiles enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.review_state enable row level security;
alter table public.review_attempts enable row level security;

grant usage on schema public to anon, authenticated;
grant select on public.courses, public.units, public.lessons, public.vocabulary, public.lesson_vocabulary
  to anon, authenticated;
grant insert, update, delete on public.courses, public.units, public.lessons, public.vocabulary, public.lesson_vocabulary
  to authenticated;
grant select, insert, update, delete on public.profiles, public.lesson_progress, public.review_state, public.review_attempts
  to authenticated;

create policy "published courses are readable"
  on public.courses for select
  to anon, authenticated
  using (
    is_published
    or coalesce((select auth.jwt()) -> 'app_metadata' ->> 'role', '') = 'admin'
  );

create policy "published units are readable"
  on public.units for select
  to anon, authenticated
  using (
    (
      is_published
      and exists (
        select 1
        from public.courses c
        where c.id = course_id and c.is_published
      )
    )
    or coalesce((select auth.jwt()) -> 'app_metadata' ->> 'role', '') = 'admin'
  );

create policy "published lessons are readable"
  on public.lessons for select
  to anon, authenticated
  using (
    (
      is_published
      and exists (
        select 1
        from public.units u
        join public.courses c on c.id = u.course_id
        where u.id = unit_id and u.is_published and c.is_published
      )
    )
    or coalesce((select auth.jwt()) -> 'app_metadata' ->> 'role', '') = 'admin'
  );

create policy "published vocabulary is readable"
  on public.vocabulary for select
  to anon, authenticated
  using (
    is_published
    or coalesce((select auth.jwt()) -> 'app_metadata' ->> 'role', '') = 'admin'
  );

create policy "published lesson vocabulary is readable"
  on public.lesson_vocabulary for select
  to anon, authenticated
  using (
    (
      exists (
        select 1 from public.lessons l
        where l.id = lesson_id and l.is_published
      )
      and exists (
        select 1 from public.vocabulary v
        where v.id = vocabulary_id and v.is_published
      )
    )
    or coalesce((select auth.jwt()) -> 'app_metadata' ->> 'role', '') = 'admin'
  );

create policy "admins insert courses"
  on public.courses for insert
  to authenticated
  with check (coalesce((select auth.jwt()) -> 'app_metadata' ->> 'role', '') = 'admin');

create policy "admins update courses"
  on public.courses for update
  to authenticated
  using (coalesce((select auth.jwt()) -> 'app_metadata' ->> 'role', '') = 'admin')
  with check (coalesce((select auth.jwt()) -> 'app_metadata' ->> 'role', '') = 'admin');

create policy "admins delete courses"
  on public.courses for delete
  to authenticated
  using (coalesce((select auth.jwt()) -> 'app_metadata' ->> 'role', '') = 'admin');

create policy "admins insert units"
  on public.units for insert
  to authenticated
  with check (coalesce((select auth.jwt()) -> 'app_metadata' ->> 'role', '') = 'admin');

create policy "admins update units"
  on public.units for update
  to authenticated
  using (coalesce((select auth.jwt()) -> 'app_metadata' ->> 'role', '') = 'admin')
  with check (coalesce((select auth.jwt()) -> 'app_metadata' ->> 'role', '') = 'admin');

create policy "admins delete units"
  on public.units for delete
  to authenticated
  using (coalesce((select auth.jwt()) -> 'app_metadata' ->> 'role', '') = 'admin');

create policy "admins insert lessons"
  on public.lessons for insert
  to authenticated
  with check (coalesce((select auth.jwt()) -> 'app_metadata' ->> 'role', '') = 'admin');

create policy "admins update lessons"
  on public.lessons for update
  to authenticated
  using (coalesce((select auth.jwt()) -> 'app_metadata' ->> 'role', '') = 'admin')
  with check (coalesce((select auth.jwt()) -> 'app_metadata' ->> 'role', '') = 'admin');

create policy "admins delete lessons"
  on public.lessons for delete
  to authenticated
  using (coalesce((select auth.jwt()) -> 'app_metadata' ->> 'role', '') = 'admin');

create policy "admins insert vocabulary"
  on public.vocabulary for insert
  to authenticated
  with check (coalesce((select auth.jwt()) -> 'app_metadata' ->> 'role', '') = 'admin');

create policy "admins update vocabulary"
  on public.vocabulary for update
  to authenticated
  using (coalesce((select auth.jwt()) -> 'app_metadata' ->> 'role', '') = 'admin')
  with check (coalesce((select auth.jwt()) -> 'app_metadata' ->> 'role', '') = 'admin');

create policy "admins delete vocabulary"
  on public.vocabulary for delete
  to authenticated
  using (coalesce((select auth.jwt()) -> 'app_metadata' ->> 'role', '') = 'admin');

create policy "admins insert lesson vocabulary"
  on public.lesson_vocabulary for insert
  to authenticated
  with check (coalesce((select auth.jwt()) -> 'app_metadata' ->> 'role', '') = 'admin');

create policy "admins update lesson vocabulary"
  on public.lesson_vocabulary for update
  to authenticated
  using (coalesce((select auth.jwt()) -> 'app_metadata' ->> 'role', '') = 'admin')
  with check (coalesce((select auth.jwt()) -> 'app_metadata' ->> 'role', '') = 'admin');

create policy "admins delete lesson vocabulary"
  on public.lesson_vocabulary for delete
  to authenticated
  using (coalesce((select auth.jwt()) -> 'app_metadata' ->> 'role', '') = 'admin');

create policy "users read own profile"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "users create own profile"
  on public.profiles for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "users update own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "users read own lesson progress"
  on public.lesson_progress for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "users create own lesson progress"
  on public.lesson_progress for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "users update own lesson progress"
  on public.lesson_progress for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "users delete own lesson progress"
  on public.lesson_progress for delete
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "users read own review state"
  on public.review_state for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "users create own review state"
  on public.review_state for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "users update own review state"
  on public.review_state for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "users delete own review state"
  on public.review_state for delete
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "users read own review attempts"
  on public.review_attempts for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "users create own review attempts"
  on public.review_attempts for insert
  to authenticated
  with check ((select auth.uid()) = user_id);
