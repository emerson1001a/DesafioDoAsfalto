import { NextRequest, NextResponse } from "next/server";
import { obterClassificacao } from "@/lib/classificacao";
import { obterStatusCampanha } from "@/lib/campanha";
import { CONJUNTO_ATIVO, perguntasConjuntoA, perguntasConjuntoB } from "@/lib/perguntas";
import { verificarSessaoAssinada } from "@/lib/sessao-segura";
import { tabelaResultados } from "@/lib/supabase-config";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

type RespostaRecebida = { pergunta_id: number; alternativa_id: string };

export async function POST(request: NextRequest) {
  try {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      console.error("[registrar] Supabase não configurado");
      return NextResponse.json({ ok: false, erro: "Serviço indisponível" }, { status: 500 });
    }

    const tamanho = Number(request.headers.get("content-length") || 0);
    if (tamanho > 16_384) {
      return NextResponse.json({ ok: false, erro: "Requisição muito grande" }, { status: 413 });
    }

    const body = await request.json();
    const sessao = verificarSessaoAssinada(body.sessao_token);
    if (!sessao) {
      return NextResponse.json({ ok: false, erro: "Sessão inválida ou expirada" }, { status: 400 });
    }

    const perguntasAtivas = CONJUNTO_ATIVO === "A" ? perguntasConjuntoA : perguntasConjuntoB;
    const idsAtivos = perguntasAtivas.map((pergunta) => pergunta.id).sort((a, b) => a - b);
    const idsSessao = [...sessao.perguntas].sort((a, b) => a - b);
    if (JSON.stringify(idsAtivos) !== JSON.stringify(idsSessao)) {
      return NextResponse.json({ ok: false, erro: "O quiz foi atualizado; inicie novamente" }, { status: 409 });
    }

    if (!Array.isArray(body.respostas) || body.respostas.length !== perguntasAtivas.length) {
      return NextResponse.json({ ok: false, erro: "Respostas incompletas" }, { status: 400 });
    }

    const respostas = body.respostas as RespostaRecebida[];
    const porPergunta = new Map<number, string>();
    for (const item of respostas) {
      if (!Number.isInteger(item?.pergunta_id) || typeof item?.alternativa_id !== "string") {
        return NextResponse.json({ ok: false, erro: "Resposta inválida" }, { status: 400 });
      }
      porPergunta.set(item.pergunta_id, item.alternativa_id);
    }
    if (porPergunta.size !== perguntasAtivas.length) {
      return NextResponse.json({ ok: false, erro: "Respostas duplicadas" }, { status: 400 });
    }

    const erros = perguntasAtivas
      .filter((pergunta) => porPergunta.get(pergunta.id) !== pergunta.correta)
      .map((pergunta) => pergunta.id);
    const pontuacao = perguntasAtivas.length - erros.length;
    const tempoSegundos = Math.max(1, Math.round((Date.now() - sessao.inicio) / 1000));
    const tentativa = Number(body.tentativa_numero || 1);

    const payload = {
      id: sessao.id,
      classificacao: obterClassificacao(pontuacao).id,
      pontuacao,
      compartilhou: Boolean(body.compartilhou),
      origem: typeof body.origem === "string" ? body.origem.slice(0, 80) : null,
      tentativa_numero: Number.isInteger(tentativa) && tentativa > 0 && tentativa <= 10_000 ? tentativa : 1,
      erros,
      tempo_segundos: tempoSegundos,
    } as Record<string, unknown>;

    if (Boolean(body.sorteio_participa)) {
      if (obterStatusCampanha() !== "ativa") {
        return NextResponse.json({ ok: false, erro: "Inscrições fora do período da campanha" }, { status: 403 });
      }
      const nome = typeof body.sorteio_nome === "string" ? body.sorteio_nome.trim().slice(0, 120) : "";
      const telefone = typeof body.sorteio_telefone === "string" ? body.sorteio_telefone.replace(/[^0-9+() -]/g, "").trim().slice(0, 40) : "";
      if (nome.length < 2 || telefone.replace(/\D/g, "").length < 10) {
        return NextResponse.json({ ok: false, erro: "Nome ou telefone inválido" }, { status: 400 });
      }
      payload.sorteio_participa = true;
      payload.sorteio_nome = nome;
      payload.sorteio_telefone = telefone;
    }

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
      console.error("[registrar] Supabase erro", resposta.status, await resposta.text());
      return NextResponse.json({ ok: false, erro: "Não foi possível registrar" }, { status: 502 });
    }

    return NextResponse.json({ ok: true, id: sessao.id, pontuacao, tempo_segundos: tempoSegundos });
  } catch (erro) {
    console.error("[registrar] exceção inesperada:", erro);
    return NextResponse.json({ ok: false, erro: "Não foi possível registrar" }, { status: 500 });
  }
}
