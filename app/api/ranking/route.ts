import { NextRequest, NextResponse } from "next/server";
import { tabelaResultados } from "@/lib/supabase-config";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

async function contarRegistros(filtro: string): Promise<number> {
  const url = `${SUPABASE_URL}/rest/v1/${tabelaResultados}${filtro ? `?${filtro}` : ""}`;
  const resposta = await fetch(url, {
    method: "HEAD",
    headers: {
      apikey: SUPABASE_KEY!,
      Authorization: `Bearer ${SUPABASE_KEY!}`,
      Prefer: "count=exact"
    }
  });
  const contentRange = resposta.headers.get("content-range");
  if (!contentRange) return 0;
  const total = contentRange.split("/")[1];
  return total ? Number(total) : 0;
}

export async function GET(request: NextRequest) {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const pontuacao = Number(searchParams.get("pontuacao"));
  const tempoParam = searchParams.get("tempo");
  const tempo = tempoParam !== null ? Number(tempoParam) : 0;

  if (!Number.isInteger(pontuacao) || pontuacao < 0 || pontuacao > 10) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  try {
    const [acimaPontuacao, empatesMaisRapidos, total] = await Promise.all([
      contarRegistros(`pontuacao=gt.${pontuacao}`),
      tempo > 0
        ? contarRegistros(`pontuacao=eq.${pontuacao}&tempo_segundos=lt.${tempo}`)
        : Promise.resolve(0),
      contarRegistros("")
    ]);

    return NextResponse.json({
      ok: true,
      posicao: acimaPontuacao + empatesMaisRapidos + 1,
      total
    });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
