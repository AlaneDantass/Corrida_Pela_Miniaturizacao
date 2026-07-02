/* ⚙️ js/config.js */

export const GRID_COLS = 3;
export const GRID_ROWS = 4;
export const TOTAL_SLOTS = GRID_COLS * GRID_ROWS;

export const BASE_BUY_COST = 10;
export const BUY_INFLATION = 1.15;
export const OFFLINE_EARNINGS_CAP_HOURS = 24;
export const COMPONENT_PRODUCTION_BASE = 1;
export const COMPONENT_PRODUCTION_GROWTH = 1.45;

export const ITEMS_PER_ERA = 3;
export const MAX_GLOBAL_LEVEL = 18;
export const ERA_START_LEVELS = Object.freeze([1, 4, 7, 10, 13, 16]);

const ERA_THEME_DATA = [
  {
    level: 1,
    name: "Máquinas Mecânicas",
    period: "Séc. XVII–XIX",
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

const COMPONENT_DEFINITIONS = [
  {
    level: 1,
    name: "Engrenagens",
    description: "Peças mecânicas que transferem movimento e representam os primeiros mecanismos de cálculo.",
    sprite: "era1_gear.png"
  },
  {
    level: 2,
    name: "Calculadora de Pascal",
    description: "Máquina aritmética de engrenagens criada para automatizar somas e subtrações.",
    sprite: "era1_pascaline.png"
  },
  {
    level: 3,
    name: "Máquina Analítica",
    description: "Projeto de computador mecânico geral com memória, processamento e entrada por cartões.",
    sprite: "era1_analytical_engine.png"
  },
  {
    level: 4,
    name: "Válvula a Vácuo",
    description: "Componente eletrônico que controla fluxo de eletricidade e viabiliza computadores digitais iniciais.",
    sprite: "era2_vacuum_tube.png"
  },
  {
    level: 5,
    name: "Painel de Distribuição",
    description: "Conjunto de conexões e válvulas usado para programar e controlar máquinas eletrônicas grandes.",
    sprite: "era2_valve_panel.png"
  },
  {
    level: 6,
    name: "Mainframe Transistorizado",
    description: "Computador institucional mais compacto e eficiente graças ao uso de transistores.",
    sprite: "era2_mainframe.png"
  },
  {
    level: 7,
    name: "Circuito Integrado",
    description: "Chip que reúne múltiplos componentes eletrônicos em uma única pastilha de silício.",
    sprite: "era3_ic_chip.png"
  },
  {
    level: 8,
    name: "Placa Lógica de Silício",
    description: "Placa com circuitos integrados interligados para executar lógica computacional em menor espaço.",
    sprite: "era3_logic_board.png"
  },
  {
    level: 9,
    name: "Computador Apollo (AGC)",
    description: "Computador de navegação das missões Apollo, marco prático dos circuitos integrados.",
    sprite: "era3_apollo_dsky.png"
  },
  {
    level: 10,
    name: "Intel 4004",
    description: "Primeiro microprocessador comercial em chip único, lançado pela Intel em 1971.",
    sprite: "era4_intel4004.png"
  },
  {
    level: 11,
    name: "Placa-Mãe",
    description: "Placa central que conecta processador, memória e periféricos em computadores pessoais.",
    sprite: "era4_motherboard.png"
  },
  {
    level: 12,
    name: "IBM PC",
    description: "Computador pessoal de arquitetura aberta que popularizou padrões de hardware e software.",
    sprite: "era4_ibm_pc.png"
  },
  {
    level: 13,
    name: "Componentes Compactos",
    description: "Peças miniaturizadas de montagem superficial que reduziram tamanho e consumo dos dispositivos.",
    sprite: "era5_compact_components.png"
  },
  {
    level: 14,
    name: "Telefone Celular",
    description: "Dispositivo portátil de comunicação que levou computação embarcada ao uso diário.",
    sprite: "era5_brick_phone.png"
  },
  {
    level: 15,
    name: "Primeiro Smartphone",
    description: "Integra telefone, assistente digital, aplicativos e internet em um computador de bolso.",
    sprite: "era5_smartphone.png"
  },
  {
    level: 16,
    name: "SoC Avançado",
    description: "Sistema em chip que reúne CPU, GPU, sensores e comunicação em um único componente.",
    sprite: "era6_soc.png"
  },
  {
    level: 17,
    name: "Células Quânticas",
    description: "Estruturas lógicas baseadas em qubits para representar informação quântica.",
    sprite: "era6_quantum_cells.png"
  },
  {
    level: 18,
    name: "Computador Quântico",
    description: "Computador que usa qubits, superposição e emaranhamento para explorar novos modelos de processamento.",
    sprite: "era6_quantum_computer.png"
  }
];

function toLevel(value) {
  return Number.isInteger(value) ? value : Number.parseInt(value, 10);
}

export function getComponentProduction(level) {
  const globalLevel = toLevel(level);
  if (!Number.isInteger(globalLevel) || globalLevel < 1 || globalLevel > MAX_GLOBAL_LEVEL) {
    return 0;
  }

  return Math.max(1, Math.round(COMPONENT_PRODUCTION_BASE * Math.pow(COMPONENT_PRODUCTION_GROWTH, globalLevel - 1)));
}

function buildComponent(definition) {
  const eraLevel = Math.ceil(definition.level / ITEMS_PER_ERA);
  const localItemIndex = ((definition.level - 1) % ITEMS_PER_ERA) + 1;

  return Object.freeze({
    ...definition,
    globalLevel: definition.level,
    eraLevel,
    localItemIndex,
    coinsPerSecond: getComponentProduction(definition.level),
    spritePath: `assets/images/sprites/${definition.sprite}`
  });
}

export const COMPONENTS_DATA = Object.freeze(COMPONENT_DEFINITIONS.map(buildComponent));

export const ERAS_DATA = Object.freeze(ERA_THEME_DATA.map((era) => {
  const components = COMPONENTS_DATA.filter((component) => component.eraLevel === era.level);

  return Object.freeze({
    ...era,
    startLevel: components[0]?.globalLevel ?? null,
    endLevel: components[components.length - 1]?.globalLevel ?? null,
    itemN1: components[0]?.name ?? "",
    itemN2: components[1]?.name ?? "",
    itemN3: components[2]?.name ?? ""
  });
}));

export function getEra(level) {
  const eraLevel = toLevel(level);
  if (!Number.isInteger(eraLevel) || eraLevel < 1) return null;
  return ERAS_DATA[Math.min(eraLevel, ERAS_DATA.length) - 1] ?? null;
}

export function getComponentByLevel(level) {
  const globalLevel = toLevel(level);
  if (!Number.isInteger(globalLevel) || globalLevel < 1 || globalLevel > MAX_GLOBAL_LEVEL) {
    return null;
  }

  return COMPONENTS_DATA[globalLevel - 1] ?? null;
}

export function getEraLevelForGlobalLevel(level) {
  return getComponentByLevel(level)?.eraLevel ?? null;
}

export function getEraByGlobalLevel(level) {
  const eraLevel = getEraLevelForGlobalLevel(level);
  return eraLevel ? getEra(eraLevel) : null;
}

export function getLocalItemByGlobalLevel(level) {
  const component = getComponentByLevel(level);
  if (!component) return null;

  return {
    eraLevel: component.eraLevel,
    localItemIndex: component.localItemIndex,
    name: component.name,
    description: component.description,
    sprite: component.sprite,
    spritePath: component.spritePath
  };
}

export function getComponentsForEra(eraLevel) {
  const normalizedEraLevel = toLevel(eraLevel);
  if (!Number.isInteger(normalizedEraLevel) || normalizedEraLevel < 1 || normalizedEraLevel > ERAS_DATA.length) {
    return [];
  }

  return COMPONENTS_DATA.filter((component) => component.eraLevel === normalizedEraLevel);
}

export function getComponentRangeForEra(eraLevel) {
  const components = getComponentsForEra(eraLevel);
  if (components.length === 0) return null;

  return {
    eraLevel: components[0].eraLevel,
    start: components[0].globalLevel,
    end: components[components.length - 1].globalLevel,
    levels: components.map((component) => component.globalLevel)
  };
}

export function getEraStartLevel(eraLevel) {
  return getComponentRangeForEra(eraLevel)?.start ?? null;
}

/**
 * Maps a freshly created global level to the era its creation should transition
 * into, or null when it is not an era-opening level. Era 1's start level (1)
 * never triggers a transition since it is the game's initial state.
 * @param {number} globalLevel
 * @returns {number|null} target era level (2-6) or null
 */
export function getEraTransitionTarget(globalLevel) {
  const level = toLevel(globalLevel);
  const startIndex = ERA_START_LEVELS.indexOf(level);
  if (startIndex <= 0) return null;
  return startIndex + 1;
}

export function getAdaptivePurchaseLevel(highestKnownGlobalLevel = 1) {
  const normalizedLevel = toLevel(highestKnownGlobalLevel);
  if (!Number.isInteger(normalizedLevel) || normalizedLevel < 1) {
    return 1;
  }

  const cappedLevel = Math.min(normalizedLevel, MAX_GLOBAL_LEVEL);
  const component = getComponentByLevel(cappedLevel);
  if (!component) return 1;

  // Conservative anti-grind rule: buy the base item for the highest discovered era.
  // This keeps purchases useful while never spawning beyond discovered progression.
  return Math.min(getEraStartLevel(component.eraLevel) ?? 1, cappedLevel);
}
