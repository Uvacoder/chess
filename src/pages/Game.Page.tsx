import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import BoardComponent from "../components/Board.Component";
import SidebarComponent from "../components/Sidebar.Component";
import Board from "../models/Board";
import Game from "../models/Game";
import ModalComponent from "../components/Modal";
import { TGameOverInfo } from "../@types";
import GameContext, { useGame } from "../hooks/GameContext";
import { START_POSITION } from "../utils/Constants";
import GameOver from "../components/GameOver";
import { Anchor, ChevronLeft } from "tabler-icons-react";
import DrawerComponent from "../components/Drawer.Component";
export default function GamePage() {
  const { fen, setFen, board, setBoard } = useGame();

  // const [board, setBoard] = useState<Board>();
  const [fenError, setFenError] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
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
    setFen(START_POSITION);
    const game = new Game();
    game.NewGame(fen);
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
      setFen(fen);
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
      <div className="absolute top-[20px] right-[20px] ">
        <button
          className="p-2 bg-neutral-700 rounded hover:opacity-80"
          onClick={() => setDrawerOpen(true)}
        >
          <ChevronLeft />
        </button>
      </div>
      <div className="flex">
        {board && (
          <div className="relative">
            <BoardComponent setGameOver={setGameOver} />
            {/* <ModalComponent setOpen={() => {}} openStatus={gameOver.status}>
              <GameOver gameOverInfo={gameOver} />
            </ModalComponent> */}
          </div>
        )}
      </div>
      <DrawerComponent isOpen={drawerOpen} setOpen={setDrawerOpen}>
        <SidebarComponent invalidFen={fenError} updateFen={ChangeFenString} />
      </DrawerComponent>
    </div>
  );
}
