# 🖥️ Corrida pela Miniaturização (Computer Evolution)

Um jogo de simulação estilo clicker/fusão (**Cow Evolution**) ambientado na história evolutiva dos computadores e microprocessadores. Comece fundindo enormes gabinetes a vácuo na década de 1940 e avance as eras tecnológicas até atingir os nano-chips quânticos e a singularidade tecnológica.

https://alanedantass.github.io/Corrida_Pela_Miniaturizacao/
## 🚀 Como Executar o Jogo

O projeto foi construído sem dependências externas (zero-dependency). Para jogar:

1. Clone o repositório ou navegue até o diretório do projeto.
2. Inicie um servidor HTTP local simples no diretório raiz.
   - Usando a extensão **Live Server** no VS Code.
   - Ou usando Python no terminal: `python3 -m http.server 8080`.
   - Ou usando Node.js/npx: `npx serve`.
3. Abra `http://localhost:8080` (ou a porta correspondente) no seu navegador.

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
- **Renderização Gráfica**: HTML5 Canvas (2D) para animações de sprites, partículas e linhas de circuitos. Os sprites dos computadores são desenhados inteiramente via código (linhas, círculos, matrizes).
- **Estilos**: CSS3 moderno, usando Glassmorphism, CSS Custom Properties para temas de cores e animações de CRT scanlines e flicker.
- **Arquitetura de Diretórios**:
  - `css/`: Gerencia layouts gerais, temas por era, e animações visuais.
  - `js/config.js`: Centraliza dados históricos, taxas de geração e constantes da grade.
  - `js/audio/`: Módulo de sintetizador da Web Audio API.
  - `js/storage/`: Salvamento automático e processamento de tempo offline.
  - `js/game/`: Controla a economia, a grade física dos slots, a inicialização (`GameEngine.js`) e as regras de fusão.
  - `js/render/`: Desenha as linhas do circuito de fundo, sprites e partículas no Canvas.
  - `js/ui/`: Sincroniza dados com o DOM (HUD, timeline e modais).
  - `js/input/`: Captura e normaliza interações do mouse e eventos touch (mobile).

## 🤝 Contribuição e Colaboração
Para entender as regras de nomenclatura de branches, convenções de commits, e como colaborar com o time neste repositório de forma profissional, leia o nosso [Guia de Contribuição (CONTRIBUTING.md)](CONTRIBUTING.md).

---

## ⚡ Licença
Este projeto é exclusivamente educativo. Sinta-se livre para usar, aprimorar ou contribuir!
