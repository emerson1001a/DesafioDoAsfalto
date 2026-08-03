export type ClassificacaoId =
  | "REI DA ESTRADA"
  | "LOBO RODADO"
  | "FRETE CERTO"
  | "NOVATO NO ASFALTO"
  | "RODANDO NO PREJUÍZO";

export type Classificacao = {
  id: ClassificacaoId;
  emoji: string;
  titulo: string;
  texto: string;
  tom: string;
  cor: string;
  fundo: string;
  prioridadeTentarDeNovo: boolean;
};

export function obterClassificacao(pontuacao: number): Classificacao {
  if (pontuacao >= 5) {
    return {
      id: "REI DA ESTRADA",
      emoji: "👑",
      titulo: "REI DA ESTRADA",
      texto: "Você não só roda — você comanda. Esse nível é de quem aprendeu na pista, não em livro. A estrada te conhece pelo nome.",
      tom: "Dono da pista",
      cor: "#f5b51b",
      fundo: "sunset",
      prioridadeTentarDeNovo: false
    };
  }

  if (pontuacao >= 4) {
    return {
      id: "LOBO RODADO",
      emoji: "🐺",
      titulo: "LOBO RODADO",
      texto: "Você rodou muito e aprendeu de verdade. Tem o faro da estrada. Manda pros parceiros — eles precisam saber disso.",
      tom: "Rodou de verdade",
      cor: "#2fc47d",
      fundo: "cabine",
      prioridadeTentarDeNovo: false
    };
  }

  if (pontuacao >= 3) {
    return {
      id: "FRETE CERTO",
      emoji: "🎯",
      titulo: "FRETE CERTO",
      texto: "Metade certa, metade chutada. Na prática você se vira — mas na teoria ainda tem buraco pra tapar.",
      tom: "Metade lá, metade cá",
      cor: "#4da3ff",
      fundo: "oficina",
      prioridadeTentarDeNovo: false
    };
  }

  if (pontuacao >= 2) {
    return {
      id: "NOVATO NO ASFALTO",
      emoji: "🛞",
      titulo: "NOVATO NO ASFALTO",
      texto: "Passou do básico, mas a estrada ainda esconde muita coisa de você. Boa notícia: dá pra melhorar. Ativa as notificações pra não perder o próximo quiz.",
      tom: "Ainda aprendendo",
      cor: "#f28c28",
      fundo: "cidade",
      prioridadeTentarDeNovo: true
    };
  }

  return {
    id: "RODANDO NO PREJUÍZO",
    emoji: "💸",
    titulo: "RODANDO NO PREJUÍZO",
    texto: "Hm. Bem... todo mundo começa de algum lugar. Só que esse lugar tá bem longe do volante. Não esquece de ativar as notificações pro próximo quiz.",
    tom: "Vai treinar mais",
    cor: "#f5d94a",
    fundo: "passageiro",
    prioridadeTentarDeNovo: true
  };
}

export type RankingInfo = { posicao: number; total: number };

function textoCompartilhar(pontuacao: number, url: string, ranking?: RankingInfo): string {
  const desempenho = ranking
    ? `acertei ${pontuacao}/5 e fiquei em ${ranking.posicao}º entre ${ranking.total} participantes`
    : `acertei ${pontuacao}/5`;
  return `🏆 *R$500 NO PIX!* No Desafio do Asfalto, ${desempenho}. Faz melhor? ${url}`;
}

export function textoWhatsapp(pontuacao: number, url: string, ranking?: RankingInfo): string {
  return textoCompartilhar(pontuacao, url, ranking);
}

export function textoWhatsappGrupo(pontuacao: number, url: string, ranking?: RankingInfo): string {
  return textoCompartilhar(pontuacao, url, ranking);
}
