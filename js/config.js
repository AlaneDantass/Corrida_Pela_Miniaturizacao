/* ⚙️ js/config.js */

export const GRID_COLS = 3;
export const GRID_ROWS = 4;
export const TOTAL_SLOTS = GRID_COLS * GRID_ROWS;

export const BASE_BUY_COST = 10;
export const BUY_INFLATION = 1.15;
export const OFFLINE_EARNINGS_CAP_HOURS = 24;

export const ERAS_DATA = [
  {
    level: 1,
    name: "Máquinas Mecânicas",
    period: "Séc. XVII–XIX",
    itemN1: "Engrenagens",
    itemN2: "Calculadora de Pascal",
    itemN3: "Máquina Analítica",
    description: "A Máquina Analítica de Charles Babbage é considerada o primeiro projeto de um computador mecânico de uso geral. Tinha entrada por cartões perfurados, uma unidade de processamento ('moinho') e memória ('depósito'), conceitos usados nos computadores modernos.",
    quiz: {
      question: "Quem projetou a Máquina Analítica, considerada o primeiro design conceitual de um computador mecânico de uso geral?",
      options: [
        "Alan Turing",
        "Charles Babbage",
        "Bill Gates",
        "Blaise Pascal"
      ],
      correct: 1 // Charles Babbage
    },
    themeClass: "era-1",
    color: "#C9A227",
    secColor: "#8B4513",
    bgColor: "#2C1810",
    accentColor: "#E8891A"
  },
  {
    level: 2,
    name: "Computadores Eletrônicos",
    period: "1930–1950",
    itemN1: "Válvula a Vácuo",
    itemN2: "Painel de Distribuição",
    itemN3: "Mainframe Transistorizado",
    description: "Os mainframes transistorizados marcaram a substituição das grandes válvulas por transistores de silício. Isso permitiu computadores centenas de vezes menores, mais rápidos e eficientes energeticamente, impulsionando a computação científica.",
    quiz: {
      question: "Qual componente eletrônico que controlava o fluxo de eletricidade em vácuo caracterizou os computadores da primeira geração como o ENIAC?",
      options: [
        "Transistor",
        "Válvula a Vácuo",
        "Resistor",
        "Circuito Integrado"
      ],
      correct: 1 // Válvula a Vácuo
    },
    themeClass: "era-2",
    color: "#E05A1A",
    secColor: "#5A3020",
    bgColor: "#1A1008",
    accentColor: "#FF6B2B"
  },
  {
    level: 3,
    name: "Circuitos Integrados",
    period: "1960–1970",
    itemN1: "Circuito Integrado",
    itemN2: "Placa Lógica de Silício",
    itemN3: "Computador de Navegação Apollo",
    description: "O AGC (Apollo Guidance Computer) foi uma das primeiras aplicações de circuitos integrados da história. Instalado a bordo das naves Apollo, controlava a navegação e a orientação em tempo real, viabilizando o pouso do homem na Lua.",
    quiz: {
      question: "O Computador de Navegação Apollo (AGC) foi um dos pioneiros no uso de circuitos integrados. Qual foi o principal objetivo de sua missão histórica?",
      options: [
        "Prever o clima terrestre",
        "Guiar as naves espaciais para pousar o homem na Lua",
        "Simular testes nucleares",
        "Conectar a primeira rede mundial de computadores"
      ],
      correct: 1 // Guiar as naves espaciais para pousar o homem na Lua
    },
    themeClass: "era-3",
    color: "#4A9E6B",
    secColor: "#2A5A3A",
    bgColor: "#0D1F14",
    accentColor: "#39D966"
  },
  {
    level: 4,
    name: "Revolução do Microprocessador",
    period: "1970–1990",
    itemN1: "Intel 4004",
    itemN2: "Placa-Mãe Antiga",
    itemN3: "IBM PC",
    description: "O IBM PC (Personal Computer) de 1981 padronizou a arquitetura dos computadores pessoais com sua estrutura aberta. Popularizou o uso de computadores em escritórios e residências e impulsionou a indústria de softwares modernos.",
    quiz: {
      question: "Qual foi o primeiro microprocessador comercial em um único chip, lançado pela Intel in 1971?",
      options: [
        "Intel 4004",
        "Intel 8086",
        "Intel Pentium",
        "Zilog Z80"
      ],
      correct: 0 // Intel 4004
    },
    themeClass: "era-4",
    color: "#C8A878",
    secColor: "#6B5A3A",
    bgColor: "#1A1508",
    accentColor: "#F0B840"
  },
  {
    level: 5,
    name: "Computação Pessoal Portátil",
    period: "1990–2010",
    itemN1: "Componentes Compactos",
    itemN2: "Telefone Celular",
    itemN3: "Primeiro Smartphone",
    description: "A fusão de telefones celulares, assistentes pessoais (PDAs) e conexão constante à Internet resultou nos primeiros smartphones. Eles colocaram o poder de supercomputadores antigos direto na palma da mão e nos bolsos da sociedade.",
    quiz: {
      question: "O conceito de smartphone uniu telefone, assistente digital e internet. Qual foi um dos primeiros modelos comerciais a incorporar essas funções nos anos 90?",
      options: [
        "IBM Simon",
        "Nokia 3310",
        "Blackberry Bold",
        "Motorola StarTAC"
      ],
      correct: 0 // IBM Simon
    },
    themeClass: "era-5",
    color: "#8AB4D4",
    secColor: "#3A5A7A",
    bgColor: "#0A1020",
    accentColor: "#60A0E0"
  },
  {
    level: 6,
    name: "Computação Ubíqua e Futuro",
    period: "2010+",
    itemN1: "SoC Avançado",
    itemN2: "Células Lógicas Quânticas",
    itemN3: "Computador Quântico",
    description: "Diferente de bits binários (0 e 1), computadores quânticos usam qubits que aproveitam propriedades da mecânica quântica, como superposição e emaranhamento, para processar dados em velocidades massivas, abrindo novas fronteiras na ciência.",
    quiz: {
      question: "Qual é a unidade fundamental de informação usada na computação quântica, que pode existir em múltiplos estados simultaneamente?",
      options: [
        "Bit",
        "Byte",
        "Qubit",
        "Transistor"
      ],
      correct: 2 // Qubit
    },
    themeClass: "era-6",
    color: "#00E5FF",
    secColor: "#0050A0",
    bgColor: "#020814",
    accentColor: "#40FFCC"
  }
];

export function getEra(level) {
  return ERAS_DATA[Math.min(level, ERAS_DATA.length) - 1];
}
