# Connect 4

Lig 4 online para dois jogadores. Um jogador cria uma sala, manda o link para o outro, e os dois jogam em tempo real.

- **Frontend:** Next.js 16 (App Router) + React 19 + Tailwind CSS 4, em [frontend/](frontend/)
- **Backend:** Node + Express + Socket.IO 4, em TypeScript rodando com ts-node, em [backend/](backend/)

O servidor é a autoridade do jogo: ele guarda o tabuleiro, valida as jogadas, decide vitória e empate e controla o relógio de 30s por vez. O frontend só mostra o estado e envia as intenções do jogador.

## Rodando localmente

Requer Node 20 ou mais novo.

```sh
npm install   # na raiz: instala a raiz, o backend e o frontend (via postinstall)
npm run dev   # sobe backend (:8080) e frontend (:3000) juntos
```

Abra http://localhost:3000, clique em **PLAY VS PLAYER** e abra o link do convite em outra aba ou em outro navegador.

Para rodar só um dos lados: `npm run dev:backend` ou `npm run dev:frontend`.

## Variáveis de ambiente

Os dois lados funcionam sem `.env` em desenvolvimento. Para mudar alguma coisa, copie o `.env.example` de cada pasta para `.env` (no frontend pode ser `.env.local`).

| Onde | Variável | Padrão | Para que serve |
| --- | --- | --- | --- |
| backend | `PORT` | `8080` | Porta do servidor |
| backend | `CLIENT_URL` | `http://localhost:3000` | Origem liberada no CORS; tem que ser a URL do frontend |
| frontend | `NEXT_PUBLIC_SERVER_URL` | `http://localhost:8080` | URL do backend Socket.IO; entra no bundle em tempo de build |

## Scripts

| Pasta | Comando | O que faz |
| --- | --- | --- |
| raiz | `npm run dev` | Backend e frontend juntos (`concurrently`; se um cair, derruba o outro) |
| backend | `npm run dev` | Servidor com nodemon (reinicia ao salvar) |
| backend | `npm start` | Servidor em produção (`ts-node --transpile-only`) |
| backend | `npm test` | Testes unitários da lógica do jogo |
| backend | `npm run typecheck` | `tsc --noEmit` |
| frontend | `npm run dev` | `next dev` (Turbopack) |
| frontend | `npm run build` / `npm start` | Build e servidor de produção do Next |
| frontend | `npm run typecheck` | `tsc --noEmit` |

## Estrutura

```
connect4/
├── package.json            scripts da raiz (dev conjunto, postinstall)
├── backend/
│   ├── server.ts           Socket.IO: salas, assentos, jogadas, relógio, restart
│   ├── gameFunctions.ts    regras puras: grade, linha de queda, vitória, empate
│   ├── types/              tipos do jogo e do protocolo
│   └── tests/              testes com node:test
└── frontend/
    └── src/
        ├── app/            rotas: / (home) e /[roomID] (partida)
        ├── providers/      GameProvider: estado do jogo e eventos do socket
        ├── components/     home/, game/, ui/
        ├── lib/socket.ts   socket único, criado sob demanda
        └── types/          tipos do jogo e cópia do protocolo
```

## Documentação

- [docs/arquitetura.md](docs/arquitetura.md): como o jogo funciona de ponta a ponta (salas, assentos, turnos, relógio, saída de jogador)
- [docs/protocolo.md](docs/protocolo.md): referência dos eventos Socket.IO
- [docs/frontend.md](docs/frontend.md): estrutura do Next.js, estado e convenções de Tailwind

## Deploy

O backend e o frontend são publicados separadamente, mas o protocolo entre eles não tem versão: **publique os dois juntos** sempre que mudar algum evento.

- **Backend:** `npm install && npm start` com `PORT` e `CLIENT_URL` definidos. As salas ficam em memória, então reiniciar o processo encerra todas as partidas, e o servidor precisa rodar em uma instância só.
- **Frontend:** `npm run build && npm start`, com `NEXT_PUBLIC_SERVER_URL` definido **antes** do build.
