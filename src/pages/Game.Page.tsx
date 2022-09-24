import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import BoardComponent from "../components/Board.Component";
import FenComponent from "../components/Fen.Component";
import Board from "../models/Board";
import Game from "../models/Game";

export default function GamePage() {
  const [board, setBoard] = useState<Board>();

  useEffect(() => {
    const game = new Game();
    game.NewGame();
    const b = game.board;
    setBoard(b);
  }, []);

  function ChangeFenString(fen: string) {
    try {
      const game = new Game();
      game.NewGame(fen);
      const b = game.board;
      setBoard(b);
    } catch (error) {
      console.error(error);
      toast.error("Invalid Fen String");
    }
  }

  return (
    <div className="grid h-screen place-items-center">
      <div className="flex">
        {board && <BoardComponent board={board as Board} />}
        <FenComponent updateFen={ChangeFenString} />
      </div>
    </div>
  );
}
