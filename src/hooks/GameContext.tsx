import React, { createContext, ReactNode } from "react";
import Board from "../models/Board";

const GameContext = createContext<any>({});

export const useGame = () =>
  React.useContext<{
    fen: string;
    setFen: Function;
    board: Board;
    setBoard: Function;
  }>(GameContext);

export default function GameProvider({ children }: { children: ReactNode }) {
  const [fen, setFen] = React.useState<string>();
  const [board, setBoard] = React.useState<Board>();
  return (
    <GameContext.Provider value={{ fen, setFen, board, setBoard }}>
      {children}
    </GameContext.Provider>
  );
}
