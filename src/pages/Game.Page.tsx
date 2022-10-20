import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import BoardComponent from "../components/Board.Component";
import SidebarComponent from "../components/Sidebar.Component";
import Board from "../models/Board";
import Game from "../models/Game";
import ModalComponent from "../components/Modal";
import { TGameOverInfo } from "../@types";
import GameContext, { useGame } from "../hooks/GameContext";
import { COLORS, START_POSITION } from "../utils/Constants";
import GameOver from "../components/GameOver";
import { Anchor, ChevronLeft } from "tabler-icons-react";
import DrawerComponent from "../components/Drawer.Component";
import PlayerBanner from "../components/PlayerBanner.Component";
import { useCountdown } from "../hooks/CountdownContext";

export default function GamePage() {
  const { fen, setFen, board, setBoard, gameOver, setFenError } = useGame();
  const { time, startCountdown, GetFormattedTime } = useCountdown();
  useEffect(() => {
    startCountdown(60);
    setFen(START_POSITION);
    const game = new Game();
    game.NewGame(fen);
    setFenError(false);
    const b = game.board;
    setBoard(b);
  }, []);

  return (
    <div className="grid relative h-screen place-items-center">
      <div className="flex items-center">
        {board && (
          <div className="grid place-items-center">
            <PlayerBanner
              color={COLORS.WHITE}
              remainingTime={GetFormattedTime()}
              name="Suparth"
            />
            <BoardComponent />
            <PlayerBanner
              color={COLORS.WHITE}
              name="Suparth"
              remainingTime={GetFormattedTime()}
            />
          </div>
        )}
      </div>
      <ModalComponent setOpen={() => {}} openStatus={gameOver.status}>
        <GameOver />
      </ModalComponent>
    </div>
  );
}
