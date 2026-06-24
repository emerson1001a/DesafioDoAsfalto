create extension if not exists "pgcrypto";

create table if not exists public.resultados_do_quiz (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  classificacao text not null,
  pontuacao integer not null check (pontuacao >= 0 and pontuacao <= 10),
  compartilhou boolean not null default false,
  origem text,
  tentativa_numero integer not null default 1,
  erros jsonb not null default '[]'::jsonb
);

alter table public.resultados_do_quiz enable row level security;

drop policy if exists "Bloquear leitura publica dos resultados" on public.resultados_do_quiz;
create policy "Bloquear leitura publica dos resultados"
on public.resultados_do_quiz
for select
to anon
using (false);

drop policy if exists "Permitir insert anonimo de resultado" on public.resultados_do_quiz;
create policy "Permitir insert anonimo de resultado"
on public.resultados_do_quiz
for insert
to anon
with check (true);
