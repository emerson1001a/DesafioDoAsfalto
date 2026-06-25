export type Alternativa = {
  id: string;
  texto: string;
};

export type Pergunta = {
  id: number;
  pergunta: string;
  alternativas: Alternativa[];
  correta: string;
  textoAcertou: string;
  textoErrou: string;
};

export const perguntas: Pergunta[] = [
  {
    id: 1,
    pergunta: "Um caminhao trucado (6x2) esta plenamente carregado e o motorista percebe que o freio esta 'mole', exigindo mais forca no pedal. Qual e a causa MAIS PROVAVEL desse sintoma?",
    alternativas: [
      { id: "A", texto: "Pastilha de freio desgastada" },
      { id: "B", texto: "Ar no circuito de freio pneumatico" },
      { id: "C", texto: "Fluido de freio baixo" },
      { id: "D", texto: "Freio de motor com defeito" }
    ],
    correta: "B",
    textoAcertou: "Isso ai! Caminhao e freio pneumatico, nao hidraulico. Pedal mole e ar no sistema - vazamento ou falha na pressurizacao. Quem foi la na pastilha ta confundindo caminhao com Corsa. Aqui a conversa e outra, meu parceiro.",
    textoErrou: "Caminhao pesado usa freio pneumatico - nao hidraulico. Pastilha desgastada faz barulho e aumenta a distancia de frenagem, mas nao deixa o pedal mole. Pedal mole e ar no circuito. Confundir isso na pista nao e erro de quiz - e risco de acidente."
  },
  {
    id: 2,
    pergunta: "Voce esta em uma descida longa e ingreme. O freio de servico comeca a esquentar excessivamente. Qual e a acao CORRETA?",
    alternativas: [
      { id: "A", texto: "Usar o freio motor e o freio de servico intermitentemente" },
      { id: "B", texto: "Manter o freio de servico acionado com pressao constante e moderada" },
      { id: "C", texto: "Usar somente o freio motor e soltar completamente o freio de servico para ele esfriar" },
      { id: "D", texto: "Reduzir a marcha e usar o retarder/freio motor como principal, acionando o freio de servico apenas em emergencia" }
    ],
    correta: "D",
    textoAcertou: "Isso ai, irmao! Freio motor e retarder e o que manda na descida. Freio de servico voce guarda pra emergencia - nao fica segurando a lomba toda nele, senao chega no fundo sem freio. Nao e teoria nao: e o tipo de coisa que ja matou gente.",
    textoErrou: "Eita... segurou o freio de servico a descida toda? Isso e fading garantido - o freio esquenta, perde a pressao e sumiu. Motorista experiente usa o freio motor e guarda o servico pra emergencia. Volta ao basico, parceiro."
  },
  {
    id: 3,
    pergunta: "Um motorista percebe que seu caminhao 'puxa' para um lado ao frear. Antes de ir a oficina, ele verifica os pneus e todos estao calibrados corretamente. O que e MAIS PROVAVEL que esteja causando o problema?",
    alternativas: [
      { id: "A", texto: "Diferenca de desgaste entre os pneus do eixo dianteiro" },
      { id: "B", texto: "Desregulagem ou falha no freio de um dos lados do eixo dianteiro" },
      { id: "C", texto: "Problema na direcao hidraulica" },
      { id: "D", texto: "Carga mal distribuida na carroceria" }
    ],
    correta: "B",
    textoAcertou: "Acertou na mosca! Puxao so na hora de frear e freio assimetrico - um lado segurando mais que o outro. Pneu fora de calibragem puxa o tempo todo, nao so ao frear. Detalhe que muita gente ignora ate dar problema de verdade.",
    textoErrou: "Prestou atencao? O caminhao puxa SO na hora de frear - nao em velocidade normal. Isso e freio, nao pneu nem direcao. Um lado travando mais que o outro. Parece detalhe, mas na pista esse detalhe te coloca no barranco."
  },
  {
    id: 4,
    pergunta: "Qual e o peso maximo permitido por lei brasileira no eixo traseiro simples (eixo simples de rodagem dupla) de um caminhao?",
    alternativas: [
      { id: "A", texto: "8 toneladas" },
      { id: "B", texto: "10 toneladas" },
      { id: "C", texto: "12 toneladas" },
      { id: "D", texto: "17 toneladas" }
    ],
    correta: "B",
    textoAcertou: "10 toneladas no eixo simples de rodagem dupla. Certo! Fiscal de balanca nao aceita 'eu achei que era mais, chefe'. A multa e o patio sao bem reais - e saem do seu bolso, nao do bolso do dono da carga.",
    textoErrou: "10 toneladas no eixo simples de rodagem dupla - nao 17. Esse e o limite do tandem duplo. Confundir na balanca custa caro: multa, retencao e ainda fica parado esperando o dono tirar o excesso. Nem sempre o chefe aparece rapido."
  },
  {
    id: 5,
    pergunta: "Durante uma revisao, o mecanico verifica a agua do radiador e ela esta com coloracao levemente leitosa e espumosa. O que isso indica?",
    alternativas: [
      { id: "A", texto: "O fluido de arrefecimento esta vencido e precisa ser trocado" },
      { id: "B", texto: "Ha mistura de oleo com agua, provavelmente por falha na junta do cabecote" },
      { id: "C", texto: "O radiador esta entupido e a agua esta superaquecendo" },
      { id: "D", texto: "A proporcao de aditivo/agua esta errada" }
    ],
    correta: "B",
    textoAcertou: "Acertou e salvou o motor! Agua leitosa com espuma e oleo no circuito de arrefecimento - quase sempre junta do cabecote. Quanto mais cedo pega, menos dinheiro perde. Ignorar esse sinal e assinar um cheque em branco pra oficina.",
    textoErrou: "Agua vencida fica amarelada ou enferrujada - nao leitosa e espumosa. Quando esta assim e oleo no circuito. Quase sempre e junta do cabecote. Qualquer mecanico de beira de estrada que ja viu isso reconhece na hora. Voce ainda ia rodar com isso?"
  },
  {
    id: 6,
    pergunta: "Um caminhao esta consumindo muito mais diesel que o normal, mas a fumaca esta normal - nem preta, nem azul, nem branca. Marque a causa MENOS provavel entre as opcoes:",
    alternativas: [
      { id: "A", texto: "Filtro de ar entupido" },
      { id: "B", texto: "Injetor com problema de vazao" },
      { id: "C", texto: "Problema no turbocompressor" },
      { id: "D", texto: "Pneus calibrados acima do recomendado" }
    ],
    correta: "D",
    textoAcertou: "Boa, voce leu a pergunta ate o fim! Pneu com pressao alta reduz o atrito - consumo cai, nao sobe. Era pegadinha de atencao. Quem acertou essa e porque le o contrato antes de assinar. Raro nas estradas.",
    textoErrou: "Cuidado com a palavra 'menos'! Pneu calibrado acima do normal diminui o consumo - nao aumenta. As outras tres sao causas reais. Pegadinha de leitura. Na estrada, quem nao le o aviso so ve o buraco depois que cai."
  },
  {
    id: 7,
    pergunta: "Na hora de fazer o freio de estacionamento em uma subida, qual e o procedimento correto para um caminhao com cambio manual?",
    alternativas: [
      { id: "A", texto: "Acionar o freio de mao e deixar o cambio em ponto morto" },
      { id: "B", texto: "Acionar o freio de mao e engatar marcha a re" },
      { id: "C", texto: "Acionar o freio de mao e engatar a primeira marcha, com a frente do veiculo voltada para a subida" },
      { id: "D", texto: "Acionar o freio de mao e engatar a primeira marcha, com a frente voltada para qualquer direcao" }
    ],
    correta: "C",
    textoAcertou: "Certinho! Frente pra subida, primeira marcha engatada. O motor trava no sentido que o veiculo tenderia a descer. Parece besteira, mas tem gente que deixa em ponto morto com o freio de mao e vai dormir. Num caminhao carregado, isso e roleta-russa de verdade.",
    textoErrou: "Nunca confia so no freio de mao num caminhao carregado. Primeira marcha engatada com a frente pra subida - a compressao do motor e sua segunda trava. Parece frescura. Nao e. O caminhao que desceu sozinho enquanto o motorista dormia nao avisou antes de sair."
  },
  {
    id: 8,
    pergunta: "Um caminhao com semi-reboque comeca a 'sambar' (oscilacao lateral do reboque, conhecida como fishtailing) em alta velocidade. Qual e a acao CORRETA imediata do motorista?",
    alternativas: [
      { id: "A", texto: "Frear com forca para reduzir rapidamente a velocidade" },
      { id: "B", texto: "Fazer movimentos rapidos de direcao no sentido contrario a oscilacao para estabilizar" },
      { id: "C", texto: "Soltar o acelerador suavemente e manter o volante firme e reto ate o veiculo estabilizar" },
      { id: "D", texto: "Puxar o freio de estacionamento para segurar o reboque" }
    ],
    correta: "C",
    textoAcertou: "Isso! Contra-intuicao na veia. Todo instinto grita 'freia!' - mas frear bruscamente num conjunto sambando e convite pro tombamento. Solta o gas com calma, volante firme e reto, e deixa o bicho se acomodar. Quem nunca passou por isso acha que e facil. Nao e, nao.",
    textoErrou: "Frear forte com reboque sambando e pedir pro conjunto tombar. A fisica nao negocia. Solta o gas devagar, segura o volante reto e espera o bicho se acalmar. Cada volantazo que voce da pra 'corrigir' e mais descontrole. Menos e mais, nessa hora."
  },
  {
    id: 9,
    pergunta: "Durante uma revisao, o mecanico verifica o diferencial traseiro e percebe que o oleo esta com aspecto escuro, espesso e com um leve cheiro de queimado. Qual e a conclusao CORRETA?",
    alternativas: [
      { id: "A", texto: "O oleo simplesmente esta vencido pelo tempo e precisa de troca rotineira" },
      { id: "B", texto: "O diferencial esta superaquecendo, possivelmente por nivel baixo ou carga excessiva por longo periodo" },
      { id: "C", texto: "Ha contaminacao de agua no oleo do diferencial" },
      { id: "D", texto: "O tipo de oleo usado e incompativel com o diferencial" }
    ],
    correta: "B",
    textoAcertou: "Diagnostico certeiro! Oleo escuro com cheiro de queimado e diferencial trabalhando quente demais - nivel baixo ou bloqueio acionado por tempo demais. Trocar o oleo resolve o sintoma. Entender por que queimou e o que separa o motorista do mecanico de estrada.",
    textoErrou: "Oleo vencido fica escuro, mas nao tem cheiro de queimado. O cheiro e o que entrega: esse diferencial cozinhou por dentro. Nivel baixo ou bloqueio mal usado. Trocar o oleo sem saber o por que e so adiar o problema - e a conta fica maior depois."
  },
  {
    id: 10,
    pergunta: "Um motorista esta em viagem longa, noite fechada, e o painel acende o icone de temperatura alta do motor - o marcador esta na zona vermelha. Qual e a sequencia CORRETA de acoes?",
    alternativas: [
      { id: "A", texto: "Parar imediatamente, desligar o motor e abrir o radiador para verificar o nivel" },
      { id: "B", texto: "Reduzir a velocidade, ligar o aquecedor da cabine no maximo e procurar um lugar seguro para parar - depois desligar o motor e aguardar esfriar antes de abrir qualquer coisa" },
      { id: "C", texto: "Continuar ate o proximo posto para nao ficar parado no acostamento a noite" },
      { id: "D", texto: "Desligar o ar-condicionado, acelerar para aumentar a rotacao do motor e forcar a circulacao de agua" }
    ],
    correta: "B",
    textoAcertou: "Veterano de verdade! O truque do aquecedor no maximo e o que separa quem aprendeu na pratica de quem so acha que sabe. Usa o calor do motor como dissipador extra - funciona. E nunca, NUNCA abre o radiador quente. Isso nao e conselho, e lei da fisica.",
    textoErrou: "Abrir o radiador com motor quente e garantia de explosao de vapor na cara. Acontece de verdade e deixa marca. Continuar rodando destroca o motor. Certo: reduz a velocidade, liga o aquecedor no talo e acha um lugar seguro. Depois espera. Pressa aqui sai caro."
  }
];
