# 🤝 Guia de Contribuição e Colaboração (CONTRIBUTING.md)

Seja bem-vindo(a) à equipe de desenvolvimento do **Corrida pela Miniaturização (Computer Evolution)**! 🚀

Para mantermos o projeto organizado, escalável e com um histórico de desenvolvimento limpo, adotamos práticas profissionais de controle de versão (Git e GitHub). Este documento serve como o nosso guia passo a passo de trabalho.

---

## 📌 1. Como Não Perder a Versão Atual (Preservação de Estado)

Antes de qualquer integrante da equipe começar a modificar o jogo, é crucial salvarmos e "congelarmos" a versão atual estável. Dessa forma, caso ocorra algum erro crítico no futuro, poderemos restaurá-la instantaneamente.

### Passos para Criar uma Tag e Release no GitHub:
1. **Gerar uma Tag Local:**
   Abra o terminal no diretório do projeto e crie uma tag anotada (por exemplo, `v1.0.0-stable`):
   ```bash
   git tag -a v1.0.0 -m "Versão 1.0.0 - Lançamento Inicial Estável (Versão Solo)"
   ```

2. **Enviar a Tag para o GitHub:**
   Envie a tag criada para o repositório remoto:
   ```bash
   git push origin v1.0.0
   ```

3. **Criar uma Release no GitHub:**
   - Acesse o repositório no GitHub: [AlaneDantass/Corrida_Pela_Miniaturizacao](https://github.com/AlaneDantass/Corrida_Pela_Miniaturizacao)
   - Do lado direito, clique em **Releases** > **Create a new release**.
   - Selecione a tag `v1.0.0`.
   - Dê um título descritivo (ex: `Lançamento Inicial Estável - v1.0.0`).
   - Escreva um resumo rápido das funcionalidades atuais (ex: "Versão base do jogo de fusão com 6 eras, áudio via Web Audio API e persistência com localStorage").
   - Clique em **Publish release**.

> [!TIP]
> O GitHub arquiva automaticamente o código-fonte dessa versão exata em arquivos `.zip` e `.tar.gz` acessíveis a qualquer momento.

---

## ⚡ 2. Fluxo de Trabalho (GitHub Flow)

Adotamos o **GitHub Flow**, um modelo de ramificação (branching) simples, focado em entrega contínua e revisões.

```mermaid
graph TD
    A[main: Versão Estável] -->|Criar Branch| B(feature/nova-funcionalidade)
    B -->|Escrever Código & Commit| C(Commits Frequentes)
    C -->|Push para GitHub| D[Abrir Pull Request]
    D -->|Revisão por Colega| E{Aprovado?}
    E -- Não -->|Fazer Ajustes| C
    E -- Sim -->|Merge Squash| F[main atualizada]
    F -->|Deletar Branch| G[Fim do Ciclo]
```

### O Passo a Passo no Dia a Dia:

1. **Atualize o seu repositório local:**
   Antes de começar qualquer nova tarefa, garanta que você tem a versão mais recente do código da branch principal:
   ```bash
   git checkout main
   git pull origin main
   ```

2. **Crie uma ramificação (branch) nova:**
   Nunca trabalhe ou faça commits diretamente na branch `main`. Crie uma branch específica para a sua tarefa:
   ```bash
   git checkout -b <nome-da-branch>
   ```
   *(Veja o padrão de nomes de branches na Seção 3).*

3. **Desenvolva e faça commits:**
   Faça alterações focadas e realize commits organizados.
   *(Veja o padrão de mensagens de commits na Seção 4).*

4. **Envie a sua branch para o GitHub:**
   ```bash
   git push origin <nome-da-branch>
   ```

5. **Abra um Pull Request (PR):**
   - Acesse o GitHub. O site sugerirá a criação do PR para a branch recém-enviada.
   - Descreva de forma objetiva o que foi feito, anexe capturas de tela/vídeos se houver mudanças visuais, e atribua colegas de equipe para revisão (**Reviewers**).

6. **Revisão de Código (Code Review):**
   - Pelo menos um outro membro da equipe deve analisar o código do PR.
   - Se houver sugestões de melhoria, o autor faz as alterações na mesma branch localmente, realiza o commit e faz o push (`git push`). O PR será atualizado automaticamente.

7. **Mesclar (Merge) e Limpar:**
   - Uma vez aprovado, faça o merge utilizando a opção **Squash and merge** no GitHub (isso junta todos os commits menores do PR em um único commit limpo na `main`).
   - Delete a branch remota no próprio GitHub e apague-a localmente no seu computador:
     ```bash
     git checkout main
     git pull origin main
     git branch -d <nome-da-branch>
     ```

---

## 🏷️ 3. Nomenclaturas de Branches

As ramificações devem seguir o padrão: `tipo/descricao-curta-hifenizada`.

### Tipos permitidos:
| Tipo | Descrição | Exemplo |
| :--- | :--- | :--- |
| **`feat/`** | Nova funcionalidade ou recurso para o jogo | `feat/sistema-de-conquistas` |
| **`fix/`** | Correção de bugs ou comportamentos inesperados | `fix/delay-audio-chrome` |
| **`refactor/`**| Melhoria no código existente sem alterar o comportamento | `refactor/otimizacao-sprites` |
| **`style/`** | Mudanças puramente visuais, CSS, formatação (sem lógica) | `style/responsividade-mobile` |
| **`docs/`** | Alteração ou adição de documentações | `docs/guia-de-colaboracao` |
| **`chore/`** | Tarefas administrativas, configuração, versionamento | `chore/adicionar-gitignore` |

---

## 💬 4. Nomenclaturas de Commits (Conventional Commits)

Escrever mensagens de commit padronizadas torna o histórico fácil de ler e ajuda a entender exatamente quando e por que uma alteração foi introduzida.

**Formato básico:**
```text
tipo(escopo-opcional): descrição curta em minúsculas
```

### Tipos de commits:
*   `feat`: Adição de um novo elemento ou funcionalidade.
    *   *Exemplo:* `feat(canvas): adicionar partículas neon na fusão de chips`
*   `fix`: Correção de um bug.
    *   *Exemplo:* `fix(storage): resolver bug de perda de moedas ao recarregar a página`
*   `docs`: Documentação externa ou comentários internos.
    *   *Exemplo:* `docs: documentar estrutura do localStorage no readme`
*   `style`: Formatação de código, CSS, espaçamento (nada que mude lógica).
    *   *Exemplo:* `style(hud): ajustar alinhamento do texto de prestígio`
*   `refactor`: Modificação do código que não corrige bug nem adiciona funcionalidade (limpeza/otimização).
    *   *Exemplo:* `refactor(grid): unificar detecção de colisão do mouse e touch`
*   `chore`: Atualizações de dependências, arquivos de configuração Git, etc.
    *   *Exemplo:* `chore: criar arquivo .gitignore inicial`

---

## 🔒 5. Proteção da Branch Principal (`main`)

Para garantir que ninguém apague arquivos ou quebre o jogo por acidente na branch `main`, é recomendado configurar regras de proteção diretamente no repositório do GitHub (configuração administrativa):

1. Vá até as **Settings** (Configurações) do repositório no GitHub.
2. No menu lateral esquerdo, clique em **Branches**.
3. Em **Branch protection rules**, clique em **Add rule**.
4. Em **Branch name pattern**, digite `main`.
5. Ative as seguintes opções:
   - **Require a pull request before merging**: Exige que as alterações passem por PR antes de irem para a `main`.
   - **Require approvals**: Define quantos aprovadores são necessários (geralmente `1` para times pequenos).
   - **Require conversation resolution before merging**: Garante que todos os comentários/discussões no PR tenham sido resolvidos antes de mesclar.
6. Clique em **Create** (ou **Save changes**).

---

## 🛠️ 6. Práticas Recomendadas de Código

Para garantir que o código escrito por diferentes pessoas continue funcionando de forma harmônica:
*   **Modularização**: Mantenha as responsabilidades separadas. Se for mexer em áudio, mexa em `scripts/audio/`. Se for mexer na renderização, use `scripts/render/`. Estilos ficam em `css/` e `styles/`.
*   **Comentários Úteis**: Explique o *porquê* de soluções complexas (como fórmulas matemáticas de escalabilidade financeira do jogo), não apenas o *como*.
*   **Nomes Semânticos**: Use variáveis e funções em inglês (seguindo o padrão atual do código, ex: `GameEngine`, `updateProgress`, `coins`) ou português de forma consistente. Como o código atual está em inglês, continue utilizando **inglês para variáveis, classes e funções** e **português para a interface visível ao usuário**.

---

Seguindo esses passos, nossa equipe trabalhará de forma coordenada, sem conflitos de código e com a segurança de um histórico de alterações impecável! Bom desenvolvimento! 🎮🖥️
