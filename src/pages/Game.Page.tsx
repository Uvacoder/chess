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
  const {
    fen,
    setFen,
    board,
    setBoard,
    fenError,
    gameOver,
    setGameOver,
    setFenError,
    ChangeFenString,
    ResetGameOverStatus,
  } = useGame();

  // const [board, setBoard] = useState<Board>();
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  useEffect(() => {
    setFen(START_POSITION);
    const game = new Game();
    game.NewGame(fen);

    setFenError(false);
    const b = game.board;
    setBoard(b);
    // ResetGameOverStatus();
  }, []);

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
            <BoardComponent />
          </div>
        )}
      </div>
      <ModalComponent setOpen={() => {}} openStatus={gameOver.status}>
        <GameOver />
      </ModalComponent>
      <DrawerComponent isOpen={drawerOpen} setOpen={setDrawerOpen}>
        <SidebarComponent setDrawerOpen={setDrawerOpen} />
      </DrawerComponent>
    </div>
  );
}
