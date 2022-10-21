import { useEffect } from "react";
import BoardComponent from "../components/Board.Component";
import Game from "../models/Game";
import ModalComponent from "../components/Modal";
import { COLORS, START_POSITION } from "../utils/Constants";
import GameOver from "../components/GameOver";
import PlayerBanner from "../components/PlayerBanner.Component";
import { useGame } from "../hooks/GameContext";

export default function GamePage() {
  const { fen, setFen, board, setBoard, gameOver, setFenError } = useGame();

  useEffect(() => {
    setFen(START_POSITION);
    const game = new Game();
    game.NewGame(fen);
    setFenError(false);
    const b = game.board;
    setBoard(b);
  }, []);

  return (
    <div className="grid relative h-screen bg-white place-items-center">
      <div className="flex items-center">
        {board && (
          <div className="grid place-items-center">
            <div className="w-full px-3 lg:px-0">
              <PlayerBanner color={COLORS.BLACK} name="Suparth" />
            </div>
            <BoardComponent />
            <div className="w-full px-3 lg:px-0">
              <PlayerBanner color={COLORS.WHITE} name="Suparth" />
            </div>
          </div>
        )}
      </div>
      <ModalComponent setOpen={() => {}} openStatus={gameOver.status}>
        <GameOver />
      </ModalComponent>
    </div>
  );
}
