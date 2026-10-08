-- Japanese dictionary/content schema for Kana, KANJIDIC2, JMdict, JLPT mappings, and examples.
-- Existing public.vocabulary columns are retained as a compatibility surface for the current UI.

alter table public.vocabulary
  add column jmdict_seq bigint,
  add column is_common boolean not null default false,
  add column source text not null default 'manual';

create unique index vocabulary_jmdict_seq_idx
  on public.vocabulary (jmdict_seq)
  where jmdict_seq is not null;

create index vocabulary_expression_idx on public.vocabulary (expression);
create index vocabulary_reading_idx on public.vocabulary (reading);

create table public.kana (
  id bigint generated always as identity primary key,
  character text not null,
  script text not null check (script in ('hiragana', 'katakana')),
  romaji text not null,
  row_name text,
  vowel text check (vowel is null or vowel in ('a', 'i', 'u', 'e', 'o')),
  category text not null default 'basic'
    check (category in ('basic', 'dakuten', 'handakuten', 'yoon', 'small', 'other')),
  base_kana_id bigint references public.kana(id) on delete set null,
  sort_order integer not null check (sort_order >= 0),
  created_at timestamptz not null default now(),
  unique (script, character)
);

create index kana_script_sort_idx on public.kana (script, sort_order);
create index kana_base_kana_id_idx on public.kana (base_kana_id);

create table public.jlpt_levels (
  code text primary key check (code in ('N5', 'N4', 'N3', 'N2', 'N1')),
  rank smallint not null unique check (rank between 1 and 5),
  label text not null,
  created_at timestamptz not null default now()
);

insert into public.jlpt_levels (code, rank, label)
values
  ('N5', 5, 'JLPT N5'),
  ('N4', 4, 'JLPT N4'),
  ('N3', 3, 'JLPT N3'),
  ('N2', 2, 'JLPT N2'),
  ('N1', 1, 'JLPT N1')
on conflict (code) do update
set rank = excluded.rank,
    label = excluded.label;

create table public.kanji (
  id bigint generated always as identity primary key,
  literal text not null unique,
  stroke_count smallint check (stroke_count is null or stroke_count > 0),
  grade smallint check (grade is null or grade > 0),
  frequency integer check (frequency is null or frequency > 0),
  radical_classical smallint check (radical_classical is null or radical_classical > 0),
  source text not null default 'KANJIDIC2',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index kanji_frequency_idx
  on public.kanji (frequency)
  where frequency is not null;

create table public.kanji_readings (
  id bigint generated always as identity primary key,
  kanji_id bigint not null references public.kanji(id) on delete cascade,
  reading text not null,
  reading_type text not null check (reading_type in ('on', 'kun', 'nanori', 'other')),
  is_common boolean not null default false,
  created_at timestamptz not null default now(),
  unique (kanji_id, reading_type, reading)
);

create index kanji_readings_kanji_id_idx on public.kanji_readings (kanji_id);
create index kanji_readings_reading_idx on public.kanji_readings (reading);

create table public.kanji_meanings (
  id bigint generated always as identity primary key,
  kanji_id bigint not null references public.kanji(id) on delete cascade,
  language text not null default 'en',
  meaning text not null,
  order_index smallint not null default 0 check (order_index >= 0),
  created_at timestamptz not null default now(),
  unique (kanji_id, language, meaning)
);

create index kanji_meanings_kanji_id_idx on public.kanji_meanings (kanji_id);

create table public.kanji_jlpt (
  kanji_id bigint not null references public.kanji(id) on delete cascade,
  level_code text not null references public.jlpt_levels(code) on delete restrict,
  source text not null,
  created_at timestamptz not null default now(),
  primary key (kanji_id, level_code, source)
);

create index kanji_jlpt_level_idx on public.kanji_jlpt (level_code, kanji_id);

create table public.vocabulary_readings (
  id bigint generated always as identity primary key,
  vocabulary_id uuid not null references public.vocabulary(id) on delete cascade,
  reading text not null,
  is_primary boolean not null default false,
  no_kanji boolean not null default false,
  restrictions text[] not null default '{}',
  priority_tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  unique (vocabulary_id, reading)
);

create index vocabulary_readings_vocabulary_id_idx on public.vocabulary_readings (vocabulary_id);
create index vocabulary_readings_reading_idx on public.vocabulary_readings (reading);

create table public.vocabulary_senses (
  id bigint generated always as identity primary key,
  vocabulary_id uuid not null references public.vocabulary(id) on delete cascade,
  sense_index smallint not null check (sense_index > 0),
  parts_of_speech text[] not null default '{}',
  fields text[] not null default '{}',
  misc text[] not null default '{}',
  dialects text[] not null default '{}',
  info text[] not null default '{}',
  antonyms text[] not null default '{}',
  cross_references text[] not null default '{}',
  created_at timestamptz not null default now(),
  unique (vocabulary_id, sense_index)
);

create index vocabulary_senses_vocabulary_id_idx on public.vocabulary_senses (vocabulary_id);

create table public.vocabulary_glosses (
  id bigint generated always as identity primary key,
  sense_id bigint not null references public.vocabulary_senses(id) on delete cascade,
  language text not null default 'en',
  gloss text not null,
  order_index smallint not null default 0 check (order_index >= 0),
  created_at timestamptz not null default now(),
  unique (sense_id, language, gloss)
);

create index vocabulary_glosses_sense_id_idx on public.vocabulary_glosses (sense_id);

create table public.vocabulary_jlpt (
  vocabulary_id uuid not null references public.vocabulary(id) on delete cascade,
  level_code text not null references public.jlpt_levels(code) on delete restrict,
  source text not null,
  created_at timestamptz not null default now(),
  primary key (vocabulary_id, level_code, source)
);

create index vocabulary_jlpt_level_idx on public.vocabulary_jlpt (level_code, vocabulary_id);

create table public.examples (
  id bigint generated always as identity primary key,
  tatoeba_id bigint unique,
  japanese_text text not null,
  transliteration text,
  source text not null default 'manual',
  created_at timestamptz not null default now(),
  unique (source, japanese_text)
);

create index examples_japanese_text_idx on public.examples (japanese_text);

create table public.example_translations (
  id bigint generated always as identity primary key,
  example_id bigint not null references public.examples(id) on delete cascade,
  language text not null,
  translated_text text not null,
  source_translation_id bigint,
  created_at timestamptz not null default now(),
  unique (example_id, language, translated_text)
);

create index example_translations_example_id_idx on public.example_translations (example_id);

create table public.vocabulary_examples (
  vocabulary_id uuid not null references public.vocabulary(id) on delete cascade,
  example_id bigint not null references public.examples(id) on delete cascade,
  source text not null default 'manual',
  created_at timestamptz not null default now(),
  primary key (vocabulary_id, example_id)
);

create index vocabulary_examples_example_id_idx on public.vocabulary_examples (example_id);

alter table public.kana enable row level security;
alter table public.jlpt_levels enable row level security;
alter table public.kanji enable row level security;
alter table public.kanji_readings enable row level security;
alter table public.kanji_meanings enable row level security;
alter table public.kanji_jlpt enable row level security;
alter table public.vocabulary_readings enable row level security;
alter table public.vocabulary_senses enable row level security;
alter table public.vocabulary_glosses enable row level security;
alter table public.vocabulary_jlpt enable row level security;
alter table public.examples enable row level security;
alter table public.example_translations enable row level security;
alter table public.vocabulary_examples enable row level security;

revoke all on table
  public.kana,
  public.jlpt_levels,
  public.kanji,
  public.kanji_readings,
  public.kanji_meanings,
  public.kanji_jlpt,
  public.vocabulary_readings,
  public.vocabulary_senses,
  public.vocabulary_glosses,
  public.vocabulary_jlpt,
  public.examples,
  public.example_translations,
  public.vocabulary_examples
from anon, authenticated;

grant select on table
  public.kana,
  public.jlpt_levels,
  public.kanji,
  public.kanji_readings,
  public.kanji_meanings,
  public.kanji_jlpt,
  public.vocabulary_readings,
  public.vocabulary_senses,
  public.vocabulary_glosses,
  public.vocabulary_jlpt,
  public.examples,
  public.example_translations,
  public.vocabulary_examples
to anon, authenticated;

create policy "kana is publicly readable" on public.kana
  for select to anon, authenticated using (true);
create policy "jlpt levels are publicly readable" on public.jlpt_levels
  for select to anon, authenticated using (true);
create policy "kanji is publicly readable" on public.kanji
  for select to anon, authenticated using (true);
create policy "kanji readings are publicly readable" on public.kanji_readings
  for select to anon, authenticated using (true);
create policy "kanji meanings are publicly readable" on public.kanji_meanings
  for select to anon, authenticated using (true);
create policy "kanji jlpt mappings are publicly readable" on public.kanji_jlpt
  for select to anon, authenticated using (true);
create policy "vocabulary readings are publicly readable" on public.vocabulary_readings
  for select to anon, authenticated using (true);
create policy "vocabulary senses are publicly readable" on public.vocabulary_senses
  for select to anon, authenticated using (true);
create policy "vocabulary glosses are publicly readable" on public.vocabulary_glosses
  for select to anon, authenticated using (true);
create policy "vocabulary jlpt mappings are publicly readable" on public.vocabulary_jlpt
  for select to anon, authenticated using (true);
create policy "examples are publicly readable" on public.examples
  for select to anon, authenticated using (true);
create policy "example translations are publicly readable" on public.example_translations
  for select to anon, authenticated using (true);
create policy "vocabulary examples are publicly readable" on public.vocabulary_examples
  for select to anon, authenticated using (true);
