import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import BoardComponent from "../components/Board.Component";
import FenComponent from "../components/Fen.Component";
import Board from "../models/Board";
import Game from "../models/Game";

export default function GamePage() {
  const [board, setBoard] = useState<Board>();
  const [fenError, setFenError] = useState<boolean>(false);

  useEffect(() => {
    const game = new Game();
    game.NewGame();
    const b = game.board;
    setBoard(b);
  }, []);

  function ChangeFenString(fen: string) {
    try {
      setFenError(false);
      const game = new Game();
      game.NewGame(fen);
      const b = game.board;
      setBoard(b);
    } catch (error) {
      setFenError(true);
      console.error(error);
      toast.error("Invalid Fen String");
    }
  }

  return (
    <div className="grid h-screen place-items-center">
      <div className="flex">
        {board && <BoardComponent board={board as Board} />}
        <FenComponent invalidFen={fenError} updateFen={ChangeFenString} />
      </div>
    </div>
  );
}
