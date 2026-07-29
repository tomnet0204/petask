-- vets テーブル（answersより先に作成）
create table if not exists public.vets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  credential text not null,
  specialty text[] default '{}',
  bio text,
  avatar_url text,
  is_verified boolean not null default false,
  created_at timestamptz default now()
);

-- questions テーブル
create table if not exists public.questions (
  id uuid default gen_random_uuid() primary key,
  pet_name text not null,
  animal_type text not null check (animal_type in ('dog', 'cat')),
  age_years integer,
  sex text check (sex in ('male', 'female', 'unknown')),
  body text not null,
  symptom_slug text,
  checker_result jsonb,
  image_urls text[] default '{}',
  status text not null default 'pending' check (status in ('pending', 'answered', 'closed')),
  user_email text,
  user_id uuid references auth.users(id) on delete set null,
  answer_count integer not null default 0,
  created_at timestamptz default now()
);

-- answers テーブル
create table if not exists public.answers (
  id uuid default gen_random_uuid() primary key,
  question_id uuid not null references public.questions(id) on delete cascade,
  vet_id uuid not null references public.vets(id) on delete cascade,
  body text not null,
  is_accepted boolean not null default false,
  created_at timestamptz default now()
);

-- RLS有効化
alter table public.questions enable row level security;
alter table public.answers enable row level security;
alter table public.vets enable row level security;

-- RLSポリシー: questionsは全員閲覧可・投稿は誰でも可
create policy "questions_select_all" on public.questions for select using (true);
create policy "questions_insert_all" on public.questions for insert with check (true);

-- RLSポリシー: answersは全員閲覧可・投稿は認証済みvetのみ
create policy "answers_select_all" on public.answers for select using (true);
create policy "answers_insert_vet" on public.answers for insert
  with check (
    exists (
      select 1 from public.vets
      where vets.user_id = auth.uid()
      and vets.is_verified = true
    )
  );

-- RLSポリシー: vetsは全員閲覧可
create policy "vets_select_all" on public.vets for select using (true);

-- answer_countを自動更新するトリガー
create or replace function update_answer_count()
returns trigger as $$
begin
  update public.questions
  set answer_count = (
    select count(*) from public.answers where question_id = NEW.question_id
  )
  where id = NEW.question_id;
  return NEW;
end;
$$ language plpgsql;

create trigger on_answer_insert
after insert on public.answers
for each row execute function update_answer_count();
