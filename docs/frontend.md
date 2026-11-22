# Frontend

Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS 4 e `socket.io-client`.

> O Next 16 mudou várias APIs em relação a versões anteriores. Antes de mexer em rotas, layouts ou configuração, leia o guia correspondente em `frontend/node_modules/next/dist/docs/` (veja [frontend/AGENTS.md](../frontend/AGENTS.md)).

## Rotas

| Rota | Arquivo | O que mostra |
| --- | --- | --- |
| `/` | [src/app/page.tsx](../frontend/src/app/page.tsx) → `HomeScreen` | Logo, **PLAY VS PLAYER** e **GAME RULES** |
| `/[roomID]` | [src/app/[roomID]/page.tsx](../frontend/src/app/[roomID]/page.tsx) → `GameScreen` | A partida. IDs fora do formato `nanoid(7)` dão 404. |

- `params` é assíncrono (`await params`). Os tipos vêm dos helpers globais `PageProps<"/[roomID]">` e `LayoutProps<"/">`, gerados pelo Next.
- O [layout](../frontend/src/app/layout.tsx) carrega a fonte Space Grotesk com `next/font/local` (variável CSS `--font-space-grotesk`) e envolve tudo no `GameProvider`.
- O ícone da aba é [src/app/icon.svg](../frontend/src/app/icon.svg).

## Estado: `GameProvider`

[src/providers/GameProvider.tsx](../frontend/src/providers/GameProvider.tsx) é o único lugar que conversa com o socket. Os componentes usam o hook `useGame()`.

- **Estado:** `players`, `grid`, `turn`, `boardVersion`, `isConnected`, `result`, `restartRequested`.
- **Ações:** `createRoom()` (Promise com o ID e timeout de 10s), `enterRoom(id)`, `playMove(col)`, `requestRestart()`, `answerRestart(bool)`, `dismissResult()`.
- Os listeners do socket são registrados **uma vez**, num `useEffect` com cleanup. `enterRoom` tem uma trava (`enteredRoom` ref) porque o Strict Mode roda os efeitos duas vezes em dev.
- `boardVersion` incrementa a cada `updateBoard`. O `GameScreen` usa isso como `key` do `TurnIndicator`, para a contagem reiniciar.
- `players[p].wins === undefined` quer dizer que o jogador saiu. O card mostra o aviso no lugar do placar.
- O placar existe só aqui (o servidor não guarda), e a coluna clicada é só enviada: quem valida tudo é o servidor.

## Socket

[src/lib/socket.ts](../frontend/src/lib/socket.ts) expõe `getSocket()`, um socket por aba criado sob demanda. **Chame só dentro de efeitos ou handlers**: componentes client também renderizam no servidor, onde nenhuma conexão deve ser aberta.

## Componentes

```
components/
├── home/   HomeScreen, GameRules
├── game/   GameScreen (layout da partida), Board, PlayerCard, Header (MENU/RESTART),
│           TurnIndicator, InviteModal, RestartModal, ResultModal
└── ui/     Modal (base de todos os modais), icons (SVGs inline)
```

- **`Board`**: cada coluna é um `<button>` com `aria-label="Drop a disc in column N"`, para acessibilidade e também para os testes automatizados. O `text-left` no botão é proposital: sem ele, o `::before` que desenha a borda do buraco sai do lugar.
- **`Header`**: o MENU faz `window.location.replace("/")`, uma navegação completa de propósito. Isso derruba o socket, e o servidor avisa o adversário e libera o assento. Não troque por `router.push`.
- **`InviteModal`**: monta o link com `useSyncExternalStore` (a origin é `""` no servidor), o que evita erro de hidratação.
- **`Modal`**: `role="dialog"`, `aria-modal` e `aria-labelledby`. Mostra o botão de fechar quando recebe `onClose`, e aceita `delay` (em segundos) para esperar uma animação antes de aparecer.
- **Animações**: a peça cai com quiques (`animate-drop`, a duração depende da linha), a linha vencedora pulsa (`animate-win-pulse`) e os modais entram com fade e pop. Todas respeitam `motion-reduce`.

## Tailwind 4

Não há `tailwind.config`. Tudo fica em [src/app/globals.css](../frontend/src/app/globals.css):

- `@theme`: cores (`main-purple`, `darker-purple`, `player1`, `player2`), breakpoints e animações.
- `@theme inline`: `--font-sans` aponta para a Space Grotesk.
- O PostCSS usa `@tailwindcss/postcss` ([postcss.config.mjs](../frontend/postcss.config.mjs)).

### Convenções que não são óbvias

- **Desktop-first.** O layout foi feito para desktop e se adapta para baixo. Use `max-tablet:` (< 998px) e `max-phone:` (< 541px), não os breakpoints mobile-first padrão (`md:`, `lg:`).
- **O preflight foi compensado.** O design original não usava o reset do Tailwind, então:
  - elementos com tamanho fixo e borda usam `box-content`;
  - o `html` tem `line-height: normal`;
  - os tamanhos de texto são arbitrários (`text-[2rem]`), para não herdar o line-height das classes `text-xl` etc.
- **Variáveis CSS para medidas que mudam por breakpoint**: `--ball-size` e `--gap` no `Board`, `--drop-rows`, `--drop-duration` e `--pulse-delay` nas animações, `--modal-delay` no `Modal`.
- **O layout da partida** usa CSS grid com `col-start` / `row-start` em cada filho. O mapa está no comentário do [GameScreen](../frontend/src/components/game/GameScreen.tsx).

## Configuração

- [next.config.ts](../frontend/next.config.ts) fixa `turbopack.root` na pasta do frontend. A raiz do repo tem seu próprio `package-lock.json` (do `npm run dev` conjunto), e sem essa linha o Next escolhe a raiz errada.
- `NEXT_PUBLIC_SERVER_URL` entra no bundle no build. Mudar a variável depois exige rebuild.
