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

function pos(ranking: RankingInfo | undefined, sufixo: string): string {
  if (!ranking) return "";
  return ` Estou na posição #${ranking.posicao} de ${ranking.total.toLocaleString("pt-BR")}${sufixo}`;
}

export function textoWhatsapp(classificacao: ClassificacaoId, pontuacao: number, url: string, ranking?: RankingInfo) {
  const textos: Record<ClassificacaoId, string> = {
    "RODANDO NO PREJUÍZO": `Tomei um baile no Desafio do Asfalto do Zé da Graxa — Acertei ${pontuacao} de 10.${pos(ranking, ", lá no fundo mesmo.")} Tô tentando de novo. Aposto que você vai pior. Faz e me manda — esse quiz está pegando fogo!
🏆 Tá rolando sorteio de R$ 500 em PIX! Participa: ${url}`,
    "NOVATO NO ASFALTO": `Recebi o título de NOVATO NO ASFALTO no Desafio do Asfalto do Zé da Graxa — Acertei ${pontuacao} de 10.${pos(ranking, ".")} Algumas me pegaram, vou admitir. Duvido você ir melhor — testa aí, esse quiz está pegando fogo!
🏆 Tá rolando sorteio de R$ 500 em PIX! Participa: ${url}`,
    "FRETE CERTO": `Peguei o título FRETE CERTO no Desafio do Asfalto do Zé da Graxa (tipo: MEIA BOCA rsrs) — Acertei ${pontuacao} de 10.${pos(ranking, ", bem no meio da tabela.")} Metade acertei, metade chutei. Quem aqui bate isso? Faz e me manda!
🏆 Tá rolando sorteio de R$ 500 em PIX! Participa: ${url}`,
    "LOBO RODADO": `Recebi o título de LOBO RODADO no Desafio do Asfalto do Zé da Graxa — Acertei ${pontuacao} de 10.${pos(ranking, ", bem cotado.")} Quiz pesado pra caramba. Duvido você chegar perto — bora ver, esse quiz está pegando fogo!
🏆 Tá rolando sorteio de R$ 500 em PIX! Participa: ${url}`,
    "REI DA ESTRADA": `Recebi o título de REI DA ESTRADA no Desafio do Asfalto do Zé da Graxa — Acertei ${pontuacao} de 10.${pos(ranking, ", quase no topo!")} Quando parar o caminhão testa aí. Duvido chegar perto — esse quiz está pegando fogo!
🏆 Tá rolando sorteio de R$ 500 em PIX! Participa: ${url}`
  };

  return textos[classificacao];
}

export function textoWhatsappGrupo(classificacao: ClassificacaoId, pontuacao: number, url: string, ranking?: RankingInfo) {
  const textos: Record<ClassificacaoId, string> = {
    "RODANDO NO PREJUÍZO": `\u{1F602} Tomei um baile no Desafio do Asfalto do Zé da Graxa — Acertei ${pontuacao} de 10.${pos(ranking, ", lá no fundo mesmo.")} Tô tentando de novo. Aposto que você vai pior. Faz e me manda — esse quiz está pegando fogo!
🏆 Tá rolando sorteio de R$ 500 em PIX! Participa: ${url}`,
    "NOVATO NO ASFALTO": `\u{1F605} Recebi o título de NOVATO NO ASFALTO no Desafio do Asfalto do Zé da Graxa — Acertei ${pontuacao} de 10.${pos(ranking, ".")} Algumas me pegaram, vou admitir. Duvido você ir melhor — testa aí, esse quiz está pegando fogo!
🏆 Tá rolando sorteio de R$ 500 em PIX! Participa: ${url}`,
    "FRETE CERTO": `\u{1F3AF} Peguei o título FRETE CERTO no Desafio do Asfalto do Zé da Graxa (tipo: MEIA BOCA rsrs) — Acertei ${pontuacao} de 10.${pos(ranking, ", bem no meio da tabela.")} Metade acertei, metade chutei. Quem aqui bate isso? Faz e me manda!
🏆 Tá rolando sorteio de R$ 500 em PIX! Participa: ${url}`,
    "LOBO RODADO": `\u{1F43A} Recebi o título de LOBO RODADO no Desafio do Asfalto do Zé da Graxa — Acertei ${pontuacao} de 10.${pos(ranking, ", bem cotado.")} Quiz pesado pra caramba. Duvido você chegar perto — bora ver, esse quiz está pegando fogo!
🏆 Tá rolando sorteio de R$ 500 em PIX! Participa: ${url}`,
    "REI DA ESTRADA": `\u{1F451} Recebi o título de REI DA ESTRADA no Desafio do Asfalto do Zé da Graxa — Acertei ${pontuacao} de 10.${pos(ranking, ", quase no topo!")} Quando parar o caminhão testa aí. Duvido chegar perto — esse quiz está pegando fogo!
🏆 Tá rolando sorteio de R$ 500 em PIX! Participa: ${url}`
  };

  return textos[classificacao];
}
