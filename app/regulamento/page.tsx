import type { Metadata } from "next";
import FecharAba from "./FecharAba";

export const metadata: Metadata = {
  title: "Regulamento — Desafio do Asfalto",
  description: "Regulamento oficial do Desafio do Asfalto do Zé da Graxa."
};

const secoes = [
  {
    titulo: "Duração e prêmios",
    texto:
      "O Desafio do Asfalto fica no ar por 1 mês. O sorteio e o fechamento do ranking acontecem no dia 30 de julho de 2026. São R$ 250 sorteados entre os participantes e R$ 250 para quem ficar em 1º no ranking geral, definido pelo número de acertos e, em caso de empate, pelo menor tempo de realização do quiz."
  },
  {
    titulo: "Quem pode participar",
    texto:
      "Qualquer pessoa pode fazer o quiz. Para concorrer ao sorteio e ao prêmio do ranking, é preciso deixar nome e WhatsApp real — é por lá que a gente confirma o prêmio."
  },
  {
    titulo: "Pode repetir o quiz?",
    texto:
      "Pode tentar quantas vezes quiser, com o mesmo WhatsApp. Para o ranking, vale sua melhor pontuação e tempo. Para o sorteio, cada WhatsApp conta como uma chance só, não importa quantas vezes você jogou."
  },
  {
    titulo: "Ranking é dinâmico",
    texto:
      "A posição mostrada na hora do resultado vale pra aquele momento. Conforme mais gente vai fazendo o quiz, sua colocação só tende a cair, nunca a subir sozinha — é descida garantida, igual carreta na ladeira. Quem quiser melhorar a posição, precisa tentar de novo e bater a própria pontuação."
  },
  {
    titulo: "Comunicação durante a campanha",
    texto:
      "Ao deixar seu WhatsApp, você concorda em receber mensagens sobre o andamento do Desafio do Asfalto — como sua posição no ranking, resultado dos sorteios e avisos importantes. Esse contato também pode ser usado para apresentar novidades e ferramentas do ecossistema Rode com Lucro, voltadas pra facilitar a vida de quem roda na estrada."
  },
  {
    titulo: "Jogo limpo",
    texto:
      "A organização pode desclassificar respostas com tempo incompatível com leitura humana, números de WhatsApp inválidos ou inexistentes, e qualquer uso de robôs, scripts ou automação para responder o quiz."
  },
  {
    titulo: "Antes de pagar o prêmio",
    texto:
      "Todo ganhador é contatado por WhatsApp para confirmar a identidade antes do envio do Pix. Sem essa confirmação, o prêmio passa pro próximo colocado ou é resorteado."
  },
  {
    titulo: "Decisão final",
    texto:
      "Casos não previstos aqui são decididos pela organização do Desafio do Asfalto, sempre buscando manter o jogo justo pra quem participa de verdade."
  }
];

export default function Regulamento() {
  return (
    <main className="min-h-screen px-4 py-8 text-stone-100">
      <div className="mx-auto w-full max-w-md space-y-6">
        <header>
          <div className="mb-1 text-xs uppercase tracking-[.24em] text-stone-400">por @zedagraxa.oficial</div>
          <div className="brand-title text-[2.2rem] leading-none text-gold">Regulamento oficial</div>
          <div className="brand-title text-[1.4rem] leading-tight text-white">Desafio do Asfalto</div>
        </header>

        <div className="road-card rounded-2xl p-5">
          <p className="text-base font-bold text-stone-300">
            Eu, Zé da Graxa, sei que tem gente esperta nessa estrada. Por isso, antes de pegar o volante, lê as regras do jogo. É simples, é justo, e ninguém fica no prejuízo.
          </p>
        </div>

        {secoes.map((secao) => (
          <div key={secao.titulo} className="road-card rounded-2xl p-5">
            <p className="mb-2 text-xs font-black uppercase tracking-wide text-gold">{secao.titulo}</p>
            <p className="text-sm font-bold leading-relaxed text-stone-300">{secao.texto}</p>
          </div>
        ))}

        <div className="pb-6 pt-2 text-center">
          <FecharAba />
        </div>
      </div>
    </main>
  );
}
