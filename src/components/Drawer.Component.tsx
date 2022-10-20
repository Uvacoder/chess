import { useState } from "react";
import { ChevronRight, X } from "tabler-icons-react";

export default function DrawerComponent({
  children,
  isOpen,
  setOpen,
}: {
  children: React.ReactNode;
  isOpen: boolean;
  setOpen: Function;
}) {
  return (
    <div
      className={`${
        isOpen ? "translate-x-0 opacity-100" : "translate-x-[100%] opacity-0"
      } transition absolute top-0 right-0 h-full z-[999]`}
    >
      <div className="absolute z-[999] right-[20px] top-[20px]">
        <button
          className="p-2 bg-neutral-700 rounded hover:opacity-80"
          onClick={() => {
            setOpen(false);
          }}
        >
          <ChevronRight size={20} />
        </button>
      </div>
      <div className="grid relative h-full w-[400px]">
        <div className="p-5 bg-neutral-900">{children}</div>
      </div>
    </div>
  );
}
