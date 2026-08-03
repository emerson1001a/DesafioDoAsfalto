"use client";

export const META_CONSENTIMENTO_KEY = "desafio-asfalto-meta-consentimento";

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void; queue?: unknown[]; loaded?: boolean; version?: string };
    _fbq?: Window["fbq"];
  }
}

export function temConsentimentoMeta(): boolean {
  return typeof window !== "undefined" && localStorage.getItem(META_CONSENTIMENTO_KEY) === "aceito";
}

export function rastrearMeta(nome: string, parametros: Record<string, unknown> = {}, eventId?: string) {
  if (!temConsentimentoMeta() || !window.fbq) return;
  const metodo = ["PageView", "Lead"].includes(nome) ? "track" : "trackCustom";
  if (eventId) {
    window.fbq(metodo, nome, parametros, { eventID: eventId });
  } else {
    window.fbq(metodo, nome, parametros);
  }
}

function cookie(nome: string): string | undefined {
  const prefixo = `${nome}=`;
  return document.cookie.split(";").map((item) => item.trim()).find((item) => item.startsWith(prefixo))?.slice(prefixo.length);
}

export function contextoMeta() {
  return {
    meta_consentimento: temConsentimentoMeta(),
    meta_fbp: cookie("_fbp"),
    meta_fbc: cookie("_fbc"),
    meta_url: window.location.href,
  };
}
