import React from "react";
import { Link } from "react-router-dom";

export default function Play() {
  return (
    <section
      className="min-h-[900px]  mt-10 w-full h-full grid grid-cols-1 lg:grid-cols-2 grid rows-1 lg:grid-rows-[repeat(2,_0.35fr)] gap-5 relative"
      id="play"
    >
      <MenuButton piece="king" title="Local Multiplayer" link="/game" />
      <MenuButton piece="bishop" title="Board Analysis" link="/analysis" />
      <MenuButton disabled={true} piece="rook" title="vs AI" />
      <MenuButton disabled={true} piece="queen" title="Online Multiplayer" />
    </section>
  );
}
function MenuButton({
  title,
  piece,
  disabled = false,
  link = "",
}: {
  title: string;
  disabled?: boolean;
  link?: string;
  piece: "king" | "queen" | "rook" | "bishop" | "knight" | "pawn";
}) {
  return (
    <Link to={link}>
      <button
        disabled={disabled}
        className={`overflow-hidden relative p-3 lg:p-8 text-[3rem] lg:text-[5rem] text-white grid items-center text-left flex h-full border bg-primary rounded-xl after:absolute after:top-0 after:left-0 after:w-full after:h-full after:bg-neutral-900 after:translate-x-[-100%] hover:after:translate-x-[0%] after:opacity-0 hover:after:opacity-100 z-[1] after:transition`}
      >
        {disabled === true && (
          <span className="z-[999] text-center leading-tight absolute top-0 left-0 w-full h-full grid items-center bg-white/90 text-black">
            COMMING SOON
          </span>
        )}
        <p
          className="z-[2] leading-tight"
          style={{
            wordSpacing: "100000px",
          }}
        >
          {title}
        </p>
        <div className="isolation-auto absolute top-50 lg:top-[70px] right-[10px] z-[9]">
          <img
            src={`/assets/menu/${piece}.svg`}
            alt=""
            className="w-[65px] lg:w-[150px]"
          />
        </div>
      </button>
    </Link>
  );
}
