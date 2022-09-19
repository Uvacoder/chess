import { useEffect, useState } from "react";
import Board from "../models/Board";
import BoardComponent from "../components/board";
import { COLORS } from "../utils/Constants";
import PlayerBanner from "../components/PlayerBanner";
import Game from "../models/Game";
function FenComponent() {
  const [board, setBoard] = useState<Board>();
  const [game, setGame] = useState<Game | null>(null);
  useEffect(() => {
    try {
      const game = new Game([
        {
          name: "Player 1",
          color: COLORS.BLACK,
        },
        {
          name: "Player 2",
          color: COLORS.WHITE,
        },
      ]);
      setGame(game);
      const boardObj = game.GetBoard();
      setBoard(boardObj);
    } catch (error: any) {}
  }, []);

  return (
    <div className="grid h-screen place-items-center">
      <div className="flex items-stretch gap-5">
        <div className="">
          <PlayerBanner name="Player 1" />
          <BoardComponent key={"board"} board={board as Board} />
          <PlayerBanner name="Player 2" />
        </div>
      </div>
    </div>
  );
}

export default FenComponent;
