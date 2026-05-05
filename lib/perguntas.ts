import { Pergunta } from "./tipos";

const perguntas: Pergunta[] = [
  {
    "id": 1,
    "pergunta": "Quando você pensa no seu negócio HOJE, qual frase descreve melhor sua rotina?",
    "alternativas": [
      { "id": "1a", "texto": "Estou focado em vender mais, produzir mais e manter o caixa em dia.", "pontos": 1 },
      { "id": "1b", "texto": "Tenho clareza de qual dor específica resolvo e para qual cliente ideal.", "pontos": 2 },
      { "id": "1c", "texto": "Construí uma operação que cresce receita sem crescer despesa proporcionalmente.", "pontos": 3 },
      { "id": "1d", "texto": "Tomo decisões pensando em como elas afetam o valuation futuro da empresa.", "pontos": 4 },
      { "id": "1e", "texto": "Lidero um ecossistema de negócios conectados e uma comunidade que indica minha marca.", "pontos": 5 }
    ]
  },
  {
    "id": 2,
    "pergunta": "Onde você investe a MAIOR parte dos seus recursos hoje?",
    "alternativas": [
      { "id": "2a", "texto": "Em marca, posicionamento, valuation e ativos intangíveis que valorizam a empresa.", "pontos": 4 },
      { "id": "2b", "texto": "Em estrutura física: estoque, máquinas, ponto comercial, mais funcionários.", "pontos": 1 },
      { "id": "2c", "texto": "Em pesquisa de cliente, validação de hipóteses e entendimento de persona/ICP.", "pontos": 2 },
      { "id": "2d", "texto": "Em ecossistema, comunidade, novos braços de negócio e legado de longo prazo.", "pontos": 5 },
      { "id": "2e", "texto": "Em tecnologia, plataforma e canais de distribuição que escalam sem custo proporcional.", "pontos": 3 }
    ]
  },
  {
    "id": 3,
    "pergunta": "Como você quer crescer sua empresa nos próximos 2 anos?",
    "alternativas": [
      { "id": "3a", "texto": "Criando camadas de serviço e modelos de distribuição que multiplicam resultado sem multiplicar estrutura.", "pontos": 3 },
      { "id": "3b", "texto": "Construindo um ecossistema com várias unidades de negócio em torno do meu propósito.", "pontos": 5 },
      { "id": "3c", "texto": "Abrindo mais unidades, contratando mais gente, ampliando o ponto físico ou o estoque.", "pontos": 1 },
      { "id": "3d", "texto": "Estruturando a empresa para receber investimento, atrair sócios e aumentar valuation.", "pontos": 4 },
      { "id": "3e", "texto": "Ajustando produto, persona e oferta para atender melhor um nicho específico.", "pontos": 2 }
    ]
  },
  {
    "id": 4,
    "pergunta": "Você sabe quanto a sua empresa VALE hoje (valuation)?",
    "alternativas": [
      { "id": "4a", "texto": "Sei o valuation atual e o projetado para os próximos anos. Negocio com base no valor futuro.", "pontos": 4 },
      { "id": "4b", "texto": "Nunca calculei. Olho o faturamento e o lucro do mês.", "pontos": 1 },
      { "id": "4c", "texto": "Sei que somos diferentes, mas nunca traduzi isso em número de valuation.", "pontos": 2 },
      { "id": "4d", "texto": "O valor da empresa hoje é detalhe. O que importa é o legado e o impacto que ela vai gerar.", "pontos": 5 },
      { "id": "4e", "texto": "Tenho noção do múltiplo do meu setor (EBITDA x N) e sei como escalar para ampliar.", "pontos": 3 }
    ]
  },
  {
    "id": 5,
    "pergunta": "Quando você pensa em CONTRATAR um talento que não consegue pagar à vista, você...",
    "alternativas": [
      { "id": "5a", "texto": "Não contrato. Espero ter caixa para pagar o salário cheio.", "pontos": 1 },
      { "id": "5b", "texto": "Negocio um modelo enxuto onde ele atende vários clientes meus simultaneamente via plataforma.", "pontos": 3 },
      { "id": "5c", "texto": "Convido como co-construtor do ecossistema, com participação no propósito de longo prazo.", "pontos": 5 },
      { "id": "5d", "texto": "Ofereço participação societária (Equity) com vesting, atrelada ao crescimento do valuation.", "pontos": 4 },
      { "id": "5e", "texto": "Tento entender que problema ele resolveria melhor antes de qualquer proposta.", "pontos": 2 }
    ]
  },
  {
    "id": 6,
    "pergunta": "Sobre seus CLIENTES, qual frase mais combina com a sua realidade?",
    "alternativas": [
      { "id": "6a", "texto": "Preciso correr atrás de clientes novos toda semana para manter o faturamento.", "pontos": 1 },
      { "id": "6b", "texto": "Meus clientes viram embaixadores espontâneos e indicam minha empresa por conta própria.", "pontos": 5 },
      { "id": "6c", "texto": "Mapeei meu cliente ideal (ICP) e sei exatamente a dor que ele tem.", "pontos": 2 },
      { "id": "6d", "texto": "Tenho base recorrente e canal de distribuição que captura cliente em escala.", "pontos": 3 },
      { "id": "6e", "texto": "Minha base de clientes é um ativo do valuation. Cada cliente vale X reais para a empresa.", "pontos": 4 }
    ]
  },
  {
    "id": 7,
    "pergunta": "Se aparecesse hoje um competidor agressivo no seu mercado, você...",
    "alternativas": [
      { "id": "7a", "texto": "Provavelmente sentiria pressão de margem rapidamente. É meu maior medo.", "pontos": 1 },
      { "id": "7b", "texto": "Conseguiria reposicionar minha proposta de valor e nicho em pouco tempo.", "pontos": 2 },
      { "id": "7c", "texto": "Estou tranquilo: meu ecossistema e minha comunidade me tornam praticamente inevitável.", "pontos": 5 },
      { "id": "7d", "texto": "Meu valuation, marca e ativos intangíveis seguram o jogo no longo prazo.", "pontos": 4 },
      { "id": "7e", "texto": "Minha distribuição é tão forte que ele teria que comprar canal — e isso custa caro.", "pontos": 3 }
    ]
  },
  {
    "id": 8,
    "pergunta": "Quando você ouve a palavra ESCALAR, o que vem à sua cabeça?",
    "alternativas": [
      { "id": "8a", "texto": "Vender mais, abrir mais unidades, contratar mais gente.", "pontos": 1 },
      { "id": "8b", "texto": "Crescer receita SEM crescer despesa proporcional. Distribuição é o segredo.", "pontos": 3 },
      { "id": "8c", "texto": "Ampliar a oferta para resolver melhor a dor do meu cliente.", "pontos": 2 },
      { "id": "8d", "texto": "É efeito colateral natural de quem tem ecossistema vivo e propósito claro.", "pontos": 5 },
      { "id": "8e", "texto": "Aumentar o valuation para atrair capital e fazer M&A estratégico.", "pontos": 4 }
    ]
  },
  {
    "id": 9,
    "pergunta": "Qual destas perguntas é a que MAIS te tira o sono hoje?",
    "alternativas": [
      { "id": "9a", "texto": "\"Quanto minha empresa vai valer daqui a 5 anos e como acelero esse valor?\"", "pontos": 4 },
      { "id": "9b", "texto": "\"Como vou bater a meta de faturamento e fechar o mês no azul?\"", "pontos": 1 },
      { "id": "9c", "texto": "\"Estou resolvendo a dor certa para o cliente certo?\"", "pontos": 2 },
      { "id": "9d", "texto": "\"Que legado eu deixo? Como meu negócio serve mais gente e dura para sempre?\"", "pontos": 5 },
      { "id": "9e", "texto": "\"Como amplio distribuição e crio um modelo escalável de verdade?\"", "pontos": 3 }
    ]
  },
  {
    "id": 10,
    "pergunta": "Daqui a 10 anos, qual destes cenários você considera SUCESSO?",
    "alternativas": [
      { "id": "10a", "texto": "Ter um negócio sólido, lucrativo e que sustente bem minha família.", "pontos": 1 },
      { "id": "10b", "texto": "Liderar um ecossistema de empresas conectadas, com comunidade forte e impacto duradouro (jogo infinito).", "pontos": 5 },
      { "id": "10c", "texto": "Ser referência absoluta no nicho que escolhi servir.", "pontos": 2 },
      { "id": "10d", "texto": "Ter feito uma boa saída (exit), IPO ou venda estratégica com valuation alto.", "pontos": 4 },
      { "id": "10e", "texto": "Ter uma operação rodando sozinha, escalável, gerando receita recorrente.", "pontos": 3 }
    ]
  }
];

export default perguntas;
