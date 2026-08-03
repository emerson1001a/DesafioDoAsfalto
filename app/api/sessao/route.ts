import { NextResponse } from "next/server";
import { CONJUNTO_ATIVO, perguntasConjuntoA, perguntasConjuntoB } from "@/lib/perguntas";
import { criarSessaoAssinada } from "@/lib/sessao-segura";

export async function POST() {
  try {
    const perguntas = CONJUNTO_ATIVO === "A" ? perguntasConjuntoA : perguntasConjuntoB;
    const sessao = criarSessaoAssinada(perguntas.map((pergunta) => pergunta.id));
    return NextResponse.json({ ok: true, token: sessao.token }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (erro) {
    console.error("[sessao] falha ao criar sessão:", erro);
    return NextResponse.json({ ok: false, erro: "Não foi possível iniciar" }, { status: 500 });
  }
}
