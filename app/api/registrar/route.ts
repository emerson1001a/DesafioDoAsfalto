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

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      return NextResponse.json({ ok: false, erro: "Supabase não configurado" }, { status: 500 });
    }

    if (!Number.isInteger(pontuacao) || pontuacao < 0 || pontuacao > 10) {
      return NextResponse.json({ ok: false, erro: "Pontuação inválida" }, { status: 400 });
    }

    const id = typeof body.id === "string" ? body.id : null;
    const payload = {
      classificacao: String(body.classificacao || ""),
      pontuacao,
      compartilhou: Boolean(body.compartilhou),
      origem: typeof body.origem === "string" ? body.origem.slice(0, 80) : null,
      tentativa_numero: Number.isInteger(tentativa) && tentativa > 0 ? tentativa : 1,
      erros
    };

    const url = id
      ? `${SUPABASE_URL}/rest/v1/${tabelaResultados}?id=eq.${encodeURIComponent(id)}`
      : `${SUPABASE_URL}/rest/v1/${tabelaResultados}`;

    const resposta = await fetch(url, {
      method: id ? "PATCH" : "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal"
      },
      body: JSON.stringify(payload)
    });

    if (!resposta.ok) {
      const detalhe = await resposta.text();
      return NextResponse.json({ ok: false, erro: detalhe }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id: id || null });
  } catch {
    return NextResponse.json({ ok: false, erro: "Não foi possível registrar" }, { status: 500 });
  }
}
