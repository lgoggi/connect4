import type { SVGProps } from "react";
import type { PlayerId } from "@/types/game";

type IconProps = SVGProps<SVGSVGElement>;

const PLAYER_COLORS: Record<PlayerId, string> = {
  player1: "#FD6687",
  player2: "#FFCE67",
};

export function Logo(props: IconProps) {
  const holes = [
    [13, 13],
    [45, 13],
    [13, 45],
    [45, 45],
  ];
  const discs: [number, number, string][] = [
    [13, 13, PLAYER_COLORS.player1],
    [45, 45, PLAYER_COLORS.player1],
    [45, 13, PLAYER_COLORS.player2],
    [13, 45, PLAYER_COLORS.player2],
  ];
  return (
    <svg width={58} height={61} viewBox="0 0 58 61" role="img" aria-label="Connect 4" {...props}>
      <g fill="#000">
        {holes.map(([cx, cy]) => (
          <circle key={`a${cx}${cy}`} cx={cx} cy={cy} r={13} />
        ))}
        {holes.map(([cx, cy]) => (
          <circle key={`b${cx}${cy}`} cx={cx} cy={cy + 3} r={13} />
        ))}
      </g>
      {discs.map(([cx, cy, fill]) => (
        <circle key={`c${cx}${cy}`} cx={cx} cy={cy} r={10} fill={fill} />
      ))}
    </svg>
  );
}

export function PlayerIcon({ player, ...props }: IconProps & { player: PlayerId }) {
  return (
    <svg width={54} height={59} viewBox="0 0 54 59" aria-hidden="true" {...props}>
      <g fill="none" fillRule="evenodd" transform={player === "player2" ? "translate(54 0) scale(-1 1)" : undefined}>
        <circle fill="#000" cx={27} cy={27} r={27} />
        <circle fill="#000" cx={27} cy={32} r={27} />
        <circle fill={PLAYER_COLORS[player]} cx={27} cy={27} r={24} />
        <g transform="translate(19 17)" stroke="#000" strokeWidth={3}>
          <path
            d="M6,26.75 C12.627417,26.75 18,21.377417 18,14.75 C18,8.122583 12.627417,2.75 6,2.75"
            transform="translate(12 14.75) rotate(90) translate(-12 -14.75)"
          />
          <g transform="translate(9.75 0)">
            <line x1={0.5} y1={0} x2={0.5} y2={5.9844035} />
            <line x1={10.5} y1={0} x2={10.5} y2={5.9844035} />
          </g>
        </g>
      </g>
    </svg>
  );
}

/** Background of the turn timer. Only one is ever on screen, so fixed ids are safe. */
export function TurnBackground({ player, ...props }: IconProps & { player: PlayerId }) {
  return (
    <svg width={197} height={165} viewBox="0 0 197 165" aria-hidden="true" {...props}>
      <defs>
        <filter id="turn-bg-shadow" x="-4.2%" y="-4.2%" width="108.4%" height="116.2%" filterUnits="objectBoundingBox">
          <feMorphology radius={3} operator="dilate" in="SourceAlpha" result="spread" />
          <feOffset dy={10} in="spread" result="offset" />
          <feComposite in="offset" in2="SourceAlpha" operator="out" result="offset" />
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" in="offset" />
        </filter>
        <path
          id="turn-bg-shape"
          d="M12.239 34.847 87.279 3.25a20 20 0 0 1 15.454-.029l75.96 31.65A20 20 0 0 1 191 53.333V130c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20V53.28a20 20 0 0 1 12.239-18.433Z"
        />
      </defs>
      <g transform="translate(3 2)" fill="none" fillRule="evenodd">
        <use fill="#000" filter="url(#turn-bg-shadow)" href="#turn-bg-shape" />
        <path
          stroke="#000"
          strokeWidth={3}
          fill={PLAYER_COLORS[player]}
          d="M86.697 1.868a21.5 21.5 0 0 1 16.613-.03l75.96 31.65a21.478 21.478 0 0 1 9.62 7.92 21.478 21.478 0 0 1 3.61 11.925V130a21.433 21.433 0 0 1-6.297 15.203A21.433 21.433 0 0 1 171 151.5H20a21.433 21.433 0 0 1-15.203-6.297A21.433 21.433 0 0 1-1.5 130V53.28c0-4.326 1.296-8.44 3.589-11.893a21.478 21.478 0 0 1 9.568-7.923Z"
        />
      </g>
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg width={14} height={15} viewBox="0 0 14 15" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="m11.596.782 2.122 2.122L9.12 7.499l4.597 4.597-2.122 2.122L7 9.62l-4.595 4.597-2.122-2.122L4.878 7.5.282 2.904 2.404.782l4.595 4.596L11.596.782Z"
      />
    </svg>
  );
}
