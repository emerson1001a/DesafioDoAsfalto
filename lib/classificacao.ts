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
      texto: "Esse nivel nao e sorte - e conhecimento de quem rodou de verdade. A estrada te respeita. Agora compartilha e deixa seus colegas tentarem chegar perto. Spoiler: a maioria nao vai.",
      tom: "Dono da pista",
      cor: "#f5b51b",
      fundo: "sunset",
      prioridadeTentarDeNovo: false
    };
  }

  if (pontuacao >= 7) {
    return {
      id: "VETERANO DO ASFALTO",
      titulo: "VETERANO DO ASFALTO",
      texto: "Voce rodou muito e aprendeu de verdade. Conhecimento na veia, nao so na teoria. Agora manda pro seu parceiro - quero ver ele chegar perto de voce.",
      tom: "Rodou de verdade",
      cor: "#2fc47d",
      fundo: "cabine",
      prioridadeTentarDeNovo: false
    };
  }

  if (pontuacao >= 5) {
    return {
      id: "QUEBRA-GALHO DA ESTRADA",
      titulo: "QUEBRA-GALHO DA ESTRADA",
      texto: "Metade acerta, metade chuta. Na pratica voce se vira - mas na teoria ainda tem buraco. Nao e desonra, nao. Mas seus colegas nao precisam saber disso. A menos que voce queira testar se eles sao piores que voce...",
      tom: "Metade la, metade ca",
      cor: "#4da3ff",
      fundo: "oficina",
      prioridadeTentarDeNovo: false
    };
  }

  if (pontuacao >= 3) {
    return {
      id: "MOTORISTA DE LINHA",
      titulo: "MOTORISTA DE LINHA",
      texto: "Passou do basico, mas a estrada ainda tem muita coisa escondida de voce. Boa noticia: da pra melhorar. Ma noticia: seus colegas provavelmente sabem mais que voce. Manda pra eles verem.",
      tom: "Ainda aprendendo",
      cor: "#f28c28",
      fundo: "cidade",
      prioridadeTentarDeNovo: true
    };
  }

  return {
    id: "PASSAGEIRO DE CARONA",
    titulo: "PASSAGEIRO DE CARONA",
    texto: "Hm. Bem... todo mundo comeca de algum lugar. O problema e que esse lugar ta bem longe do volante. O Ze nao vai te julgar - mas seus colegas vao. Tenta de novo antes de mostrar isso pra alguem.",
    tom: "Vai treinar mais",
    cor: "#f5d94a",
    fundo: "passageiro",
    prioridadeTentarDeNovo: true
  };
}

export function textoWhatsapp(classificacao: ClassificacaoId, pontuacao: number, url: string) {
  const textos: Record<ClassificacaoId, string> = {
    "DONO DO ASFALTO": `Fiz o Desafio do Asfalto do Ze da Graxa e tirei DONO DO ASFALTO - ${pontuacao} de 10. Para o caminhao e testa voce - duvido muito voce chegar perto: ${url}`,
    "VETERANO DO ASFALTO": `Fiz o Desafio do Asfalto do Ze da Graxa - VETERANO DO ASFALTO, ${pontuacao} de 10. Duvido voce chegar no mesmo nivel. Testa ai se tiver coragem: ${url}`,
    "QUEBRA-GALHO DA ESTRADA": `Fiz o Desafio do Asfalto do Ze da Graxa e fui QUEBRA-GALHO DA ESTRADA - ${pontuacao} de 10. Algumas me pegaram, vou admitir. Sinceramente acho que voce vai pior. Me prova o contrario: ${url}`,
    "MOTORISTA DE LINHA": `Fiz o Desafio do Asfalto do Ze da Graxa e fui MOTORISTA DE LINHA - ${pontuacao} de 10. Pesado demais esse quiz. Quero ver voce passar disso - testa aqui: ${url}`,
    "PASSAGEIRO DE CARONA": `Acabei de reprovar no Desafio do Asfalto do Ze da Graxa - ${pontuacao} de 10. Nem vou falar minha nota. Mas aposto que voce vai pior - prova ai: ${url}`
  };

  return textos[classificacao];
}

export function textoWhatsappGrupo(url: string) {
  return `Ze da Graxa lancou um desafio pra ver quem manda de verdade na estrada. 10 perguntas tecnicas - a maioria dos motoristas nao passa. Quero ver quem aqui e o verdadeiro Dono do Asfalto: ${url}`;
}
