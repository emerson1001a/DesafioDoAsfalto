"use client";

export default function FecharAba() {
  function fechar() {
    window.close();
    // fallback se o browser bloquear window.close()
    if (!window.closed) {
      window.location.href = "/";
    }
  }

  return (
    <button onClick={fechar} className="gold-button rounded-xl px-6 py-4 font-black uppercase">
      Fechar e voltar ao resultado
    </button>
  );
}
