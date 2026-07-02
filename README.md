# 🖥️ Corrida pela Miniaturização (Computer Evolution)

Um jogo de simulação estilo clicker/fusão (**Cow Evolution**) ambientado na história evolutiva dos computadores e microprocessadores. Comece fundindo componentes históricos e avance pelas eras tecnológicas até atingir a computação quântica.

https://alanedantass.github.io/Corrida_Pela_Miniaturizacao/
## 🚀 Como Executar o Jogo

O jogo continua sendo uma aplicação estática sem etapa de build para deploy. Para jogar localmente:

1. Clone o repositório ou navegue até o diretório do projeto.
2. Inicie um servidor HTTP local simples no diretório raiz.
   - Usando npm: `npm run serve`.
   - Ou usando Python no terminal: `python3 -m http.server 8080 --bind 127.0.0.1`.
   - Ou usando a extensão **Live Server** no VS Code.
3. Abra `http://localhost:8080` (ou a porta correspondente) no seu navegador.

> O npm é usado apenas para validação local e automação de testes. A publicação do jogo segue o modelo estático: HTML, CSS, JavaScript e assets servidos diretamente.

---

## ✅ Validação Local

Instale as dependências de desenvolvimento antes de rodar os testes:

```bash
npm install
npm run install:browsers
```

Comandos disponíveis na raiz do repositório:

```bash
npm test              # testes unitários ES modules com node:test
npm run test:coverage # testes unitários com meta mínima de 80% de cobertura
npm run test:smoke    # smoke test em browser carregando game.html via HTTP
npm run validate      # cobertura + smoke test
npm run serve         # servidor local em http://127.0.0.1:8080
```

O smoke test usa Playwright e sobe `game.html` por HTTP em `http://127.0.0.1:4173`, evitando validação por `file://`.

---

## 🎮 Funcionalidades Principais

- **Mecânica de Fusão em Grade**: Arraste computadores de mesmo nível no grid de 3×4 para fundi-los e aprimorá-los.
- **Progressão Tecnológica (6 Gerações)**:
  1. **Válvulas (ENIAC)**: 1940–1956
  2. **Transistores**: 1956–1963
  3. **Circuitos Integrados**: 1964–1971
  4. **Microprocessadores (PC)**: 1971–2000
  5. **Smartphones/IoT**: 2000–2020
  6. **Computação Quântica / Nano**: 2020+
- **Cards Educativos**: Ao alcançar uma nova era tecnológica pela primeira vez, um modal educativo contextualiza o marco histórico, com dados de peso, consumo e miniaturização de hardware.
- **Evolução de UI por Era**: A interface se adapta dinamicamente à era atual, alterando paletas de cores neon, acentos e estilos visuais por meio de transições suaves.
- **Áudio Sintético (Web Audio API)**: Sons retrô gerados dinamicamente via código, eliminando assets de áudio pesados.
- **Salvamento Automático e Geração Offline**: O progresso é salvo no `localStorage`. Ao reabrir, seus ganhos acumulados enquanto esteve offline são contabilizados e mostrados em um relatório de pesquisa.
- **Sistema de Prestígio**: Ao alcançar o nível 6, escolha entre continuar jogando infinitamente no modo Sandbox ou resetar a grade com um multiplicador permanente de **+50% na velocidade de produção**.

---

## 🛠️ Stack Técnica e Arquitetura

- **Estrutura**: HTML5 semântico com overlays interativos.
- **Lógica e Loop**: Vanilla JavaScript utilizando ES Modules.
- **Renderização Gráfica**: HTML5 Canvas (2D) para sprites, partículas e linhas de circuitos.
- **Estilos**: CSS3 moderno, usando Glassmorphism, CSS Custom Properties para temas de cores e animações de CRT scanlines e flicker.
- **Arquitetura de Diretórios**:
  - `game.html`: Tela principal do jogo e alvo do smoke test.
  - `index.html`: Entrada/menu inicial.
  - `css/`: Temas por era e animações compartilhadas.
  - `styles/`: Estilos de tela, menu, intro e layout principal.
  - `scripts/config.js`: Dados históricos, taxas de geração e constantes da grade.
  - `scripts/game.js`: Bootstrap do jogo e da intro cinematográfica.
  - `scripts/intro.js`: Controle da sequência de introdução.
  - `scripts/audio/`: Módulo de áudio/Web Audio API.
  - `scripts/storage/`: Salvamento automático e processamento de tempo offline.
  - `scripts/game/`: Economia, grade, motor principal, computador e regras de fusão.
  - `scripts/render/`: Fundo, sprites, partículas e renderização Canvas.
  - `scripts/ui/`: HUD, timeline, galeria, quiz, tutorial e modais.
  - `scripts/input/`: Mouse, touch, drag-and-drop e ações de clique.
  - `tests/unit/`: Testes unitários de módulos JavaScript puros.
  - `tests/smoke/`: Testes de boot em browser com Playwright.

## 📌 Contexto v2

As tarefas v2 em `.compozy/tasks/corrida-pela-miniaturizacao-v2/` derivam do PRD local. Este diretório não possui `_techspec.md`; implementações devem consultar o PRD, a tarefa ativa e o código existente, registrando lacunas técnicas em vez de inventar detalhes fora do escopo.

## 🤝 Contribuição e Colaboração
Para entender as regras de nomenclatura de branches, convenções de commits, e como colaborar com o time neste repositório de forma profissional, leia o nosso [Guia de Contribuição (CONTRIBUTING.md)](CONTRIBUTING.md).

---

## ⚡ Licença
Este projeto é exclusivamente educativo. Sinta-se livre para usar, aprimorar ou contribuir!
