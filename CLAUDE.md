# CLAUDE.md

Connect 4 online para dois jogadores. Monorepo com `backend/` (Express + Socket.IO, TypeScript via ts-node) e `frontend/` (Next.js 16 + React 19 + Tailwind 4). Documentação: [README.md](README.md) e [docs/](docs/) ([arquitetura](docs/arquitetura.md), [protocolo](docs/protocolo.md), [frontend](docs/frontend.md)). Atualize esses arquivos quando mudar o comportamento que eles descrevem.

## Comandos

- `npm install` na raiz instala tudo (o `postinstall` instala backend e frontend).
- `npm run dev` na raiz sobe o backend (:8080) e o frontend (:3000).
- Backend: `npm test` (node:test via ts-node), `npm run typecheck`, `npm start` (produção).
- Frontend: `npm run typecheck`, `npm run build`.
- Antes de dar uma mudança por concluída: `npm test` e `npm run typecheck` no backend, `npm run typecheck` e `npm run build` no frontend. O frontend não tem testes automatizados; para mudanças de UI ou de protocolo, rode o jogo com dois navegadores (ou puppeteer) e jogue de verdade.

## Invariantes do jogo (não quebrar)

- **O servidor é a autoridade.** Ele valida e aplica jogadas, decide vitória e empate e controla o relógio de 30s (`startTurnClock` em `backend/server.ts`). O cliente só envia intenções e redesenha a partir de `updateBoard`. Nunca mova regra de jogo para o frontend.
- **Identidade = `socket.id`.** Nenhum evento carrega ID de usuário, e não reintroduza `userID` nos argumentos.
- **Toda entrada do socket é hostil.** Valide o tipo e o intervalo, e ignore o que for inválido sem lançar erro: um throw num handler derruba o processo inteiro.
- **A grade é `grid[coluna][linha]`, com a linha 0 no topo.** As peças caem para o maior índice de linha.
- **O protocolo está duplicado** em `backend/types/server-types.ts` e `frontend/src/types/socket.ts`. Mude os dois juntos. Não há versionamento, então backend e frontend vão para produção juntos.
- **A regex do ID da sala** (`/^[A-Za-z0-9_-]{7}$/`, de `nanoid(7)`) está em `backend/server.ts` e em `frontend/src/app/[roomID]/page.tsx`. Mantenha as duas iguais.
- Depois de uma vitória, a vez fica com quem perdeu. Um restart aceito não muda a vez. A saída de um jogador zera a grade e volta a vez para `player1`.
- O placar de vitórias existe **só no cliente** (`GameProvider`), e o servidor não o guarda.
- As salas ficam em memória (`Map`): a sala é apagada quando esvazia, e não há persistência nem reconexão.

## Armadilhas conhecidas

- **Next 16 não é o Next do treinamento**: leia `frontend/node_modules/next/dist/docs/` antes de mexer em rotas ou config. `params` é assíncrono, e os tipos vêm dos helpers globais `PageProps<"/rota">` / `LayoutProps<"/">`.
- **`frontend/AGENTS.md` é gerado pelo `next dev`**, que o recria se for removido. Deixe-o como está.
- **`turbopack.root`** em `next.config.ts` é necessário porque a raiz do repo tem outro `package-lock.json`.
- **`getSocket()` só em efeitos ou handlers**, nunca durante o render: componentes client também renderizam no servidor.
- **O GameProvider registra os listeners uma vez**, com cleanup. O `enterRoom` tem trava contra o duplo efeito do Strict Mode.
- **O `TurnIndicator` é remontado com `key={boardVersion}`**, e é isso que reinicia a contagem. A contagem do cliente é só visual.
- **O MENU usa `window.location.replace("/")` de propósito**: derruba o socket para o servidor liberar o assento. Não troque por `router.push`.
- **O `text-left` nos botões de coluna do `Board`** é necessário: sem ele, o `::before` da peça sai do lugar.
- **Tailwind 4 sem `tailwind.config`**: o tema e as animações ficam em `frontend/src/app/globals.css`. O layout é **desktop-first**, então use `max-tablet:` / `max-phone:` e não `md:` / `lg:`. O preflight foi compensado (`box-content` em elementos com tamanho e borda, `line-height: normal` no html, tamanhos `text-[Xrem]` arbitrários). Siga o mesmo padrão para não mudar o visual.
- **Backend em CommonJS + TypeScript 4.9**: o `nanoid` precisa ficar na **v3** (a v4+ é só ESM e quebra o `require`). `ts-node` e `typescript` estão em `dependencies` (e não em `devDependencies`) porque o `npm start` de produção usa os dois.
- **Os testes de integração exigem um build de produção** (`npm start` no backend, `npm run build && npm start` no frontend), com as portas 3000 e 8080 livres. Um `npm run dev` esquecido continua respondendo nessas portas: no Windows, o nodemon e o next dev renascem se você matar só o processo filho. Mate a árvore inteira com `taskkill /PID <pid> /T /F`.
- No Windows, os avisos "LF will be replaced by CRLF" vêm do `.gitattributes` (`* text=auto`) e são inofensivos.

## Git

- Commite só quando o usuário pedir, e não faça push sem pedido explícito.
- As mensagens de commit são em inglês, no imperativo, com um resumo curto e uma lista de mudanças no corpo.
