import { createHash } from "crypto";
import type { NextRequest } from "next/server";

const PIXEL_ID = process.env.META_PIXEL_ID || process.env.NEXT_PUBLIC_META_PIXEL_ID;
const ACCESS_TOKEN = process.env.META_CONVERSIONS_API_TOKEN;
const GRAPH_VERSION = process.env.META_GRAPH_API_VERSION || "v23.0";

function hash(valor: string): string {
  return createHash("sha256").update(valor.trim().toLowerCase()).digest("hex");
}

function telefoneBrasil(valor: string): string {
  const numeros = valor.replace(/\D/g, "");
  return numeros.length === 10 || numeros.length === 11 ? `55${numeros}` : numeros;
}

function textoSeguro(valor: unknown, maximo: number): string | undefined {
  return typeof valor === "string" && valor.length <= maximo ? valor : undefined;
}

export async function enviarLeadMeta(params: {
  request: NextRequest;
  body: Record<string, unknown>;
  eventId: string;
  nome: string;
  telefone: string;
}) {
  if (!PIXEL_ID || !ACCESS_TOKEN || params.body.meta_consentimento !== true) return;

  const partesNome = params.nome.trim().toLowerCase().split(/\s+/);
  const primeiroNome = partesNome[0] || "";
  const ultimoNome = partesNome.length > 1 ? partesNome.at(-1) || "" : "";
  const userData: Record<string, unknown> = {
    ph: [hash(telefoneBrasil(params.telefone))],
    external_id: [hash(telefoneBrasil(params.telefone))],
    client_ip_address: params.request.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
    client_user_agent: params.request.headers.get("user-agent") || undefined,
    fbp: textoSeguro(params.body.meta_fbp, 200),
    fbc: textoSeguro(params.body.meta_fbc, 200),
  };
  if (primeiroNome) userData.fn = [hash(primeiroNome)];
  if (ultimoNome) userData.ln = [hash(ultimoNome)];

  const eventSourceUrl = textoSeguro(params.body.meta_url, 500);
  const resposta = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${PIXEL_ID}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      data: [{
        event_name: "Lead",
        event_time: Math.floor(Date.now() / 1000),
        event_id: params.eventId,
        action_source: "website",
        event_source_url: eventSourceUrl,
        user_data: userData,
      }],
    }),
  });

  if (!resposta.ok) {
    console.error("[meta-capi] Lead rejeitado", resposta.status, (await resposta.text()).slice(0, 500));
  }
}
