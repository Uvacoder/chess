import { Flag } from "tabler-icons-react";
import { useGame } from "../hooks/GameContext";
import { COLORS, FormattedTime } from "../utils/Constants";
import useCountDown from "react-countdown-hook";
import { useEffect, useState } from "react";
import { TGameOverInfo } from "../@types";
const initialTime = 6000 * 100; // initial time in milliseconds, defaults to 60000
const interval = 500; // interval to change remaining time amount, defaults to 1000

const capturedPieces = ["p", "p", "p", "b", "b", "k", "k", "r", "r", "q"];
export default function PlayerBanner({
  name,
  color,
}: {
  name: string;
  color: COLORS;
}) {
  const { turn, setGameOver, PlaySound } = useGame();
  const [timeLeft, { start, pause, resume, reset }] = useCountDown(
    initialTime,
    interval
  );

  const [st, setSt] = useState(true);

  useEffect(() => {
    if (!st && timeLeft === 0) {
      PlaySound("WIN");
      const oppositeColor =
        color === COLORS.WHITE ? COLORS.BLACK : COLORS.WHITE;
      setGameOver((pgo: TGameOverInfo) => ({
        status: true,
        reason: {
          ...pgo.reason,
          won: {
            status: true,
            reason: oppositeColor,
          },
        },
      }));
    }
    setSt(false);
  }, [timeLeft]);

  useEffect(() => {
    setSt(false);
    if (turn === color) {
      if (timeLeft === 0) start();
      else {
        start(timeLeft - interval);
        resume();
      }
    } else {
      pause();
    }
  }, [turn]);
  useEffect(() => {
    reset();
    setSt(true);
  }, []);
  return (
    <div
      className={`my-5 w-full max-w-[650px] block p-6 bg-neutral-800 rounded-lg flex items-center justify-between`}
    >
      <div className="flex w-full items-center gap-5">
        <div className="w-[50px] h-[50px] object-cover rounded-full">
          <img
            src="https://source.unsplash.com/100x100"
            className="rounded-full w-full h-full object-cover"
            alt={name}
          />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">{name}</h1>
            <div>
              <button className="text-white bg-neutral-700 hover:bg-neutral-500 rounded-full p-1 ">
                <Flag size={20} />
              </button>
            </div>
          </div>
          {/* <div className="flex flex-wrap max-w-[200px] items-end gap-2 justify-start">
            {capturedPieces.map((p, i) => (
              <CapturedPiece
                key={`captured-piece-${i}-${color}`}
                type={p}
                color={color}
              />
            ))}
          </div> */}
        </div>
      </div>
      <div className="text-sans-serif bg-neutral-700 min-w-max px-4 py-2 pt-3 rounded font-bold lg:text-[1.5rem] lg:text-[2rem]">
        {FormattedTime(timeLeft === 0 ? initialTime : timeLeft)}
      </div>
    </div>
  );
}

function CapturedPiece({ type, color }: { type: string; color: COLORS }) {
  return (
    <img
      className="h-[25px]  rounded-full"
      src={`/assets/sprites/${color}/${type}.svg`}
      alt=""
    />
  );
}
