import { useEffect, useState } from "react";
import BoardComponent from "../components/Board.Component";
import SidebarComponent from "../components/Sidebar.Component";
import Game from "../models/Game";
import ModalComponent from "../components/Modal";
import { useGame } from "../hooks/GameContext";
import { START_POSITION } from "../utils/Constants";
import GameOver from "../components/GameOver";
import { ChevronLeft } from "tabler-icons-react";
import DrawerComponent from "../components/Drawer.Component";
export default function GamePage() {
  const { fen, setFen, board, setBoard, gameOver, setFenError } = useGame();
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  useEffect(() => {
    setFen(START_POSITION);
    const game = new Game();
    game.NewGame(fen);

    setFenError(false);
    const b = game.board;
    setBoard(b);
  }, []);

  return (
    <div className="grid relative bg-white h-screen place-items-center">
      <div className="absolute w-full top-[10%] md:top-[20px] px-4 py-2">
        <h2 className="text-black text-center font-bold text-[5rem] leading-tight">
          Analysis
        </h2>
      </div>
      <div className="absolute top-[20px] right-[20px]">
        <button
          className="p-2 bg-neutral-700 rounded flex gap-2 items-center hover:opacity-80"
          onClick={() => setDrawerOpen(true)}
        >
          <ChevronLeft />
          <p>Game Options</p>
        </button>
      </div>
      <div className="flex">{board && <BoardComponent />}</div>
      <ModalComponent setOpen={() => {}} openStatus={gameOver.status}>
        <GameOver />
      </ModalComponent>
      <DrawerComponent isOpen={drawerOpen} setOpen={setDrawerOpen}>
        <SidebarComponent setDrawerOpen={setDrawerOpen} />
      </DrawerComponent>
    </div>
  );
}
