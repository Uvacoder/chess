import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import BoardComponent from "../components/Board.Component";
import SidebarComponent from "../components/Sidebar.Component";
import Board from "../models/Board";
import Game from "../models/Game";
import ModalComponent from "../components/Modal";
import { TGameOverInfo } from "../@types";
export default function GamePage() {
  const [board, setBoard] = useState<Board>();
  const [fenError, setFenError] = useState<boolean>(false);

  const [gameOver, setGameOver] = useState<TGameOverInfo>({
    status: false,
    reason: {
      won: {
        status: false,
        reason: null,
      },
      draw: {
        status: false,
        reason: null,
      },
    },
  });

  useEffect(() => {
    const game = new Game();
    game.NewGame();
    setGameOver({
      status: false,
      reason: {
        won: {
          status: false,
          reason: null,
        },
        draw: {
          status: false,
          reason: null,
        },
      },
    });
    setFenError(false);
    const b = game.board;
    setBoard(b);
    setGameOver({
      status: false,
      reason: {
        won: {
          status: false,
          reason: null,
        },
        draw: {
          status: false,
          reason: null,
        },
      },
    });
  }, []);

  function ChangeFenString(fen: string) {
    try {
      setFenError(false);
      const game = new Game();
      game.NewGame(fen);
      const b = game.board;
      setBoard(b);
      setGameOver({
        status: false,
        reason: {
          won: {
            status: false,
            reason: null,
          },
          draw: {
            status: false,
            reason: null,
          },
        },
      });
      toast.success("Position Updated on the Board");
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
            {gameOver.status && (
              <ModalComponent
                gameOverInfo={gameOver}
                setOpen={() => {}}
                openStatus={true}
              />
            )}
          </div>
        )}
        <SidebarComponent invalidFen={fenError} updateFen={ChangeFenString} />
      </div>
    </div>
  );
}
