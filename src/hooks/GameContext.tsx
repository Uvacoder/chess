import React, { createContext, ReactNode, useContext, useState } from "react";
import { TGameOverInfo } from "../@types";
import Board from "../models/Board";
import Game from "../models/Game";
import { toast } from "react-toastify";
import { COLORS, START_POSITION } from "../utils/Constants";

type TGameContextType = {
  fen: string;
  pgn: Array<string> | undefined;
  setPgn: Function;
  setFen: Function;
  board: Board | undefined;
  setBoard: Function;
  ChangeFenString: Function;
  fenError: boolean;
  gameOver: TGameOverInfo;
  setFenError: Function;
  setGameOver: Function;
  ResetGameOverStatus: Function;
  turn: COLORS;
  setTurn: Function;
  PlaySound: Function;
};

const GameContext = createContext<TGameContextType>({
  fen: "",
  pgn: [],
  setPgn: () => {},
  setFen: () => {},
  board: undefined,
  setBoard: () => {},
  ChangeFenString: () => {},
  fenError: false,
  gameOver: {
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
  },
  setFenError: () => {},
  setGameOver: () => {},
  ResetGameOverStatus: () => {},
  turn: COLORS.WHITE,
  setTurn: () => {},
  PlaySound: (
    type: "WIN" | "DRAW" | "CHECK" | "CASTLE" | "CAPTURE" | "MOVE"
  ) => {},
});

export const useGame = () => useContext<TGameContextType>(GameContext);

export default function GameProvider({ children }: { children: ReactNode }) {
  const [sounds, setSounds] = useState({
    move: new Audio("/assets/sounds/move.mp3"),
    capture: new Audio("/assets/sounds/capture.mp3"),
    check: new Audio("/assets/sounds/check.mp3"),
    castle: new Audio("/assets/sounds/castle.mp3"),
    win: new Audio("/assets/sounds/checkmate.mp3"),
    draw: new Audio("/assets/sounds/draw.mp3"),
  });
  const [fen, setFen] = useState<string>(START_POSITION);
  const [board, setBoard] = useState<Board>();
  const [pgn, setPgn] = useState<Array<string>>();
  const [fenError, setFenError] = useState<boolean>(false);
  const [turn, setTurn] = useState<COLORS>(COLORS.WHITE);
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
  function ResetGameOverStatus() {
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
  }

  function PlaySound(
    type: "WIN" | "DRAW" | "CHECK" | "CASTLE" | "CAPTURE" | "MOVE"
  ) {
    switch (type) {
      case "WIN":
        console.log("PLAU WIN");
        sounds.win.play();
        break;
      case "DRAW":
        sounds.draw.play();
        break;
      case "CHECK":
        sounds.check.play();
        break;
      case "CASTLE":
        sounds.castle.play();
        break;
      case "CAPTURE":
        sounds.capture.play();
        break;
      case "MOVE":
        sounds.move.play();
        break;
    }
  }
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
      toast.success("Position Set on Board");
    } catch (error) {
      setFenError(true);
      console.error(error);
      toast.error("Invalid FEN string");
    }
  }

  return (
    <GameContext.Provider
      value={{
        fen,
        setFen,
        board,
        setBoard,
        pgn,
        setPgn,
        fenError,
        gameOver,
        ChangeFenString,
        setFenError,
        setGameOver,
        ResetGameOverStatus,
        turn,
        setTurn,
        PlaySound,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
