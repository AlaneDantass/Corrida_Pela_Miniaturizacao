# Corrida Pela Miniaturização v2 — PRD derivado do GDD

Fonte: `/Users/emersondantas/Downloads/GDD_Corrida_Pela_Miniaturizacao.docx`

Este PRD consolida os requisitos do Game Design Document v2.0, "Redesign da Experiência", de julho de 2026. Não há `_techspec.md` neste diretório; tarefas derivadas deste documento devem marcar lacunas técnicas em vez de inventar detalhes de implementação.

## Visão

Corrida Pela Miniaturização é um jogo educativo de fusão contínua, inspirado em Cow Evolution, sobre a história da evolução dos computadores. O jogador funde componentes desde engrenagens mecânicas até o computador quântico, atravessando seis eras tecnológicas em uma cadeia evolutiva única e ininterrupta.

## Metas de UX

- O jogador deve sentir curiosidade constante sobre a próxima tecnologia por meio de silhuetas de itens futuros, timeline de progresso e transições de era cinematográficas.
- A interface deve entregar jogo completo sem poluição visual, com cada elemento de tela tendo função clara.
- O acabamento deve parecer profissional, com animações coreografadas, tipografia consistente, áudio reativo e microinterações.
- A atmosfera deve evoluir de vintage sombrio e assustador nas eras 1-2 para tecnologia leve e reconfortante nas eras 5-6.

## Direção de Arte

- O estilo visual alvo é inspirado em Cuphead: rubber hose anos 1930, texturas de aquarela, granulado de filme antigo, personagens expressivos e squash/stretch.
- O tratamento Cuphead permanece em todas as eras, mas o clima deve mudar de sépia/grão pesado/vinhetas escuras para cores saturadas, luz difusa e interfaces limpas.
- O asset `personagem.png` ou equivalente atual de Bugsy deve ser mantido, com contraste de cor para destacar o personagem em fundos claros e escuros.

## Fluxo de Jogo

### Começo

- O jogo deve abrir com vídeo cinematográfico já produzido, pulável, substituindo intro coreografada em código.
- O modal Continuar/Recomeçar deve ser mantido.
- Em jogo novo, Bugsy deve conduzir tour guiado completo da tela e dos componentes disponíveis.
- O estado inicial deve conter 1 Engrenagem, nível global 1, no grid.

### Meio

- O jogador deve clicar em Realizar Pesquisa para coletar PP.
- O jogador deve comprar peças e fundir pares iguais no grid usando cadeia evolutiva única de 18 níveis.
- Quizzes de revisão devem surgir durante o jogo como oportunidade de bônus em PP.
- Ao criar o primeiro item de uma nova era, a transição deve acontecer automaticamente, sem botão Avançar e sem quiz-portão.
- A partir da era 3, o jogador deve lidar com invasões do Bugze que drenam PP, contratando Técnico de TI pelo telefone.

### Fim

- Ao criar Computador Quântico, nível global 18, o jogo deve exibir cutscene/modal de vitória com tempo, PP totais e prestígios.
- O jogador deve escolher Prestígio, com +50% permanente por ciclo e reinício da cadeia, ou Sandbox, com continuação livre.

## Progressão Contínua

- O grid nunca deve zerar entre eras.
- A cadeia deve ter 18 níveis globais:
  - 1: Engrenagens
  - 2: Calculadora de Pascal
  - 3: Máquina Analítica
  - 4: Válvula a Vácuo
  - 5: Painel de Distribuição
  - 6: Mainframe Transistorizado
  - 7: Circuito Integrado
  - 8: Placa Lógica de Silício
  - 9: Computador Apollo (AGC)
  - 10: Intel 4004
  - 11: Placa-Mãe
  - 12: IBM PC
  - 13: Componentes Compactos
  - 14: Telefone Celular
  - 15: Primeiro Smartphone
  - 16: SoC Avançado
  - 17: Células Quânticas
  - 18: Computador Quântico
- Dois itens iguais devem fundir para o próximo nível global.
- Item final de uma era deve fundir diretamente no primeiro item da era seguinte.
- Slot vazio deve mover item; nível diferente deve rejeitar fusão.
- Compra de peças deve entregar o item base mais útil ao momento, subindo conforme o progresso para evitar grind excessivo.
- Itens de eras passadas devem permanecer válidos no grid.

## Transição de Era

- Transição deve ser disparada pela fusão que cria o primeiro item de uma nova era.
- A transição deve incluir tremor de câmera e shockwave a partir do item recém-criado.
- Paleta, fundo, música, grão de filme e iluminação devem transicionar para o tema da nova era em uma varredura animada de 2-3 segundos.
- Uma historinha da era deve aparecer no fluxo.
- A timeline superior deve avançar com animação e rastro iluminado.

## Historinhas de Época

- Cada era deve abrir com historinha imersiva de 3-5 quadros ilustrados em estilo Cuphead.
- Historinhas devem ter narração em texto, trilha da época, avanço por clique ou automático, opção de pular e reexibição pela timeline.
- Conteúdo por era deve cobrir contexto histórico, quem usava, para quê, problema tecnológico, marco inventado e dados concretos de miniaturização.
- Cada historinha deve plantar fatos que os quizzes vão perguntar depois.
- O tom deve seguir o arco emocional: eras 1-2 misteriosas/sombrias, eras 3-4 corrida tecnológica, eras 5-6 leveza/futuro reconfortante.

## Bugsy, Bugze e Ajuda

- No primeiro jogo, Bugsy deve guiar um tour completo com spotlight, escurecendo/desfocando o restante da tela e elevando o elemento explicado.
- O tour deve cobrir grid/fusão, Realizar Pesquisa, Comprar Peças, barra de componentes, timeline, e o próprio Bugsy como ajuda.
- Após o tour, Bugsy deve ficar ancorado em um canto como botão permanente de ajuda, com FAQ e opção de rever tour.
- Ao chegar à era 3, Bugsy deve se corromper em Bugze, com cena curta de susto usando glitch/CRT, flash vermelho, alarme e moldura pulsante.
- A ajuda deve continuar acessível, agora com versão abstrata/corrompida do personagem.
- A partir da era 3, Bugze deve invadir em intervalos calibráveis e drenar PP continuamente.
- Um ícone de telefone deve ficar fixo em canto específico da tela a partir da era 3.
- O telefone deve abrir menu com opção Contratar Técnico de TI, com custo em PP.
- O técnico deve remover Bugze com animação de dedetização/antivírus.
- Na primeira invasão, um tutorial impessoal deve guiar o jogador até o telefone.

## Quiz-Recompensa

- Quiz não deve ser portão de era.
- Quizzes devem aparecer durante o jogo em pausas naturais, após fusões ou por intervalo de tempo.
- Convite deve ser não bloqueante e pode ser ignorado.
- Perguntas devem ter quatro opções e devem cobrir historinhas já vistas, incluindo revisão espaçada de eras passadas.
- Acerto deve pagar PP generoso, escalado por era.
- Erro não deve punir PP; pergunta deve retornar depois reformulada.
- Acerto de primeira deve conceder bônus adicional.

## Barra de Componentes

- A lateral direita deve ter barra vertical com todos os 18 componentes descobertos ao longo do jogo.
- Itens futuros devem aparecer como silhuetas ou interrogação.
- Ao criar item inédito, deve ocorrer animação de descoberta: zoom/brilho/som e voo até a barra.
- Clicar em componente descoberto deve abrir painel com ilustração, nome, era e descrição do diferencial daquele componente.
- Barra deve rolar verticalmente e agrupar itens por era com cabeçalhos discretos.
- Bugsy deve explicar a barra durante o tour.

## Layout

- Topo: timeline das 6 eras com marcador, rastro de progresso e PP atuais integrados.
- Lateral esquerda: botões Realizar Pesquisa e Comprar Peças, empilhados e sem espaços mortos.
- Centro: grid de fusão como protagonista da tela.
- Lateral direita: coleção de componentes das 6 eras.
- Canto inferior: Bugsy como botão de ajuda.
- Canto específico: telefone visível a partir da era 3.
- Overlays/modais: historinhas, painel de componente, quiz, invasão do Bugze e vitória.

## Economia e Persistência

- Moeda deve ser PP.
- Clique de pesquisa deve partir da base v1: `floor((1 + (era - 1) * 2) * prestígio)`, recalibrável para cadeia de 18 níveis.
- Compra de peças deve partir da base v1: `10 * 1.15^compras`, com item entregue acompanhando progresso.
- Quiz-recompensa deve virar fonte principal de PP em bônus.
- Bugze deve drenar PP continuamente até contratação do Técnico de TI.
- Prestígio deve manter +50% permanente por ciclo.
- Auto-save em localStorage a cada 30 segundos e ações-chave deve ser mantido.
- Save deve incluir coleção, nível global e estado do Bugze.

## Mapa v1 -> v2

- Grid: v1 zera entre eras; v2 nunca zera e usa cadeia global de 18 níveis.
- Transição: v1 usa botão Avançar + quiz obrigatório; v2 usa fusão automática + mudança visual global + historinha.
- Quiz: v1 é portão de fim de era; v2 é recompensa contínua.
- Conteúdo educativo: v1 usa card de texto; v2 usa historinha ilustrada multi-quadro.
- Tutorial: v1 tem poucas falas; v2 exige tour completo com spotlight.
- Personagem: v1 tutorial/frustração; v2 guia/ajuda nas eras 1-2 e vilão Bugze na era 3+.
- Dificuldade: v1 inexistente; v2 tem Bugze drenando PP e Técnico de TI via telefone.
- Galeria: v1 mostra painel simples da era atual; v2 exige coleção acumulada de 18 itens.
- Layout: v1 usa painéis laterais genéricos; v2 exige timeline topo, ações esquerda, coleção direita, ajuda e telefone nos cantos.
- Intro: v1 coreografia de código; v2 vídeo de abertura pronto.
- Arte: v1 usa sprites em canvas/assets; v2 pede direção Cuphead com arco sombrio -> reconfortante.
- Bugsy: v1 usa asset direto; v2 mantém com tratamento de contraste.
- Mantidos: fusão por arrasto, save/continue, prestígio/sandbox, mute/reset.
