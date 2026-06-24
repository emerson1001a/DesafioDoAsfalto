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
    textoAcertou: "Isso ai! Caminhao usa freio pneumatico, meu irmao. Freio mole e sinal de ar no sistema - ou vazamento, ou falha na pressurizacao. Quem respondeu pastilha ta pensando em carro de passeio. Aqui e outra conversa.",
    textoErrou: "Atencao: em caminhao pesado o freio e pneumatico. Pastilha desgastada faz barulho e aumenta a distancia de frenagem - mas nao amolece o pedal. Pedal mole e ar no sistema. Isso e diferenca que pode salvar vida."
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
    textoAcertou: "Certo! O freio motor e o retarder sao seus melhores amigos na descida. O freio de servico voce guarda pra emergencia - nao fica segurando nele a descida toda, senao vai perder o freio na hora que mais precisar. Isso nao e teoria, e sobrevivencia.",
    textoErrou: "Manter o freio de servico acionado em descida longa e receita pra perder o freio por calor - o famoso fading. Usa o freio motor. O freio de servico e reserva, nao ferramenta principal de descida."
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
    textoAcertou: "E isso! Quando o puxao aparece na hora de frear, o culpado quase sempre e o freio atuando mais forte de um lado que do outro. Pneu fora de calibragem puxa o tempo todo - nao so ao frear. Presta atencao nessa diferenca.",
    textoErrou: "A dica esta no momento do sintoma: o carro puxa ao frear, nao em velocidade normal. Isso aponta pro freio, nao pro pneu nem pra direcao. Freio assimetrico - um lado segurando mais que o outro. Diferenca sutil que muita gente deixa passar."
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
    textoAcertou: "Certo! Eixo simples de rodagem dupla: 10 toneladas. Decorou? Porque fiscalizacao nao aceita 'eu achei que era mais'. A multa e a apreensao sao bem reais.",
    textoErrou: "Muita gente confunde: eixo simples de rodagem dupla aguenta 10 toneladas. As 17 toneladas sao do eixo tandem duplo - dois eixos juntos. Sao limites diferentes pra configuracoes diferentes. Conhecer essa diferenca evita multa, apreensao e acidente."
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
    textoAcertou: "Acertou, e esse e o tipo de coisa que quanto mais cedo voce identifica, menos dinheiro voce perde. Agua leitosa com espuma em motor e oleo misturado na agua - e o caminho mais comum e pela junta do cabecote. Nao ignora esse sinal.",
    textoErrou: "Agua vencida fica amarelada ou enferrujada - nao leitosa. Agua leitosa com espuma significa que oleo entrou no circuito de arrefecimento. Isso quase sempre e junta do cabecote comprometida. Um mecanico que ja viu isso de verdade reconhece na hora."
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
    textoAcertou: "Pegou a virada! Pneu com pressao alta reduz atrito com o asfalto - o consumo cai, nao aumenta. Essa pergunta foi pra ver se voce leu com atencao. Na estrada e na mecanica, detalhe faz diferenca.",
    textoErrou: "A armadilha foi a palavra 'menos'. Pneu com pressao acima do normal diminui o consumo - nao aumenta. As outras tres opcoes sao causas reais de consumo alto. Leitura atenta e parte do trabalho de quem manda na estrada."
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
    textoAcertou: "Correto! Frente pra subida, primeira marcha engajada. O motor trava no sentido que o veiculo tenderia a descer. E simples, mas tem gente que deixa em ponto morto com freio de mao e vai dormir. Num caminhao carregado, isso e roleta-russa.",
    textoErrou: "Nunca deixa caminhao carregado so no freio de mao. O cambio em primeira com a frente pra subida usa a compressao do motor como trava extra. Parece detalhe - mas e o detalhe que evita que o caminhao desca sozinho enquanto voce dorme."
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
    textoAcertou: "Isso! Contra-intuicao pura. O instinto manda frear - mas frear bruscamente num conjunto sambando e quase garantia de tombamento. Solta o gas devagar, mantem o volante reto e deixa o veiculo se estabilizar. Quem nunca viveu isso na pratica acha que e facil. Nao e.",
    textoErrou: "Quando o reboque samba, frear ou estercar bruscamente aumenta a oscilacao e pode virar o conjunto. A resposta correta parece errada - mas e a unica que funciona: soltar o gas com calma e segurar o volante reto ate estabilizar. Vale memorizar isso."
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
    textoAcertou: "Diagnostico certo. Oleo escuro e com cheiro de queimado no diferencial e estresse termico acumulado. Ou o nivel estava baixo, ou o diferencial bloqueado ficou acionado por tempo demais. Troca o oleo e investiga a causa - nao so o sintoma.",
    textoErrou: "Oleo simplesmente vencido fica escuro mas nao tem cheiro de queimado. O cheiro entrega: esse diferencial trabalhou quente demais. Nivel baixo ou bloqueio mal usado sao os suspeitos principais. Nao adianta trocar so o oleo sem entender por que queimou."
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
    textoAcertou: "Veterano! Essa pegou muita gente. O detalhe do aquecedor e o que separa quem estudou de quem so acha que sabe: ligar o aquecedor da cabine no maximo usa o calor do motor como dissipador extra. Pequeno detalhe, grande diferenca. E nunca abre o radiador quente - nunca.",
    textoErrou: "Abre o radiador com motor quente e voce leva uma explosao de vapor na cara - isso acontece de verdade. E continuar rodando e destruir o motor. O certo e: reduz a velocidade, liga o aquecedor da cabine no maximo pra ajudar a dissipar calor, para em lugar seguro, desliga e espera esfriar. So depois abre."
  }
];
