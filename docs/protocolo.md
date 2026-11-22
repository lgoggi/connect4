# Protocolo Socket.IO

Os tipos estão em **dois arquivos que precisam ficar iguais**:

- [backend/types/server-types.ts](../backend/types/server-types.ts)
- [frontend/src/types/socket.ts](../frontend/src/types/socket.ts)

Quem muda um evento muda os dois e publica backend e frontend juntos.

## Cliente → servidor

| Evento | Argumentos | Quando o servidor aceita | Efeito |
| --- | --- | --- | --- |
| `create` | (nenhum) | sempre | Responde `createRoom` com um ID novo. Não cria a sala ainda. |
| `enter` | `roomID: string` | ID válido (7 caracteres `[A-Za-z0-9_-]`) e diferente da sala atual | Sai da sala atual, entra nesta, ocupa um assento ou vira espectador. Responde `enter`. Liga o relógio se a sala encheu. |
| `isConnected` | (nenhum) | o socket está numa sala | Envia `isConnected(salaCheia)` para **todos** da sala. |
| `playerMove` | `column: number` (0–6) | assento, sala cheia, partida em andamento, vez do jogador, coluna válida e não cheia | Coloca a peça e faz broadcast de `updateBoard`. |
| `restartGame` | (nenhum) | assento e sala cheia | Marca o pedido e envia `restartRequest` **só para o adversário**. |
| `restartAns` | `accepted: boolean` | existe um pedido pendente e quem responde **não** é quem pediu | Limpa o pedido. Se `accepted === true`, zera a grade, religa o relógio e faz broadcast de `updateBoard(..., "restart")`. |

Qualquer evento fora dessas condições é **ignorado sem resposta**. O servidor nunca lança erro por causa de uma entrada inválida.

## Servidor → cliente

| Evento | Argumentos | Para quem | Significado |
| --- | --- | --- | --- |
| `createRoom` | `{ room: string }` | quem pediu | ID da nova sala. O cliente navega para `/<room>`. |
| `enter` | `userID: string, username: "player1" \| "player2" \| ""` | quem entrou | Assento recebido; `""` = espectador. `userID` é o `socket.id` (informativo). |
| `isConnected` | `connected: boolean` | sala | `true` quando os dois assentos estão ocupados. |
| `updateBoard` | `grid, turn, result?` | sala (ou só o espectador que acabou de entrar) | Estado completo do tabuleiro. Veja `result` abaixo. |
| `restartRequest` | (nenhum) | adversário de quem pediu | Mostrar o modal "Restart request". |
| `playerLeft` | `player: "player1" \| "player2"` | sala | Esse assento ficou vago. Vem logo depois de um `updateBoard(..., "restart")`. |

### O campo `result` de `updateBoard`

| Valor | Significado |
| --- | --- |
| `undefined` | Partida em andamento: uma jogada normal ou a vez passou porque o tempo acabou. |
| `"player1"` / `"player2"` | Esse jogador venceu. `turn` já aponta para quem perdeu. |
| `"draw"` | Empate (tabuleiro cheio). |
| `"restart"` | A grade foi zerada (restart aceito ou saída de um jogador). |

`updateBoard` sempre leva o estado inteiro (`grid` completa e `turn`), nunca um diff. O cliente pode simplesmente substituir o que tem.

## Exemplo de sequência

```
A: create                    → A: createRoom {room:"abc1234"}
A: enter "abc1234"           → A: enter (id, "player1")
A: isConnected               → sala: isConnected false
B: enter "abc1234"           → B: enter (id, "player2")      [relógio de player1 liga]
B: isConnected               → sala: isConnected true
A: playerMove 3              → sala: updateBoard (grid, "player2", undefined)
...                          (30s sem jogar)  → sala: updateBoard (grid, "player1", undefined)
A: playerMove 3  (vence)     → sala: updateBoard (grid, "player2", "player1")
A: restartGame               → B: restartRequest
B: restartAns true           → sala: updateBoard (grid vazia, "player2", "restart")
A desconecta                 → sala: updateBoard (grid vazia, "player1", "restart")
                               sala: playerLeft "player1"
```
