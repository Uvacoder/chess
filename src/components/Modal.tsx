import { CSSProperties } from "react";
import { X } from "tabler-icons-react";

export default function ModalComponent({
  openStatus,
  setOpen,
  children,
  closable = false,
  closeBtnBgVal = 200,
  backgroundClassName = "bg-white/90",
  closeBtnIconColor = "black",
  className = "",
  style = {},
}: {
  openStatus: boolean;
  setOpen: any;
  children: React.ReactNode;
  closable?: boolean;
  closeBtnBgVal?: number;
  backgroundClassName?: string;
  closeBtnIconColor?: string;
  className?: string;
  style?: CSSProperties;
}) {
  return openStatus ? (
    <div
      className={`transition absolute z-[999] top-0 w-full h-full backdrop-blur-sm ${backgroundClassName} ${"opacity-100"} ${className}`}
    >
      {closable && (
        <button
          onClick={() => setOpen(false)}
          className={`absolute top-[10px] right-[10px] p-2 rounded-full shadow-lg bg-neutral-${closeBtnBgVal} transition hover:rotate-[-10deg] hover:scale-[3] hover:bg-neutral-bg-neutral-${
            closeBtnBgVal + 100
          }`}
          style={style}
        >
          <X color={closeBtnIconColor} />
        </button>
      )}

      {children}
    </div>
  ) : (
    <></>
  );
}
