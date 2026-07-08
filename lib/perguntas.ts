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

// Para trocar o conjunto de perguntas (ex.: segundo sorteio),
// troque este valor para "B" e faça deploy.
export const CONJUNTO_ATIVO: "A" | "B" = "A";

export const perguntasConjuntoA: Pergunta[] = [
  {
    id: 1,
    pergunta: "Um caminhão trucado (6x2) está plenamente carregado e o motorista percebe que o freio está 'mole', exigindo mais força no pedal. Qual é a causa MAIS PROVÁVEL desse sintoma?",
    alternativas: [
      { id: "A", texto: "Pastilha de freio desgastada" },
      { id: "B", texto: "Ar no circuito de freio pneumático" },
      { id: "C", texto: "Fluido de freio baixo" },
      { id: "D", texto: "Freio de motor com defeito" }
    ],
    correta: "B",
    textoAcertou: "Isso aí! Caminhão é freio pneumático, não hidráulico. Pedal mole é ar no sistema - vazamento ou falha na pressurização. Quem foi lá na pastilha tá confundindo caminhão com Corsa. Aqui a conversa é outra, meu parceiro.",
    textoErrou: "Caminhão pesado usa freio pneumático - não hidráulico. Pastilha desgastada faz barulho e aumenta a distância de frenagem, mas não deixa o pedal mole. Pedal mole é ar no circuito. Confundir isso na pista não é erro de quiz - é risco de acidente."
  },
  {
    id: 2,
    pergunta: "Você está em uma descida longa e íngreme. O freio de serviço começa a esquentar excessivamente. Qual é a ação CORRETA?",
    alternativas: [
      { id: "A", texto: "Usar o freio motor e o freio de serviço intermitentemente" },
      { id: "B", texto: "Manter o freio de serviço acionado com pressão constante e moderada" },
      { id: "C", texto: "Usar somente o freio motor e soltar completamente o freio de serviço para ele esfriar" },
      { id: "D", texto: "Reduzir a marcha e usar o retarder/freio motor como principal, acionando o freio de serviço apenas em emergência" }
    ],
    correta: "D",
    textoAcertou: "Isso aí, irmão! Freio motor e retarder é o que manda na descida. Freio de serviço você guarda pra emergência - não fica segurando a lomba toda nele, senão chega no fundo sem freio. Não é teoria não: é o tipo de coisa que já matou gente.",
    textoErrou: "Eita... segurou o freio de serviço a descida toda? Isso é fading garantido - o freio esquenta, perde a pressão e sumiu. Motorista experiente usa o freio motor e guarda o serviço pra emergência. Volta ao básico, parceiro."
  },
  {
    id: 3,
    pergunta: "Um motorista percebe que seu caminhão 'puxa' para um lado ao frear. Antes de ir à oficina, ele verifica os pneus e todos estão calibrados corretamente. O que é MAIS PROVÁVEL que esteja causando o problema?",
    alternativas: [
      { id: "A", texto: "Diferença de desgaste entre os pneus do eixo dianteiro" },
      { id: "B", texto: "Desregulagem ou falha no freio de um dos lados do eixo dianteiro" },
      { id: "C", texto: "Problema na direção hidráulica" },
      { id: "D", texto: "Carga mal distribuída na carroceria" }
    ],
    correta: "B",
    textoAcertou: "Acertou na mosca! Puxão só na hora de frear é freio assimétrico - um lado segurando mais que o outro. Pneu fora de calibragem puxa o tempo todo, não só ao frear. Detalhe que muita gente ignora até dar problema de verdade.",
    textoErrou: "Prestou atenção? O caminhão puxa SÓ na hora de frear - não em velocidade normal. Isso é freio, não pneu nem direção. Um lado travando mais que o outro. Parece detalhe, mas na pista esse detalhe te coloca no barranco."
  },
  {
    id: 4,
    pergunta: "Qual é o peso máximo permitido por lei brasileira no eixo traseiro simples (eixo simples de rodagem dupla) de um caminhão?",
    alternativas: [
      { id: "A", texto: "8 toneladas" },
      { id: "B", texto: "10 toneladas" },
      { id: "C", texto: "12 toneladas" },
      { id: "D", texto: "17 toneladas" }
    ],
    correta: "B",
    textoAcertou: "10 toneladas no eixo simples de rodagem dupla. Certo! Fiscal de balança não aceita 'eu achei que era mais, chefe'. A multa e o pátio são bem reais - e saem do seu bolso, não do bolso do dono da carga.",
    textoErrou: "10 toneladas no eixo simples de rodagem dupla - não 17. Esse é o limite do tandem duplo. Confundir na balança custa caro: multa, retenção e ainda fica parado esperando o dono tirar o excesso. Nem sempre o chefe aparece rápido."
  },
  {
    id: 5,
    pergunta: "Durante uma revisão, o mecânico verifica a água do radiador e ela está com coloração levemente leitosa e espumosa. O que isso indica?",
    alternativas: [
      { id: "A", texto: "O fluido de arrefecimento está vencido e precisa ser trocado" },
      { id: "B", texto: "Há mistura de óleo com água, provavelmente por falha na junta do cabeçote" },
      { id: "C", texto: "O radiador está entupido e a água está superaquecendo" },
      { id: "D", texto: "A proporção de aditivo/água está errada" }
    ],
    correta: "B",
    textoAcertou: "Acertou e salvou o motor! Água leitosa com espuma é óleo no circuito de arrefecimento - quase sempre junta do cabeçote. Quanto mais cedo pega, menos dinheiro perde. Ignorar esse sinal é assinar um cheque em branco pra oficina.",
    textoErrou: "Água vencida fica amarelada ou enferrujada - não leitosa e espumosa. Quando está assim é óleo no circuito. Quase sempre é junta do cabeçote. Qualquer mecânico de beira de estrada que já viu isso reconhece na hora. Você ainda ia rodar com isso?"
  },
];

export const perguntasConjuntoB: Pergunta[] = [
  {
    id: 6,
    pergunta: "Um caminhão está consumindo muito mais diesel que o normal, mas a fumaça está normal - nem preta, nem azul, nem branca. Marque a causa MENOS provável entre as opções:",
    alternativas: [
      { id: "A", texto: "Filtro de ar entupido" },
      { id: "B", texto: "Injetor com problema de vazão" },
      { id: "C", texto: "Problema no turbocompressor" },
      { id: "D", texto: "Pneus calibrados acima do recomendado" }
    ],
    correta: "D",
    textoAcertou: "Boa, você leu a pergunta até o fim! Pneu com pressão alta reduz o atrito - consumo cai, não sobe. Era pegadinha de atenção. Quem acertou essa é porque lê o contrato antes de assinar. Raro nas estradas.",
    textoErrou: "Cuidado com a palavra 'menos'! Pneu calibrado acima do normal diminui o consumo - não aumenta. As outras três são causas reais. Pegadinha de leitura. Na estrada, quem não lê o aviso só vê o buraco depois que cai."
  },
  {
    id: 7,
    pergunta: "Na hora de fazer o freio de estacionamento em uma subida, qual é o procedimento correto para um caminhão com câmbio manual?",
    alternativas: [
      { id: "A", texto: "Acionar o freio de mão e deixar o câmbio em ponto morto" },
      { id: "B", texto: "Acionar o freio de mão e engatar marcha à ré" },
      { id: "C", texto: "Acionar o freio de mão e engatar a primeira marcha, com a frente do veículo voltada para a subida" },
      { id: "D", texto: "Acionar o freio de mão e engatar a primeira marcha, com a frente voltada para qualquer direção" }
    ],
    correta: "C",
    textoAcertou: "Certinho! Frente pra subida, primeira marcha engatada. O motor trava no sentido que o veículo tenderia a descer. Parece besteira, mas tem gente que deixa em ponto morto com o freio de mão e vai dormir. Num caminhão carregado, isso é roleta-russa de verdade.",
    textoErrou: "Nunca confia só no freio de mão num caminhão carregado. Primeira marcha engatada com a frente pra subida - a compressão do motor é sua segunda trava. Parece frescura. Não é. O caminhão que desceu sozinho enquanto o motorista dormia não avisou antes de sair."
  },
  {
    id: 8,
    pergunta: "Um caminhão com semi-reboque começa a 'sambar' (oscilação lateral do reboque, conhecida como fishtailing) em alta velocidade. Qual é a ação CORRETA imediata do motorista?",
    alternativas: [
      { id: "A", texto: "Frear com força para reduzir rapidamente a velocidade" },
      { id: "B", texto: "Fazer movimentos rápidos de direção no sentido contrário à oscilação para estabilizar" },
      { id: "C", texto: "Soltar o acelerador suavemente e manter o volante firme e reto até o veículo estabilizar" },
      { id: "D", texto: "Puxar o freio de estacionamento para segurar o reboque" }
    ],
    correta: "C",
    textoAcertou: "Isso! Contraintuição na veia. Todo instinto grita 'freia!' - mas frear bruscamente num conjunto sambando é convite pro tombamento. Solta o gás com calma, volante firme e reto, e deixa o bicho se acomodar. Quem nunca passou por isso acha que é fácil. Não é, não.",
    textoErrou: "Frear forte com reboque sambando é pedir pro conjunto tombar. A física não negocia. Solta o gás devagar, segura o volante reto e espera o bicho se acalmar. Cada volantazo que você dá pra 'corrigir' é mais descontrole. Menos é mais, nessa hora."
  },
  {
    id: 9,
    pergunta: "Durante uma revisão, o mecânico verifica o diferencial traseiro e percebe que o óleo está com aspecto escuro, espesso e com um leve cheiro de queimado. Qual é a conclusão CORRETA?",
    alternativas: [
      { id: "A", texto: "O óleo simplesmente está vencido pelo tempo e precisa de troca rotineira" },
      { id: "B", texto: "O diferencial está superaquecendo, possivelmente por nível baixo ou carga excessiva por longo período" },
      { id: "C", texto: "Há contaminação de água no óleo do diferencial" },
      { id: "D", texto: "O tipo de óleo usado é incompatível com o diferencial" }
    ],
    correta: "B",
    textoAcertou: "Diagnóstico certeiro! Óleo escuro com cheiro de queimado é diferencial trabalhando quente demais - nível baixo ou bloqueio acionado por tempo demais. Trocar o óleo resolve o sintoma. Entender por que queimou é o que separa o motorista do mecânico de estrada.",
    textoErrou: "Óleo vencido fica escuro, mas não tem cheiro de queimado. O cheiro é o que entrega: esse diferencial cozinhou por dentro. Nível baixo ou bloqueio mal usado. Trocar o óleo sem saber o porquê é só adiar o problema - e a conta fica maior depois."
  },
  {
    id: 10,
    pergunta: "Um motorista está em viagem longa, noite fechada, e o painel acende o ícone de temperatura alta do motor - o marcador está na zona vermelha. Qual é a sequência CORRETA de ações?",
    alternativas: [
      { id: "A", texto: "Parar imediatamente, desligar o motor e abrir o radiador para verificar o nível" },
      { id: "B", texto: "Reduzir a velocidade, ligar o aquecedor da cabine no máximo e procurar um lugar seguro para parar - depois desligar o motor e aguardar esfriar antes de abrir qualquer coisa" },
      { id: "C", texto: "Continuar até o próximo posto para não ficar parado no acostamento à noite" },
      { id: "D", texto: "Desligar o ar-condicionado, acelerar para aumentar a rotação do motor e forçar a circulação de água" }
    ],
    correta: "B",
    textoAcertou: "Veterano de verdade! O truque do aquecedor no máximo é o que separa quem aprendeu na prática de quem só acha que sabe. Usa o calor do motor como dissipador extra - funciona. E nunca, NUNCA abre o radiador quente. Isso não é conselho, é lei da física.",
    textoErrou: "Abrir o radiador com motor quente é garantia de explosão de vapor na cara. Acontece de verdade e deixa marca. Continuar rodando destroça o motor. Certo: reduz a velocidade, liga o aquecedor no talo e acha um lugar seguro. Depois espera. Pressa aqui sai caro."
  },
];
