export type ClassificacaoId =
  | "DONO DO ASFALTO"
  | "VETERANO DO ASFALTO"
  | "QUEBRA-GALHO DA ESTRADA"
  | "MOTORISTA DE LINHA"
  | "PASSAGEIRO DE CARONA";

export type Classificacao = {
  id: ClassificacaoId;
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
      id: "DONO DO ASFALTO",
      titulo: "DONO DO ASFALTO",
      texto: "Parabens. Voce e do tipo que a estrada respeita. Compartilha - voce merece mostrar isso.",
      tom: "Conquista total",
      cor: "#f5b51b",
      fundo: "sunset",
      prioridadeTentarDeNovo: false
    };
  }

  if (pontuacao >= 7) {
    return {
      id: "VETERANO DO ASFALTO",
      titulo: "VETERANO DO ASFALTO",
      texto: "Voce rodou muito e aprendeu de verdade. A estrada te respeita. Manda pro seu parceiro ver se ele chega perto.",
      tom: "Confianca",
      cor: "#2fc47d",
      fundo: "cabine",
      prioridadeTentarDeNovo: false
    };
  }

  if (pontuacao >= 5) {
    return {
      id: "QUEBRA-GALHO DA ESTRADA",
      titulo: "QUEBRA-GALHO DA ESTRADA",
      texto: "Voce resolve no improviso e sai bem da maioria das situacoes. Mas a estrada ainda guarda uns segredos de voce. Tenta de novo - ou manda pro amigo ver se ele vai melhor.",
      tom: "Quase la",
      cor: "#4da3ff",
      fundo: "oficina",
      prioridadeTentarDeNovo: false
    };
  }

  if (pontuacao >= 3) {
    return {
      id: "MOTORISTA DE LINHA",
      titulo: "MOTORISTA DE LINHA",
      texto: "Voce chegou ate aqui - mas a estrada ainda tem muita coisa pra te ensinar, parceiro. Boa noticia: voce nao precisa ficar assim nao.",
      tom: "Sem humilhar",
      cor: "#f28c28",
      fundo: "cidade",
      prioridadeTentarDeNovo: true
    };
  }

  return {
    id: "PASSAGEIRO DE CARONA",
    titulo: "PASSAGEIRO DE CARONA",
    texto: "Tranquilo. Cada um comeca de algum lugar. ...Mas esse lugar ta bem longe do volante. O Ze acredita em voce. Tenta de novo.",
    tom: "Bem humorado",
    cor: "#f5d94a",
    fundo: "passageiro",
    prioridadeTentarDeNovo: true
  };
}

export function textoWhatsapp(classificacao: ClassificacaoId, pontuacao: number, url: string) {
  const textos: Record<ClassificacaoId, string> = {
    "DONO DO ASFALTO": `Fiz o Desafio do Asfalto la do Ze da Graxa e tirei DONO DO ASFALTO - ${pontuacao} de 10. Duvido voce chegar perto. Testa aqui: ${url}`,
    "VETERANO DO ASFALTO": `Fiz o Desafio do Asfalto do Ze da Graxa e passei como VETERANO - ${pontuacao} de 10. Manda ver, ve se voce aguenta: ${url}`,
    "QUEBRA-GALHO DA ESTRADA": `Fiz o desafio do Ze da Graxa. Fui Quebra-Galho, mas algumas pegaram ate mim. Vamos ver como voce vai: ${url}`,
    "MOTORISTA DE LINHA": `Esse desafio do Ze da Graxa e pesado. Me pegou em algumas. Testa voce ai e me conta: ${url}`,
    "PASSAGEIRO DE CARONA": `Fiz o Desafio do Asfalto do Ze da Graxa... fui Passageiro de Carona. Nao vou nem explicar. Testa voce: ${url}`
  };

  return textos[classificacao];
}
