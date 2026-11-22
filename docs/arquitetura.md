# Arquitetura

## Visão geral

```
navegador (Next.js)                       backend (Express + Socket.IO)
┌──────────────────────┐   websocket   ┌──────────────────────────────┐
│ GameProvider         │ ────────────▶ │ server.ts                    │
│  estado espelhado    │  intenções    │  rooms: Map<roomID, Room>    │
│  (grade, vez, placar)│ ◀──────────── │  valida, aplica, decide      │
│                      │  estado novo  │  relógio de 30s por vez      │
└──────────────────────┘               └──────────────────────────────┘
                                         gameFunctions.ts (regras puras)
```

O servidor é a **única fonte da verdade**. O cliente nunca decide vitória, vez ou tempo: ele envia o que o jogador quer fazer (`playerMove`, `restartGame`...) e redesenha a partir do que o servidor devolve (`updateBoard`). Isso fecha as trapaças mais óbvias e evita que os dois clientes discordem sobre o estado.

## O tabuleiro

- 7 colunas × 6 linhas (`COLUMNS`, `ROWS` em [backend/gameFunctions.ts](../backend/gameFunctions.ts)).
- A grade é indexada **`grid[coluna][linha]`**, e a **linha 0 é o topo**. Uma peça cai até a maior linha livre da coluna (`landingRow`).
- Cada célula é `{ column, row, occupied, player }`, onde `player` é `"empty"`, `"player1"` ou `"player2"`.
- **Vitória:** `isWinningMove` olha só a peça que acabou de cair e, para cada uma das 4 direções, conta as peças iguais nos dois sentidos. Com 4 ou mais, é vitória.
- **Empate:** o tabuleiro cheio sem vitória (`isBoardFull`).

O frontend tem uma cópia dos tipos e de `createEmptyGrid` em [frontend/src/types/game.ts](../frontend/src/types/game.ts), mas nunca aplica regras. A única exceção é visual: o `Board` procura as linhas de 4 do vencedor para destacá-las.

## Salas e assentos

Estado de uma sala ([backend/types/game-types.ts](../backend/types/game-types.ts)):

```ts
interface Room {
  players: [string, string];        // socket.id de cada assento; "" = vago
  grid: Grid;
  turn: PlayerId;
  finished: boolean;
  restartRequestedBy: string | null; // socket.id de quem pediu restart
  turnTimer: NodeJS.Timeout | null;
}
```

- **Criação:** `create` só gera um ID (`nanoid(7)`). A sala passa a existir quando alguém faz `enter` nela.
- **ID da sala:** 7 caracteres `[A-Za-z0-9_-]`. A mesma regex está no servidor e em [frontend/src/app/[roomID]/page.tsx](../frontend/src/app/[roomID]/page.tsx), que responde 404 para qualquer outra URL.
- **Identidade:** o jogador é o seu `socket.id`. Nenhum evento carrega ID de usuário, então não dá para se passar por outro jogador. Recarregar a página gera um socket novo, ou seja, um jogador novo.
- **Assentos:** quem entra pega o primeiro assento vago: `player1`, depois `player2`. Se a sala estiver cheia, a pessoa entra como **espectador**: recebe `updateBoard`, mas o servidor ignora tudo o que ela envia.
- **Uma sala por socket:** entrar em outra sala sai da atual.
- **Memória:** as salas vivem em um `Map` no processo. Quando os dois assentos ficam vagos, a sala é apagada. Reiniciar o servidor apaga todas.

## Ciclo de uma partida

1. A cria a sala, entra como `player1` e vê o modal de convite com o link.
2. B abre o link e entra como `player2`. Cada cliente emite `isConnected` depois do `enter`, e o servidor responde à sala toda com `true`, o que fecha o convite.
3. Com os dois assentos ocupados, o servidor liga o relógio de quem está na vez (sempre `player1` numa sala nova).
4. Cada `playerMove` válido coloca a peça, passa a vez, religa o relógio e faz broadcast de `updateBoard`.
5. No caso de vitória ou empate, `finished = true`, o relógio para e o `updateBoard` leva o resultado (`"player1"`, `"player2"` ou `"draw"`). A vez já fica com **quem perdeu**, que começa a próxima partida.
6. **Restart:** um jogador pede (`restartGame`), e só o adversário recebe `restartRequest`. Se ele aceitar (`restartAns(true)`), a grade zera, o relógio volta e todos recebem `updateBoard(..., "restart")`. A vez não muda no restart.

### Regras de validação de `playerMove`

O servidor ignora a jogada, sem responder nada, se:

- quem enviou não tem assento;
- a sala não está cheia ou a partida acabou;
- não é a vez de quem enviou;
- a coluna não for um inteiro entre 0 e 6;
- a coluna está cheia (a vez **continua** com o jogador).

## Relógio de turno

- Fica no servidor: `startTurnClock` / `stopTurnClock` em [backend/server.ts](../backend/server.ts), com `TURN_MS = 30_000`.
- Só corre com a sala cheia e a partida em andamento. É religado a cada jogada, restart e entrada na sala.
- Se o tempo acaba, a vez passa para o outro jogador, o servidor faz broadcast de `updateBoard` (sem resultado) e o relógio recomeça. Isso vale também antes da primeira jogada.
- O cliente só **mostra** uma contagem regressiva. O `TurnIndicator` é remontado a cada `updateBoard` (via `key={boardVersion}`), então a contagem reinicia sempre que o servidor manda estado novo. Fechar a aba de quem está na vez não trava o jogo.

## Saída de jogador

Ao desconectar (fechar a aba, recarregar ou clicar em MENU, que faz uma navegação completa justamente para derrubar o socket):

1. O assento fica vago e o relógio para.
2. Se a sala ficou vazia, ela é apagada.
3. Se não ficou, a grade zera, a vez volta para `player1` e o servidor envia `updateBoard(..., "restart")` e `playerLeft(<assento>)`.
4. O cliente que ficou mostra "has left the game" no card e reabre o modal de convite.
5. Quando alguém novo entra no assento, o `isConnected(true)` faz o cliente zerar o placar dos dois: é uma partida nova contra outra pessoa.

## Placar

O número de vitórias é **contado só no cliente** (`GameProvider`), somando +1 a cada `updateBoard` com vencedor. O servidor não guarda placar. Por isso, recarregar a página zera o placar daquela aba, e um espectador que entra no meio começa do zero.

## Limitações conhecidas

- Não há persistência nem escala horizontal: as salas ficam na memória de um único processo.
- Não há reconexão: uma queda de rede conta como saída, e o jogador volta como um jogador novo.
- O espectador não tem uma interface própria. Ele vê o tabuleiro, mas os cards e o rodapé não indicam que está só assistindo.
- O protocolo não é versionado: backend e frontend precisam ser publicados juntos.
