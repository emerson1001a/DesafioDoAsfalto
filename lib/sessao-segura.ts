import { createHmac, randomUUID, timingSafeEqual } from "crypto";

type SessaoAssinada = {
  v: 1;
  id: string;
  inicio: number;
  expira: number;
  perguntas: number[];
};

function segredo(): string {
  const valor = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!valor) throw new Error("Segredo de sessão não configurado");
  return valor;
}

function assinatura(conteudo: string): string {
  return createHmac("sha256", segredo()).update(conteudo).digest("base64url");
}

export function criarSessaoAssinada(perguntas: number[]): { id: string; token: string } {
  const agora = Date.now();
  const payload: SessaoAssinada = {
    v: 1,
    id: randomUUID(),
    inicio: agora,
    expira: agora + 2 * 60 * 60 * 1000,
    perguntas,
  };
  const conteudo = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return { id: payload.id, token: `${conteudo}.${assinatura(conteudo)}` };
}

export function verificarSessaoAssinada(token: unknown): SessaoAssinada | null {
  if (typeof token !== "string" || token.length > 4096) return null;
  const [conteudo, assinaturaRecebida, extra] = token.split(".");
  if (!conteudo || !assinaturaRecebida || extra) return null;

  const esperada = Buffer.from(assinatura(conteudo));
  const recebida = Buffer.from(assinaturaRecebida);
  if (esperada.length !== recebida.length || !timingSafeEqual(esperada, recebida)) return null;

  try {
    const payload = JSON.parse(Buffer.from(conteudo, "base64url").toString("utf8")) as SessaoAssinada;
    if (
      payload.v !== 1 ||
      typeof payload.id !== "string" ||
      !Number.isFinite(payload.inicio) ||
      !Number.isFinite(payload.expira) ||
      !Array.isArray(payload.perguntas) ||
      payload.expira < Date.now() ||
      payload.inicio > Date.now() + 30_000
    ) return null;
    return payload;
  } catch {
    return null;
  }
}
