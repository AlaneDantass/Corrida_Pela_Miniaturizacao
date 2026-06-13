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
    name: "Válvulas (ENIAC)",
    period: "1940–1956",
    coinsPerSecond: 1,
    spriteSize: 0.85, // preenchimento relativo do slot
    title: "ENIAC — O Gigante Eletrônico",
    description: "O primeiro computador eletrônico de propósito geral pesava <strong>30 toneladas</strong> e ocupava uma sala inteira! Usava cerca de <strong>18.000 válvulas a vácuo</strong> — tubos de vidro que controlavam a corrente elétrica. Queimavam frequentemente e consumiam energia suficiente para abastecer um bairro. Mas foi o início de tudo.",
    themeClass: "era-1",
    color: "#FFB74D",
    secColor: "#FF8A65",
    bgColor: "#0B0D17"
  },
  {
    level: 2,
    name: "Transistores",
    period: "1956–1963",
    coinsPerSecond: 3,
    spriteSize: 0.70,
    title: "A Revolução do Silício",
    description: "Os <strong>transistores</strong> substituíram as válvulas: eram <strong>100× menores</strong>, não esquentavam tanto e raramente queimavam. Um único transistor fazia o trabalho de uma válvula, mas cabia na ponta do dedo. Linguagens como Fortran e COBOL surgiram nesta era, facilitando a programação.",
    themeClass: "era-2",
    color: "#4FC3F7",
    secColor: "#29B6F6",
    bgColor: "#0A1628"
  },
  {
    level: 3,
    name: "Circuitos Integrados",
    period: "1964–1971",
    coinsPerSecond: 10,
    spriteSize: 0.58,
    title: "Milhares em um Chip",
    description: "Jack Kilby e Robert Noyce tiveram a mesma ideia: colocar vários transistores numa única pastilha de silício. Nascia o <strong>circuito integrado (CI)</strong>. Um chip do tamanho de uma unha podia conter milhares de transistores. Os computadores encolheram de salas para armários.",
    themeClass: "era-3",
    color: "#66BB6A",
    secColor: "#43A047",
    bgColor: "#0B1A0F"
  },
  {
    level: 4,
    name: "Microprocessadores (PC)",
    period: "1971–2000",
    coinsPerSecond: 30,
    spriteSize: 0.48,
    title: "O Computador Pessoal",
    description: "O Intel 4004 (1971) colocou toda a CPU num único chip — o <strong>microprocessador</strong>. Isso permitiu criar computadores que cabiam numa mesa. O IBM PC (1981) e o Macintosh (1984) levaram a computação para dentro das casas. A Lei de Moore previa: a cada 2 anos, o dobro de transistores no mesmo espaço.",
    themeClass: "era-4",
    color: "#AB47BC",
    secColor: "#8E24AA",
    bgColor: "#140B1E"
  },
  {
    level: 5,
    name: "Smartphones / IoT",
    period: "2000–2020",
    coinsPerSecond: 100,
    spriteSize: 0.38,
    title: "O Computador no Bolso",
    description: "Seu smartphone tem mais poder de processamento que todos os computadores da NASA usados para levar o homem à Lua — e cabe no bolso. Bilhões de transistores em chips menores que uma moeda. A <strong>Internet das Coisas (IoT)</strong> conectou geladeiras, relógios e até lâmpadas.",
    themeClass: "era-5",
    color: "#EF5350",
    secColor: "#E53935",
    bgColor: "#1A0B0B"
  },
  {
    level: 6,
    name: "Computação Quântica",
    period: "2020+",
    coinsPerSecond: 500,
    spriteSize: 0.28,
    title: "Além do Silício",
    description: "Qubits em vez de bits. Superposição em vez de 0 e 1. A <strong>computação quântica</strong> promete resolver em minutos problemas que supercomputadores levariam milhares de anos. Ainda experimental, mas representa o próximo salto — onde os átomos são os novos transistores.",
    themeClass: "era-6",
    color: "#00E5FF",
    secColor: "#18FFFF",
    bgColor: "#060E1A"
  }
];

export function getEra(level) {
  return ERAS_DATA[Math.min(level, ERAS_DATA.length) - 1];
}
