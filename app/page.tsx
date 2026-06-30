"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { obterClassificacao, textoWhatsapp, textoWhatsappGrupo, type RankingInfo } from "@/lib/classificacao";
import { embaralhar } from "@/lib/embaralhar";
import { perguntas, type Alternativa, type Pergunta } from "@/lib/perguntas";
import { montarPayloadResultado } from "@/lib/resultado";

type PerguntaSessao = Pergunta & { alternativasEmbaralhadas: Alternativa[] };
type Tela = "entrada" | "quiz" | "resultado";

const tentativaKey = "desafio-asfalto-tentativas";

function criarSessao(): PerguntaSessao[] {
  return embaralhar(perguntas).map((pergunta) => ({
    ...pergunta,
    alternativasEmbaralhadas: embaralhar(pergunta.alternativas)
  }));
}

export default function Home() {
  const feedbackRef = useRef<HTMLDivElement | null>(null);
  const tempoInicioRef = useRef<number>(0);
  const tempoSegundosRef = useRef<number>(0);
  const resultadoIdRef = useRef<string | null>(null);
  const [tela, setTela] = useState<Tela>("entrada");
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
  const [mostrarCamposInstagram, setMostrarCamposInstagram] = useState(false);
  const [nomeCompartilhar, setNomeCompartilhar] = useState("");
  const [instagramCompartilhar, setInstagramCompartilhar] = useState("");
  const [nomeSorteio, setNomeSorteio] = useState("");
  const [telefoneSorteio, setTelefoneSorteio] = useState("");
  const [salvandoSorteio, setSalvandoSorteio] = useState(false);
  const [sorteioOk, setSorteioOk] = useState(false);
  const [erroSorteio, setErroSorteio] = useState("");
  const [ranking, setRanking] = useState<RankingInfo | null>(null);
  const [carregandoRanking, setCarregandoRanking] = useState(false);

  useEffect(() => {
    const parametros = new URLSearchParams(window.location.search);
    setOrigem(parametros.get("utm_source"));
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
  const whatsappGrupoUrl = origemUrl ? `${origemUrl}?utm_source=whatsapp_grupo` : "";
  const textoGrupo = textoWhatsappGrupo(classificacao.id, acertos, whatsappGrupoUrl, ranking ?? undefined);
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(textoGrupo)}`;
  const whatsappIndividualUrl = origemUrl ? `${origemUrl}?utm_source=whatsapp_individual` : "";
  const textoIndividual = textoWhatsapp(classificacao.id, acertos, whatsappIndividualUrl, ranking ?? undefined);
  const whatsappIndividualHref = `https://wa.me/?text=${encodeURIComponent(textoIndividual)}`;

  function iniciar() {
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
    resultadoIdRef.current = null;
    setSorteioOk(false);
    setErroSorteio("");
    setNomeSorteio("");
    setTelefoneSorteio("");
    setModal(false);
    setRanking(null);
    setCarregandoRanking(false);
    tempoInicioRef.current = Date.now();
    tempoSegundosRef.current = 0;
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

  async function buscarRanking(pontuacao: number, tempo: number) {
    setCarregandoRanking(true);
    try {
      const resposta = await fetch(`/api/ranking?pontuacao=${pontuacao}&tempo=${tempo}`);
      if (resposta.ok) {
        const dados = await resposta.json();
        if (dados.ok) setRanking({ posicao: dados.posicao, total: dados.total });
      }
    } catch {
      // ranking é opcional — falha silenciosa
    } finally {
      setCarregandoRanking(false);
    }
  }

  async function registrarResultado(compartilhou = false, dadosSorteio?: { nome: string; telefone: string }) {
    if (registrando) return false;
    setRegistrando(true);
    const payload = {
      ...montarPayloadResultado({
      pontuacao: acertos,
      compartilhou,
      origem,
      tentativaNumero: tentativa,
      erros,
      tempoSegundos: tempoSegundosRef.current || undefined
      }),
      ...(dadosSorteio
        ? {
            sorteio_participa: true,
            sorteio_nome: dadosSorteio.nome,
            sorteio_telefone: dadosSorteio.telefone
          }
        : {}),
      id: resultadoIdRef.current
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
        resultadoIdRef.current = dados.id;
        setResultadoId(dados.id);
      }
      if (!resposta.ok) {
        setErroRegistro(dados.erro || "Erro sem detalhe");
      }
      return resposta.ok;
    } catch {
      setRegistroOk(false);
      setErroRegistro("Falha de conexão com a API");
      return false;
    } finally {
      setRegistrando(false);
    }
  }

  async function salvarSorteio() {
    const nomeLimpo = nomeSorteio.trim();
    const telefoneLimpo = telefoneSorteio.trim();

    setErroSorteio("");

    if (!nomeLimpo || !telefoneLimpo) {
      setErroSorteio("Informe nome e telefone para participar do sorteio.");
      return;
    }

    setSalvandoSorteio(true);
    const salvou = await registrarResultado(false, {
      nome: nomeLimpo,
      telefone: telefoneLimpo
    });
    setSalvandoSorteio(false);

    if (salvou) {
      setSorteioOk(true);
      return;
    }

    setErroSorteio("Não consegui salvar agora. Tente novamente em alguns segundos.");
  }

  function proxima() {
    if (indice < sessao.length - 1) {
      setIndice((valor) => valor + 1);
      setSelecionada(null);
      return;
    }

    const tempo = tempoInicioRef.current > 0
      ? Math.round((Date.now() - tempoInicioRef.current) / 1000)
      : 0;
    tempoSegundosRef.current = tempo;
    setTela("resultado");
    setTimeout(() => {
      void registrarResultado(false).then((ok) => {
        if (ok) void buscarRanking(acertos, tempo);
      });
    }, 0);
  }

  function registrarCompartilhamento() {
    void registrarResultado(true);
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
    void registrarResultado(true);

    const janelaFallback = window.open("", "_blank");

    try {
      const resposta = await fetch(cardUrl);
      const blob = await resposta.blob();
      const arquivo = new File([blob], "desafio-do-asfalto.png", { type: "image/png" });

      if (navigator.canShare?.({ files: [arquivo] })) {
        janelaFallback?.close();
        await navigator.share({
          title: "Desafio do Asfalto",
          text: `Fiz o Desafio do Asfalto do Zé da Graxa e tirei ${acertos} de 10. Caí como ${classificacao.id}. Quero ver você tentando também.`,
          files: [arquivo]
        });
        return;
      }
    } catch {
      // Cai no fallback abaixo.
    }

    if (janelaFallback) {
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
          {tela === "quiz" && <div className="rounded-full bg-stone-900 px-3 py-1 text-sm font-black text-gold">{indice + 1}/10</div>}
        </header>

        {tela === "entrada" && (
          <section className="road-card rounded-2xl p-5">
            <div className="mb-4 inline-flex rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-black uppercase text-gold">
              Quiz do Zé da Graxa
            </div>
            <h1 className="brand-title text-[2.85rem] leading-none text-white">Você acha que manda na estrada?</h1>
            <p className="mt-4 text-lg font-bold text-stone-300">
              7 em cada 10 caminhoneiros erram pelo menos 3. Será que você passa?
            </p>

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
                <p className="text-sm font-black uppercase text-gold">Resultado final</p>
                <h1 className="brand-title mt-3 text-[2.75rem] leading-none text-white">{classificacao.titulo}</h1>
                <p className="mt-3 text-[2.15rem] font-black text-gold">{acertos} de 10</p>
                {carregandoRanking ? (
                  <p className="mt-1 text-sm font-bold text-stone-500">calculando sua posição...</p>
                ) : ranking ? (
                  <p className="mt-1 text-sm font-black uppercase tracking-wide text-stone-300">
                    #{ranking.posicao.toLocaleString("pt-BR")} de {ranking.total.toLocaleString("pt-BR")} participantes
                  </p>
                ) : null}
                <p className="mt-4 text-base font-bold text-stone-200">{classificacao.texto}</p>
                <p className="mt-4 rounded-xl border border-gold/25 bg-black/35 p-3 text-sm font-bold text-gold">
                  Inscreva-se no canal @ZedaGraxa.oficial para não perder os próximos quizzes.
                </p>
              </div>
              <div className="grid gap-3 p-5">
                <div className="rounded-xl border border-gold/25 bg-black/35 p-4">
                  <p className="brand-title text-4xl leading-none text-gold">Sorteio Pix de R$ 500</p>
                  <h2 className="mt-2 text-xl font-black text-white">Quer concorrer e ainda desafiar seus amigos a te superar?</h2>
                  <p className="mt-2 text-sm font-bold text-stone-300">
                    Deixe seu nome e telefone para participar do sorteio. Se for sorteado, a gente entra em contato por WhatsApp.
                  </p>

                  <label className="mt-4 block">
                    <span className="mb-1 block text-xs font-black uppercase text-stone-400">Nome</span>
                    <input
                      value={nomeSorteio}
                      onChange={(event) => setNomeSorteio(event.target.value)}
                      disabled={sorteioOk || salvandoSorteio}
                      className="w-full rounded-xl border border-stone-700 bg-black/45 px-4 py-3 outline-none focus:border-gold disabled:opacity-60"
                      placeholder="Ex.: Paulo"
                    />
                  </label>

                  <label className="mt-3 block">
                    <span className="mb-1 block text-xs font-black uppercase text-stone-400">Telefone ou WhatsApp</span>
                    <input
                      value={telefoneSorteio}
                      onChange={(event) => setTelefoneSorteio(event.target.value)}
                      disabled={sorteioOk || salvandoSorteio}
                      inputMode="tel"
                      className="w-full rounded-xl border border-stone-700 bg-black/45 px-4 py-3 outline-none focus:border-gold disabled:opacity-60"
                      placeholder="Ex.: (11) 99999-9999"
                    />
                  </label>

                  {sorteioOk ? (
                    <p className="mt-3 rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-3 text-sm font-bold text-emerald-100">
                      Pronto. Seu nome está no sorteio.
                    </p>
                  ) : (
                    <button
                      onClick={salvarSorteio}
                      disabled={salvandoSorteio}
                      className="mt-4 w-full rounded-xl bg-emerald-950 px-5 py-4 font-black uppercase text-emerald-50 ring-1 ring-emerald-700 disabled:opacity-60"
                    >
                      {salvandoSorteio ? "Salvando..." : "Participar do sorteio"}
                    </button>
                  )}

                  {erroSorteio && (
                    <p className="mt-3 rounded-xl border border-red-500/40 bg-red-950/40 p-3 text-sm text-red-100">{erroSorteio}</p>
                  )}

                  <p className="mt-4 text-center">
                    <a href="/regulamento" target="_blank" rel="noopener noreferrer" className="text-xs text-stone-600 hover:text-stone-400 underline underline-offset-2">
                      Ver regulamento completo
                    </a>
                  </p>
                </div>

                <button onClick={abrirCompartilhamento} className="gold-button rounded-xl px-5 py-5 text-lg font-black uppercase">
                  Desafiar os parceiros
                </button>
                <button onClick={iniciar} className="rounded-xl border border-stone-700 px-5 py-4 font-black uppercase">
                  Tentar de novo
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

      {modal && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/75 p-4">
          <div className="mx-auto w-full max-w-md rounded-2xl border border-gold/30 bg-coal p-5 shadow-hard">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-black">Mandar o desafio</h2>
              <button onClick={() => setModal(false)} className="rounded-lg bg-stone-800 px-3 py-2 font-black">X</button>
            </div>
            <div className="grid gap-3">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={registrarCompartilhamento}
                className="rounded-xl bg-emerald-950 px-5 py-4 text-center font-black uppercase text-emerald-50 ring-1 ring-emerald-700"
              >
                Mandar nos grupos de WhatsApp
              </a>
              <a
                href={whatsappIndividualHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={registrarCompartilhamento}
                className="rounded-xl border border-emerald-700 px-5 py-4 text-center font-black uppercase text-emerald-100"
              >
                Desafiar um parceiro direto
              </a>
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
