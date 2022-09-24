import React from "react";

export default function Piece({ sprite }: { sprite: string | undefined }) {
  return (
    <div
      className="w-[75px] h-[75px] object-cover"
      style={{ transform: "translate(0, 0)" }}
      draggable={sprite !== null}
    >
      {sprite && (
        <img
          src={sprite}
          alt=""
          className="w-[75px] h-[75px]"
          style={{ transform: "translate(0, 0)" }}
        />
      )}
    </div>
  );
}
