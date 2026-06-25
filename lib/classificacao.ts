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
      texto: "Esse nível não é sorte - é conhecimento de quem rodou de verdade. A estrada te respeita. Agora compartilha e deixa seus colegas tentarem chegar perto. Spoiler: a maioria não vai.",
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
      texto: "Você rodou muito e aprendeu de verdade. Conhecimento na veia, não só na teoria. Agora manda pro seu parceiro - quero ver ele chegar perto de você.",
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
      texto: "Metade acerta, metade chuta. Na prática você se vira - mas na teoria ainda tem buraco. Não é desonra, não. Mas seus colegas não precisam saber disso. A menos que você queira testar se eles são piores que você...",
      tom: "Metade lá, metade cá",
      cor: "#4da3ff",
      fundo: "oficina",
      prioridadeTentarDeNovo: false
    };
  }

  if (pontuacao >= 3) {
    return {
      id: "MOTORISTA DE LINHA",
      titulo: "MOTORISTA DE LINHA",
      texto: "Passou do básico, mas a estrada ainda tem muita coisa escondida de você. Boa notícia: dá pra melhorar. Má notícia: seus colegas provavelmente sabem mais que você. Manda pra eles verem.",
      tom: "Ainda aprendendo",
      cor: "#f28c28",
      fundo: "cidade",
      prioridadeTentarDeNovo: true
    };
  }

  return {
    id: "PASSAGEIRO DE CARONA",
    titulo: "PASSAGEIRO DE CARONA",
    texto: "Hm. Bem... todo mundo começa de algum lugar. O problema é que esse lugar tá bem longe do volante. O Zé não vai te julgar - mas seus colegas vão. Se você aguenta sarro, compartilha. Se não aguenta, tenta de novo... Não esquece de ativar as notificações para receber o próximo quiz.",
    tom: "Vai treinar mais",
    cor: "#f5d94a",
    fundo: "passageiro",
    prioridadeTentarDeNovo: true
  };
}

export function textoWhatsapp(classificacao: ClassificacaoId, pontuacao: number, url: string) {
  const textos: Record<ClassificacaoId, string> = {
    "DONO DO ASFALTO": `Fiz o Desafio do Asfalto do Zé da Graxa e tirei DONO DO ASFALTO - ${pontuacao} de 10. Para o caminhão e testa você - duvido muito você chegar perto: ${url}`,
    "VETERANO DO ASFALTO": `Fiz o Desafio do Asfalto do Zé da Graxa - VETERANO DO ASFALTO, ${pontuacao} de 10. Duvido você chegar no mesmo nível. Testa aí se tiver coragem: ${url}`,
    "QUEBRA-GALHO DA ESTRADA": `Fiz o Desafio do Asfalto do Zé da Graxa e fui QUEBRA-GALHO DA ESTRADA - ${pontuacao} de 10. Algumas me pegaram, vou admitir. Sinceramente acho que você vai pior. Me prova o contrário: ${url}`,
    "MOTORISTA DE LINHA": `Fiz o Desafio do Asfalto do Zé da Graxa e fui MOTORISTA DE LINHA - ${pontuacao} de 10. Pesado demais esse quiz. Quero ver você passar disso - testa aqui: ${url}`,
    "PASSAGEIRO DE CARONA": `Acabei de reprovar no Desafio do Asfalto do Zé da Graxa - ${pontuacao} de 10. Nem vou falar minha nota. Mas aposto que você vai pior - prova aí: ${url}`
  };

  return textos[classificacao];
}

export function textoWhatsappGrupo(classificacao: ClassificacaoId, pontuacao: number, url: string) {
  return `Fiz o Desafio do Asfalto do Zé da Graxa e tirei ${pontuacao} de 10. Caí como ${classificacao}. Quero ver quem aqui manda de verdade na estrada. A maioria não passa. Testa aí: ${url}`;
}
