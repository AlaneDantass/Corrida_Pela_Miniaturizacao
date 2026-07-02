/* 📖 js/data/EraStories.js — centralized multi-frame era stories.
 *
 * Each era has 3-5 illustrated frames. Copy is kept here so art and text can be
 * swapped later without touching UI logic. Frames deliberately seed the facts
 * that the era quiz (config.js ERA quiz) asks about later. */

const STORIES = [
  {
    eraLevel: 1,
    eraName: "Máquinas Mecânicas",
    frames: [
      { text: "Séculos XVII–XIX. Antes da eletricidade, calcular era trabalho braçal: engrenagens de latão giravam para somar e subtrair." },
      { text: "Blaise Pascal criou a Pascalina para automatizar contas. Mas foi Charles Babbage quem sonhou mais alto." },
      { text: "A Máquina Analítica de Charles Babbage foi o primeiro projeto de um computador mecânico de uso geral, com entrada por cartões perfurados, processamento e memória." },
      { text: "Marco: os conceitos de Babbage — 'moinho' (processamento) e 'depósito' (memória) — antecipam os computadores modernos." }
    ]
  },
  {
    eraLevel: 2,
    eraName: "Computadores Eletrônicos",
    frames: [
      { text: "1930–1950. As engrenagens deram lugar a máquinas eletrônicas gigantes que ocupavam salas inteiras." },
      { text: "O ENIAC calculava trajetórias de guerra usando milhares de válvulas a vácuo — o componente que controlava o fluxo de eletricidade no vácuo." },
      { text: "Válvulas queimavam o tempo todo e consumiam energia absurda. Era preciso algo menor e mais confiável." },
      { text: "Marco: os mainframes transistorizados substituíram válvulas por transistores de silício — centenas de vezes menores e mais eficientes." }
    ]
  },
  {
    eraLevel: 3,
    eraName: "Circuitos Integrados",
    frames: [
      { text: "1960–1970. Engenheiros aprenderam a imprimir vários componentes numa única pastilha de silício: o circuito integrado." },
      { text: "Isso encolheu computadores inteiros até caberem a bordo de uma nave espacial." },
      { text: "O Computador de Navegação Apollo (AGC) foi um dos pioneiros no uso de circuitos integrados." },
      { text: "Marco: o AGC guiou as naves Apollo para pousar o homem na Lua, controlando navegação em tempo real." }
    ]
  },
  {
    eraLevel: 4,
    eraName: "Revolução do Microprocessador",
    frames: [
      { text: "1970–1990. E se um computador inteiro coubesse num só chip? A corrida da miniaturização acelerou." },
      { text: "Em 1971 a Intel lançou o Intel 4004, o primeiro microprocessador comercial em um único chip." },
      { text: "Com processadores baratos, o computador saiu dos laboratórios e entrou em casas e escritórios." },
      { text: "Marco: o IBM PC (1981) padronizou a arquitetura aberta e popularizou o computador pessoal." }
    ]
  },
  {
    eraLevel: 5,
    eraName: "Computação Pessoal Portátil",
    frames: [
      { text: "1990–2010. Componentes de montagem superficial miniaturizaram tudo: o poder de processamento passou a caber no bolso." },
      { text: "Telefones celulares levaram computação embarcada ao dia a dia das pessoas." },
      { text: "Juntando telefone, assistente digital e internet nasceram os primeiros smartphones." },
      { text: "Marco: o IBM Simon, dos anos 90, foi um dos primeiros modelos comerciais a unir essas funções." }
    ]
  },
  {
    eraLevel: 6,
    eraName: "Computação Ubíqua e Futuro",
    frames: [
      { text: "2010+. Sistemas em chip (SoC) reúnem CPU, GPU, sensores e comunicação num único componente onipresente." },
      { text: "Mas há um limite físico para encolher transistores. A próxima fronteira muda as regras." },
      { text: "Computadores quânticos usam qubits — a unidade que pode existir em múltiplos estados ao mesmo tempo (superposição)." },
      { text: "Marco: com superposição e emaranhamento, o computador quântico processa dados de formas impossíveis para bits comuns." }
    ]
  }
];

const ERA_STORY_BY_LEVEL = new Map(
  STORIES.map((story) => [
    story.eraLevel,
    Object.freeze({
      ...story,
      // Reuse the existing era backdrop art as frame illustration until final
      // Cuphead-style frames are produced.
      frames: story.frames.map((frame) =>
        Object.freeze({ image: `assets/images/sprites/era${story.eraLevel}.png`, ...frame })
      )
    })
  ])
);

export const ERA_STORIES = Object.freeze(STORIES.map((story) => ERA_STORY_BY_LEVEL.get(story.eraLevel)));

/**
 * @param {number} eraLevel
 * @returns {{eraLevel:number, eraName:string, frames:Array<{text:string,image?:string,title?:string}>}|null}
 */
export function getEraStory(eraLevel) {
  return ERA_STORY_BY_LEVEL.get(eraLevel) ?? null;
}
