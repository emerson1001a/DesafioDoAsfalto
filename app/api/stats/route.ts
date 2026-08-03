import { NextRequest, NextResponse } from "next/server";
import { tabelaResultados } from "@/lib/supabase-config";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const STATS_API_KEY = process.env.STATS_API_KEY;

type Resultado = {
  classificacao: string;
  compartilhou: boolean;
  erros: number[] | null;
};

export async function GET(request: NextRequest) {
  const autorizacao = request.headers.get("authorization");
  if (!STATS_API_KEY || autorizacao !== `Bearer ${STATS_API_KEY}`) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return NextResponse.json({ ok: false, erro: "Supabase não configurado" }, { status: 500 });
  }

  const resposta = await fetch(
    `${SUPABASE_URL}/rest/v1/${tabelaResultados}?select=classificacao,compartilhou,erros`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      },
      cache: "no-store"
    }
  );

  if (!resposta.ok) {
    console.error("[stats] Supabase respondeu", resposta.status, await resposta.text());
    return NextResponse.json({ ok: false }, { status: 502 });
  }

  const dados = (await resposta.json()) as Resultado[];
  const total = dados.length;
  const distribuicao: Record<string, number> = {};
  const errosPorPergunta: Record<string, number> = {};
  let compartilhamentos = 0;

  for (const item of dados) {
    distribuicao[item.classificacao] = (distribuicao[item.classificacao] || 0) + 1;
    if (item.compartilhou) compartilhamentos += 1;

    for (const id of item.erros || []) {
      const chave = String(id);
      errosPorPergunta[chave] = (errosPorPergunta[chave] || 0) + 1;
    }
  }

  const distribuicaoPercentual = Object.fromEntries(
    Object.entries(distribuicao).map(([classe, quantidade]) => [
      classe,
      total ? Number(((quantidade / total) * 100).toFixed(1)) : 0
    ])
  );

  const perguntaMaiorErro = Object.entries(errosPorPergunta).sort((a, b) => b[1] - a[1])[0] || null;

  return NextResponse.json({
    ok: true,
    total_respostas: total,
    distribuicao_percentual: distribuicaoPercentual,
    pergunta_maior_indice_erro: perguntaMaiorErro
      ? { pergunta_id: Number(perguntaMaiorErro[0]), erros: perguntaMaiorErro[1] }
      : null,
    percentual_usuarios_que_compartilharam: total ? Number(((compartilhamentos / total) * 100).toFixed(1)) : 0
  }, { headers: { "Cache-Control": "no-store" } });
}
