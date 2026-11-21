import { PlayerIcon } from "@/components/ui/icons";
import type { PlayerId, PlayerInfo } from "@/types/game";

// player1's card mirrors player2's: it sits on the left on desktop and keeps
// its icon on the outer (left) edge on smaller screens.
const sides: Record<PlayerId, { wrapper: string; box: string; icon: string; name: string; wins: string }> = {
  player1: {
    wrapper: "col-start-1 justify-end",
    box: "max-tablet:flex-row max-phone:grid-cols-[0_100%]",
    icon: "max-tablet:my-0 max-tablet:mr-0 max-tablet:-ml-[55px] max-phone:col-start-1",
    name: "max-phone:col-start-2",
    wins: "max-phone:col-start-2",
  },
  player2: {
    wrapper: "col-start-3 justify-start max-tablet:ml-auto",
    box: "max-tablet:flex-row-reverse max-phone:grid-cols-[100%_0]",
    icon: "max-tablet:my-0 max-tablet:ml-0 max-tablet:-mr-[55px] max-phone:col-start-2",
    name: "max-phone:col-start-1",
    wins: "max-phone:col-start-1",
  },
};

export function PlayerCard({ player }: { player: PlayerInfo }) {
  const side = sides[player.name];
  const hasLeft = player.wins === undefined;

  return (
    <section
      aria-label={player.name}
      className={`row-start-2 flex h-full w-4/5 items-center max-tablet:col-start-2 max-tablet:h-32 max-tablet:w-1/2 max-tablet:items-start max-tablet:justify-center max-phone:h-3/4 ${side.wrapper}`}
    >
      <div
        className={`box-content flex h-48 w-40 flex-col items-center justify-center rounded-3xl border-[3px] border-black bg-white shadow-[0_16px_rgba(0,0,0,0.7)] max-tablet:h-24 max-tablet:w-4/5 max-tablet:max-w-[100vw] max-tablet:justify-around max-tablet:shadow-[0_12px_rgba(0,0,0,0.7)] max-phone:grid max-phone:h-full max-phone:w-[85%] max-phone:place-content-center max-phone:place-items-center ${side.box}`}
      >
        {!hasLeft && (
          <PlayerIcon
            player={player.name}
            className={`-mt-[15px] mb-[15px] scale-125 max-phone:row-[1/span_2] max-phone:m-0 max-phone:scale-80 ${side.icon}`}
          />
        )}
        <div
          className={`text-center text-[1.5rem] font-black max-tablet:text-[1.2rem] max-phone:row-start-1 max-phone:p-2.5 max-phone:text-[1rem] ${side.name}`}
        >
          {player.display}
        </div>
        <div className={`text-[5rem] font-bold max-tablet:text-[4rem] max-phone:row-start-2 max-phone:text-[2rem] ${side.wins}`}>
          {player.wins}
        </div>
      </div>
    </section>
  );
}
