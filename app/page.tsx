"use client";

import { useEffect, useMemo, useState } from "react";
import { obterClassificacao, textoWhatsapp } from "@/lib/classificacao";
import { embaralhar } from "@/lib/embaralhar";
import { perguntas, type Alternativa, type Pergunta } from "@/lib/perguntas";
import { montarPayloadResultado } from "@/lib/resultado";

type PerguntaSessao = Pergunta & { alternativasEmbaralhadas: Alternativa[] };
type Tela = "entrada" | "quiz" | "resultado";

const tentativaKey = "desafio-asfalto-tentativas";
const nomeKey = "desafio-asfalto-nome";
const instaKey = "desafio-asfalto-instagram";

function criarSessao(): PerguntaSessao[] {
  return embaralhar(perguntas).map((pergunta) => ({
    ...pergunta,
    alternativasEmbaralhadas: embaralhar(pergunta.alternativas)
  }));
}

export default function Home() {
  const [tela, setTela] = useState<Tela>("entrada");
  const [nome, setNome] = useState("");
  const [instagram, setInstagram] = useState("");
  const [sessao, setSessao] = useState<PerguntaSessao[]>([]);
  const [indice, setIndice] = useState(0);
  const [selecionada, setSelecionada] = useState<string | null>(null);
  const [acertos, setAcertos] = useState(0);
  const [erros, setErros] = useState<number[]>([]);
  const [origem, setOrigem] = useState<string | null>(null);
  const [tentativa, setTentativa] = useState(1);
  const [registrando, setRegistrando] = useState(false);
  const [registroOk, setRegistroOk] = useState<boolean | null>(null);
  const [erroRegistro, setErroRegistro] = useState("");
  const [resultadoId, setResultadoId] = useState<string | null>(null);
  const [incluirInstagram, setIncluirInstagram] = useState(false);
  const [modal, setModal] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const [nomeCompartilhar, setNomeCompartilhar] = useState("");
  const [instagramCompartilhar, setInstagramCompartilhar] = useState("");

  useEffect(() => {
    setNome(localStorage.getItem(nomeKey) || "");
    setInstagram(localStorage.getItem(instaKey) || "");
    const parametros = new URLSearchParams(window.location.search);
    setOrigem(parametros.get("utm_source"));
  }, []);

  const perguntaAtual = sessao[indice];
  const classificacao = useMemo(() => obterClassificacao(acertos), [acertos]);
  const nomeCard = nomeCompartilhar.trim() || nome.trim() || "Voce";
  const instagramLimpo = instagramCompartilhar.trim() || instagram.trim();
  const instagramCard = incluirInstagram && instagramLimpo ? (instagramLimpo.startsWith("@") ? instagramLimpo : `@${instagramLimpo}`) : "";
  const cardUrl = `/api/card?score=${acertos}&nome=${encodeURIComponent(nomeCard)}&instagram=${encodeURIComponent(instagramCard)}`;

  function iniciar() {
    localStorage.setItem(nomeKey, nome);
    localStorage.setItem(instaKey, instagram);
    const tentativas = Number(localStorage.getItem(tentativaKey) || "0") + 1;
    localStorage.setItem(tentativaKey, String(tentativas));
    setTentativa(tentativas);
    setSessao(criarSessao());
    setIndice(0);
    setSelecionada(null);
    setAcertos(0);
    setErros([]);
    setRegistroOk(null);
    setErroRegistro("");
    setResultadoId(null);
    setModal(false);
    setCopiado(false);
    setTela("quiz");
  }

  function responder(alternativaId: string) {
    if (selecionada || !perguntaAtual) return;
    setSelecionada(alternativaId);
    const acertou = alternativaId === perguntaAtual.correta;
    if (acertou) {
      setAcertos((valor) => valor + 1);
    } else {
      setErros((lista) => [...lista, perguntaAtual.id]);
    }
  }

  async function registrarResultado(compartilhou = false) {
    if (registrando) return;
    setRegistrando(true);
    const payload = {
      ...montarPayloadResultado({
      pontuacao: acertos,
      compartilhou,
      origem,
      tentativaNumero: tentativa,
      erros
      }),
      id: resultadoId
    };

    try {
      const resposta = await fetch("/api/registrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const dados = await resposta.json().catch(() => ({}));
      setRegistroOk(resposta.ok);
      if (resposta.ok && dados.id) {
        setResultadoId(dados.id);
      }
      if (!resposta.ok) {
        setErroRegistro(dados.erro || "Erro sem detalhe");
      }
    } catch {
      setRegistroOk(false);
      setErroRegistro("Falha de conexao com a API");
    } finally {
      setRegistrando(false);
    }
  }

  function proxima() {
    if (indice < sessao.length - 1) {
      setIndice((valor) => valor + 1);
      setSelecionada(null);
      return;
    }

    setTela("resultado");
    setTimeout(() => registrarResultado(false), 0);
  }

  async function compartilharWhatsapp() {
    localStorage.setItem(nomeKey, nomeCompartilhar || nome);
    localStorage.setItem(instaKey, instagramCompartilhar || instagram);
    await registrarResultado(true);
    const url = window.location.origin + window.location.pathname + "?utm_source=whatsapp";
    const texto = textoWhatsapp(classificacao.id, acertos, url);
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, "_blank", "noopener,noreferrer");
  }

  async function copiarLink() {
    await registrarResultado(true);
    await navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?utm_source=stories`);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 1800);
  }

  async function salvarImagem() {
    const resposta = await fetch(cardUrl);
    const blob = await resposta.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "desafio-do-asfalto.png";
    link.click();
    URL.revokeObjectURL(url);
  }

  async function compartilharStories() {
    localStorage.setItem(nomeKey, nomeCompartilhar || nome);
    localStorage.setItem(instaKey, instagramCompartilhar || instagram);
    const resposta = await fetch(cardUrl);
    const blob = await resposta.blob();
    const arquivo = new File([blob], "desafio-do-asfalto.png", { type: "image/png" });
    await registrarResultado(true);

    if (navigator.canShare?.({ files: [arquivo] })) {
      await navigator.share({
        title: "Desafio do Asfalto",
        text: "Fiz o Desafio do Asfalto do Ze da Graxa. Testa ai.",
        files: [arquivo]
      });
      return;
    }

    await salvarImagem();
    alert("Imagem salva. Agora e so postar no Instagram Stories.");
  }

  function abrirCompartilhamento() {
    setNomeCompartilhar(nome);
    setInstagramCompartilhar(instagram);
    setIncluirInstagram(false);
    setModal(true);
  }

  return (
    <main className="min-h-screen px-4 py-5 text-stone-100">
      <div className="mx-auto flex min-h-[calc(100vh-40px)] w-full max-w-md flex-col justify-between">
        <header className="mb-4 flex items-center justify-between">
          <div>
            <div className="brand-title text-2xl text-gold">Desafio do Asfalto</div>
            <div className="text-xs uppercase tracking-[.24em] text-stone-400">por @zedagraxa.oficial</div>
          </div>
          {tela === "quiz" && <div className="rounded-full bg-stone-900 px-3 py-1 text-sm font-black text-gold">{indice + 1}/10</div>}
        </header>

        {tela === "entrada" && (
          <section className="road-card rounded-2xl p-5">
            <div className="mb-4 inline-flex rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-black uppercase text-gold">
              Quiz do Ze da Graxa
            </div>
            <h1 className="brand-title text-5xl leading-none text-white">Voce acha que manda na estrada?</h1>
            <p className="mt-4 text-lg font-bold text-stone-300">
              10 perguntas que ja derrubaram muito motorista experiente. Testa ai.
            </p>

            <div className="mt-7 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-stone-300">Como posso te chamar? (opcional)</span>
                <input
                  value={nome}
                  onChange={(event) => setNome(event.target.value)}
                  className="w-full rounded-xl border border-stone-700 bg-black/45 px-4 py-4 text-lg outline-none focus:border-gold"
                  placeholder="Ex.: Ze"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-stone-300">Qual seu @ no Instagram? (opcional)</span>
                <input
                  value={instagram}
                  onChange={(event) => setInstagram(event.target.value)}
                  className="w-full rounded-xl border border-stone-700 bg-black/45 px-4 py-4 text-lg outline-none focus:border-gold"
                  placeholder="@seuperfil"
                />
              </label>
            </div>

            <button onClick={iniciar} className="gold-button mt-7 w-full rounded-xl px-5 py-5 text-xl font-black uppercase">
              Aceitar o desafio
            </button>
          </section>
        )}

        {tela === "quiz" && perguntaAtual && (
          <section className="road-card rounded-2xl p-5">
            <div className="mb-5 h-3 overflow-hidden rounded-full bg-stone-800">
              <div
                className="h-full rounded-full bg-gold transition-all duration-500"
                style={{ width: `${((indice + 1) / 10) * 100}%` }}
              />
            </div>

            <p className="mb-2 text-sm font-black uppercase text-gold">Pergunta {indice + 1} de 10</p>
            <h2 className="text-2xl font-black leading-tight text-white">{perguntaAtual.pergunta}</h2>

            <div className="mt-6 space-y-3">
              {perguntaAtual.alternativasEmbaralhadas.map((alternativa) => {
                const correta = alternativa.id === perguntaAtual.correta;
                const marcada = alternativa.id === selecionada;
                const classe =
                  selecionada && correta ? "answer-correct" : selecionada && marcada && !correta ? "answer-wrong" : "answer";

                return (
                  <button
                    key={alternativa.id}
                    onClick={() => responder(alternativa.id)}
                    disabled={Boolean(selecionada)}
                    className={`${classe} w-full rounded-xl px-4 py-4 text-left text-base font-bold transition`}
                  >
                    {alternativa.texto}
                  </button>
                );
              })}
            </div>

            {selecionada && (
              <div className="mt-5 rounded-xl border border-gold/25 bg-black/45 p-4">
                <p className="font-bold text-stone-100">
                  {selecionada === perguntaAtual.correta ? perguntaAtual.textoAcertou : perguntaAtual.textoErrou}
                </p>
                <button onClick={proxima} className="mt-5 w-full rounded-xl bg-gold px-5 py-4 text-lg font-black uppercase text-black">
                  {indice === sessao.length - 1 ? "Ver resultado" : "Proxima"}
                </button>
              </div>
            )}
          </section>
        )}

        {tela === "resultado" && (
          <section className="space-y-4">
            <div className="road-card overflow-hidden rounded-2xl">
              <div className="bg-gradient-to-br from-black via-stone-950 to-yellow-950 p-5">
                <p className="text-sm font-black uppercase text-gold">Resultado final</p>
                <h1 className="brand-title mt-3 text-5xl leading-none text-white">{classificacao.titulo}</h1>
                <p className="mt-3 text-4xl font-black text-gold">{acertos} de 10</p>
                <p className="mt-4 text-lg font-bold text-stone-200">{classificacao.texto}</p>
              </div>
              <div className="grid gap-3 p-5">
                <button onClick={abrirCompartilhamento} className="gold-button rounded-xl px-5 py-5 text-lg font-black uppercase">
                  Compartilhar resultado
                </button>
                <button onClick={iniciar} className="rounded-xl border border-stone-700 px-5 py-4 font-black uppercase">
                  Tentar de novo
                </button>
              </div>
            </div>

            {registroOk === false && (
              <p className="rounded-xl border border-red-500/40 bg-red-950/40 p-3 text-sm text-red-100">
                Resultado exibido, mas ainda nao consegui gravar as estatisticas no banco.
                {erroRegistro ? ` Detalhe: ${erroRegistro.slice(0, 180)}` : ""}
              </p>
            )}
          </section>
        )}

        <footer className="mt-5 text-center text-xs font-bold uppercase tracking-[.2em] text-stone-500">por @zedagraxa.oficial</footer>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/75 p-4">
          <div className="mx-auto w-full max-w-md rounded-2xl border border-gold/30 bg-coal p-5 shadow-hard">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-black">Compartilhar resultado</h2>
              <button onClick={() => setModal(false)} className="rounded-lg bg-stone-800 px-3 py-2 font-black">X</button>
            </div>
            <div className="mb-4 rounded-xl border border-stone-700 bg-black/35 p-4">
              <p className="mb-3 text-sm font-bold text-stone-300">Quer personalizar o card antes de mandar?</p>
              <label className="block">
                <span className="mb-1 block text-xs font-black uppercase text-stone-400">Nome no card</span>
                <input
                  value={nomeCompartilhar}
                  onChange={(event) => setNomeCompartilhar(event.target.value)}
                  className="w-full rounded-xl border border-stone-700 bg-black/45 px-4 py-3 outline-none focus:border-gold"
                  placeholder="Voce"
                />
              </label>
              <label className="mt-3 flex items-center gap-3 rounded-xl border border-stone-800 bg-stone-950/70 p-3">
                <input
                  type="checkbox"
                  checked={incluirInstagram}
                  onChange={(event) => setIncluirInstagram(event.target.checked)}
                  className="h-5 w-5 accent-yellow-500"
                />
                <span className="text-sm font-bold">Colocar meu @ do Instagram no card</span>
              </label>
              {incluirInstagram && (
                <input
                  value={instagramCompartilhar}
                  onChange={(event) => setInstagramCompartilhar(event.target.value)}
                  className="mt-3 w-full rounded-xl border border-stone-700 bg-black/45 px-4 py-3 outline-none focus:border-gold"
                  placeholder="@seuperfil"
                />
              )}
            </div>
            <div className="grid gap-3">
              <button onClick={compartilharWhatsapp} className="rounded-xl bg-diesel px-5 py-4 font-black uppercase">
                Compartilhar no WhatsApp
              </button>
              <button onClick={compartilharStories} className="rounded-xl bg-brake px-5 py-4 font-black uppercase">
                Compartilhar no Instagram Stories
              </button>
              <button onClick={copiarLink} className="rounded-xl bg-stone-800 px-5 py-4 font-black uppercase">
                {copiado ? "Link copiado!" : "Copiar link do desafio"}
              </button>
              <button onClick={salvarImagem} className="rounded-xl border border-stone-700 px-5 py-4 font-black uppercase">
                Salvar imagem do resultado
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
