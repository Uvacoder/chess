import { values } from "lodash";
import React, { createContext, ReactNode } from "react";
import Cell from "../models/Cell";

const GameContext = createContext<any>({});

export const useFen = () => React.useContext(GameContext);

export default function GameProvider({ children }: { children: ReactNode }) {
  const [fen, setFen] = React.useState<string>();
  return (
    <GameContext.Provider value={{ fen, setFen }}>
      {children}
    </GameContext.Provider>
  );
}
