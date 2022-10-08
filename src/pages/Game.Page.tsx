import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import BoardComponent from "../components/Board.Component";
import FenComponent from "../components/Fen.Component";
import Board from "../models/Board";
import Game from "../models/Game";
import ModalComponent from "../components/Modal";
export default function GamePage() {
  const [board, setBoard] = useState<Board>();
  const [fenError, setFenError] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [winner, setWinner] = useState<string | null>(null);
  useEffect(() => {
    setGameOver(false);
    const game = new Game();
    game.NewGame();
    const b = game.board;
    setBoard(b);
  }, []);

  function ChangeFenString(fen: string) {
    try {
      setGameOver(false);
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
    <div className="grid relative h-screen place-items-center">
      <div className="flex">
        {board && (
          <div className="relative">
            <BoardComponent setGameOver={setGameOver} board={board as Board} />
            {gameOver && (
              <ModalComponent
                winner={board.game.winner}
                setOpen={() => {}}
                openStatus={true}
              />
            )}
          </div>
        )}
        <FenComponent invalidFen={fenError} updateFen={ChangeFenString} />
      </div>
    </div>
  );
}
