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
  if (pontuacao >= 9) {
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

  if (pontuacao >= 7) {
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

  if (pontuacao >= 5) {
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

  if (pontuacao >= 3) {
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

function rankingTexto(ranking: RankingInfo | undefined): string {
  if (!ranking) return "";
  return ` Fui o #${ranking.posicao} de ${ranking.total.toLocaleString("pt-BR")}.`;
}

export function textoWhatsapp(classificacao: ClassificacaoId, pontuacao: number, url: string, ranking?: RankingInfo) {
  const rk = rankingTexto(ranking);
  const textos: Record<ClassificacaoId, string> = {
    "REI DA ESTRADA": `Tirei REI DA ESTRADA no Desafio do Asfalto do Zé da Graxa — ${pontuacao} de 10.${rk} Para o caminhão e testa você. Duvido chegar perto: ${url}`,
    "LOBO RODADO": `Fui LOBO RODADO no Desafio do Asfalto do Zé da Graxa — ${pontuacao} de 10.${rk} Sei que você ia pior. Prova aí: ${url}`,
    "FRETE CERTO": `Tirei FRETE CERTO no Desafio do Asfalto do Zé da Graxa — ${pontuacao} de 10.${rk} Algumas me pegaram, vou admitir. Acho que você vai pior. Me prova o contrário: ${url}`,
    "NOVATO NO ASFALTO": `Tirei NOVATO NO ASFALTO no Desafio do Asfalto do Zé da Graxa — ${pontuacao} de 10.${rk} Quiz pesado pra caramba. Duvido você ir melhor que eu — prova aí: ${url}`,
    "RODANDO NO PREJUÍZO": `Tomei um baile no Desafio do Asfalto do Zé da Graxa — ${pontuacao} de 10.${rk} Tô tentando de novo. Aposto que você vai pior: ${url}`
  };

  return textos[classificacao];
}

export function textoWhatsappGrupo(classificacao: ClassificacaoId, pontuacao: number, url: string, ranking?: RankingInfo) {
  const rk = rankingTexto(ranking);
  const textos: Record<ClassificacaoId, string> = {
    "RODANDO NO PREJUÍZO": `\u{1F602} Tomei uma surra no Desafio do Asfalto do Zé da Graxa. ${pontuacao} de 10.${rk} Dói admitir. Mas eu conheço essa turma — vai tudo pior que eu. Testa e manda aqui: ${url}`,
    "NOVATO NO ASFALTO": `\u{1F605} NOVATO NO ASFALTO no Desafio do Asfalto do Zé da Graxa — ${pontuacao} de 10.${rk} Algumas me pegaram feio. Tem engraçadinho aqui que vai dizer que ia melhor — então vai lá: ${url}`,
    "FRETE CERTO": `\u{1F3AF} FRETE CERTO no Desafio do Asfalto do Zé da Graxa — ${pontuacao} de 10.${rk} Metade acertei, metade chutei. Quem aqui bate isso? Duvido. Testa: ${url}`,
    "LOBO RODADO": `\u{1F43A} LOBO RODADO no Desafio do Asfalto do Zé da Graxa — ${pontuacao} de 10.${rk} Quiz pesado. Duvido alguém aqui chegar nesse nível. Se tiver coragem, testa e manda o resultado: ${url}`,
    "REI DA ESTRADA": `\u{1F451} REI DA ESTRADA no Desafio do Asfalto do Zé da Graxa — ${pontuacao} de 10.${rk} Para o caminhão. Duvido qualquer um de vocês chegar perto. Testa e me prova o contrário: ${url}`
  };

  return textos[classificacao];
}
