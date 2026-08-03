import { NextRequest, NextResponse } from "next/server";
import { tabelaResultados } from "@/lib/supabase-config";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type Participacao = {
  id: string;
  sorteio_telefone: string | null;
  pontuacao: number;
  tempo_segundos: number | null;
};

function telefoneNormalizado(valor: string | null): string {
  return (valor || "").replace(/\D/g, "");
}

function melhorQue(a: Participacao, b: Participacao): boolean {
  if (a.pontuacao !== b.pontuacao) return a.pontuacao > b.pontuacao;
  return (a.tempo_segundos ?? Number.MAX_SAFE_INTEGER) < (b.tempo_segundos ?? Number.MAX_SAFE_INTEGER);
}

export async function GET(request: NextRequest) {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  const id = new URL(request.url).searchParams.get("id") || "";
  if (!UUID.test(id)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  try {
    const parametros = new URLSearchParams({
      select: "id,sorteio_telefone,pontuacao,tempo_segundos",
      sorteio_participa: "eq.true",
    });
    const resposta = await fetch(`${SUPABASE_URL}/rest/v1/${tabelaResultados}?${parametros}`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      cache: "no-store",
    });
    if (!resposta.ok) throw new Error(`Supabase respondeu ${resposta.status}`);

    const participacoes = (await resposta.json()) as Participacao[];
    const atual = participacoes.find((item) => item.id === id);
    if (!atual) return NextResponse.json({ ok: false }, { status: 404 });

    const melhores = new Map<string, Participacao>();
    for (const item of participacoes) {
      const telefone = telefoneNormalizado(item.sorteio_telefone);
      if (telefone.length < 10) continue;
      const anterior = melhores.get(telefone);
      if (!anterior || melhorQue(item, anterior)) melhores.set(telefone, item);
    }

    const ranking = [...melhores.values()].sort((a, b) => {
      if (a.pontuacao !== b.pontuacao) return b.pontuacao - a.pontuacao;
      return (a.tempo_segundos ?? Number.MAX_SAFE_INTEGER) - (b.tempo_segundos ?? Number.MAX_SAFE_INTEGER);
    });
    const telefoneAtual = telefoneNormalizado(atual.sorteio_telefone);
    const posicao = ranking.findIndex((item) => telefoneNormalizado(item.sorteio_telefone) === telefoneAtual) + 1;

    return NextResponse.json({ ok: true, posicao, total: ranking.length }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (erro) {
    console.error("[ranking] falha ao calcular:", erro);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
