"use client";

import { useEffect, useState } from "react";
import { META_CONSENTIMENTO_KEY } from "@/lib/meta-pixel";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

function iniciarPixel() {
  if (!PIXEL_ID || window.fbq) return;
  const fbq = function (...args: unknown[]) {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue?.push(args);
  } as NonNullable<Window["fbq"]>;
  fbq.queue = [];
  fbq.loaded = true;
  fbq.version = "2.0";
  window.fbq = fbq;
  window._fbq = fbq;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);

  fbq("init", PIXEL_ID);
  fbq("track", "PageView");
}

export default function MetaPixel() {
  const [consentimento, setConsentimento] = useState<"aceito" | "recusado" | null>(null);

  useEffect(() => {
    const salvo = localStorage.getItem(META_CONSENTIMENTO_KEY);
    if (salvo === "aceito" || salvo === "recusado") setConsentimento(salvo);
  }, []);

  useEffect(() => {
    if (consentimento === "aceito") iniciarPixel();
  }, [consentimento]);

  function escolher(valor: "aceito" | "recusado") {
    localStorage.setItem(META_CONSENTIMENTO_KEY, valor);
    setConsentimento(valor);
  }

  if (!PIXEL_ID || consentimento !== null) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-[70] mx-auto max-w-md rounded-2xl border border-gold/40 bg-stone-950 p-4 shadow-2xl">
      <p className="text-sm font-black text-white">Privacidade e anúncios</p>
      <p className="mt-1 text-xs leading-relaxed text-stone-300">
        Usamos o Pixel da Meta para medir a campanha e saber quantas inscrições vieram dos anúncios. Você pode aceitar ou continuar sem esse rastreamento.
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button onClick={() => escolher("recusado")} className="rounded-xl border border-stone-700 px-3 py-3 text-xs font-black uppercase">
          Recusar
        </button>
        <button onClick={() => escolher("aceito")} className="rounded-xl bg-gold px-3 py-3 text-xs font-black uppercase text-black">
          Aceitar
        </button>
      </div>
      <a href="/regulamento" target="_blank" rel="noopener noreferrer" className="mt-2 block text-center text-[11px] text-stone-500 underline">
        Saiba como os dados são usados
      </a>
    </div>
  );
}
