"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { obterStatusCampanha, type StatusCampanha } from "@/lib/campanha";
import { obterClassificacao, textoWhatsapp, textoWhatsappGrupo, type RankingInfo } from "@/lib/classificacao";
import { embaralhar } from "@/lib/embaralhar";
import { CONJUNTO_ATIVO, perguntasConjuntoA, perguntasConjuntoB, type Alternativa, type Pergunta } from "@/lib/perguntas";
import { contextoMeta, rastrearMeta } from "@/lib/meta-pixel";

type PerguntaSessao = Pergunta & { alternativasEmbaralhadas: Alternativa[] };
type RespostaQuiz = { pergunta_id: number; alternativa_id: string };
type Tela = "entrada" | "quiz" | "resultado";

const tentativaKey = "desafio-asfalto-tentativas";

function criarSessao(): PerguntaSessao[] {
  const perguntasAtivas = CONJUNTO_ATIVO === "A" ? perguntasConjuntoA : perguntasConjuntoB;
  return embaralhar(perguntasAtivas).map((pergunta) => ({
    ...pergunta,
    alternativasEmbaralhadas: embaralhar(pergunta.alternativas)
  }));
}

export default function Home() {
  const feedbackRef = useRef<HTMLDivElement | null>(null);
  const sessaoTokenRef = useRef<string | null>(null);
  const motorRef = useRef<HTMLAudioElement | null>(null);
  const [tela, setTela] = useState<Tela>("entrada");
  const [sessao, setSessao] = useState<PerguntaSessao[]>([]);
  const [indice, setIndice] = useState(0);
  const [selecionada, setSelecionada] = useState<string | null>(null);
  const [acertos, setAcertos] = useState(0);
  const [respostas, setRespostas] = useState<RespostaQuiz[]>([]);
  const [origem, setOrigem] = useState<string | null>(null);
  const [tentativa, setTentativa] = useState(1);
  const [iniciando, setIniciando] = useState(false);
  const [registrando, setRegistrando] = useState(false);
  const [registroOk, setRegistroOk] = useState<boolean | null>(null);
  const [resultadoId, setResultadoId] = useState<string | null>(null);
  const [erroRegistro, setErroRegistro] = useState("");
  const [incluirInstagram, setIncluirInstagram] = useState(false);
  const [modal, setModal] = useState(false);
  const [mostrarCamposInstagram, setMostrarCamposInstagram] = useState(false);
  const [nomeCompartilhar, setNomeCompartilhar] = useState("");
  const [instagramCompartilhar, setInstagramCompartilhar] = useState("");
  const [nomeSorteio, setNomeSorteio] = useState("");
  const [telefoneSorteio, setTelefoneSorteio] = useState("");
  const [salvandoSorteio, setSalvandoSorteio] = useState(false);
  const [sorteioOk, setSorteioOk] = useState(false);
  const [erroSorteio, setErroSorteio] = useState("");
  const [statusCampanha, setStatusCampanha] = useState<StatusCampanha>("aguardando");
  const [ranking, setRanking] = useState<RankingInfo | null>(null);
  const [carregandoRanking, setCarregandoRanking] = useState(false);

  useEffect(() => {
    const parametros = new URLSearchParams(window.location.search);
    setOrigem(parametros.get("utm_source"));
    setStatusCampanha(obterStatusCampanha());
    const timer = window.setInterval(() => setStatusCampanha(obterStatusCampanha()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!selecionada) return;

    window.requestAnimationFrame(() => {
      feedbackRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    });
  }, [selecionada]);

  useEffect(() => {
    if (tela === "resultado") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [tela]);

  const perguntaAtual = sessao[indice];
  const classificacao = useMemo(() => obterClassificacao(acertos), [acertos]);
  const nomeCard = nomeCompartilhar.trim() || "Motorista";
  const instagramLimpo = instagramCompartilhar.trim();
  const instagramCard = incluirInstagram && instagramLimpo ? (instagramLimpo.startsWith("@") ? instagramLimpo : `@${instagramLimpo}`) : "";
  const cardUrl = `/api/card?score=${acertos}&nome=${encodeURIComponent(nomeCard)}&instagram=${encodeURIComponent(instagramCard)}`;
  const origemUrl = typeof window === "undefined" ? "" : window.location.origin + window.location.pathname;
  const whatsappGrupoUrl = origemUrl ? `${origemUrl}?utm_source=whatsapp_grupo&cb=2` : "";
  const whatsappIndividualUrl = origemUrl ? `${origemUrl}?utm_source=whatsapp_individual&cb=2` : "";

  async function iniciar() {
    if (iniciando) return;
    setIniciando(true);
    setErroRegistro("");

    try {
      const respostaSessao = await fetch("/api/sessao", { method: "POST" });
      const dadosSessao = await respostaSessao.json().catch(() => ({}));
      if (!respostaSessao.ok || typeof dadosSessao.token !== "string") {
        setErroRegistro("Não foi possível iniciar uma sessão segura. Tente novamente.");
        return;
      }
      sessaoTokenRef.current = dadosSessao.token;

    const tentativas = Number(localStorage.getItem(tentativaKey) || "0") + 1;
    localStorage.setItem(tentativaKey, String(tentativas));
    setTentativa(tentativas);
    setSessao(criarSessao());
    setIndice(0);
    setSelecionada(null);
    setAcertos(0);
    setRespostas([]);
    setRegistroOk(null);
    setResultadoId(null);
    setErroRegistro("");
    setModal(false);
    setSorteioOk(false);
    setErroSorteio("");
    setNomeSorteio("");
    setTelefoneSorteio("");
    setRanking(null);
    setCarregandoRanking(false);
    setTela("quiz");
    rastrearMeta("QuizStarted", { tentativa: tentativas });
    } catch {
      setErroRegistro("Falha de conexão ao iniciar o quiz.");
    } finally {
      setIniciando(false);
    }
  }

  function responder(alternativaId: string) {
    if (selecionada || !perguntaAtual) return;
    setSelecionada(alternativaId);
    setRespostas((lista) => [...lista, { pergunta_id: perguntaAtual.id, alternativa_id: alternativaId }]);
    const acertou = alternativaId === perguntaAtual.correta;
    if (acertou) {
      setAcertos((valor) => valor + 1);
    }
  }

  async function buscarRanking(id: string): Promise<RankingInfo | null> {
    setCarregandoRanking(true);
    try {
      const resposta = await fetch(`/api/ranking?id=${encodeURIComponent(id)}`);
      if (resposta.ok) {
        const dados = await resposta.json();
        if (dados.ok) {
          const rankingAtual = { posicao: dados.posicao, total: dados.total };
          setRanking(rankingAtual);
          return rankingAtual;
        }
      }
    } catch {
      // ranking é opcional — falha silenciosa
    } finally {
      setCarregandoRanking(false);
    }
    return null;
  }

  async function registrarResultado(compartilhou = false): Promise<string | null> {
    if (registrando) return resultadoId;
    setRegistrando(true);
    const payload = {
      sessao_token: sessaoTokenRef.current,
      respostas,
      compartilhou,
      origem,
      tentativa_numero: tentativa,
    };

    try {
      const resposta = await fetch("/api/registrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const dados = await resposta.json().catch(() => ({}));
      setRegistroOk(resposta.ok);
      if (!resposta.ok) {
        setErroRegistro(dados.erro || "Erro sem detalhe");
        return null;
      }
      const id = typeof dados.id === "string" ? dados.id : null;
      setResultadoId(id);
      return id;
    } catch {
      setRegistroOk(false);
      setErroRegistro("Falha de conexão com a API");
      return null;
    } finally {
      setRegistrando(false);
    }
  }

  function tocarMotor() {
    const audio = motorRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(() => undefined);
    window.setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
    }, 4000);
  }

  async function salvarSorteio() {
    const nome = nomeSorteio.trim();
    const telefone = telefoneSorteio.trim();
    setErroSorteio("");
    if (statusCampanha !== "ativa") {
      setErroSorteio("As inscrições ainda não estão abertas.");
      return;
    }
    if (nome.length < 2 || telefone.replace(/\D/g, "").length < 10) {
      setErroSorteio("Informe nome e telefone válidos.");
      return;
    }
    setSalvandoSorteio(true);
    try {
      const resposta = await fetch("/api/registrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessao_token: sessaoTokenRef.current,
          respostas,
          origem,
          tentativa_numero: tentativa,
          sorteio_participa: true,
          sorteio_nome: nome,
          sorteio_telefone: telefone,
          ...contextoMeta(),
        }),
      });
      const dados = await resposta.json().catch(() => ({}));
      if (!resposta.ok) {
        setErroSorteio(dados.erro || "Não foi possível salvar agora.");
        return;
      }
      tocarMotor();
      setSorteioOk(true);
      if (typeof dados.id === "string") {
        setResultadoId(dados.id);
        rastrearMeta("Lead", { content_name: "Inscrição Desafio do Asfalto" }, dados.id);
        await buscarRanking(dados.id);
      }
    } catch {
      setErroSorteio("Falha de conexão. Tente novamente.");
    } finally {
      setSalvandoSorteio(false);
    }
  }

  function proxima() {
    if (indice < sessao.length - 1) {
      setIndice((valor) => valor + 1);
      setSelecionada(null);
      return;
    }

    rastrearMeta("QuizCompleted", { pontuacao: acertos, total_perguntas: sessao.length });
    setTela("resultado");
    setTimeout(async () => {
      const id = await registrarResultado(false);
      if (id) await buscarRanking(id);
    }, 0);
  }

  async function compartilharWhatsapp(tipo: "grupo" | "individual") {
    const janela = window.open("", "_blank");
    const id = await registrarResultado(true);
    const rankingCompartilhar = ranking ?? (id ? await buscarRanking(id) : null);
    const url = tipo === "grupo" ? whatsappGrupoUrl : whatsappIndividualUrl;
    const mensagem = tipo === "grupo"
      ? textoWhatsappGrupo(acertos, url, rankingCompartilhar ?? undefined)
      : textoWhatsapp(acertos, url, rankingCompartilhar ?? undefined);
    const href = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
    rastrearMeta("Share", { canal: "whatsapp" });
    if (janela) {
      console.log("[compartilhar] janela válida?", !!janela, "closed?", janela?.closed, "destino:", href);
      janela.location.href = href;
    } else {
      console.error("[compartilharWhatsapp] popup bloqueado");
    }
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
    const janelaFallback = window.open("", "_blank");
    const registrou = await registrarResultado(true);
    rastrearMeta("Share", { canal: "instagram" });
    if (!registrou) {
      console.error("[compartilharStories] falha ao registrar compartilhamento");
    }

    try {
      const resposta = await fetch(cardUrl);
      const blob = await resposta.blob();
      const arquivo = new File([blob], "desafio-do-asfalto.png", { type: "image/png" });

      if (navigator.canShare?.({ files: [arquivo] })) {
        janelaFallback?.close();
        await navigator.share({
          title: "Desafio do Asfalto",
          text: `No Desafio do Asfalto, meu título foi ${classificacao.id} — acertei ${acertos}/${sessao.length}. Faz melhor?`,
          files: [arquivo]
        });
        return;
      }
    } catch {
      // Cai no fallback abaixo.
    }

    if (janelaFallback) {
      console.log("[compartilhar] janela válida?", !!janelaFallback, "closed?", janelaFallback?.closed, "destino:", cardUrl);
      janelaFallback.location.href = cardUrl;
      return;
    }

    await salvarImagem();
    alert("Imagem aberta. Salve a imagem e poste no Instagram Stories.");
  }

  function abrirCompartilhamento() {
    setNomeCompartilhar("");
    setInstagramCompartilhar("");
    setIncluirInstagram(false);
    setMostrarCamposInstagram(false);
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
          {tela === "quiz" && <div className="rounded-full bg-stone-900 px-3 py-1 text-sm font-black text-gold">{indice + 1}/{sessao.length}</div>}
        </header>

        {tela === "entrada" && (
          <section className="road-card rounded-2xl p-5">
            <div className="mb-4 inline-flex rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-black uppercase text-gold">
              Quiz do Zé da Graxa
            </div>
            <h1 className="brand-title text-[2.85rem] leading-none text-white">Você acha que manda na estrada?</h1>
            <p className="mt-4 text-lg font-bold text-stone-300">
              Responda 5 perguntas e veremos...
            </p>

            <button onClick={() => void iniciar()} disabled={iniciando} className="gold-button mt-7 w-full rounded-xl px-5 py-5 text-xl font-black uppercase disabled:opacity-60">
              {iniciando ? "Preparando..." : "Aceitar o desafio"}
            </button>

            <div className="mt-4 rounded-xl border border-gold/40 bg-amber-950/60 px-4 py-3 text-center">
              <p className="font-black uppercase tracking-wide text-gold">
                {statusCampanha === "aguardando"
                  ? "Inscrições para os prêmios a partir de 15/08"
                  : statusCampanha === "ativa"
                    ? "Concorra a R$ 500 em prêmios"
                    : "Inscrições encerradas — sorteio em 20/09"}
              </p>
            </div>
            {erroRegistro && <p className="mt-3 text-center text-sm font-bold text-red-200">{erroRegistro}</p>}
          </section>
        )}

        {tela === "quiz" && perguntaAtual && (
          <section className="road-card rounded-2xl p-5">
            <div className="mb-5 h-3 overflow-hidden rounded-full bg-stone-800">
              <div
                className="h-full rounded-full bg-gold transition-all duration-500"
                style={{ width: `${((indice + 1) / sessao.length) * 100}%` }}
              />
            </div>

            <p className="mb-2 text-sm font-black uppercase text-gold">Pergunta {indice + 1} de {sessao.length}</p>
            <h2 className="text-[1.4rem] font-black leading-tight text-white">{perguntaAtual.pergunta}</h2>

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
              <div ref={feedbackRef} className="mt-5 rounded-xl border border-gold/25 bg-black/45 p-4">
                <p className="font-bold text-stone-100">
                  {selecionada === perguntaAtual.correta ? perguntaAtual.textoAcertou : perguntaAtual.textoErrou}
                </p>
                <button onClick={proxima} className="mt-5 w-full rounded-xl bg-gold px-5 py-4 text-lg font-black uppercase text-black">
                  {indice === sessao.length - 1 ? "Ver resultado" : "Próxima"}
                </button>
              </div>
            )}
          </section>
        )}

        {tela === "resultado" && (
          <section className="space-y-4">
            <div className="road-card overflow-hidden rounded-2xl">
              <div className="bg-gradient-to-br from-black via-stone-950 to-yellow-950 p-5">
                <p className="text-sm font-black uppercase text-gold">Seu título</p>
                <div className="mt-2 flex items-end justify-between gap-3">
                  <h1 className="brand-title min-w-0 flex-1 text-[2.5rem] leading-none text-white">{classificacao.titulo}</h1>
                  <p className="flex-shrink-0 text-[1.75rem] font-black text-gold">{acertos}/{sessao.length}</p>
                </div>
                {carregandoRanking ? (
                  <p className="mt-1 text-sm font-bold text-stone-500">calculando sua posição...</p>
                ) : ranking ? (
                  <p className="mt-1 text-sm font-bold text-stone-300">
                    Você ficou em {ranking.posicao.toLocaleString("pt-BR")}º de {ranking.total.toLocaleString("pt-BR")} participantes
                  </p>
                ) : null}
              </div>
              <div className="grid gap-3 p-5">
                <div className="rounded-xl border border-gold/25 bg-black/35 p-4">
                  {statusCampanha === "ativa" ? (
                    <>
                      <p className="brand-title text-4xl leading-none text-gold">Concorra aos prêmios</p>
                      <h2 className="mt-2 text-xl font-black text-white">Cadastre-se para o sorteio e para o ranking valendo Pix.</h2>
                      {sorteioOk ? (
                        <p className="mt-4 rounded-xl border border-emerald-600/50 bg-emerald-950/50 p-3 text-center font-black text-emerald-100">
                          Inscrição confirmada. Boa sorte!
                        </p>
                      ) : (
                        <div className="mt-4 grid gap-3">
                          <input
                            value={nomeSorteio}
                            onChange={(event) => setNomeSorteio(event.target.value)}
                            className="w-full rounded-xl border border-stone-700 bg-black/45 px-4 py-3 outline-none focus:border-gold"
                            placeholder="Seu nome"
                            autoComplete="name"
                            maxLength={120}
                          />
                          <input
                            value={telefoneSorteio}
                            onChange={(event) => setTelefoneSorteio(event.target.value)}
                            className="w-full rounded-xl border border-stone-700 bg-black/45 px-4 py-3 outline-none focus:border-gold"
                            placeholder="WhatsApp com DDD"
                            inputMode="tel"
                            autoComplete="tel"
                            maxLength={40}
                          />
                          <button
                            onClick={() => void salvarSorteio()}
                            disabled={salvandoSorteio}
                            className="gold-button rounded-xl px-5 py-4 font-black uppercase disabled:opacity-60"
                          >
                            {salvandoSorteio ? "Confirmando..." : "Quero participar"}
                          </button>
                          {erroSorteio && <p className="text-center text-sm font-bold text-red-200">{erroSorteio}</p>}
                        </div>
                      )}
                    </>
                  ) : statusCampanha === "aguardando" ? (
                    <>
                      <p className="brand-title text-4xl leading-none text-gold">Campanha em breve</p>
                      <h2 className="mt-2 text-xl font-black text-white">As inscrições começam em 15 de agosto de 2026.</h2>
                      <p className="mt-2 text-sm font-bold text-stone-300">
                        Você já pode jogar e compartilhar. Volte a partir de 15/08 para concorrer aos prêmios.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="brand-title text-4xl leading-none text-gold">Inscrições encerradas</p>
                      <h2 className="mt-2 text-xl font-black text-white">A campanha terminou em 15 de setembro de 2026.</h2>
                      <p className="mt-2 text-sm font-bold text-stone-300">
                        O sorteio e a apuração final do ranking acontecem em 20/09/2026. O quiz continua disponível.
                      </p>
                    </>
                  )}

                  <p className="mt-4 text-center">
                    <a href="/regulamento" target="_blank" rel="noopener noreferrer" className="text-xs text-stone-600 hover:text-stone-400 underline underline-offset-2">
                      Ver regulamento completo
                    </a>
                  </p>
                </div>

                <p className="text-base font-bold text-stone-200">{classificacao.texto}</p>

                <div className="rounded-xl border border-fuchsia-500/40 bg-fuchsia-950/30 p-4 text-center">
                  <p className="font-black text-white">Acompanhe o Zé da Graxa no Instagram</p>
                  <p className="mt-1 text-sm font-bold text-stone-300">
                    Siga para acompanhar o sorteio, os resultados e os próximos desafios.
                  </p>
                  <a
                    href="https://www.instagram.com/zedagraxa.oficial/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => rastrearMeta("InstagramProfileClick", { posicao: "resultado_quiz" })}
                    className="mt-3 block rounded-xl bg-gradient-to-r from-fuchsia-600 via-rose-500 to-amber-500 px-5 py-4 font-black uppercase text-white shadow-lg"
                  >
                    Seguir @zedagraxa.oficial
                  </a>
                  <p className="mt-2 text-[11px] text-stone-500">Sua participação no sorteio não depende de seguir o perfil.</p>
                </div>

                <button onClick={abrirCompartilhamento} className="gold-button rounded-xl px-5 py-5 text-lg font-black uppercase">
                  Desafiar os parceiros
                </button>
                <button onClick={() => void iniciar()} disabled={iniciando} className="rounded-xl border border-stone-700 px-5 py-4 font-black uppercase disabled:opacity-60">
                  {iniciando ? "Preparando..." : "Tentar de novo"}
                </button>
              </div>
            </div>

            {registroOk === false && (
              <p className="rounded-xl border border-red-500/40 bg-red-950/40 p-3 text-sm text-red-100">
                Resultado exibido, mas ainda não consegui gravar as estatísticas no banco.
                {erroRegistro ? ` Detalhe: ${erroRegistro.slice(0, 180)}` : ""}
              </p>
            )}
          </section>
        )}

        <footer className="mt-5 text-center text-xs font-bold uppercase tracking-[.2em] text-stone-500">por @zedagraxa.oficial</footer>
      </div>

      <audio ref={motorRef} src="/sounds/motor.wav" preload="auto" />

      {modal && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/75 p-4">
          <div className="mx-auto w-full max-w-md rounded-2xl border border-gold/30 bg-coal p-5 shadow-hard">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-black">Mandar o desafio</h2>
              <button onClick={() => setModal(false)} className="rounded-lg bg-stone-800 px-3 py-2 font-black">X</button>
            </div>
            <div className="grid gap-3">
              <button
                onClick={() => void compartilharWhatsapp("grupo")}
                className="rounded-xl bg-emerald-950 px-5 py-4 text-center font-black uppercase text-emerald-50 ring-1 ring-emerald-700"
              >
                Mandar nos grupos de WhatsApp
              </button>
              <button
                onClick={() => void compartilharWhatsapp("individual")}
                className="rounded-xl border border-emerald-700 px-5 py-4 text-center font-black uppercase text-emerald-100"
              >
                Desafiar um parceiro direto
              </button>
              <button
                onClick={() => setMostrarCamposInstagram((v) => !v)}
                className="rounded-xl bg-brake px-5 py-4 font-black uppercase"
              >
                Compartilhar no Instagram Stories
              </button>
              {mostrarCamposInstagram && (
                <div className="rounded-xl border border-stone-700 bg-black/35 p-4">
                  <label className="block">
                    <span className="mb-1 block text-xs font-black uppercase text-stone-400">Nome no card</span>
                    <input
                      value={nomeCompartilhar}
                      onChange={(event) => setNomeCompartilhar(event.target.value)}
                      className="w-full rounded-xl border border-stone-700 bg-black/45 px-4 py-3 outline-none focus:border-gold"
                      placeholder="Motorista"
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
                  <button onClick={compartilharStories} className="mt-4 w-full rounded-xl bg-brake px-5 py-4 font-black uppercase">
                    Gerar e compartilhar o card
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
