import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { tabelaResultados } from "@/lib/supabase-config";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const pontuacao = Number(body.pontuacao);
    const tentativa = Number(body.tentativa_numero || 1);
    const erros = Array.isArray(body.erros)
      ? body.erros.map((id: unknown) => Number(id)).filter((id: number) => Number.isInteger(id) && id >= 1 && id <= 10)
      : [];
    const tempoSegundosRaw = body.tempo_segundos !== undefined && body.tempo_segundos !== null ? Number(body.tempo_segundos) : null;
    const tempoSegundos = tempoSegundosRaw !== null && Number.isInteger(tempoSegundosRaw) && tempoSegundosRaw >= 0 ? tempoSegundosRaw : null;

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      console.error("[registrar] SUPABASE_URL ou SUPABASE_KEY não configurados");
      return NextResponse.json({ ok: false, erro: "Supabase não configurado" }, { status: 500 });
    }

    if (!Number.isInteger(pontuacao) || pontuacao < 0 || pontuacao > 10) {
      return NextResponse.json({ ok: false, erro: "Pontuação inválida" }, { status: 400 });
    }

    // UUID vem do cliente para idempotência; gera no servidor apenas como fallback
    const registroId = typeof body.id === "string" && body.id.length > 0 ? body.id : randomUUID();

    const payload: Record<string, unknown> = {
      id: registroId,
      classificacao: String(body.classificacao || ""),
      pontuacao,
      compartilhou: Boolean(body.compartilhou),
      origem: typeof body.origem === "string" ? body.origem.slice(0, 80) : null,
      tentativa_numero: Number.isInteger(tentativa) && tentativa > 0 ? tentativa : 1,
      erros,
    };
    // Sorteio só entra no payload quando sorteio_participa=true — evita sobrescrever
    // dados de sorteio já gravados em upserts subsequentes sem esses campos
    if (Boolean(body.sorteio_participa)) {
      payload.sorteio_participa = true;
      payload.sorteio_nome = typeof body.sorteio_nome === "string" ? body.sorteio_nome.slice(0, 120) : null;
      payload.sorteio_telefone = typeof body.sorteio_telefone === "string" ? body.sorteio_telefone.slice(0, 40) : null;
    }
    // Tempo só entra se existir — evita erro caso a coluna ainda não exista no banco
    if (tempoSegundos !== null) payload.tempo_segundos = tempoSegundos;

    // Upsert idempotente: reenviar o mesmo UUID sempre cai na mesma linha, nunca cria duplicata
    const resposta = await fetch(`${SUPABASE_URL}/rest/v1/${tabelaResultados}`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal,resolution=merge-duplicates",
      },
      body: JSON.stringify(payload),
    });

    if (!resposta.ok) {
      const detalhe = await resposta.text();
      console.error("[registrar] Supabase erro", resposta.status, detalhe);
      return NextResponse.json({ ok: false, erro: detalhe }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id: registroId });
  } catch (err) {
    console.error("[registrar] exceção inesperada:", err);
    return NextResponse.json({ ok: false, erro: "Não foi possível registrar" }, { status: 500 });
  }
}
