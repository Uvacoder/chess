import { useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import About from "../components/About";

export default function MenuPage() {
  const [tabIdx, setTabIdx] = useState(0);

  return (
    <div className="text-black h-screen lg:h-fit w-screen lg:w-[75vw] p-10 lg:px-[100px] bg-white">
      <header className="flex gap-4 items-center h-fit">
        <img src="/logo.svg" className="w-[3rem] md:w-[5rem]" alt="APP Logo" />
        <h1 className="logo drop-shadow-lg text-primary overflow-hidden text-[3rem] md:text-[5rem] leading-loose">
          Shakuni
        </h1>
      </header>

      <section className="rounded-md flex w-fit relative bg-neutral-900">
        <div
          className={`absolute isolate z-[1] h-full top-0 transition left-0 bg-primary`}
          style={{
            width: "calc(50%)",
            transform: tabIdx === 0 ? "translateX(0)" : "translateX(100%)",
          }}
        ></div>
        <button
          className={`focus:outline-none z-[2] text-[2rem] overflow-hidden w-[100px] h-[50px] pt-1 transition ${
            tabIdx === 0 ? "text-neutral-900 " : "text-white"
          }`}
          onClick={() => setTabIdx(0)}
        >
          PLAY
        </button>
        <button
          className={`focus:outline-none z-[2] text-[2rem] overflow-hidden w-[100px] h-[50px] pt-1 transition ${
            tabIdx === 1 ? "text-neutral-900 " : "text-white"
          }`}
          onClick={() => setTabIdx(1)}
        >
          ABOUT
        </button>
      </section>
      {tabIdx === 0 && (
        <section
          className="min-h-[1000px]  mt-10 w-full h-full grid grid-cols-1 lg:grid-cols-2 grid rows-1 lg:grid-rows-[repeat(2,_0.35fr)] gap-5 relative"
          id="play"
        >
          <MenuButton piece="king" title="Local Multiplayer" />
          <MenuButton piece="bishop" title="Board Analysis" />
          <MenuButton disabled={true} piece="rook" title="vs AI" />
          <MenuButton
            disabled={true}
            piece="queen"
            title="Online Multiplayer"
          />
        </section>
      )}
      {tabIdx === 1 && (
        <section className="mt-10 w-[full]" id="about">
          <About />
        </section>
      )}
    </div>
  );
}

function MenuButton({
  title,
  piece,
  disabled = false,
}: {
  title: string;
  disabled?: boolean;
  piece: "king" | "queen" | "rook" | "bishop" | "knight" | "pawn";
}) {
  return (
    <button
      disabled={disabled}
      className={`overflow-hidden relative p-3 lg:p-8 text-[3rem] lg:text-[5rem] text-white grid items-center text-left flex h-full border bg-primary rounded-xl after:absolute after:top-0 after:left-0 after:w-full after:h-full after:bg-neutral-900 after:scale-0 hover:after:scale-100 z-[1] transition`}
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
      <div className="isolation-auto absolute top-50 lg:top-[50px] right-[10px] z-[9]">
        <img
          src={`/assets/menu/${piece}.svg`}
          alt=""
          className="w-[65px] lg:w-[150px]"
        />
      </div>
    </button>
  );
}
