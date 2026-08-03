create extension if not exists "pgcrypto";

create table if not exists public.resultados_do_quiz (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  classificacao text not null,
  pontuacao integer not null check (pontuacao >= 0 and pontuacao <= 5),
  compartilhou boolean not null default false,
  origem text,
  tentativa_numero integer not null default 1,
  erros jsonb not null default '[]'::jsonb,
  sorteio_participa boolean not null default false,
  sorteio_nome text,
  sorteio_telefone text
);

alter table public.resultados_do_quiz
  add column if not exists sorteio_participa boolean not null default false,
  add column if not exists sorteio_nome text,
  add column if not exists sorteio_telefone text;

alter table public.resultados_do_quiz
  add column if not exists tempo_segundos integer;

alter table public.resultados_do_quiz
  drop constraint if exists resultados_do_quiz_pontuacao_check;

alter table public.resultados_do_quiz
  add constraint resultados_do_quiz_pontuacao_check
  check (pontuacao >= 0 and pontuacao <= 5);

create index if not exists resultados_do_quiz_ranking_idx
  on public.resultados_do_quiz (pontuacao desc, tempo_segundos asc);

alter table public.resultados_do_quiz enable row level security;

drop policy if exists "Bloquear leitura publica dos resultados" on public.resultados_do_quiz;
create policy "Bloquear leitura publica dos resultados"
on public.resultados_do_quiz
for select
to anon
using (false);

drop policy if exists "Permitir insert anonimo de resultado" on public.resultados_do_quiz;
